"use client";

import { useState } from "react";

import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/useToast";

export interface PromptCardProps {
    title: string;
    tags: string[];
    prompt: string;
    author: {
        name: string;
        avatar: string;
    };
    image: string;
    imageAlt: string;
    pinColor?: "bg-primary" | "bg-accent-orange" | "bg-accent-green" | "bg-ink" | "bg-white";
    rotation?: string; // e.g. "rotate-1", "-rotate-2"
    featured?: boolean;
}

export function PromptCard({
    title,
    tags,
    prompt,
    author,
    image,
    imageAlt,
    pinColor = "bg-accent-orange",
    rotation = "rotate-0",
    featured,
}: PromptCardProps) {
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopied(true);
            showToast({
                message: "Prompt copied!",
                description: "Ready to paste anywhere",
                type: "success",
            });

            // Reset after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            showToast({
                message: "Copy failed",
                description: "Please try again",
                type: "error",
            });
        }
    };
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
            className={`break-inside-avoid mb-12 relative group transform ${rotation} hover:rotate-0 transition-all duration-400 ease-in-out pt-4`}
        >
            {/* Decorative Pin - Like a real pushpin! */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30">
                <div className={`w-6 h-6 rounded-full ${pinColor} border-2 border-ink shadow-[2px_2px_0_0_#000]`} />
            </div>

            {/* Physical Shadow - Static relative to parent */}
            <div className="absolute inset-0 bg-ink translate-x-2 translate-y-2 rounded-sm top-4"></div>

            {/* Main Card Content */}
            <article
                className="bg-white p-2 pb-8 border-[3px] border-ink relative z-10 w-full hover:-translate-y-1 transition-all duration-400 ease-in-out"
            >
                <div className="aspect-[4/3] bg-gray-100 border-[3px] border-ink mb-4 overflow-hidden relative">
                    <Image
                        src={image}
                        alt={imageAlt}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover filter contrast-125 hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    {featured && (
                        <div className="absolute top-2 left-2 bg-accent-green text-white px-3 py-1 text-xs font-mono font-bold border-2 border-ink shadow-hard-sm transform -rotate-2">
                            ⭐ FEATURED
                        </div>
                    )}
                    {!featured && (
                        <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-0.5 text-xs font-mono font-bold border border-white">
                            STITCH_V4
                        </div>
                    )}
                </div>
                <div className="px-2">
                    <h3 className="font-bold text-xl mb-3 text-ink leading-tight">{title}</h3>
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-bold font-mono bg-[#FFF8D6] px-2 py-1 border-2 border-ink text-ink hover:bg-primary transition-colors duration-300 ease-in-out"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <div className="bg-background-light border-2 border-dashed border-ink/40 p-4 mb-4 font-mono text-xs text-ink/80 h-24 overflow-hidden relative leading-relaxed">
                        &quot;{prompt}&quot;
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-background-light to-transparent"></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-ink overflow-hidden relative grayscale-0">
                                <Image src={author.avatar} alt={author.name} fill className="object-cover" />
                            </div>
                            <span className="font-mono text-xs font-bold text-ink">{author.name}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopy();
                            }}
                            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-ink text-white hover:scale-110 transition-all duration-300 ease-in-out shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none cursor-pointer ${copied ? "bg-accent-green" : "bg-accent-orange hover:bg-ink"
                                }`}
                            title={copied ? "Copied!" : "Copy Prompt"}
                        >
                            {copied ? (
                                <Check className="w-5 h-5" strokeWidth={2.5} />
                            ) : (
                                <Copy className="w-5 h-5" strokeWidth={2.5} />
                            )}
                        </button>
                    </div>
                </div>
            </article>
        </motion.div>
    );
}
