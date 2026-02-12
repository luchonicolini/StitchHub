import { useMemo } from "react";
import { Prompt } from "@/types/prompt";

/**
 * Custom hook to filter prompts based on active filter and search query
 * @param prompts - Array of prompts to filter
 * @param activeFilter - Current active filter tag (or null for all)
 * @param searchQuery - Search query string
 * @returns Filtered array of prompts
 */
export function useFilteredPrompts(
    prompts: Prompt[],
    activeFilter: string | null,
    searchQuery: string = ""
): Prompt[] {
    return useMemo(() => {
        return prompts.filter((prompt) => {
            // Skip promo cards from filtering
            if (prompt.type === "promo") return true;

            // Filter by tag
            const matchesFilter =
                !activeFilter ||
                prompt.tags.some((tag) =>
                    tag.toLowerCase().includes(activeFilter.toLowerCase())
                );

            // Filter by search query (title or prompt text)
            const matchesSearch =
                !searchQuery ||
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [prompts, activeFilter, searchQuery]);
}
