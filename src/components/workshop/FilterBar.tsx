"use client";

import { BarChart3, Smartphone, ShoppingCart, Code, TrendingUp, Palette, Zap, SlidersHorizontal, type LucideIcon } from "lucide-react";

interface FilterBarProps {
    activeFilter: string | null;
    onFilterChange: (filter: string | null) => void;
    activeTool?: string | null;
    onToolChange?: (tool: string | null) => void;
    resultCount?: number;
    searchQuery?: string;
    onClearAll?: () => void;
}

export function FilterBar({ activeFilter, onFilterChange, activeTool, onToolChange, resultCount, searchQuery, onClearAll }: FilterBarProps) {
    const filters: { name: string; icon: LucideIcon; color: string }[] = [
        { name: "#Analytics", icon: BarChart3, color: "hover:bg-accent-orange" },
        { name: "#Mobile", icon: Smartphone, color: "hover:bg-accent-green" },
        { name: "#Shop", icon: ShoppingCart, color: "hover:bg-ink hover:text-white" },
        { name: "#Developer", icon: Code, color: "hover:bg-accent-orange" },
        { name: "#Trend", icon: TrendingUp, color: "hover:bg-accent-green" },
        { name: "#UI", icon: Palette, color: "hover:bg-ink hover:text-white" },
    ];

    const tools: { name: string; shortLabel: string; bg: string }[] = [
        { name: "Google Stitch", shortLabel: "Stitch", bg: "bg-blue-50 border-blue-400 text-blue-800 hover:bg-blue-100" },
        { name: "Claude Artifacts", shortLabel: "Claude", bg: "bg-orange-50 border-orange-400 text-orange-800 hover:bg-orange-100" },
        { name: "v0 by Vercel", shortLabel: "v0", bg: "bg-neutral-100 border-neutral-500 text-neutral-800 hover:bg-neutral-200" },
        { name: "Figma AI", shortLabel: "Figma AI", bg: "bg-purple-50 border-purple-400 text-purple-800 hover:bg-purple-100" },
        { name: "Cursor", shortLabel: "Cursor", bg: "bg-green-50 border-green-400 text-green-800 hover:bg-green-100" },
    ];

    const hasAnyFilter = !!(activeFilter || searchQuery || activeTool);

    return (
        <section className="border-y-4 border-ink bg-primary py-3.5 mb-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">

                {/* Categories */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 mr-2">
                        <SlidersHorizontal className="w-4 h-4 text-ink" />
                        <span className="font-black text-sm uppercase tracking-wider text-ink">
                            TAGS:
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
                                        ? "px-3.5 py-1.5 bg-ink text-white border-2 border-ink font-mono font-bold text-xs transition-all shadow-none translate-y-[1px]"
                                        : `px-3.5 py-1.5 bg-white text-ink border-2 border-ink font-mono font-bold text-xs transition-all shadow-hard-sm hover:shadow-none hover:translate-y-[1px] ${filter.color}`
                                }
                            >
                                <span className="flex items-center gap-1.5">
                                    <filter.icon className="w-3.5 h-3.5" />
                                    <span>{filter.name}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* AI Tool Filters + Results */}
                <div className="flex items-center gap-2 flex-wrap border-t-2 border-ink/15 lg:border-t-0 pt-2 lg:pt-0 lg:border-l-2 lg:pl-4">
                    <div className="flex items-center gap-1 mr-1">
                        <Zap className="w-3.5 h-3.5 text-ink/70" />
                        <span className="font-mono font-bold text-xs uppercase text-ink/70">
                            TOOL:
                        </span>
                    </div>

                    {tools.map((tool) => {
                        const isActive = activeTool === tool.name;
                        return (
                            <button
                                key={tool.name}
                                onClick={() => onToolChange?.(isActive ? null : tool.name)}
                                className={`px-2.5 py-1 font-mono font-bold text-xs border-2 transition-all ${isActive
                                    ? "bg-ink text-white border-ink shadow-none translate-y-[1px]"
                                    : `${tool.bg} shadow-sm hover:shadow-none hover:translate-y-[1px]`
                                    }`}
                            >
                                {tool.shortLabel}
                                {isActive && <span className="ml-1 text-accent-orange">✓</span>}
                            </button>
                        );
                    })}

                    {/* Result Counter & Clear */}
                    {hasAnyFilter && (
                        <div className="flex items-center gap-2 ml-auto lg:ml-2">
                            {resultCount !== undefined && (
                                <span className="px-2.5 py-1 bg-white border-2 border-ink font-mono font-bold text-xs text-ink">
                                    {resultCount} {resultCount === 1 ? 'result' : 'results'}
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    onFilterChange(null);
                                    onToolChange?.(null);
                                    onClearAll?.();
                                }}
                                className="px-2.5 py-1 bg-accent-orange text-white border-2 border-ink font-mono font-bold text-xs uppercase hover:bg-white hover:text-ink transition-all shadow-sm hover:shadow-none"
                            >
                                Clear ✕
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
