import { supabase } from './supabase';
import { uploadDesignImage } from './uploadImage';

export interface DesignSubmission {
    title: string;
    promptContent: string;
    category: string;
    codeSnippet?: string;
    imageFile: File;
}

export async function submitDesign(
    submission: DesignSubmission,
    userId: string
) {
    try {
        // 1. Upload image first
        const imageUrl = await uploadDesignImage(submission.imageFile, userId);

        // 2. Create design record
        const { data, error } = await supabase
            .from('designs')
            .insert({
                title: submission.title,
                prompt_content: submission.promptContent,
                category: submission.category,
                code_snippet: submission.codeSnippet || null,
                image_url: imageUrl,
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
