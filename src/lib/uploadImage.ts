import { supabase as defaultSupabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

const PUBLIC_BUCKET = 'design-images';
const PRIVATE_BUCKET = 'private-design-images';
const PRIVATE_URI_PREFIX = `${PRIVATE_BUCKET}://`;

interface StoredImage {
    bucket: typeof PUBLIC_BUCKET | typeof PRIVATE_BUCKET;
    path: string;
}

// Helper to provide a timeout
const withTimeout = <T,>(promise: Promise<T>, ms: number = 15000): Promise<T> => {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error(`Operation timed out after ${ms / 1000} seconds`));
        }, ms);
    });

    return Promise.race([
        promise,
        timeoutPromise
    ]).finally(() => {
        clearTimeout(timeoutId);
    });
};

export async function uploadDesignImages(
    files: File[],
    userId: string,
    supabaseClient?: SupabaseClient,
    isPublic: boolean = true
): Promise<string[]> {
    const supabase = supabaseClient || defaultSupabase;
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // 1. Validate all files strictly
    for (const file of files) {
        if (file.size > maxSize) {
            throw new Error(`Image ${file.name} must be less than 5MB`);
        }
        if (!allowedTypes.includes(file.type.toLowerCase())) {
            throw new Error(`File ${file.name} is not a valid format. Only JPG, PNG, and WebP are allowed.`);
        }
    }

    const bucketName = isPublic ? PUBLIC_BUCKET : PRIVATE_BUCKET;

    // Upload concurrently while retaining enough information to roll back partial uploads.
    const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        // Exact segment [1] is userId for RLS foldername matching
        const filePath = `${userId}/${Date.now()}-${index}.${fileExt}`;

        const uploadTask = supabase.storage
            .from(bucketName)
            .upload(filePath, file, {
                cacheControl: isPublic ? '3600' : '0',
                upsert: false
            });

        const { error } = await withTimeout(uploadTask, 60000); // 60s timeout per file

        if (error) {
            throw new Error(`Upload failed for ${file.name}: ${error.message}`);
        }

        if (isPublic) {
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);
            return publicUrl;
        } else {
            // Private images: Store private reference URI so clients fetch signed URLs on demand
            return `${PRIVATE_URI_PREFIX}${filePath}`;
        }
    });

    const settledUploads = await Promise.allSettled(uploadPromises);
    const uploadedUrls = settledUploads.flatMap(result => result.status === 'fulfilled' ? [result.value] : []);
    const failedUpload = settledUploads.find(result => result.status === 'rejected');

    if (failedUpload?.status === 'rejected') {
        await deleteDesignImages(uploadedUrls, supabase).catch(() => undefined);
        throw failedUpload.reason instanceof Error
            ? failedUpload.reason
            : new Error('One or more images could not be uploaded.');
    }

    if (!uploadedUrls || uploadedUrls.length === 0) {
        throw new Error('No images were successfully uploaded.');
    }

    return uploadedUrls;
}

/**
 * Resolves an image URL or private URI into a viewable image URL.
 * Public URLs pass through unchanged.
 * Private URIs generate a temporary signed URL valid for ten minutes.
 */
export async function resolveImageUrl(
    urlOrUri: string,
    supabaseClient?: SupabaseClient
): Promise<string> {
    if (!urlOrUri || !urlOrUri.startsWith(PRIVATE_URI_PREFIX)) {
        return urlOrUri;
    }

    const supabase = supabaseClient || defaultSupabase;
    const filePath = urlOrUri.slice(PRIVATE_URI_PREFIX.length);

    // Ten minutes avoids broken previews while keeping private URLs short lived.
    const { data, error } = await supabase.storage
        .from(PRIVATE_BUCKET)
        .createSignedUrl(filePath, 600);

    if (error || !data?.signedUrl) {
        console.error("Failed to generate private signed URL:", error);
        return '/images/placeholder.svg'; // Fallback if user is unauthorized by RLS
    }

    return data.signedUrl;
}

function parseStoredImage(reference: string): StoredImage | null {
    if (reference.startsWith(PRIVATE_URI_PREFIX)) {
        return { bucket: PRIVATE_BUCKET, path: reference.slice(PRIVATE_URI_PREFIX.length) };
    }

    try {
        const url = new URL(reference);
        const marker = '/storage/v1/object/public/';
        const markerIndex = url.pathname.indexOf(marker);
        if (markerIndex === -1) return null;

        const storagePath = decodeURIComponent(url.pathname.slice(markerIndex + marker.length));
        const separatorIndex = storagePath.indexOf('/');
        if (separatorIndex === -1) return null;

        const bucket = storagePath.slice(0, separatorIndex);
        if (bucket !== PUBLIC_BUCKET) return null;

        return { bucket: PUBLIC_BUCKET, path: storagePath.slice(separatorIndex + 1) };
    } catch {
        return null;
    }
}

/** Delete known StitchHub image references. Storage RLS still enforces ownership. */
export async function deleteDesignImages(
    references: string[],
    supabaseClient?: SupabaseClient
): Promise<void> {
    const supabase = supabaseClient || defaultSupabase;
    const images = references.map(parseStoredImage).filter((image): image is StoredImage => image !== null);

    for (const bucket of [PUBLIC_BUCKET, PRIVATE_BUCKET] as const) {
        const paths = [...new Set(images.filter(image => image.bucket === bucket).map(image => image.path))];
        if (paths.length === 0) continue;

        const { error } = await supabase.storage.from(bucket).remove(paths);
        if (error) throw new Error(`Failed to remove images from ${bucket}: ${error.message}`);
    }
}
