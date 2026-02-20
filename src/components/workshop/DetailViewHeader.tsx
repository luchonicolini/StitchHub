"use client";

import Link from "next/link";
import { Construction, Plus } from "lucide-react";
import { motion } from "framer-motion";



export function DetailViewHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b-4 border-ink bg-background-light py-4 shadow-[0_4px_0_0_#000000]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
                {/* Logo Area - Clickable to close modal */}
                <Link
                    href="/"
                    className="flex items-center gap-3 group cursor-pointer"
                >
                    <div className="w-12 h-12 bg-ink text-white flex items-center justify-center border-2 border-transparent transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 ease-in-out shadow-hard-sm">
                        <Construction className="w-7 h-7" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight uppercase transform skew-x-[-10deg] text-ink">
                        STITCHHUB
                    </h1>
                </Link>

                {/* Right Side - Submit Button */}
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary hover:bg-primary/90 text-ink border-3 border-ink px-6 py-3 font-black uppercase text-sm shadow-hard hover:shadow-hard-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all duration-200 flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Submit Prompt
                </motion.button>
            </div>
        </header>
    );
}
