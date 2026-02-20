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

export async function uploadDesignImages(files: File[], userId: string, supabaseClient?: SupabaseClient): Promise<string[]> {
    const supabase = supabaseClient || defaultSupabase;
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    // 1. Validate all files
    for (const file of files) {
        if (file.size > maxSize) {
            throw new Error(`Image ${file.name} must be less than 5MB`);
        }
        if (!allowedTypes.includes(file.type)) {
            throw new Error(`File ${file.name} is not a valid format. Only JPG, PNG, and WebP are allowed`);
        }
    }

    // 2. Upload all files concurrently with a timeout constraint
    const uploadPromises = files.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${index}.${fileExt}`;

        const uploadTask = supabase.storage
            .from('design-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        const { error } = await withTimeout(uploadTask, 60000); // 60s timeout per file

        if (error) {
            throw new Error(`Upload failed for ${file.name}: ${error.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('design-images')
            .getPublicUrl(fileName);

        return publicUrl;
    });

    // Await all uploads resolving
    const uploadedUrls = await Promise.all(uploadPromises);

    if (!uploadedUrls || uploadedUrls.length === 0) {
        throw new Error('No images were successfully uploaded.');
    }

    return uploadedUrls;
}
