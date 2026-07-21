"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Heart, Flame } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Prompt } from "@/types/prompt";
import { DesignDB, mapDesignToPrompt } from "@/types/design";
import { CardDetailModal } from "./CardDetailModal";

const TOOL_COLORS: Record<string, string> = {
    "Google Stitch": "bg-blue-100 text-blue-800 border-blue-300",
    "Claude Artifacts": "bg-orange-100 text-orange-800 border-orange-300",
    "v0 by Vercel": "bg-neutral-100 text-neutral-700 border-neutral-300",
    "Figma AI": "bg-purple-100 text-purple-800 border-purple-300",
    "Cursor": "bg-green-100 text-green-800 border-green-300",
    "Other": "bg-yellow-100 text-yellow-800 border-yellow-300",
};

export function TrendingBar() {
    const [trending, setTrending] = useState<Prompt[]>([]);
    const [selectedCard, setSelectedCard] = useState<Prompt | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            // Fetch top 6 by likes_count from the last 7 days
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

            const { data, error } = await supabase
                .from("designs")
                .select(`
                    *,
                    profiles (
                        username,
                        avatar_url
                    )
                `)
                .gte("created_at", sevenDaysAgo)
                .order("likes_count", { ascending: false })
                .limit(6);

            if (!error && data && data.length > 0) {
                const mapped = (data as unknown as DesignDB[]).map((d, i) => mapDesignToPrompt(d, i));
                setTrending(mapped);
            } else if (!error) {
                // Fallback: show all-time top 6 if no recent designs
                const { data: allData } = await supabase
                    .from("designs")
                    .select(`*, profiles(username, avatar_url)`)
                    .order("likes_count", { ascending: false })
                    .limit(6);

                if (allData && allData.length > 0) {
                    setTrending((allData as unknown as DesignDB[]).map((d, i) => mapDesignToPrompt(d, i)));
                }
            }
            setLoading(false);
        };

        fetchTrending();
    }, []);

    if (!loading && trending.length === 0) return null;

    return (
        <>
            <section className="border-y-4 border-ink bg-ink py-5 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header Row */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2 bg-accent-orange px-3 py-1.5 border-2 border-ink">
                            <Flame className="w-4 h-4 text-white" fill="white" />
                            <span className="font-black text-sm uppercase text-white tracking-wider">Trending This Week</span>
                        </div>
                        <TrendingUp className="w-5 h-5 text-white/60" />
                    </div>

                    {/* Scrollable Cards */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {loading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-shrink-0 w-56 h-20 bg-white/10 border-2 border-white/20 animate-pulse"
                                />
                            ))
                            : trending.map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.3 }}
                                    onClick={() => setSelectedCard(item)}
                                    className="flex-shrink-0 w-60 bg-white border-2 border-white/80 hover:border-primary hover:shadow-[4px_4px_0px_0px_rgba(253,224,71,1)] transition-all group text-left flex gap-3 p-3 cursor-pointer"
                                >
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0 w-6 text-center">
                                        <span className="font-black text-xs text-ink/40 font-mono">#{i + 1}</span>
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="relative w-14 h-14 border-2 border-ink bg-neutral-100 flex-shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary/30" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-xs text-ink leading-tight line-clamp-2 mb-1 group-hover:text-accent-orange transition-colors">
                                            {item.title}
                                        </p>

                                        {/* Tool badge */}
                                        {item.toolUsed && (
                                            <span className={`inline-block text-[9px] font-bold font-mono px-1.5 py-0.5 border rounded-none leading-none mb-1 ${TOOL_COLORS[item.toolUsed] || TOOL_COLORS["Other"]}`}>
                                                {item.toolUsed}
                                            </span>
                                        )}

                                        {/* Likes */}
                                        <div className="flex items-center gap-1 text-ink/50">
                                            <Heart className="w-3 h-3" fill="currentColor" />
                                            <span className="font-mono text-[10px] font-bold">{item.likesCount || 0}</span>
                                        </div>
                                    </div>
                                </motion.button>
                            ))
                        }
                    </div>
                </div>
            </section>

            {selectedCard && (
                <CardDetailModal
                    card={selectedCard}
                    onClose={() => setSelectedCard(null)}
                />
            )}
        </>
    );
}
