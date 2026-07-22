import { supabase as defaultSupabase } from './supabase';
import { uploadDesignImages } from './uploadImage';
import { SupabaseClient } from '@supabase/supabase-js';

export interface DesignSubmission {
    title: string;
    promptContent: string;
    description?: string;
    toolUsed?: string;
    category: string;
    codeSnippet?: string;
    isPublic?: boolean;
    imageFiles: File[];
}

export async function submitDesign(
    submission: DesignSubmission,
    userId: string,
    supabaseClient?: SupabaseClient
) {
    const supabase = supabaseClient || defaultSupabase;

    try {
        // 1. Upload array of images with timeouts and privacy setting
        const isPublic = submission.isPublic !== false;
        const imageUrls = await uploadDesignImages(submission.imageFiles, userId, supabase, isPublic);

        // 2. Create design record
        // Fallback or explicit mapping: imageUrls[0] is the cover image
        const { data, error } = await supabase
            .from('designs')
            .insert({
                title: submission.title,
                prompt_content: submission.promptContent,
                description: submission.description || null,
                tool_used: submission.toolUsed || null,
                category: submission.category,
                code_snippet: submission.codeSnippet || null,
                is_public: submission.isPublic !== undefined ? submission.isPublic : true,
                image_url: imageUrls[0], // Keep for backwards compatibility
                image_urls: imageUrls,   // New multi-image column
                user_id: userId
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create design: ${error.message}`);
        }

        return data;
    } catch (error) {
        // If design creation fails, we should ideally delete the uploaded image
        // but for now we'll just throw the error
        throw error;
    }
}
