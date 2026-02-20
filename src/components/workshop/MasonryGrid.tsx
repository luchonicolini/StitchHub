import { ReactNode } from "react";

export function MasonryGrid({ children, onLoadMore, isLoading, hasMore }: { children: ReactNode; onLoadMore?: () => void; isLoading?: boolean; hasMore?: boolean }) {
    return (
        <section className="max-w-7xl mx-auto px-4 pb-20">
            <div className="masonry-grid">{children}</div>

            {(hasMore !== false) && (
                <div className="mt-8 text-center">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="bg-white dark:bg-[#1a1a1a] text-ink dark:text-white font-mono font-bold text-xl px-12 py-4 border-4 border-ink shadow-hard hover:bg-primary hover:text-ink hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard"
                    >
                        {isLoading ? "Loading..." : "Load More Prompts..."}
                    </button>
                </div>
            )}

        </section>
    );
}
