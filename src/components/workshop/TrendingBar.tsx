"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, Flame } from "lucide-react";
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
    const [activeIndex, setActiveIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(1);
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

            const targetLeft = Math.min(maxScroll, Math.max(0, carousel.scrollLeft + step * directionRef.current));
            carousel.scrollTo({
                left: targetLeft,
                behavior: "smooth",
            });
            setActiveIndex(Math.round(targetLeft / step));
        }, 8000);

        return () => window.clearInterval(interval);
    }, [isPaused, selectedCard, trending.length]);

    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const updateVisibleCount = () => {
            const firstCard = carousel.querySelector<HTMLElement>("[data-trending-card]");
            if (!firstCard) return;
            const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 20;
            const count = Math.max(1, Math.round((carousel.clientWidth + gap) / (firstCard.offsetWidth + gap)));
            setVisibleCount(Math.min(trending.length, count));
        };

        updateVisibleCount();
        const observer = new ResizeObserver(updateVisibleCount);
        observer.observe(carousel);
        return () => observer.disconnect();
    }, [trending.length]);

    const scrollToCard = (index: number) => {
        const carousel = carouselRef.current;
        const firstCard = carousel?.querySelector<HTMLElement>("[data-trending-card]");
        if (!carousel || !firstCard) return;

        const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 20;
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        const targetLeft = Math.min(maxScroll, Math.max(0, index * (firstCard.offsetWidth + gap)));
        carousel.scrollTo({ left: targetLeft, behavior: "smooth" });
        setActiveIndex(Math.round(targetLeft / (firstCard.offsetWidth + gap)));
    };

    const moveCarousel = (direction: -1 | 1) => {
        directionRef.current = direction;
        scrollToCard(activeIndex + direction);
    };

    if (loading || trending.length === 0) return null;

    return (
        <>
            <section className="relative overflow-hidden border-y-4 border-ink bg-[#f5f2e9] py-10 sm:py-12">
                <div className="pointer-events-none absolute -right-12 top-8 h-36 w-36 rotate-12 border-4 border-ink bg-accent-cyan/40" aria-hidden="true" />
                <div className="pointer-events-none absolute -bottom-12 left-[7%] h-24 w-24 -rotate-12 bg-primary" aria-hidden="true" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="relative z-10 grid gap-5 border-4 border-ink bg-white p-5 shadow-hard sm:p-7 lg:grid-cols-[1fr_320px] lg:items-end">
                        <div className="min-w-0">
                            <div className="mb-4 inline-flex rotate-[-1deg] items-center gap-2 border-2 border-ink bg-accent-orange px-3 py-1.5 shadow-[3px_3px_0_#000]">
                                <Flame className="h-4 w-4 text-white" fill="currentColor" aria-hidden="true" />
                                <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-white">
                                    Weekly picks
                                </span>
                            </div>
                            <h2 className="max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] font-black uppercase leading-[0.82] tracking-[-0.065em] text-ink">
                                Trending <span className="relative inline-block whitespace-nowrap">
                                    now
                                    <span className="absolute -bottom-2 left-0 -z-0 h-3 w-full -rotate-1 bg-primary" aria-hidden="true" />
                                </span>
                            </h2>
                        </div>

                        <div className="relative border-3 border-ink bg-primary p-5 shadow-[5px_5px_0_#000]">
                            <span className="mb-3 flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-ink/60">
                                <span className="h-2.5 w-2.5 animate-pulse rounded-full border border-ink bg-accent-orange" />
                                Community radar · 7 days
                            </span>
                            <p className="font-mono text-sm font-bold leading-relaxed text-ink">
                                The builds earning the most love, remixes, and attention this week.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-7">
                        <div className="absolute inset-0 translate-x-2 translate-y-2 border-4 border-ink bg-primary" aria-hidden="true" />
                        <div
                            ref={carouselRef}
                            className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto border-4 border-ink bg-[#e9e5da] p-4 sm:p-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                            aria-label="Trending community designs"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                            onFocusCapture={() => setIsPaused(true)}
                            onBlurCapture={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
                            }}
                            onTouchStart={() => setIsPaused(true)}
                            onTouchEnd={() => setIsPaused(false)}
                            onScroll={(event) => {
                                const carousel = event.currentTarget;
                                const firstCard = carousel.querySelector<HTMLElement>("[data-trending-card]");
                                if (!firstCard) return;
                                const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 20;
                                setActiveIndex(Math.round(carousel.scrollLeft / (firstCard.offsetWidth + gap)));
                            }}
                        >
                            {trending.map((item, i) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.35 }}
                                    onClick={() => setSelectedCard(item)}
                                    aria-label={`Open ${item.title}`}
                                    data-trending-card
                                    className="group relative w-[82vw] max-w-[360px] flex-none snap-start overflow-hidden border-3 border-ink bg-white text-left shadow-[5px_5px_0_#000] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ink sm:w-[calc((100%_-_1.25rem)/2)] sm:max-w-none lg:w-[calc((100%_-_2.5rem)/3)]"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden border-b-3 border-ink bg-neutral-100">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-accent-cyan/40" />
                                        )}
                                        <span className="absolute left-3 top-3 grid h-10 min-w-10 place-items-center border-2 border-ink bg-ink px-2 font-mono text-sm font-black text-primary shadow-[3px_3px_0_#fff]">
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span className={`absolute bottom-0 left-0 h-2 w-full ${i % 3 === 0 ? "bg-accent-cyan" : i % 3 === 1 ? "bg-primary" : "bg-accent-orange"}`} aria-hidden="true" />
                                    </div>

                                    <div className="flex min-h-[142px] flex-col p-4 sm:p-5">
                                        <div className="mb-3 flex items-start justify-between gap-3">
                                            {item.toolUsed ? (
                                                <span className={`max-w-[75%] truncate border px-2 py-1 font-mono text-[9px] font-bold uppercase leading-none ${TOOL_COLORS[item.toolUsed] || TOOL_COLORS["Other"]}`}>
                                                    {item.toolUsed}
                                                </span>
                                            ) : (
                                                <span className="font-mono text-[9px] font-black uppercase tracking-widest text-ink/40">Community build</span>
                                            )}
                                            <ArrowUpRight className="h-5 w-5 flex-none transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                                        </div>

                                        <h3 className="line-clamp-2 font-display text-xl font-black leading-[1.02] text-ink transition-colors group-hover:text-accent-orange sm:text-2xl">
                                            {item.title}
                                        </h3>

                                        <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-dashed border-ink/20 pt-3">
                                            <span className="truncate font-mono text-[10px] font-bold text-ink/55">
                                                @{item.author.name.replace(/^@/, "")}
                                            </span>
                                            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-black text-ink/60">
                                                <Heart className="h-3 w-3" fill="currentColor" aria-hidden="true" />
                                                {item.likesCount || 0}
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <div
                            className="flex items-center gap-2"
                            aria-label={`Showing trending items ${activeIndex + 1} through ${Math.min(trending.length, activeIndex + visibleCount)} of ${trending.length}`}
                        >
                            {trending.map((item, index) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => scrollToCard(index)}
                                    aria-label={`Show trending item ${index + 1}`}
                                    aria-current={index >= activeIndex && index < activeIndex + visibleCount ? "true" : undefined}
                                    className={`h-3 border-2 border-ink transition-all ${index >= activeIndex && index < activeIndex + visibleCount ? "w-10 bg-accent-orange" : "w-5 bg-white hover:bg-primary"}`}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] font-black uppercase tracking-[0.16em] text-ink/50">
                                Auto-advances · hover to pause
                            </span>
                            <button
                                type="button"
                                onClick={() => moveCarousel(-1)}
                                aria-label="Previous trending designs"
                                className="grid h-10 w-10 place-items-center border-3 border-ink bg-white shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                            >
                                <ChevronLeft className="h-5 w-5" strokeWidth={3} />
                            </button>
                            <button
                                type="button"
                                onClick={() => moveCarousel(1)}
                                aria-label="Next trending designs"
                                className="grid h-10 w-10 place-items-center border-3 border-ink bg-primary shadow-[3px_3px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                            >
                                <ChevronRight className="h-5 w-5" strokeWidth={3} />
                            </button>
                        </div>
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
