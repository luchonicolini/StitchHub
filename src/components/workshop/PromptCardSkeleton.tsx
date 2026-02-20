"use client";

import { motion } from "framer-motion";

export function PromptCardSkeleton() {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            }}
            className="break-inside-avoid mb-12 relative group transform rotate-1 pt-4 w-full"
        >
            {/* Decorative Pin Skeleton */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30">
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-ink shadow-[2px_2px_0_0_#000] animate-pulse" />
            </div>

            {/* Physical Shadow Skeleton */}
            <div className="absolute inset-0 bg-ink translate-x-2 translate-y-2 rounded-sm top-4"></div>

            {/* Main Card Content */}
            <article
                className="bg-white dark:bg-[#1a1a1a] p-2 pb-8 border-[3px] border-ink relative z-10 w-full"
            >
                {/* Image Skeleton */}
                <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-800 border-[3px] border-ink mb-4 overflow-hidden relative animate-pulse">
                </div>

                <div className="px-2">
                    {/* Title Skeleton */}
                    <div className="h-7 w-3/4 bg-gray-200 dark:bg-gray-800 mb-3 rounded-sm border-2 border-ink/20 animate-pulse"></div>

                    {/* Tags Skeleton */}
                    <div className="flex gap-2 mb-4 flex-wrap">
                        <div className="h-6 w-16 bg-[#FFF8D6] dark:bg-[#443f2b] border-2 border-ink/20 rounded-sm animate-pulse"></div>
                        <div className="h-6 w-20 bg-[#FFF8D6] dark:bg-[#443f2b] border-2 border-ink/20 rounded-sm animate-pulse"></div>
                    </div>

                    {/* Prompt Text Skeleton */}
                    <div className="bg-background-light dark:bg-background-dark border-2 border-dashed border-ink/40 p-4 mb-4 h-[88px] flex flex-col gap-2">
                        <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-sm animate-pulse"></div>
                        <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded-sm animate-pulse"></div>
                        <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-800 rounded-sm animate-pulse"></div>
                    </div>

                    {/* Footer Skeleton */}
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-ink bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-sm animate-pulse"></div>
                        </div>
                        {/* Copy Button Skeleton */}
                        <div className="w-10 h-10 rounded-full border-2 border-ink bg-gray-200 dark:bg-gray-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse"></div>
                    </div>
                </div>
            </article>
        </motion.div>
    );
}
