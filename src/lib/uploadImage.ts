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

    const bucketName = 'design-images';
    const folderPrefix = isPublic ? 'public' : 'private';

    // 2. Upload all files concurrently
    const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${folderPrefix}/${userId}/${Date.now()}-${index}.${fileExt}`;

        const uploadTask = supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
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
                .getPublicUrl(fileName);
            return publicUrl;
        } else {
            // Private images: generate a signed URL valid for 10 years (315,360,000s)
            const { data, error: signError } = await supabase.storage
                .from(bucketName)
                .createSignedUrl(fileName, 315360000);

            if (signError || !data?.signedUrl) {
                // Fallback to public URL if signing is disabled by bucket config
                const { data: { publicUrl } } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(fileName);
                return publicUrl;
            }

            return data.signedUrl;
        }
    });

    // Await all uploads resolving
    const uploadedUrls = await Promise.all(uploadPromises);

    if (!uploadedUrls || uploadedUrls.length === 0) {
        throw new Error('No images were successfully uploaded.');
    }

    return uploadedUrls;
}
