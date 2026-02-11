"use client";

import { useState } from "react";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";
import { HeroSection } from "@/components/workshop/HeroSection";
import { FilterBar } from "@/components/workshop/FilterBar";
import { WorkshopFeed } from "@/components/workshop/WorkshopFeed";
import { Footer } from "@/components/workshop/Footer";

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [resultCount, setResultCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="bg-paper-texture min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-black">
      <WorkshopHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-grow">
        <HeroSection />
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          resultCount={resultCount}
          searchQuery={searchQuery}
        />
        <WorkshopFeed
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onResultCountChange={setResultCount}
        />
      </main>
      <Footer />
    </div>
  );
}
