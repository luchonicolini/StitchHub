import { supabase as defaultSupabase } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';

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

    // Public vs Private Bucket
    const bucketName = isPublic ? 'design-images' : 'private-design-images';

    // 2. Upload all files concurrently under `${userId}/${fileName}`
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
            return `private-design-images://${filePath}`;
        }
    });

    // Await all uploads resolving
    const uploadedUrls = await Promise.all(uploadPromises);

    if (!uploadedUrls || uploadedUrls.length === 0) {
        throw new Error('No images were successfully uploaded.');
    }

    return uploadedUrls;
}

/**
 * Resolves an image URL or private URI into a viewable image URL.
 * Public URLs pass through unchanged.
 * Private URIs (private-design-images://path) generate a short-lived temporary signed URL (60 seconds).
 */
export async function resolveImageUrl(
    urlOrUri: string,
    supabaseClient?: SupabaseClient
): Promise<string> {
    if (!urlOrUri || !urlOrUri.startsWith('private-design-images://')) {
        return urlOrUri;
    }

    const supabase = supabaseClient || defaultSupabase;
    const filePath = urlOrUri.replace('private-design-images://', '');

    // Generate a 60-second temporary signed URL on demand
    const { data, error } = await supabase.storage
        .from('private-design-images')
        .createSignedUrl(filePath, 60);

    if (error || !data?.signedUrl) {
        console.error("Failed to generate private signed URL:", error);
        return '/images/placeholder.png'; // Fallback if user is unauthorized by RLS
    }

    return data.signedUrl;
}
