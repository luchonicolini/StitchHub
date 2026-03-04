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

            // Map FilterBar labels to actual Categories defined in the upload form
            const filterToCategoryMap: Record<string, string[]> = {
                "#Analytics": ["Dashboard"],
                "#Mobile": ["Mobile App", "App"],
                "#Shop": ["E-commerce"],
                "#Developer": ["Component", "EXPERIMENTAL"],
                "#Trend": ["Landing Page", "SaaS", "Blog", "Portfolio"],
                "#UI": ["UI/UX", "Page"],
            };

            // Filter by tag
            let matchesFilter = true;

            if (activeFilter) {
                const targetCategories = filterToCategoryMap[activeFilter];
                if (targetCategories) {
                    // Check if any of the prompt's tags are found in the targeted categories for this filter
                    matchesFilter = prompt.tags.some((tag) =>
                        targetCategories.some(cat => tag.toLowerCase() === cat.toLowerCase())
                    );
                } else {
                    // Fallback to basic string inclusion if no map found (for generic tags)
                    matchesFilter = prompt.tags.some((tag) =>
                        tag.toLowerCase().includes(activeFilter.replace('#', '').toLowerCase())
                    );
                }
            }

            // Filter by search query (title or prompt text)
            const matchesSearch =
                !searchQuery ||
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [prompts, activeFilter, searchQuery]);
}
