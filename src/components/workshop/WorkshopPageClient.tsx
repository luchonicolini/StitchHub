"use client";

import { useState, useEffect } from "react";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";
import { HeroSection } from "@/components/workshop/HeroSection";
import { FilterBar } from "@/components/workshop/FilterBar";
import { WorkshopFeed } from "@/components/workshop/WorkshopFeed";
import { Footer } from "@/components/workshop/Footer";
import { Prompt } from "@/types/prompt";

interface WorkshopPageClientProps {
    initialPrompts: Prompt[];
    stats?: {
        totalPrompts: number;
        totalContributors: number;
        totalLikes: number;
    };
}

export function WorkshopPageClient({ initialPrompts, stats }: WorkshopPageClientProps) {
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [resultCount, setResultCount] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Update search query without scroll interference on typing
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    // Read ?search= param from URL if coming from another page
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearchQuery(searchParam);
            setTimeout(() => {
                document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
        }
    }, []);

    return (
        <div className="bg-paper-texture min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-black">
            <WorkshopHeader
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
            />
            <main className="flex-grow">
                <HeroSection stats={stats} />
                <div id="explore-section" className="scroll-mt-24">
                    <FilterBar
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        resultCount={resultCount}
                        searchQuery={searchQuery}
                    />
                    <WorkshopFeed
                        initialPrompts={initialPrompts}
                        activeFilter={activeFilter}
                        searchQuery={searchQuery}
                        onResultCountChange={setResultCount}
                        onTagClick={(tag) => {
                            setSearchQuery(tag);
                            document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        onClearFilters={() => {
                            setActiveFilter(null);
                            setSearchQuery("");
                        }}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
}
