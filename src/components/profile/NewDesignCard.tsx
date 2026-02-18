import { Plus } from "lucide-react";
import Link from "next/link";

export function NewDesignCard() {
    return (
        <Link
            href="/submit"
            className="group block h-full min-h-[400px] border-[3px] border-dashed border-ink/30 bg-transparent hover:border-ink hover:bg-white/50 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-8 relative overflow-hidden"
            style={{
                backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                backgroundSize: '16px 16px',
                backgroundPosition: 'center',
                opacity: 0.8
            }}
        >
            <div className="absolute inset-0 bg-white/80 z-0"></div>

            <div className="relative z-10 w-20 h-20 rounded-full border-[3px] border-dashed border-ink/30 flex items-center justify-center group-hover:border-ink group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 bg-white">
                <Plus className="w-8 h-8 text-ink/30 group-hover:text-ink transition-colors" />
            </div>
            <span className="relative z-10 font-mono font-black text-lg text-ink/40 tracking-[0.2em] uppercase group-hover:text-ink transition-colors mt-4 border-2 border-transparent px-4 py-1 group-hover:border-ink group-hover:bg-white group-hover:translate-y-1">
                New Design
            </span>
        </Link>
    );
}
