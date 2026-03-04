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
                    is_pinned: boolean | null
                    likes_count: number | null
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
                    is_pinned?: boolean | null
                    likes_count?: number | null
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
                    is_pinned?: boolean | null
                    likes_count?: number | null
                }
            }
            likes: {
                Row: {
                    id: string
                    user_id: string
                    design_id: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    design_id: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    design_id?: number
                    created_at?: string
                }
            }
        }
    }
}
