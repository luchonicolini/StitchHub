"use client";

import { BarChart3, Smartphone, ShoppingCart, Code, TrendingUp, Palette, Zap, type LucideIcon } from "lucide-react";

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
    const filters: { name: string; icon: LucideIcon; rotation: string; color: string }[] = [
        { name: "#Analytics", icon: BarChart3, rotation: "rotate-1", color: "hover:bg-accent-orange" },
        { name: "#Mobile", icon: Smartphone, rotation: "-rotate-2", color: "hover:bg-accent-green" },
        { name: "#Shop", icon: ShoppingCart, rotation: "rotate-2", color: "hover:bg-ink hover:text-white" },
        { name: "#Developer", icon: Code, rotation: "-rotate-1", color: "hover:bg-accent-orange" },
        { name: "#Trend", icon: TrendingUp, rotation: "rotate-1", color: "hover:bg-accent-green" },
        { name: "#UI", icon: Palette, rotation: "-rotate-2", color: "hover:bg-ink hover:text-white" },
    ];

    const tools: { name: string; shortLabel: string; bg: string }[] = [
        { name: "Google Stitch", shortLabel: "Stitch", bg: "bg-blue-100 border-blue-400 text-blue-800 hover:bg-blue-200" },
        { name: "Claude Artifacts", shortLabel: "Claude", bg: "bg-orange-100 border-orange-400 text-orange-800 hover:bg-orange-200" },
        { name: "v0 by Vercel", shortLabel: "v0", bg: "bg-neutral-200 border-neutral-500 text-neutral-800 hover:bg-neutral-300" },
        { name: "Figma AI", shortLabel: "Figma AI", bg: "bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200" },
        { name: "Cursor", shortLabel: "Cursor", bg: "bg-green-100 border-green-400 text-green-800 hover:bg-green-200" },
    ];

    const hasAnyFilter = !!(activeFilter || searchQuery || activeTool);

    return (
        <section className="border-y-4 border-ink bg-primary py-5 mb-12 overflow-x-auto">
            <div className="max-w-7xl mx-auto px-4 space-y-4">
                {/* Row 1: Category Filters */}
                <div className="flex items-center gap-4 min-w-max">
                    <div className="relative mr-2 flex-shrink-0">
                        <span className="font-black text-xl uppercase tracking-tight text-ink relative z-10">
                            FILTERS:
                        </span>
                        <div className="absolute -bottom-1 left-0 w-full h-1 bg-ink transform -rotate-1" />
                    </div>

                    <div className="flex items-center gap-3">
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
                                    <span className={isActive ? "flex items-center gap-2 !text-white" : "flex items-center gap-2"}>
                                        <filter.icon className="w-4 h-4" />
                                        <span>{filter.name}</span>
                                    </span>
                                    {isActive && (
                                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-orange border-2 border-ink rounded-full animate-pulse" />
                                    )}
                                    {!isActive && (
                                        <span className="absolute inset-0 border-2 border-transparent group-hover:border-dashed group-hover:border-ink/30 pointer-events-none transition-all duration-500 ease-in-out" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Result Counter */}
                    {hasAnyFilter && resultCount !== undefined && (
                        <div className="ml-2 px-3 py-1 bg-white border-2 border-ink font-mono font-bold text-sm text-ink flex-shrink-0">
                            {resultCount} {resultCount === 1 ? 'result' : 'results'}
                            {searchQuery && (
                                <span className="text-accent-orange ml-1">
                                    for &quot;{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}&quot;
                                </span>
                            )}
                        </div>
                    )}

                    {/* Clear All */}
                    {hasAnyFilter && (
                        <button
                            onClick={() => {
                                onFilterChange(null);
                                onToolChange?.(null);
                                onClearAll?.();
                            }}
                            className="ml-2 px-4 py-2 bg-accent-orange text-white border-2 border-ink font-mono font-bold text-xs uppercase
                                hover:bg-white hover:text-ink transition-all duration-300 ease-in-out shadow-hard-sm hover:shadow-none
                                hover:translate-x-[2px] hover:translate-y-[2px] transform -rotate-1 hover:rotate-0 cursor-pointer flex-shrink-0"
                        >
                            Clear ✕
                        </button>
                    )}
                </div>

                {/* Row 2: Tool Filters */}
                <div className="flex items-center gap-3 min-w-max">
                    <div className="flex items-center gap-2 mr-1 flex-shrink-0">
                        <Zap className="w-4 h-4 text-ink/60" />
                        <span className="font-mono font-bold text-xs uppercase text-ink/60 tracking-wide">AI Tool:</span>
                    </div>
                    {tools.map((tool) => {
                        const isActive = activeTool === tool.name;
                        return (
                            <button
                                key={tool.name}
                                onClick={() => onToolChange?.(isActive ? null : tool.name)}
                                className={`px-3 py-1.5 font-mono font-bold text-xs border-2 transition-all duration-200 flex-shrink-0 ${isActive
                                    ? "bg-ink text-white border-ink shadow-none translate-x-[2px] translate-y-[2px]"
                                    : `${tool.bg} shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]`
                                    }`}
                            >
                                {tool.shortLabel}
                                {isActive && (
                                    <span className="ml-1 text-accent-orange">✓</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
