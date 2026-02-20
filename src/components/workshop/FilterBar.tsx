"use client";

import { BarChart3, Smartphone, ShoppingCart, Code, TrendingUp, Palette, type LucideIcon } from "lucide-react";

interface FilterBarProps {
    activeFilter: string | null;
    onFilterChange: (filter: string | null) => void;
    resultCount?: number;
    searchQuery?: string;
}

export function FilterBar({ activeFilter, onFilterChange, resultCount, searchQuery }: FilterBarProps) {
    // Updated filters to match actual card tags
    const filters: { name: string; icon: LucideIcon; rotation: string; color: string }[] = [
        { name: "#Analytics", icon: BarChart3, rotation: "rotate-1", color: "hover:bg-accent-orange" },
        { name: "#Mobile", icon: Smartphone, rotation: "-rotate-2", color: "hover:bg-accent-green" },
        { name: "#Shop", icon: ShoppingCart, rotation: "rotate-2", color: "hover:bg-ink hover:text-white" },
        { name: "#Developer", icon: Code, rotation: "-rotate-1", color: "hover:bg-accent-orange" },
        { name: "#Trend", icon: TrendingUp, rotation: "rotate-1", color: "hover:bg-accent-green" },
        { name: "#UI", icon: Palette, rotation: "-rotate-2", color: "hover:bg-ink hover:text-white" },
    ];

    return (
        <section className="border-y-4 border-ink bg-primary py-6 mb-12 overflow-x-auto">
            <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 min-w-max">
                {/* Label with decorative elements */}
                <div className="relative mr-2">
                    <span className="font-black text-2xl uppercase tracking-tight text-ink relative z-10">
                        FILTERS:
                    </span>
                    {/* Decorative underline */}
                    <div className="absolute -bottom-1 left-0 w-full h-1 bg-ink transform -rotate-1" />
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                    {filters.map((filter) => {
                        const isActive = activeFilter === filter.name;
                        return (
                            <button
                                key={filter.name}
                                onClick={() => onFilterChange(isActive ? null : filter.name)}
                                className={
                                    isActive
                                        ? "group relative px-5 py-2.5 bg-ink !text-white border-3 border-ink font-mono font-bold text-sm transition-all duration-500 ease-in-out cursor-pointer shadow-none translate-x-[4px] translate-y-[4px] rotate-0 scale-105"
                                        : `group relative px-5 py-2.5 bg-white text-ink border-3 border-ink font-mono font-bold text-sm transition-all duration-500 ease-in-out cursor-pointer shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:rotate-0 ${filter.rotation} ${filter.color}`
                                }
                            >
                                {/* Icon + Text */}
                                <span className={isActive ? "flex items-center gap-2 !text-white" : "flex items-center gap-2"}>
                                    <filter.icon className="w-4 h-4" />
                                    <span>{filter.name}</span>
                                </span>

                                {/* Active indicator badge */}
                                {isActive && (
                                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-orange border-2 border-ink rounded-full animate-pulse" />
                                )}

                                {/* Hover decoration */}
                                {!isActive && (
                                    <span className="absolute inset-0 border-2 border-transparent group-hover:border-dashed group-hover:border-ink/30 pointer-events-none transition-all duration-500 ease-in-out" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Result Counter - Shows for both search and filter */}
                {(activeFilter || searchQuery) && resultCount !== undefined && (
                    <div className="ml-2 px-3 py-1 bg-white border-2 border-ink font-mono font-bold text-sm text-ink">
                        {resultCount} {resultCount === 1 ? 'result' : 'results'}
                        {searchQuery && (
                            <span className="text-accent-orange ml-1">
                                for &quot;{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}&quot;
                            </span>
                        )}
                    </div>
                )}

                {/* Clear All Button - Shows when filter OR search is active */}
                {(activeFilter || searchQuery) && (
                    <button
                        onClick={() => onFilterChange(null)}
                        className="ml-4 px-4 py-2 bg-accent-orange text-white border-2 border-ink font-mono font-bold text-xs uppercase
                            hover:bg-white hover:text-ink transition-all duration-300 ease-in-out shadow-hard-sm hover:shadow-none
                            hover:translate-x-[2px] hover:translate-y-[2px] transform -rotate-1 hover:rotate-0"
                    >
                        Clear ✕
                    </button>
                )}
            </div>
        </section>
    );
}
