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
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary text-ink flex items-center justify-center border-2 border-white transform rotate-3 group-hover:rotate-0 transition-transform">
                                <Construction className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight uppercase group-hover:underline decoration-4 decoration-white underline-offset-4 transition-all">
                                StitchHub
                            </h2>
                        </Link>
                    </div>
                    <p className="font-mono text-sm text-gray-300 mb-6">
                        Hand-crafted prompts for the digital artisan. Built with sweat,
                        coffee, and slightly buggy CSS.
                    </p>
                </div>
                {/* Workshop CTA */}
                <div className="bg-primary p-1 transform rotate-1 w-full md:w-auto shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                    <div className="border-2 border-ink p-6 bg-primary">
                        <h3 className="text-ink font-black text-xl mb-2 uppercase">
                            Build something bold.
                        </h3>
                        <p className="text-ink font-mono text-xs mb-4">
                            Share a prompt with the community or keep it in your private vault.
                        </p>
                        <Link href="/submit" className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-4 py-2 font-mono text-xs font-black uppercase text-white transition-colors hover:bg-accent-orange">
                            Submit a prompt <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs font-mono text-gray-500">
                <p>© 2026 StitchHub Workshop. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="/privacy" className="hover:text-primary transition-colors cursor-pointer">
                        Privacy
                    </Link>
                    <Link href="/terms" className="hover:text-primary transition-colors cursor-pointer">
                        Terms
                    </Link>
                    <Link href="/contact" className="hover:text-primary transition-colors cursor-pointer">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
}

