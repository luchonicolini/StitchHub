
import { useState, useEffect } from "react";
import { MasonryGrid } from "@/components/workshop/MasonryGrid";
import { PromptCard } from "@/components/workshop/PromptCard";
import { PromptCardSkeleton } from "@/components/workshop/PromptCardSkeleton";
import { CardDetailModal } from "@/components/workshop/CardDetailModal";
import { Sparkles, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prompt } from "@/types/prompt";
import { DesignDB, mapDesignToPrompt } from "@/types/design";
import { MOCK_PROMPTS } from "@/data/mockPrompts";
import { useFilteredPrompts } from "@/hooks/useFilteredPrompts";
import { supabase } from "@/lib/supabase";

// Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

interface WorkshopFeedProps {
    initialPrompts: Prompt[];
    activeFilter: string | null;
    searchQuery?: string;
    onResultCountChange?: (count: number) => void;
}

export function WorkshopFeed({ initialPrompts, activeFilter, searchQuery, onResultCountChange }: WorkshopFeedProps) {
    const ITEMS_PER_PAGE = 12;

    const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
    const [selectedCard, setSelectedCard] = useState<Prompt | null>(null);
    const [page, setPage] = useState(0);

    // Determine initial hasMore based on how many items we got
    const initialDesignCount = initialPrompts.filter(p => p.type !== 'promo').length;
    const [hasMore, setHasMore] = useState(initialDesignCount >= ITEMS_PER_PAGE);

    // No longer loading initially since we have SSR data
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const fetchDesigns = async (currentPage: number) => {
        try {
            setIsFetchingMore(true);

            // Calculate range
            const from = currentPage * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, count, error } = await supabase
                .from('designs')
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `, { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) throw error;

            if (data) {
                const dbPrompts: Prompt[] = (data as unknown as DesignDB[]).map(mapDesignToPrompt);

                // Append new items
                setPrompts(prev => [...prev, ...dbPrompts]);

                // Check if we hit the end
                if (count !== null) {
                    setHasMore(to < count - 1);
                } else {
                    setHasMore(data.length === ITEMS_PER_PAGE);
                }
            }
        } catch (err) {
            console.error("Error fetching designs:", err);
        } finally {
            setIsFetchingMore(false);
        }
    };

    // Use custom hook for filtering (client-side for now, can be moved to server-side query if needed)
    const filteredPrompts = useFilteredPrompts(prompts, activeFilter, searchQuery || "");

    const handleLoadMore = () => {
        if (!hasMore || isFetchingMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchDesigns(nextPage);
    };

    const resultCount = filteredPrompts.filter(item => item.type !== "promo").length;

    // Report result count to parent component
    useEffect(() => {
        if (onResultCountChange) {
            onResultCountChange(resultCount);
        }
    }, [resultCount, onResultCountChange]);

    return (
        <>
            <MasonryGrid onLoadMore={handleLoadMore} isLoading={isFetchingMore} hasMore={hasMore}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="contents"
                >
                    <AnimatePresence mode="popLayout">
                        {isLoading && page === 0 ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <PromptCardSkeleton key={`skeleton-${i}`} />
                            ))
                        ) : (
                            filteredPrompts.map((item, index) => {
                                if (item.type === "promo") {
                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: [0.4, 0, 0.2, 1],
                                                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
                                            }}
                                            style={{ breakInside: 'avoid' }}
                                            className={`break-inside-avoid inline-block w-full h-fit mb-12 mt-4 relative group transform ${item.rotation} rotate-hover transition-transform duration-300 ease-in-out hover:-translate-y-1`}
                                        >
                                            {/* Physical Shadow */}
                                            <div className="absolute inset-0 bg-ink translate-x-2 translate-y-2 rounded-sm w-full h-full pointer-events-none"></div>

                                            <article className="bg-primary p-2 pb-2 border-[3px] border-ink relative z-10 w-full transition-transform duration-300 ease-in-out">
                                                <div className="bg-white border-[3px] border-ink h-full flex flex-col items-center justify-center text-center gap-6 py-12 px-6 relative top-2 left-0 rotate-1 shadow-sm">
                                                    <Sparkles className="w-12 h-12 text-accent-orange fill-accent-orange" />
                                                    <div className="space-y-2">
                                                        <h3 className="font-black text-2xl uppercase text-ink tracking-tight">JOIN THE WORKSHOP</h3>
                                                        <p className="font-mono text-sm px-2 text-ink/80 leading-relaxed">
                                                            Got a prompt that generates fire?<br />
                                                            Pin it to the board.
                                                        </p>
                                                    </div>
                                                    <button className="bg-ink text-white font-bold px-8 py-3 border-2 border-ink hover:bg-white hover:text-ink transition-colors duration-300 ease-in-out shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none translate-y-0 hover:translate-y-1 cursor-pointer">
                                                        Submit Now
                                                    </button>
                                                </div>
                                            </article>
                                        </motion.div>
                                    );
                                }
                                // Destructure prompt props to separate PromptCardProps from PromptItem specific props
                                const { ...cardProps } = item;
                                return (
                                    <PromptCard
                                        key={`${item.id}-${index}`}
                                        {...cardProps}
                                        onClick={() => setSelectedCard(item)}
                                    />
                                );
                            })
                        )}
                    </AnimatePresence>

                    {/* No Results Message */}
                    {(activeFilter || searchQuery) && resultCount === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-full text-center py-20"
                        >
                            <div className="inline-block bg-white border-4 border-ink p-8 shadow-hard-sm transform -rotate-1">
                                <SearchX className="w-16 h-16 text-ink/30 mb-4" />
                                <h3 className="font-black text-2xl text-ink mb-2">No Results Found</h3>
                                <p className="font-mono text-sm text-ink/60">
                                    No prompts match {activeFilter && <span>the filter <span className="font-bold text-accent-orange">{activeFilter}</span></span>}
                                    {activeFilter && searchQuery && <span> and </span>}
                                    {searchQuery && <span>the search <span className="font-bold text-accent-orange">&quot;{searchQuery}&quot;</span></span>}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </MasonryGrid>

            {/* Detail Modal */}
            {selectedCard && (
                <CardDetailModal
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </>
    );
}
