import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";

export function NewDesignCard() {
    return (
        <Link
            href="/submit"
            className="group block h-full min-h-[400px] border-4 border-dashed border-ink/20 bg-white/30 hover:border-ink hover:bg-white transition-all duration-300 flex flex-col items-center justify-center gap-5 p-8 relative overflow-hidden hover:shadow-hard"
        >
            {/* Background pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                }}
            ></div>

            {/* Icon */}
            <div className="relative z-10 w-24 h-24 rounded-full border-4 border-dashed border-ink/20 flex items-center justify-center group-hover:border-ink group-hover:bg-primary group-hover:border-solid group-hover:scale-110 group-hover:rotate-180 transition-all duration-500">
                <Plus className="w-10 h-10 text-ink/20 group-hover:text-ink transition-colors" />
            </div>

            {/* Label */}
            <div className="relative z-10 flex flex-col items-center gap-2">
                <span className="font-black text-xl text-ink/30 uppercase tracking-[0.15em] group-hover:text-ink transition-colors">
                    New Design
                </span>
                <span className="flex items-center gap-1.5 font-mono text-xs text-ink/30 group-hover:text-ink/60 transition-colors">
                    <Sparkles className="w-3.5 h-3.5" />
                    Click to create
                </span>
            </div>
        </Link>
    );
}
