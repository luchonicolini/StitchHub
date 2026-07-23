"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Sparkles, Check, ChevronLeft, ChevronRight, ZoomIn, X, Link as LinkIcon, Wrench, FileText, Flag, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PromptCardProps } from "./PromptCard";
import { useToast } from "@/hooks/useToast";
import { Footer } from "./Footer";
import { WorkshopHeader } from "./WorkshopHeader";
import { CommentsSection } from "./CommentsSection";
import { resolveImageUrl } from "@/lib/uploadImage";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Extend the props to include the codeSnippet which might be passed in the card object
interface ExtendedCardProps extends PromptCardProps {
    id: string | number;
    codeSnippet?: string;
    gallery?: string[];
    toolUsed?: string;
    description?: string;
    commentsCount?: number;
    isPublic?: boolean;
    userId?: string;
}

interface CardDetailModalProps {
    card: ExtendedCardProps;
    onClose: () => void;
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
    const { showToast } = useToast();
    const { user } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);
    const [isPromptExpanded, setIsPromptExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState<"html" | "css" | "react">("html");
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportReason, setReportReason] = useState('spam');
    const [reportDetails, setReportDetails] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    // Code language switcher
    const getTabLanguage = () => {
        if (activeTab === "react") return "jsx";
        if (activeTab === "css") return "css";
        return "html";
    };

    // Tab code content switcher
    const getCodeForActiveTab = () => {
        const rawCode = card.codeSnippet || "<!-- No code snippet available -->";
        if (activeTab === "css") {
            return `/* Tailwind & Custom CSS Stylesheet for ${card.title} */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Neo-Brutalist Utilities */\n.neo-card {\n  border: 4px solid #000000;\n  box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);\n  transition: all 0.2s ease-in-out;\n}\n\n.neo-card:hover {\n  transform: translate(2px, 2px);\n  box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);\n}`;
        }
        if (activeTab === "react") {
            const cleanTitle = card.title.replace(/[^a-zA-Z0-9]/g, '');
            return `import React from 'react';\n\nexport default function ${cleanTitle}Component() {\n  return (\n    ${rawCode.replace(/class=/g, 'className=')}\n  );\n}`;
        }
        return rawCode;
    };

    // Initial check for gallery with private URI resolution
    const [resolvedImages, setResolvedImages] = useState<string[]>([]);

    useEffect(() => {
        let isMounted = true;
        const rawImages = card.gallery && card.gallery.length > 0 ? card.gallery : [card.image];
        const refreshImages = () => {
            Promise.all(rawImages.map(img => resolveImageUrl(img))).then(urls => {
                if (isMounted) setResolvedImages(urls);
            });
        };
        refreshImages();
        const hasPrivateImages = rawImages.some(image => image.startsWith('private-design-images://'));
        const refreshTimer = hasPrivateImages
            ? window.setInterval(refreshImages, 9 * 60 * 1000)
            : null;
        return () => {
            isMounted = false;
            if (refreshTimer) window.clearInterval(refreshTimer);
        };
    }, [card]);

    const sanitizeImage = (img?: string) => (!img || img.startsWith('private-design-images://') ? '/images/placeholder.png' : img);
    const images = resolvedImages.length > 0 ? resolvedImages : (card.gallery && card.gallery.length > 0 ? card.gallery : [card.image]).map(sanitizeImage);
    const currentImage = images[currentImageIndex] || images[0] || '/images/placeholder.png';

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

    const numericDesignId = Number.parseInt(String(card.id).replace('db-', ''), 10);
    const canReport = !card.isDemo && Number.isFinite(numericDesignId) && card.userId !== user?.id;

    const handleReport = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) {
            showToast({ message: 'Login required', description: 'Sign in to report content.', type: 'warning' });
            return;
        }
        if (!canReport || isReporting) return;

        setIsReporting(true);
        const { error } = await supabase.from('content_reports').insert({
            reporter_id: user.id,
            design_id: numericDesignId,
            reason: reportReason,
            details: reportDetails.trim() || null,
        });

        if (error) {
            showToast({
                message: error.code === '23505' ? 'You already reported this design.' : 'Unable to submit report.',
                type: error.code === '23505' ? 'info' : 'error',
            });
        } else {
            showToast({ message: 'Report submitted for review.', type: 'success' });
            setIsReportOpen(false);
            setReportDetails('');
            setReportReason('spam');
        }
        setIsReporting(false);
    };

    const handleCopyLink = async () => {
        try {
            const host = window.location.origin;
            const link = `${host}/design/${card.id}`;
            await navigator.clipboard.writeText(link);
            setCopiedLink(true);
            showToast({
                message: "Link copied to clipboard!",
                description: "Share it with anyone.",
                type: "success",
            });
            setTimeout(() => setCopiedLink(false), 2000);
        } catch (err) {
            console.error("Failed to copy link:", err);
            showToast({
                message: "Copy failed",
                description: "Please try again",
                type: "error",
            });
        }
    };

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

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
    }, [images.length, isLightboxOpen, nextImage, prevImage]);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center" role="dialog" aria-modal="true" aria-label={`${card.title} details`}>
                {/* Full Screen Page Content */}
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-0 w-full h-full bg-[#f0f0f0] overflow-y-auto z-[110] bg-paper-texture"
                >
                    {/* Detail View Header */}
                    <WorkshopHeader showSearch={false} />

                    {/* Back Navigation - Subtle & Left-aligned */}
                    <div className="bg-transparent">
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

                    <div className="max-w-7xl mx-auto min-h-screen flex flex-col lg:flex-row p-4 md:p-8 gap-8 min-w-0">

                        {/* LEFT COLUMN: Visuals (65% width for more prominence) */}
                        <div className="w-full min-w-0 lg:w-[65%] flex flex-col gap-12">

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

                            {/* Spiral Notebook Prompt (Moved to Left Column for Width) */}
                            <div className="relative mt-12 mb-8">
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
                                        <p className={`font-mono text-base md:text-lg leading-relaxed text-ink/90 break-words ${!isPromptExpanded && card.prompt.length > 500 ? 'line-clamp-6' : ''}`}>
                                            &quot;{card.prompt}&quot;
                                        </p>

                                        {/* Read More / Show Less Button */}
                                        {card.prompt.length > 500 && (
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

                            {/* Terminal Code Snippet */}
                            {card.codeSnippet && (
                                <div className="relative mt-8 group">
                                    <div className="w-full min-w-0 max-w-full bg-[#1a1b26] rounded-lg border-4 border-ink shadow-hard overflow-hidden">
                                        {/* Terminal Header */}
                                        <div className="bg-[#1a1b26] border-b border-white/10 px-3 sm:px-4 py-3 flex items-center justify-between gap-3 min-w-0">
                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                                <div className="flex gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                                </div>
                                                <div className="hidden sm:block min-w-0 font-mono text-xs text-white/50 truncate">
                                                    ~/stitch/generated-output/index.html
                                                </div>
                                            </div>
                                            
                                            {/* Copy Code Button */}
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await navigator.clipboard.writeText(card.codeSnippet || '');
                                                        showToast({ message: "Code copied!", type: "success" });
                                                    } catch {
                                                        showToast({ message: "Unable to copy code", type: "error" });
                                                    }
                                                }}
                                                className="shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded border border-white/20 transition-all active:scale-95 cursor-pointer"
                                                title="Copy full code"
                                                aria-label="Copy full code"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Copy code</span>
                                            </button>
                                        </div>

                                        {/* Terminal Tabs */}
                                        <div className="flex border-b border-white/10 bg-[#1a1b26]" role="tablist" aria-label="Code format">
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("html")}
                                                role="tab"
                                                aria-selected={activeTab === "html"}
                                                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 font-mono text-xs font-bold border-r border-white/10 transition-colors cursor-pointer ${activeTab === "html" ? 'bg-[#4d79ff] text-white' : 'text-white/40 hover:bg-white/5'}`}
                                            >
                                                HTML
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("css")}
                                                role="tab"
                                                aria-selected={activeTab === "css"}
                                                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 font-mono text-xs font-bold border-r border-white/10 transition-colors cursor-pointer ${activeTab === "css" ? 'bg-[#4d79ff] text-white' : 'text-white/40 hover:bg-white/5'}`}
                                            >
                                                CSS
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("react")}
                                                role="tab"
                                                aria-selected={activeTab === "react"}
                                                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 font-mono text-xs font-bold transition-colors cursor-pointer ${activeTab === "react" ? 'bg-[#4d79ff] text-white' : 'text-white/40 hover:bg-white/5'}`}
                                            >
                                                React
                                            </button>
                                        </div>

                                        {/* Code Content with Syntax Highlighting & Line Wrap */}
                                        <div className="w-full min-w-0 max-w-full max-h-[480px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20">
                                            <SyntaxHighlighter
                                                language={getTabLanguage()}
                                                style={vscDarkPlus}
                                                wrapLongLines={true}
                                                customStyle={{
                                                    margin: 0,
                                                        padding: 'clamp(0.75rem, 3vw, 1.5rem)',
                                                    background: '#1a1b26',
                                                        fontSize: 'clamp(11px, 1.5vw, 13px)',
                                                    lineHeight: '1.6',
                                                    whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-word',
                                                        overflowWrap: 'anywhere',
                                                        overflowX: 'hidden',
                                                        width: '100%',
                                                        maxWidth: '100%',
                                                    }}
                                                    codeTagProps={{
                                                        style: {
                                                            whiteSpace: 'pre-wrap',
                                                            wordBreak: 'break-word',
                                                            overflowWrap: 'anywhere',
                                                        },
                                                    }}
                                                    wrapLines={true}
                                                    lineProps={{
                                                        style: {
                                                            display: 'block',
                                                            whiteSpace: 'pre-wrap',
                                                            wordBreak: 'break-word',
                                                            overflowWrap: 'anywhere',
                                                        },
                                                    }}
                                                showLineNumbers={true}
                                            >
                                                {getCodeForActiveTab()}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* RIGHT COLUMN: Details (35% width) */}
                        <div className="w-full lg:w-[35%] flex flex-col gap-8 lg:sticky lg:top-24 h-fit">

                            {/* Header Group */}
                            <div>
                                {card.isPublic === false && (
                                    <span className="inline-block px-3 py-1 bg-ink text-white font-mono font-bold text-xs uppercase border-2 border-ink mb-4 shadow-hard-sm mr-2">
                                        🔒 Private Prompt
                                    </span>
                                )}
                                {card.isDemo && (
                                    <span className="mb-4 mr-2 inline-block border-2 border-ink bg-accent-yellow px-3 py-1 font-mono text-xs font-bold uppercase text-ink shadow-hard-sm">
                                        Demo example
                                    </span>
                                )}
                                {card.featured && (
                                    <span className="inline-block px-3 py-1 bg-[#ffe564] text-ink font-mono font-bold text-xs uppercase border-2 border-ink mb-4 shadow-hard-sm">
                                        NEW RELEASE
                                    </span>
                                )}
                                <h1 className="font-black text-5xl uppercase text-ink mb-6 leading-[0.9] tracking-tight break-words overflow-hidden">
                                    {card.title}
                                </h1>

                                <Link
                                    href={`/profile/${encodeURIComponent(card.author.name)}`}
                                    className="flex items-center gap-4 p-4 border-4 border-ink bg-white shadow-hard-sm transform -rotate-1 max-w-fit hover:rotate-0 hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group/profile"
                                >
                                    <div className="w-10 h-10 rounded-full border-2 border-ink overflow-hidden relative group-hover/profile:scale-110 transition-transform">
                                        <Image
                                            src={card.author.avatar}
                                            alt={card.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-lg text-ink font-mono group-hover/profile:underline decoration-2 underline-offset-2">{card.author.name}</div>
                                        <div className="bg-primary/20 p-0.5 rounded-full border border-ink/20">
                                            <Check className="w-3 h-3 text-primary" strokeWidth={4} />
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <hr className="border-t-4 border-ink border-dashed my-2 opacity-20" />

                            {/* AI Tool Badge */}
                            {card.toolUsed && (
                                <div className="flex items-center gap-2 px-4 py-3 bg-ink/5 border-3 border-ink/20">
                                    <Wrench className="w-4 h-4 text-ink/60 flex-shrink-0" />
                                    <div>
                                        <p className="font-mono text-[10px] uppercase text-ink/40 font-bold leading-none mb-0.5">Built with</p>
                                        <p className="font-mono font-bold text-sm text-ink">{card.toolUsed}</p>
                                    </div>
                                </div>
                            )}

                            {/* Process Description */}
                            {card.description && (
                                <div className="border-3 border-ink/20 bg-white p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="w-4 h-4 text-ink/50" />
                                        <span className="font-mono font-bold text-xs uppercase text-ink/50">Process & Notes</span>
                                    </div>
                                    <p className="font-mono text-sm text-ink/80 leading-relaxed whitespace-pre-wrap">
                                        {card.description}
                                    </p>
                                </div>
                            )}

                            {/* Primary Action: Sticky Copy Button */}
                            <button
                                onClick={handleCopy}
                                className={`w-full font-black text-lg px-6 py-5 border-4 border-ink shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex justify-center items-center gap-3 uppercase mt-4 cursor-pointer ${copied ? 'bg-[#27c93f] text-white' : 'bg-primary text-ink'
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-6 h-6" />
                                        Recipe Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-6 h-6" />
                                        Clone Recipe
                                    </>
                                )}
                            </button>

                            {/* Share Link Button */}
                            <button
                                onClick={handleCopyLink}
                                className={`w-full font-black text-sm px-4 py-3 border-2 border-ink transition-all flex justify-center items-center gap-2 uppercase mt-2 cursor-pointer ${copiedLink ? 'bg-ink text-white' : 'bg-white hover:bg-gray-50 text-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1'}`}
                            >
                                {copiedLink ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <LinkIcon className="w-5 h-5" />
                                        Share Link
                                    </>
                                )}
                            </button>

                            {canReport && (
                                <button
                                    type="button"
                                    onClick={() => setIsReportOpen(true)}
                                    className="mt-3 flex w-full items-center justify-center gap-2 border-2 border-ink bg-white px-4 py-3 font-mono text-xs font-bold uppercase text-ink transition-colors hover:bg-red-50 hover:text-red-700"
                                >
                                    <Flag className="h-4 w-4" /> Report content
                                </button>
                            )}

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

                    {/* Comments Section — below main content, full width */}
                    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
                        {(() => {
                            const rawId = String(card.id).replace('db-', '');
                            const numericId = parseInt(rawId);
                            if (!isNaN(numericId)) {
                                return <CommentsSection designId={rawId} />;
                            }
                            return null;
                        })()}
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
                                <button
                                    onClick={() => setIsLightboxOpen(false)}
                                    className="absolute top-6 right-6 bg-red-500 text-white border-2 border-ink p-2 hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer z-50 flex items-center justify-center"
                                    title="Close image"
                                    aria-label="Close image preview"
                                >
                                    <X className="w-6 h-6 stroke-[3]" />
                                </button>
                                <div className="relative w-full h-full max-w-7xl max-h-[90vh] overflow-auto flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                    <Image
                                        src={currentImage}
                                        alt="Full screen view"
                                        width={1920}
                                        height={1080}
                                        className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                                        quality={100}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isReportOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="report-dialog-title"
                                onClick={() => setIsReportOpen(false)}
                            >
                                <motion.form
                                    initial={{ scale: 0.95, y: 16 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 16 }}
                                    onSubmit={handleReport}
                                    onClick={(event) => event.stopPropagation()}
                                    className="w-full max-w-lg border-4 border-ink bg-white p-6 shadow-hard"
                                >
                                    <div className="mb-5 flex items-start justify-between gap-4">
                                        <div>
                                            <h2 id="report-dialog-title" className="text-xl font-black uppercase text-ink">Report content</h2>
                                            <p className="mt-1 font-mono text-xs text-ink/60">Reports are private and reviewed by the StitchHub team.</p>
                                        </div>
                                        <button type="button" onClick={() => setIsReportOpen(false)} aria-label="Close report dialog" className="border-2 border-ink p-1 text-ink hover:bg-ink hover:text-white">
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <label htmlFor="report-reason" className="mb-2 block font-mono text-xs font-bold uppercase text-ink">Reason</label>
                                    <select id="report-reason" value={reportReason} onChange={(event) => setReportReason(event.target.value)} className="mb-4 w-full border-3 border-ink bg-white px-3 py-2 font-mono text-sm text-ink">
                                        <option value="spam">Spam or misleading</option>
                                        <option value="harassment">Harassment</option>
                                        <option value="copyright">Copyright concern</option>
                                        <option value="unsafe">Unsafe content</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <label htmlFor="report-details" className="mb-2 block font-mono text-xs font-bold uppercase text-ink">Details (optional)</label>
                                    <textarea id="report-details" value={reportDetails} onChange={(event) => setReportDetails(event.target.value.slice(0, 1000))} rows={4} className="w-full resize-none border-3 border-ink bg-white px-3 py-2 font-mono text-sm text-ink" />
                                    <div className="mt-5 flex justify-end gap-3">
                                        <button type="button" onClick={() => setIsReportOpen(false)} className="border-2 border-ink bg-white px-4 py-2 font-mono text-xs font-bold uppercase text-ink">Cancel</button>
                                        <button type="submit" disabled={isReporting} className="flex items-center gap-2 border-2 border-ink bg-red-600 px-4 py-2 font-mono text-xs font-black uppercase text-white disabled:opacity-50">
                                            {isReporting && <Loader2 className="h-4 w-4 animate-spin" />} Submit report
                                        </button>
                                    </div>
                                </motion.form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
