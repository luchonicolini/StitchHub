"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Sparkles, Check, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Image from "next/image";
import { PromptCardProps } from "./PromptCard";
import { useToast } from "@/hooks/useToast";
import { Footer } from "./Footer";
import { DetailViewHeader } from "./DetailViewHeader";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Extend the props to include the codeSnippet which might be passed in the card object
interface ExtendedCardProps extends PromptCardProps {
    codeSnippet?: string;
    gallery?: string[];
}

interface CardDetailModalProps {
    card: ExtendedCardProps;
    onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
    const { showToast } = useToast();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);

    // Initial check for gallery
    const images = card.gallery && card.gallery.length > 0 ? card.gallery : [card.image];
    const currentImage = images[currentImageIndex] || card.image;

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
            if (e.key === "Escape") {
                if (isLightboxOpen) setIsLightboxOpen(false);
                else onClose();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [onClose, isLightboxOpen]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(card.prompt);
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

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Keyboard navigation for carousel
    useEffect(() => {
        const handleKeyboard = (e: KeyboardEvent) => {
            if (!isLightboxOpen && images.length > 1) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevImage();
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextImage();
                }
            }
        };
        window.addEventListener('keydown', handleKeyboard);
        return () => window.removeEventListener('keydown', handleKeyboard);
    }, [images.length, isLightboxOpen]);

    // Mock stats
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
                    className="fixed inset-0 w-full h-full bg-[#f0f0f0] overflow-y-auto z-[110] bg-paper-texture"
                >
                    {/* Detail View Header */}
                    <DetailViewHeader onClose={onClose} />

                    {/* Back Navigation - Subtle & Left-aligned */}
                    <div className="bg-white">
                        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-start">
                            <button
                                onClick={onClose}
                                className="group inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-ink border-2 border-ink px-5 py-2.5 font-mono font-bold text-sm uppercase shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                {/* Arrow Icon */}
                                <svg
                                    className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span>Back</span>

                                {/* Keyboard Hint - Subtle */}
                                <span className="hidden lg:inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 bg-gray-200 text-ink text-[10px] font-mono border border-gray-400 rounded">
                                    ESC
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row p-4 md:p-8 gap-8">

                        {/* LEFT COLUMN: Visuals (65% width for more prominence) */}
                        <div className="w-full lg:w-[65%] flex flex-col gap-12">

                            {/* Polaroid Image Container / Gallery */}
                            <div className="relative transform -rotate-1 transition-transform duration-500 ease-in-out group">
                                {/* Blue Tape - Top Left */}
                                <div className="absolute -top-4 -left-4 w-32 h-10 bg-[#4d79ff] opacity-80 z-20 transform -rotate-[30deg] shadow-sm pointer-events-none"></div>
                                {/* Blue Tape - Bottom Right */}
                                <div className="absolute -bottom-4 -right-4 w-32 h-10 bg-[#4d79ff] opacity-80 z-20 transform -rotate-[30deg] shadow-sm pointer-events-none"></div>

                                <div className="bg-white p-4 pb-16 border-2 border-ink shadow-[10px_10px_0px_0px_rgba(0,0,0,0.15)] relative">
                                    <div className="relative aspect-video w-full bg-ink/5 border-2 border-ink/10 overflow-hidden group/image">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentImageIndex}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative w-full h-full"
                                            >
                                                <Image
                                                    src={currentImage}
                                                    alt={`${card.imageAlt} - view ${currentImageIndex + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                />
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Gallery Controls (if multiple images) */}
                                        {images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-ink border-2 border-ink p-2 rounded-full hover:bg-ink hover:text-white transition-all shadow-hard-sm active:scale-95 z-30 opacity-0 group-hover/image:opacity-100"
                                                >
                                                    <ChevronLeft className="w-6 h-6" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-ink border-2 border-ink p-2 rounded-full hover:bg-ink hover:text-white transition-all shadow-hard-sm active:scale-95 z-30 opacity-0 group-hover/image:opacity-100"
                                                >
                                                    <ChevronRight className="w-6 h-6" />
                                                </button>

                                                {/* Pagination Dots */}
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
                                                    {images.map((_, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-2 h-2 rounded-full border border-ink transition-all ${idx === currentImageIndex ? 'bg-accent-orange scale-125' : 'bg-white'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        {/* Zoom Button */}
                                        <button
                                            onClick={() => setIsLightboxOpen(true)}
                                            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-ink border-2 border-ink p-2 rounded-lg hover:bg-white transition-all shadow-sm z-30 opacity-0 group-hover/image:opacity-100"
                                        >
                                            <ZoomIn className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Caption Area */}
                                    <div className="absolute bottom-4 right-6 font-mono text-xs text-ink/40 font-bold flex flex-col items-end">
                                        <span>fig_{String(currentImageIndex + 1).padStart(2, '0')}_preview.png</span>
                                        {images.length > 1 && <span className="text-[10px] text-accent-orange uppercase tracking-wider">Gallery View ({currentImageIndex + 1}/{images.length})</span>}
                                    </div>
                                    <div className="absolute bottom-4 left-6 font-mono text-xs text-ink/40 font-bold">
                                        {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            {/* Terminal Code Snippet */}
                            <div className="relative mt-8 group">
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
                                    {/* Terminal Tabs */}
                                    <div className="flex border-b border-white/10 bg-[#1a1b26]">
                                        <div className="px-6 py-2 bg-[#4d79ff] text-white font-mono text-xs font-bold border-r border-white/10">HTML</div>
                                        <div className="px-6 py-2 text-white/40 font-mono text-xs font-bold border-r border-white/10 hover:bg-white/5 cursor-pointer">CSS</div>
                                        <div className="px-6 py-2 text-white/40 font-mono text-xs font-bold hover:bg-white/5 cursor-pointer">React</div>
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
                                            {card.codeSnippet || "<!-- No code snippet available -->"}
                                        </SyntaxHighlighter>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Details (35% width) */}
                        <div className="w-full lg:w-[35%] flex flex-col gap-8 lg:sticky lg:top-24 h-fit">

                            {/* Header Group */}
                            <div>
                                {card.featured && (
                                    <span className="inline-block px-3 py-1 bg-[#ffe564] text-ink font-mono font-bold text-xs uppercase border-2 border-ink mb-4 shadow-hard-sm">
                                        NEW RELEASE
                                    </span>
                                )}
                                <h1 className="font-black text-5xl uppercase text-ink mb-6 leading-[0.9] tracking-tight">
                                    {card.title}
                                </h1>

                                <div className="flex items-center gap-4 p-4 border-4 border-ink bg-white shadow-hard-sm transform -rotate-1 max-w-fit">
                                    <div className="w-10 h-10 rounded-full border-2 border-ink overflow-hidden relative">
                                        <Image
                                            src={card.author.avatar}
                                            alt={card.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-lg text-ink font-mono">{card.author.name}</div>
                                        <div className="bg-primary/20 p-0.5 rounded-full border border-ink/20">
                                            <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-t-4 border-ink border-dashed my-2 opacity-20" />

                            {/* Spiral Notebook Prompt */}
                            <div className="relative mt-4">
                                {/* Spiral Binding Visuals */}
                                <div className="absolute -top-6 left-0 right-0 flex justify-between px-8 z-20">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="w-4 h-12 bg-[#d1d5db] border-2 border-ink rounded-full shadow-sm"></div>
                                    ))}
                                </div>

                                <div className="bg-white border-4 border-ink p-8 pt-12 shadow-hard relative">
                                    <div className="flex items-center gap-2 mb-4 text-ink/50 font-mono text-sm uppercase font-bold">
                                        <Sparkles className="w-4 h-4" />
                                        Stitch Recipe
                                    </div>

                                    {/* Expandable Prompt */}
                                    <div className="relative">
                                        <p className={`font-mono text-sm leading-relaxed text-ink/80 ${!isPromptExpanded && card.prompt.length > 200 ? 'line-clamp-4' : ''}`}>
                                            &quot;{card.prompt}&quot;
                                        </p>

                                        {/* Read More / Show Less Button */}
                                        {card.prompt.length > 200 && (
                                            <button
                                                onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                                                className="mt-3 text-xs font-mono font-bold text-ink/60 hover:text-ink underline decoration-2 underline-offset-2 hover:decoration-primary transition-all duration-200 uppercase"
                                            >
                                                {isPromptExpanded ? '← Show Less' : 'Read More →'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Copy Button styled as attached clickable element */}
                                    <div className="absolute -bottom-6 -right-2">
                                        <button
                                            onClick={handleCopy}
                                            className={`font-bold px-6 py-3 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 uppercase active:scale-95 ${copied ? 'bg-[#27c93f] text-white' : 'bg-[#4d79ff] text-white'
                                                }`}
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Clone Recipe
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="bg-white border-4 border-ink p-4 text-center shadow-hard-sm">
                                    <div className="font-black text-2xl text-ink">{stats.views}</div>
                                    <div className="font-mono text-[10px] uppercase text-ink/50 font-bold mt-1">Views</div>
                                </div>
                                <div className="bg-white border-4 border-ink p-4 text-center shadow-hard-sm">
                                    <div className="font-black text-2xl text-ink">{stats.remixes}</div>
                                    <div className="font-mono text-[10px] uppercase text-ink/50 font-bold mt-1">Remixes</div>
                                </div>
                                <div className="bg-white border-4 border-ink p-4 text-center shadow-hard-sm">
                                    <div className="font-black text-2xl text-ink">{stats.rating}</div>
                                    <div className="font-mono text-[10px] uppercase text-ink/50 font-bold mt-1">Rating</div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 flex-wrap">
                                {card.tags.map((tag, i) => (
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
                    </div>

                    {/* Footer */}
                    <Footer />

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
                                <div className="relative w-full h-full max-w-7xl max-h-[90vh] overflow-auto flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                    <img
                                        src={currentImage}
                                        alt="Full screen view"
                                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
