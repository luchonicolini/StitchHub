"use client";

import { supabase } from './supabase';

interface ImageConstraints {
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    maxSizeMB: number;
}

const AVATAR_CONSTRAINTS: ImageConstraints = {
    minWidth: 100,
    minHeight: 100,
    maxWidth: 2000,
    maxHeight: 2000,
    maxSizeMB: 2,
};

const COVER_CONSTRAINTS: ImageConstraints = {
    minWidth: 800,
    minHeight: 200,
    maxWidth: 3840,
    maxHeight: 2160,
    maxSizeMB: 5,
};

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function getConstraints(type: 'avatar' | 'cover'): ImageConstraints {
    return type === 'avatar' ? AVATAR_CONSTRAINTS : COVER_CONSTRAINTS;
}

/**
 * Validates image dimensions by loading it into an Image element.
 */
function validateDimensions(file: File, constraints: ImageConstraints): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const { naturalWidth: w, naturalHeight: h } = img;

            if (w < constraints.minWidth || h < constraints.minHeight) {
                reject(new Error(
                    `Image too small. Minimum: ${constraints.minWidth}×${constraints.minHeight}px. Yours: ${w}×${h}px.`
                ));
                return;
            }

            if (w > constraints.maxWidth || h > constraints.maxHeight) {
                reject(new Error(
                    `Image too large. Maximum: ${constraints.maxWidth}×${constraints.maxHeight}px. Yours: ${w}×${h}px.`
                ));
                return;
            }

            resolve({ width: w, height: h });
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Could not read image file. Make sure it is a valid image.'));
        };

        img.src = url;
    });
}

/**
 * Uploads a profile image (avatar or cover) to Supabase storage and returns the public URL.
 */
export async function uploadProfileImage(
    file: File,
    userId: string,
    type: 'avatar' | 'cover'
): Promise<string> {
    const constraints = type === 'avatar' ? AVATAR_CONSTRAINTS : COVER_CONSTRAINTS;

    // 1. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Invalid format. Only JPG, PNG, and WebP are allowed.');
    }

    // 2. Validate file size
    const maxBytes = constraints.maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
        throw new Error(`File too large. Maximum: ${constraints.maxSizeMB}MB.`);
    }

    // 3. Validate dimensions
    await validateDimensions(file, constraints);

    // 4. Delete any existing files for this type (cover.jpg, cover.png, cover.webp etc.)
    try {
        const { data: existingFiles } = await supabase.storage
            .from('profile-images')
            .list(userId, { search: type });

        if (existingFiles && existingFiles.length > 0) {
            const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`);
            await supabase.storage
                .from('profile-images')
                .remove(filesToDelete);
        }
    } catch {
        // If listing/deleting fails, continue with upload anyway
    }

    // 5. Upload to Supabase storage
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${userId}/${type}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        });

    if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // 6. Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

    // Add cache-buster to force refresh
    return `${publicUrl}?t=${Date.now()}`;
}
