// Comment type for StitchHub community comments

export interface Comment {
    id: string;
    design_id: number;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: {
        username: string;
        avatar_url: string | null;
    };
}
