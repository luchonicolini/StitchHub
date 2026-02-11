"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Sparkles } from "lucide-react";
import Image from "next/image";
import { PromptCardProps } from "./PromptCard";
import { useToast } from "@/hooks/useToast";

interface CardDetailModalProps {
    card: PromptCardProps;
    onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
    const { showToast } = useToast();

    // Lock body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(card.prompt);
            showToast({
                message: "Prompt copied!",
                description: "Ready to paste anywhere",
                type: "success",
            });
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    // Mock stats (can be made dynamic later)
    const stats = {
        views: "2.4k",
        remixes: "856",
        rating: "4.9",
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
                {/* Full Screen Page Content */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-0 w-full h-full bg-paper-texture overflow-y-auto z-[110]"
                >
                    {/* Top Navigation Bar */}
                    <div className="sticky top-0 z-50 w-full bg-background-light border-b-4 border-ink px-4 py-4 flex items-center justify-between shadow-sm">
                        <button
                            onClick={onClose}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-ink font-mono font-bold text-sm uppercase hover:bg-ink hover:text-white transition-all duration-300 shadow-hard-sm"
                        >
                            <span className="material-icons text-sm transform rotate-180">arrow_forward</span>
                            Back to Workshop
                        </button>

                        <div className="font-mono font-bold text-ink/50 text-xs hidden sm:block">
                            PRESS ESC TO CLOSE
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto min-h-screen flex flex-col md:flex-row">
                        {/* LEFT COLUMN: Large Image (Sticky on Desktop) */}
                        <div className="w-full md:w-[65%] bg-ink/5 border-b-4 md:border-b-0 md:border-r-4 border-ink relative min-h-[50vh] md:min-h-auto">
                            <div className="sticky top-[80px] h-[calc(100vh-80px)] w-full p-8 flex items-center justify-center">
                                <div className="relative w-full h-full shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)]">
                                    <Image
                                        src={card.image}
                                        alt={card.imageAlt}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Details (Scrollable) */}
                        <div className="w-full md:w-[35%] bg-white p-8 md:p-12 flex flex-col gap-8">
                            {/* Header Info */}
                            <div>
                                {card.featured && (
                                    <span className="inline-block px-3 py-1 bg-accent-orange text-white font-mono font-bold text-xs uppercase border-2 border-ink mb-4 shadow-hard-sm transform -rotate-2">
                                        NEW RELEASE
                                    </span>
                                )}
                                <h1 className="font-black text-4xl md:text-5xl uppercase text-ink mb-6 leading-[0.9]">
                                    {card.title}
                                </h1>

                                <div className="flex items-center gap-4 p-4 border-2 border-ink bg-paper-texture shadow-sm">
                                    <div className="w-12 h-12 rounded-full border-2 border-ink overflow-hidden relative">
                                        <Image
                                            src={card.author.avatar}
                                            alt={card.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-mono text-xs text-ink/60 uppercase">Created by</div>
                                        <div className="font-bold text-lg text-ink">{card.author.name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 flex-wrap">
                                {card.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-[#ffe564] text-ink font-mono font-bold text-sm border-2 border-ink hover:bg-white transition-colors cursor-pointer"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <hr className="border-2 border-ink border-dashed my-2" />

                            {/* Prompt Section */}
                            <div>
                                <h3 className="font-black text-xl uppercase text-ink mb-4 flex items-center gap-2">
                                    <Sparkles className="w-6 h-6 text-accent-orange fill-accent-orange" />
                                    The Prompt
                                </h3>
                                <div className="bg-ink text-white p-6 font-mono text-sm leading-relaxed border-4 border-ink/20 relative group">
                                    <span className="absolute -top-3 -left-3 bg-accent-green px-2 py-1 text-ink border-2 border-ink font-bold text-xs transform -rotate-3">
                                        RAW TEXT
                                    </span>
                                    &quot;{card.prompt}&quot;
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={handleCopy}
                                className="w-full py-4 bg-primary text-ink font-black uppercase text-xl border-4 border-ink shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3 active:bg-accent-orange"
                            >
                                <Copy className="w-6 h-6" strokeWidth={3} />
                                COPY PROMPT
                            </button>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-auto pt-8 border-t-4 border-ink">
                                <div className="text-center">
                                    <div className="font-black text-3xl text-ink">{stats.views}</div>
                                    <div className="font-mono text-xs uppercase text-ink/60">Views</div>
                                </div>
                                <div className="text-center border-l-2 border-ink">
                                    <div className="font-black text-3xl text-ink">{stats.remixes}</div>
                                    <div className="font-mono text-xs uppercase text-ink/60">Remixes</div>
                                </div>
                                <div className="text-center border-l-2 border-ink">
                                    <div className="font-black text-3xl text-ink">{stats.rating}</div>
                                    <div className="font-mono text-xs uppercase text-ink/60">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
