
import { useState, useMemo, useEffect } from "react";
import { MasonryGrid } from "@/components/workshop/MasonryGrid";
import { PromptCard } from "@/components/workshop/PromptCard";
import { CardDetailModal } from "@/components/workshop/CardDetailModal";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prompt } from "@/types/prompt";
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
    activeFilter: string | null;
    searchQuery?: string;
    onResultCountChange?: (count: number) => void;
}

export function WorkshopFeed({ activeFilter, searchQuery, onResultCountChange }: WorkshopFeedProps) {
    const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPTS);
    const [selectedCard, setSelectedCard] = useState<Prompt | null>(null);

    // Fetch real designs from Supabase
    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const { data, error } = await supabase
                    .from('designs')
                    .select(`
                        *,
                        profiles (
                            username,
                            avatar_url
                        )
                    `)
                    .order('created_at', { ascending: false });

                if (data) {
                    const dbPrompts: Prompt[] = data.map((d: any, index: number) => ({
                        id: `db-${d.id}`,
                        title: d.title,
                        tags: [d.category || 'Design'],
                        prompt: d.prompt_content,
                        author: {
                            name: d.profiles?.username || 'Unknown',
                            avatar: d.profiles?.avatar_url || 'https://github.com/shadcn.png'
                        },
                        image: d.image_url || '',
                        imageAlt: d.title,
                        codeSnippet: d.code_snippet,
                        pinColor: "bg-white",
                        rotation: index % 2 === 0 ? "rotate-1" : "-rotate-1",
                        type: "card"
                    }));

                    // Merge DB prompts with Mock prompts
                    setPrompts([...dbPrompts, ...MOCK_PROMPTS]);
                }
            } catch (err) {
                console.error("Error fetching designs:", err);
            }
        };

        fetchDesigns();
    }, []);

    // Use custom hook for filtering
    const filteredPrompts = useFilteredPrompts(prompts, activeFilter, searchQuery || "");

    const handleLoadMore = () => {
        // Only add regular cards (NO promo card) when loading more
        const regularCards = MOCK_PROMPTS.filter((p: Prompt) => p.type !== "promo");

        const newItems = regularCards.map((item: Prompt, index: number) => ({
            ...item,
            id: `new-${Date.now()}-${index}`,
            // Randomize rotation slightly for new items
            rotation: Math.random() > 0.5 ? "rotate-1" : "-rotate-1",
        }));

        setPrompts(prev => [...prev, ...newItems]);
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
            <MasonryGrid onLoadMore={handleLoadMore}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="contents"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPrompts.map((item, index) => {
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
                        })}
                    </AnimatePresence>

                    {/* No Results Message */}
                    {(activeFilter || searchQuery) && resultCount === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="col-span-full text-center py-20"
                        >
                            <div className="inline-block bg-white border-4 border-ink p-8 shadow-hard-sm transform -rotate-1">
                                <span className="material-icons text-6xl text-ink/30 mb-4 block">search_off</span>
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
