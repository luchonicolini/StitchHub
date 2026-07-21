import { useMemo } from "react";
import { Prompt } from "@/types/prompt";

/**
 * Custom hook to filter prompts based on active filter, tool filter, and search query
 * @param prompts - Array of prompts to filter
 * @param activeFilter - Current active category filter tag (or null for all)
 * @param searchQuery - Search query string
 * @param activeTool - Current active AI tool filter (or null for all)
 * @returns Filtered array of prompts
 */
export function useFilteredPrompts(
    prompts: Prompt[],
    activeFilter: string | null,
    searchQuery: string = "",
    activeTool: string | null = null
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

            // Filter by category tag
            let matchesFilter = true;
            if (activeFilter) {
                const targetCategories = filterToCategoryMap[activeFilter];
                if (targetCategories) {
                    matchesFilter = prompt.tags.some((tag) =>
                        targetCategories.some(cat => tag.toLowerCase() === cat.toLowerCase())
                    );
                } else {
                    matchesFilter = prompt.tags.some((tag) =>
                        tag.toLowerCase().includes(activeFilter.replace('#', '').toLowerCase())
                    );
                }
            }

            // Filter by AI tool
            const matchesTool =
                !activeTool ||
                (prompt.toolUsed && prompt.toolUsed.toLowerCase() === activeTool.toLowerCase());

            // Filter by search query (title, prompt text, description, or tool)
            const matchesSearch =
                !searchQuery ||
                prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (prompt.description && prompt.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (prompt.toolUsed && prompt.toolUsed.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesFilter && matchesTool && matchesSearch;
        });
    }, [prompts, activeFilter, searchQuery, activeTool]);
}
