"use client";


import Link from "next/link";
import { Search, Construction, Plus, X } from "lucide-react";

interface WorkshopHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function WorkshopHeader({ searchQuery, onSearchChange }: WorkshopHeaderProps) {
    return (
        <header className="sticky top-0 z-50 w-full border-b-4 border-ink bg-background-light py-4 shadow-[0_4px_0_0_#000000]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Logo Area */}
                <Link className="flex items-center gap-3 group" href="#">
                    <div className="w-12 h-12 bg-ink text-white flex items-center justify-center border-2 border-transparent transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 ease-in-out shadow-hard-sm">
                        <Construction className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase transform skew-x-[-10deg] text-ink">
                        STITCHHUB
                    </h1>
                </Link>

                {/* Enhanced Search Bar */}
                <div className="relative w-full md:w-auto flex-1 max-w-md mx-4">
                    {/* Decorative Pin */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-accent-orange border-2 border-ink" />

                    <div className="relative flex items-center">
                        <input
                            className="w-full bg-[#e8e4d9] border-3 border-ink pl-10 pr-16 py-3 font-mono text-sm font-bold text-ink 
                                focus:ring-0 focus:border-primary focus:bg-white focus:shadow-hard-sm
                                transition-all placeholder-ink/50 outline-none rounded-none shadow-hard-sm"
                            placeholder="Search prompts..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                        {/* Clear button when there's text */}
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange("")}
                                className="absolute right-12 w-6 h-6 rounded-full bg-ink text-white hover:bg-accent-orange transition-colors duration-200 flex items-center justify-center"
                                aria-label="Clear search"
                            >
                                <X className="w-4 h-4 stroke-[3]" />
                            </button>
                        )}
                        {/* Search icon button */}
                        <button className="absolute right-2 w-9 h-9 rounded-full bg-accent-orange border-2 border-ink text-white hover:bg-primary hover:scale-110 transition-all duration-300 ease-in-out flex items-center justify-center">
                            <Search className="w-4 h-4 stroke-[3]" />
                        </button>
                    </div>
                </div>

                {/* Nav Actions */}
                <nav className="flex items-center gap-6">
                    <Link
                        className="font-mono font-bold text-lg hover:underline decoration-4 decoration-primary underline-offset-4 hidden sm:block text-ink transition-all duration-300 ease-in-out hover:scale-105"
                        href="#"
                    >
                        Explore
                    </Link>
                    <Link
                        className="font-mono font-bold text-lg hover:underline decoration-4 decoration-accent-green underline-offset-4 hidden sm:block text-ink transition-all duration-300 ease-in-out hover:scale-105"
                        href="#"
                    >
                        Workshop
                    </Link>

                    {/* Enhanced Submit Button */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-accent-green border-2 border-ink translate-x-2 translate-y-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:translate-y-1" />
                        <button className="relative bg-primary hover:bg-[#ffe564] text-ink font-black uppercase tracking-widest px-6 py-2.5 border-4 border-ink flex items-center gap-2 cursor-pointer transform rotate-2 hover:rotate-0 transition-all duration-300 ease-in-out">
                            <Plus className="w-5 h-5" strokeWidth={3} />
                            SUBMIT
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}
