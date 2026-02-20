"use client";

import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";
import { HeroSection } from "@/components/workshop/HeroSection";
import { FilterBar } from "@/components/workshop/FilterBar";
import { Footer } from "@/components/workshop/Footer";
import { MasonryGrid } from "@/components/workshop/MasonryGrid";
import { PromptCardSkeleton } from "@/components/workshop/PromptCardSkeleton";

export default function Loading() {
    return (
        <div className="bg-paper-texture min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-black">
            <WorkshopHeader />
            <main className="flex-grow">
                <HeroSection />
                <FilterBar
                    activeFilter={null}
                    onFilterChange={() => { }}
                    resultCount={0}
                />
                <MasonryGrid hasMore={false}>
                    <div className="contents">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <PromptCardSkeleton key={`page-skeleton-${i}`} />
                        ))}
                    </div>
                </MasonryGrid>
            </main>
            <Footer />
        </div>
    );
}
