"use client";

import { BarChart3, Smartphone, ShoppingCart, Code, TrendingUp, Palette, SlidersHorizontal, type LucideIcon } from "lucide-react";

interface FilterBarProps {
    activeFilter: string | null;
    onFilterChange: (filter: string | null) => void;
    resultCount?: number;
    searchQuery?: string;
    onClearAll?: () => void;
}

export function FilterBar({ activeFilter, onFilterChange, resultCount, searchQuery, onClearAll }: FilterBarProps) {
    const filters: { name: string; icon: LucideIcon; color: string }[] = [
        { name: "#Analytics", icon: BarChart3, color: "hover:bg-accent-orange" },
        { name: "#Mobile", icon: Smartphone, color: "hover:bg-accent-green" },
        { name: "#Shop", icon: ShoppingCart, color: "hover:bg-ink hover:text-white" },
        { name: "#Developer", icon: Code, color: "hover:bg-accent-orange" },
        { name: "#Trend", icon: TrendingUp, color: "hover:bg-accent-green" },
        { name: "#UI", icon: Palette, color: "hover:bg-ink hover:text-white" },
    ];

    const hasAnyFilter = !!(activeFilter || searchQuery);

    return (
        <section className="border-y-4 border-ink bg-primary py-4 mb-10 overflow-x-auto shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 min-w-max">

                {/* Categories */}
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 mr-2">
                        <SlidersHorizontal className="w-4 h-4 text-ink" />
                        <span className="font-black text-xl uppercase tracking-tight text-ink">
                            FILTERS:
                        </span>
                    </div>

                    {filters.map((filter) => {
                        const isActive = activeFilter === filter.name;
                        return (
                            <button
                                key={filter.name}
                                onClick={() => onFilterChange(isActive ? null : filter.name)}
                                className={
                                    isActive
                                        ? "px-4 py-2 bg-ink text-white border-3 border-ink font-mono font-bold text-sm transition-all shadow-none translate-y-[2px]"
                                        : `px-4 py-2 bg-white text-ink border-3 border-ink font-mono font-bold text-sm transition-all shadow-hard-sm hover:shadow-none hover:translate-y-[2px] ${filter.color}`
                                }
                            >
                                <span className="flex items-center gap-2">
                                    <filter.icon className="w-4 h-4" />
                                    <span>{filter.name}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Result Counter & Clear */}
                {hasAnyFilter && (
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        {resultCount !== undefined && (
                            <span className="px-3 py-1.5 bg-white border-2 border-ink font-mono font-bold text-xs text-ink">
                                {resultCount} {resultCount === 1 ? 'result' : 'results'}
                                {searchQuery && (
                                    <span className="text-accent-orange ml-1">
                                        for &quot;{searchQuery.length > 15 ? searchQuery.substring(0, 15) + '...' : searchQuery}&quot;
                                    </span>
                                )}
                            </span>
                        )}
                        <button
                            onClick={() => {
                                onFilterChange(null);
                                onClearAll?.();
                            }}
                            className="px-3.5 py-1.5 bg-accent-orange text-white border-2 border-ink font-mono font-bold text-xs uppercase hover:bg-white hover:text-ink transition-all shadow-hard-sm hover:shadow-none cursor-pointer"
                        >
                            Clear ✕
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}
