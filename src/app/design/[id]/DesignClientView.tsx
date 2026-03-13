"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Copy, Sparkles, Check, ZoomIn, X, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/useToast";
import { Prompt } from "@/types/prompt";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface DesignClientViewProps {
    initialDesign: Prompt; // Extended props could be added
}

export default function DesignClientView({ initialDesign }: DesignClientViewProps) {
    const { showToast } = useToast();
    const [copiedPrompt, setCopiedPrompt] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);

    const handleCopyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(initialDesign.prompt);
            setCopiedPrompt(true);
            showToast({
                message: "Prompt copied!",
                description: "Ready to paste anywhere",
                type: "success",
            });
            setTimeout(() => setCopiedPrompt(false), 2000);
        } catch {
            showToast({ message: "Copy failed", type: "error" });
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            showToast({
                message: "Link copied to clipboard!",
                description: "Share it with anyone.",
                type: "success",
            });
            setTimeout(() => setCopiedLink(false), 2000);
        } catch {
            showToast({ message: "Copy failed", type: "error" });
        }
    };

    // Close lightbox on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isLightboxOpen) {
                setIsLightboxOpen(false);
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isLightboxOpen]);


    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row p-4 md:p-8 gap-8">
            {/* LEFT COLUMN: Visuals */}
            <div className="w-full lg:w-[65%] flex flex-col gap-12">
                {/* Polaroid Image Container */}
                <div className="relative transform -rotate-1 group">
                    {/* Blue Tape - Top Left */}
                    <div className="absolute -top-4 -left-4 w-32 h-10 bg-[#4d79ff] opacity-80 z-20 transform -rotate-[30deg] shadow-sm pointer-events-none"></div>

                    <div className="bg-white p-4 pb-16 border-2 border-ink shadow-[10px_10px_0px_0px_rgba(0,0,0,0.15)] relative">
                        <div className="relative aspect-video w-full bg-ink/5 border-2 border-ink/10 overflow-hidden group/image">
                            <Image
                                src={initialDesign.image}
                                alt={initialDesign.imageAlt}
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Zoom Button */}
                            <button
                                onClick={() => setIsLightboxOpen(true)}
                                className="absolute top-4 right-4 bg-white/80 text-ink border-2 border-ink p-2 rounded-lg hover:bg-white transition-all shadow-sm z-30 opacity-0 group-hover/image:opacity-100"
                            >
                                <ZoomIn className="w-5 h-5" />
                            </button>
                        </div>
                        {/* Caption Area */}
                        <div className="absolute bottom-4 left-6 font-mono text-xs text-ink/40 font-bold">
                            Published Object
                        </div>
                    </div>
                </div>

                {/* Spiral Notebook Prompt */}
                <div className="relative mt-8 mb-8">
                    {/* Spiral Binding Visuals */}
                    <div className="absolute -top-6 left-0 right-0 flex justify-between px-8 md:px-16 z-20">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-4 h-12 bg-[#d1d5db] border-2 border-ink rounded-full shadow-sm"></div>
                        ))}
                    </div>

                    <div className="bg-white border-4 border-ink p-8 md:p-12 pt-16 shadow-hard relative">
                        <div className="flex items-center gap-2 mb-6 text-ink/50 font-mono text-sm uppercase font-bold">
                            <Sparkles className="w-5 h-5" />
                            Stitch Recipe
                        </div>

                        {/* Expandable Prompt */}
                        <div className="relative">
                            <p className={`font-mono text-base md:text-lg leading-relaxed text-ink/90 break-words ${!isPromptExpanded && initialDesign.prompt.length > 500 ? 'line-clamp-6' : ''}`}>
                                &quot;{initialDesign.prompt}&quot;
                            </p>
                            {initialDesign.prompt.length > 500 && (
                                <button
                                    onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                                    className="mt-6 font-mono font-bold text-ink/60 hover:text-ink underline decoration-2 underline-offset-4 hover:decoration-primary transition-all duration-200 uppercase bg-ink/5 px-4 py-2"
                                >
                                    {isPromptExpanded ? '← Collapse Recipe' : 'Read Full Recipe →'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Terminal Code Snippet (if it existed on Prompt interface) */}
                {initialDesign.codeSnippet && (
                    <div className="relative mt-4 group">
                        <div className="bg-[#1a1b26] rounded-lg border-4 border-ink shadow-hard overflow-hidden">
                            {/* Terminal Header */}
                            <div className="bg-[#1a1b26] border-b border-white/10 px-4 py-3 flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                </div>
                                <div className="flex-1 text-center font-mono text-xs text-white/40">
                                    ~/stitch/generated-output/index.html
                                </div>
                                <div className="w-12"></div>
                            </div>

                            {/* Code Content with Syntax Highlighting */}
                            <div className="overflow-x-auto">
                                <SyntaxHighlighter
                                    language="jsx"
                                    style={vscDarkPlus}
                                    customStyle={{
                                        margin: 0,
                                        padding: '1.5rem',
                                        background: '#1a1b26',
                                        fontSize: '13px',
                                        lineHeight: '1.6',
                                    }}
                                    showLineNumbers={false}
                                >
                                    {initialDesign.codeSnippet}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT COLUMN: Details */}
            <div className="w-full lg:w-[35%] flex flex-col gap-8 lg:sticky lg:top-24 h-fit">
                {/* Header Group */}
                <div>
                    <h1 className="font-black text-4xl uppercase text-ink mb-6 leading-[0.9] tracking-tight break-words">
                        {initialDesign.title}
                    </h1>

                    <Link
                        href={`/profile/${encodeURIComponent(initialDesign.author.name)}`}
                        className="flex items-center gap-4 p-4 border-4 border-ink bg-white shadow-hard-sm transform -rotate-1 max-w-fit hover:rotate-0 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group/profile"
                    >
                        <div className="w-10 h-10 rounded-full border-2 border-ink overflow-hidden relative group-hover/profile:scale-110 transition-transform">
                            <Image src={initialDesign.author.avatar} alt={initialDesign.author.name} fill className="object-cover" />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="font-bold text-lg text-ink font-mono group-hover/profile:underline decoration-2 underline-offset-2">{initialDesign.author.name}</div>
                            <div className="bg-primary/20 p-0.5 rounded-full border border-ink/20">
                                <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                            </div>
                        </div>
                    </Link>
                </div>

                <hr className="border-t-4 border-ink border-dashed my-2 opacity-20" />

                {/* Primary Action: Copy Prompt Component */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleCopyPrompt}
                        className={`w-full font-black text-lg px-6 py-5 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex justify-center items-center gap-3 uppercase ${copiedPrompt ? 'bg-[#27c93f] text-white' : 'bg-primary text-ink'}`}
                    >
                        {copiedPrompt ? (
                            <><Check className="w-6 h-6" /> Recipe Copied!</>
                        ) : (
                            <><Copy className="w-6 h-6" /> Clone Recipe</>
                        )}
                    </button>

                    {/* SHARING LINK BUTTON */}
                    <button
                        onClick={handleCopyLink}
                        className={`w-full font-black text-sm px-4 py-3 border-2 border-ink transition-all flex justify-center items-center gap-2 uppercase ${copiedLink ? 'bg-ink text-white' : 'bg-white hover:bg-gray-50 text-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1'}`}
                    >
                        {copiedLink ? (
                            <><Check className="w-5 h-5" /> Copied!</>
                        ) : (
                            <><LinkIcon className="w-5 h-5" /> Share Full Design</>
                        )}
                    </button>
                </div>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mt-4">
                    {initialDesign.tags.map((tag, i) => (
                        <span
                            key={tag}
                            className={`px-3 py-1 text-ink font-mono font-bold text-xs border-2 border-ink shadow-sm transform hover:scale-105 transition-transform cursor-default
                                ${i % 3 === 0 ? 'bg-[#ff95d6] -rotate-2' : ''}
                                ${i % 3 === 1 ? 'bg-[#27c93f] rotate-1' : ''}
                                ${i % 3 === 2 ? 'bg-[#ffbd2e] -rotate-1' : ''}
                            `}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <button className="absolute top-4 right-4 text-white hover:text-accent-orange transition-colors">
                            <X className="w-8 h-8" />
                        </button>
                        <div className="relative w-full h-full max-w-5xl max-h-[90vh] overflow-auto flex items-center justify-center">
                            <Image
                                src={initialDesign.image}
                                alt={initialDesign.imageAlt}
                                width={1920}
                                height={1080}
                                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                                quality={100}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
