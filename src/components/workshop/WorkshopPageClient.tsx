"use client";

import { useState, useEffect } from "react";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";
import { HeroSection } from "@/components/workshop/HeroSection";
import { TrendingBar } from "@/components/workshop/TrendingBar";
import { FilterBar } from "@/components/workshop/FilterBar";
import { WorkshopFeed } from "@/components/workshop/WorkshopFeed";
import { Footer } from "@/components/workshop/Footer";
import { Prompt } from "@/types/prompt";

interface WorkshopPageClientProps {
    initialPrompts: Prompt[];
    dataStatus?: "ready" | "demo" | "empty" | "error";
    stats?: {
        totalPrompts: number;
        totalContributors: number;
        totalLikes: number;
    };
}

export function WorkshopPageClient({ initialPrompts, stats, dataStatus = "ready" }: WorkshopPageClientProps) {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [resultCount, setResultCount] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    // Read ?search= param from URL if coming from another page
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (!searchParam) return;

        const frame = window.requestAnimationFrame(() => {
            setSearchQuery(searchParam);
            window.setTimeout(() => {
                document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        });

        return () => window.cancelAnimationFrame(frame);
    }, []);

    const clearAll = () => {
        setActiveFilter(null);
        setSearchQuery("");
    };

    return (
        <div className="bg-paper-texture min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-black">
            <WorkshopHeader
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
            <main className="flex-grow">
                <HeroSection stats={stats} />
                {/* Trending Bar — between Hero and Filters */}
                <TrendingBar />
                <div id="explore-section" className="scroll-mt-24">
                    <FilterBar
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        resultCount={resultCount}
                        searchQuery={searchQuery}
                        onClearAll={clearAll}
                    />
                    <WorkshopFeed
                        initialPrompts={initialPrompts}
                        dataStatus={dataStatus}
                        activeFilter={activeFilter}
                        searchQuery={searchQuery}
                        onResultCountChange={setResultCount}
                        onTagClick={(tag) => {
                            setSearchQuery(tag);
                            document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        onClearFilters={clearAll}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}
