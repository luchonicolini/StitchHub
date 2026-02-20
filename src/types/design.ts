import { Prompt } from "./prompt";

/**
 * Raw design row shape from Supabase `designs` table
 * with joined `profiles` relation.
 */
export interface DesignDB {
    id: string;
    title: string;
    category: string;
    prompt_content: string;
    profiles?: { username: string; avatar_url: string };
    image_url: string;
    image_urls?: string[];
    code_snippet: string;
}

/**
 * Maps a raw Supabase design row to a Prompt for the UI.
 */
export function mapDesignToPrompt(d: DesignDB, index: number): Prompt {
    return {
        id: `db-${d.id}`,
        title: d.title,
        tags: [d.category || "Design"],
        prompt: d.prompt_content,
        author: {
            name: d.profiles?.username || "Unknown",
            avatar: d.profiles?.avatar_url || "https://github.com/shadcn.png",
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
    };
}
