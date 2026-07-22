"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Heart, Flame } from "lucide-react";
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
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const directionRef = useRef<1 | -1>(1);

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

    useEffect(() => {
        const carousel = carouselRef.current;
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!carousel || isPaused || selectedCard || prefersReducedMotion || trending.length < 2) return;

        const interval = window.setInterval(() => {
            if (document.hidden) return;

            const firstCard = carousel.querySelector<HTMLElement>("[data-trending-card]");
            if (!firstCard) return;

            const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 16;
            const step = firstCard.offsetWidth + gap;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;

            if (maxScroll <= 1) return;
            if (carousel.scrollLeft >= maxScroll - step / 2) directionRef.current = -1;
            if (carousel.scrollLeft <= step / 2) directionRef.current = 1;

            carousel.scrollTo({
                left: Math.min(maxScroll, Math.max(0, carousel.scrollLeft + step * directionRef.current)),
                behavior: "smooth",
            });
        }, 6000);

        return () => window.clearInterval(interval);
    }, [isPaused, selectedCard, trending.length]);

    if (loading || trending.length === 0) return null;

    return (
        <>
            <section className="overflow-hidden border-y-4 border-ink bg-primary py-5 sm:py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 inline-flex rotate-[-1deg] items-center gap-2 border-2 border-ink bg-accent-orange px-3 py-1.5 shadow-hard-sm">
                                <Flame className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true" />
                                <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white">
                                    Weekly picks
                                </span>
                            </div>
                            <h2 className="font-display text-3xl font-black uppercase leading-none tracking-[-0.04em] text-ink sm:text-4xl">
                                Trending now
                            </h2>
                        </div>
                        <p className="max-w-xs font-mono text-xs font-bold leading-relaxed text-ink/65 sm:text-right">
                            The most-loved community builds from the last seven days.
                        </p>
                    </div>

                    <div
                        ref={carouselRef}
                        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        aria-label="Trending community designs"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        onFocusCapture={() => setIsPaused(true)}
                        onBlurCapture={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
                        }}
                        onTouchStart={() => setIsPaused(true)}
                        onTouchEnd={() => setIsPaused(false)}
                    >
                        {trending.map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.3 }}
                                    onClick={() => setSelectedCard(item)}
                                    aria-label={`Open ${item.title}`}
                                    data-trending-card
                                    className="group relative grid min-h-[150px] w-[84vw] max-w-[380px] flex-none snap-start grid-cols-[104px_1fr] gap-4 border-3 border-ink bg-white p-4 text-left shadow-hard transition-transform duration-200 hover:-translate-y-1 hover:shadow-hard-lg focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink sm:w-[calc((100%_-_1rem)/2)] sm:max-w-none sm:grid-cols-[112px_1fr] lg:w-[calc((100%_-_2rem)/3)] lg:grid-cols-[120px_1fr]"
                                >
                                    <span className="absolute -left-2 -top-3 z-10 grid h-8 min-w-8 place-items-center border-2 border-ink bg-ink px-1.5 font-mono text-xs font-black text-primary shadow-[2px_2px_0_#fff]">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>

                                    <div className="relative aspect-square overflow-hidden border-2 border-ink bg-neutral-100">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 640px) 104px, (max-width: 1024px) 112px, 120px"
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-accent-cyan/40" />
                                        )}
                                    </div>

                                    <div className="flex min-w-0 flex-col justify-between py-0.5">
                                        <div className="flex items-start gap-2">
                                            <p className="line-clamp-3 flex-1 font-display text-lg font-black leading-[1.05] text-ink transition-colors group-hover:text-accent-orange sm:text-xl">
                                            {item.title}
                                            </p>
                                            <ArrowUpRight className="h-4 w-4 flex-none transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                                        </div>

                                        <div className="mt-3 flex items-end justify-between gap-2">
                                            {item.toolUsed && (
                                                <span className={`truncate border px-1.5 py-1 font-mono text-[9px] font-bold uppercase leading-none ${TOOL_COLORS[item.toolUsed] || TOOL_COLORS["Other"]}`}>
                                                    {item.toolUsed}
                                                </span>
                                            )}
                                            <span className="ml-auto flex items-center gap-1 font-mono text-[10px] font-bold text-ink/55">
                                                <Heart className="h-3 w-3" fill="currentColor" aria-hidden="true" />
                                                {item.likesCount || 0}
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
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
