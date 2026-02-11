"use client";

import { useState, useMemo, useEffect } from "react";
import { MasonryGrid } from "@/components/workshop/MasonryGrid";
import { PromptCard, PromptCardProps } from "@/components/workshop/PromptCard";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Define a type for the data items that extends the card props
// This handles the 'id' and 'type' properties that are not part of the card component props
interface PromptItem extends PromptCardProps {
    id: string;
    type?: "promo" | "card";
}

// Initial Data
const INITIAL_PROMPTS: PromptItem[] = [
    {
        id: "promo-card",
        type: "promo",
        title: "Join the Workshop",
        tags: [],
        prompt: "",
        author: { name: "", avatar: "" },
        image: "",
        imageAlt: "",
        rotation: "rotate-2",
    },
    {
        id: "card-1",
        title: "Retro Dashboard UI",
        tags: ["#Analytics", "#RetroUI", "#NeoBrutalism"],
        prompt: "A retro-futuristic dashboard interface with glowing green text on a dark CRT monitor background, scanlines visible, chunky 8-bit icons, high contrast, neo-brutalist layout with thick borders, data visualization charts in wireframe style, cyberpunk aesthetic.",
        author: {
            name: "@pixel_artisan",
            avatar: "https://i.pravatar.cc/150?u=pixel_artisan",
        },
        image: "https://picsum.photos/seed/retro/800/600",
        imageAlt: "Retro dashboard UI design",
        pinColor: "bg-accent-orange",
        rotation: "-rotate-2",
        featured: true,
    },
    {
        id: "card-2",
        title: "Neon Mobile App",
        tags: ["#Mobile", "#AppDesign", "#Neon"],
        prompt: "High-fidelity mobile app design for a music streaming service, dark mode with vibrant neon pink and blue accents, glassmorphism effects on cards, large bold typography, minimal navigation bar, album art with glowing drop shadows.",
        author: {
            name: "@neon_dreams",
            avatar: "https://i.pravatar.cc/150?u=neon_dreams",
        },
        image: "https://picsum.photos/seed/neon/800/600",
        imageAlt: "Neon mobile app interface",
        pinColor: "bg-primary",
        rotation: "rotate-1",
    },
    {
        id: "card-3",
        title: "E-commerce Hero",
        tags: ["#Shop", "#WebDesign", "#Minimal"],
        prompt: "Clean and minimalist e-commerce website hero section for a luxury sneaker brand, large high-quality product image on the right, bold serif typography on the left, plenty of whitespace, 'Shop Now' button with a subtle hover animation, soft pastel background.",
        author: {
            name: "@minimal_store",
            avatar: "https://i.pravatar.cc/150?u=minimal_store",
        },
        image: "https://picsum.photos/seed/shop/800/600",
        imageAlt: "E-commerce hero section",
        pinColor: "bg-accent-green",
        rotation: "-rotate-1",
    },
    {
        id: "card-4",
        title: "Developer Portfolio",
        tags: ["#Developer", "#Portfolio", "#Dark"],
        prompt: "Personal portfolio website for a full-stack developer, dark theme with code snippet background textures, monospaced typography, timeline component for work experience, skill badges with glow effects, contact form with floating labels.",
        author: {
            name: "@dev_guru",
            avatar: "https://i.pravatar.cc/150?u=dev_guru",
        },
        image: "https://picsum.photos/seed/developer/800/600",
        imageAlt: "Developer portfolio website",
        pinColor: "bg-ink",
        rotation: "rotate-2",
    },
    {
        id: "card-5",
        title: "Crypto Wallet",
        tags: ["#Trend", "#Finance", "#Mobile"],
        prompt: "Modern cryptocurrency wallet mobile app interface, clean white background with bold black borders (neo-brutalism light), colorful pill-shaped buttons for 'Send' and 'Receive', real-time graph with gradient fill, large balance display.",
        author: {
            name: "@crypto_king",
            avatar: "https://i.pravatar.cc/150?u=crypto_king",
        },
        image: "https://picsum.photos/seed/crypto/800/600",
        imageAlt: "Crypto wallet app design",
        pinColor: "bg-accent-orange",
        rotation: "-rotate-1",
    },
    {
        id: "card-6",
        title: "Task Manager",
        tags: ["#UI", "#Productivity", "#Clean"],
        prompt: "Productivity dashboard for project management, Kanban board layout with drag-and-drop cards, soft shadows, rounded corners, pastel color coding for tags, user avatars overlapping, sidebar navigation with collapsible menus.",
        author: {
            name: "@task_master",
            avatar: "https://i.pravatar.cc/150?u=task_master",
        },
        image: "https://picsum.photos/seed/task/800/600",
        imageAlt: "Task manager dashboard",
        pinColor: "bg-primary",
        rotation: "rotate-1",
    },
];

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
    const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);

    // Filter prompts based on activeFilter AND searchQuery
    const filteredPrompts = useMemo(() => {
        let filtered = prompts;

        // First, filter by search query if present
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(item => {
                // Always show promo card
                if (item.type === "promo") return true;

                // Search in title, tags, and prompt
                return (
                    item.title.toLowerCase().includes(query) ||
                    item.tags.some(tag => tag.toLowerCase().includes(query)) ||
                    item.prompt.toLowerCase().includes(query)
                );
            });
        }

        // Then, filter by active tag filter if present
        if (activeFilter) {
            filtered = filtered.filter(item => {
                // Always show promo card
                if (item.type === "promo") return true;
                // Filter by tag
                return item.tags.includes(activeFilter);
            });
        }

        return filtered;
    }, [prompts, activeFilter, searchQuery]);

    const handleLoadMore = () => {
        // Only add regular cards (NO promo card) when loading more
        const regularCards = INITIAL_PROMPTS.filter(p => p.type !== "promo");

        const newItems = regularCards.map((item, index) => ({
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
                        return <PromptCard key={`${item.id}-${index}`} {...cardProps} />;
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
    );
}
