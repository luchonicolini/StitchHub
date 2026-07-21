import { Prompt } from "./prompt";

/**
 * Raw design row shape from Supabase `designs` table
 * with joined `profiles` relation.
 */
export interface DesignDB {
    id: string;
    user_id?: string;
    title: string;
    category: string;
    prompt_content: string;
    description?: string;
    tool_used?: string;
    profiles?: { username: string; avatar_url: string };
    image_url: string;
    image_urls?: string[];
    code_snippet: string;
    likes_count?: number;
    comments_count?: number;
}

export function mapDesignToPrompt(d: DesignDB, index: number): Prompt {
    // Diverse pool of realistic developer & designer avatars
    const AVATAR_POOL = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80",
        "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=250&q=80",
        "https://api.dicebear.com/7.x/bottts/svg?seed=pixelbot",
        "https://api.dicebear.com/7.x/identicon/svg?seed=cyberdev",
    ];

    const AUTHOR_POOL = [
        "@pixel_artisan",
        "@neo_visionary",
        "@cyber_craft",
        "@design_punk",
        "@app_artisan",
        "@ai_architect",
        "@type_master",
        "@sound_wave",
        "@fintech_pro",
        "@code_craft",
        "@crypto_king",
        "@flow_creator",
        "@hacker_ui",
        "@tasty_design",
        "@vector_guru",
    ];

    const idNum = parseInt(d.id.toString()) || index || 0;
    const fallbackAvatar = AVATAR_POOL[idNum % AVATAR_POOL.length];
    const fallbackAuthor = AUTHOR_POOL[idNum % AUTHOR_POOL.length];

    return {
        id: `db-${d.id}`,
        userId: d.user_id,
        title: d.title,
        tags: [d.category || "#UI"],
        prompt: d.prompt_content,
        description: d.description,
        toolUsed: d.tool_used,
        author: {
            name: d.profiles?.username || fallbackAuthor,
            avatar: d.profiles?.avatar_url || fallbackAvatar,
        },
        image: d.image_url || "",
        gallery:
            d.image_urls && d.image_urls.length > 0
                ? d.image_urls
                : [d.image_url || ""],
        imageAlt: d.title,
        codeSnippet: d.code_snippet,
        pinColor: "bg-white",
        rotation: index % 2 === 0 ? "rotate-1" : "-rotate-1",
        type: "card",
        likesCount: d.likes_count || 0,
        commentsCount: d.comments_count || 0,
    };
}
