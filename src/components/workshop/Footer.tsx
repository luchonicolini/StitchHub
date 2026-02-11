import Link from "next/link";
import { Construction, ArrowRight } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-ink text-white py-16 border-t-8 border-accent-orange relative overflow-hidden">
            {/* Abstract shape */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="max-w-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-primary text-ink flex items-center justify-center border-2 border-white transform rotate-3">
                            <Construction className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight uppercase">
                            StitchHub
                        </h2>
                    </div>
                    <p className="font-mono text-sm text-gray-300 mb-6">
                        Hand-crafted prompts for the digital artisan. Built with sweat,
                        coffee, and slightly buggy CSS.
                    </p>
                    <div className="flex gap-4">
                        {["X", "Ig", "Gh"].map((social) => (
                            <Link
                                key={social}
                                href="#"
                                className="w-10 h-10 flex items-center justify-center bg-white text-ink rounded-full hover:bg-accent-orange hover:text-white transition-colors"
                            >
                                <span className="font-bold">{social}</span>
                            </Link>
                        ))}
                    </div>
                </div>
                {/* Newsletter Sticker */}
                <div className="bg-primary p-1 transform rotate-1 w-full md:w-auto shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                    <div className="border-2 border-ink p-6 bg-primary">
                        <h3 className="text-ink font-black text-xl mb-2 uppercase">
                            Spam? No thanks.
                        </h3>
                        <p className="text-ink font-mono text-xs mb-4">
                            Get the weekly best-of straight to your inbox.
                        </p>
                        <div className="flex gap-2">
                            <input
                                className="bg-white border-2 border-ink px-3 py-2 text-ink font-mono text-sm w-full placeholder-ink/50 focus:ring-0 focus:border-accent-orange outline-none"
                                placeholder="email@address.com"
                                type="email"
                            />
                            <button className="bg-ink text-white p-2 border-2 border-transparent hover:bg-accent-orange hover:border-ink transition-colors cursor-pointer">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-500">
                <p>© 2026 StitchHub Workshop. All rights reversed.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link className="hover:text-primary" href="#">
                        Privacy
                    </Link>
                    <Link className="hover:text-primary" href="#">
                        Terms
                    </Link>
                    <Link className="hover:text-primary" href="#">
                        Sitemap
                    </Link>
                </div>
            </div>
        </footer>
    );
}
