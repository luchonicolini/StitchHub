export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    updated_at: string | null
                    username: string | null
                    avatar_url: string | null
                    website: string | null
                }
                Insert: {
                    id: string
                    updated_at?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
                Update: {
                    id?: string
                    updated_at?: string | null
                    username?: string | null
                    avatar_url?: string | null
                    website?: string | null
                }
            }
            designs: {
                Row: {
                    id: number
                    created_at: string
                    title: string
                    prompt_content: string
                    image_url: string | null
                    code_snippet: string | null
                    category: string | null
                    user_id: string
                }
                Insert: {
                    id?: number
                    created_at?: string
                    title: string
                    prompt_content: string
                    image_url?: string | null
                    code_snippet?: string | null
                    category?: string | null
                    user_id: string
                }
                Update: {
                    id?: number
                    created_at?: string
                    title?: string
                    prompt_content?: string
                    image_url?: string | null
                    code_snippet?: string | null
                    category?: string | null
                    user_id?: string
                }
            }
        }
    }
}
