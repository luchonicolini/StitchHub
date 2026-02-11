import { ReactNode } from "react";

export function MasonryGrid({ children, onLoadMore }: { children: ReactNode; onLoadMore?: () => void }) {
    return (
        <section className="max-w-7xl mx-auto px-4 pb-20">
            <div className="masonry-grid">{children}</div>
            <div className="mt-8 text-center">
                <button
                    onClick={onLoadMore}
                    className="bg-white dark:bg-[#1a1a1a] text-ink dark:text-white font-mono font-bold text-xl px-12 py-4 border-4 border-ink shadow-hard hover:bg-primary hover:text-ink hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 ease-in-out cursor-pointer"
                >
                    Load More Prompts...
                </button>
            </div>
        </section>
    );
}
