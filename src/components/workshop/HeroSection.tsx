"use client";

import { useState } from "react";
import { Compass, HelpCircle, X, Search, Code, Share2 } from "lucide-react";

interface HeroSectionProps {
    stats?: {
        totalPrompts: number;
        totalContributors: number;
        totalLikes: number;
    };
}

export function HeroSection({ stats }: HeroSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return num.toString();
    };

    const handleStartBrowsing = () => {
        document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative py-24 md:py-32 px-4 overflow-hidden bg-background-light">
            {/* Background Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, #1a1a1a 0px, #1a1a1a 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #1a1a1a 0px, #1a1a1a 1px, transparent 1px, transparent 24px)",
                }}
            />

            {/* Decorative Chaos Elements */}
            <div
                className="absolute top-10 left-10 w-24 h-24 border-4 border-dashed border-accent-orange/40 rounded-full animate-spin-slow"
                style={{ animationDuration: "20s" }}
            />
            <div
                className="absolute top-20 right-20 w-20 h-20 bg-primary rotate-45 border-4 border-ink shadow-hard"
                style={{ animation: "float 6s ease-in-out infinite" }}
            />
            <div
                className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-green/40 rounded-full border-3 border-ink"
                style={{ animation: "float 8s ease-in-out infinite 1s" }}
            />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent-orange/20 -rotate-12 border-4 border-dashed border-ink/20" />
            <div
                className="absolute top-1/2 left-10 w-12 h-12 bg-ink rotate-12 border-2 border-ink"
                style={{ animation: "float 7s ease-in-out infinite 2s" }}
            />
            <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-accent-green border-2 border-ink rounded-full" />

            {/* Floating Lines */}
            <div className="absolute top-1/4 left-1/3 w-24 h-1 bg-ink/20 rotate-45" />
            <div className="absolute bottom-1/3 right-1/3 w-32 h-1 bg-accent-orange/30 -rotate-12" />

            <div className="max-w-5xl mx-auto text-center relative z-10">
                {/* Version Badge with Animation */}
                <div className="inline-block bg-accent-orange text-white font-mono text-xs px-4 py-1.5 border-2 border-ink shadow-hard-sm mb-8 transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                    <span className="inline-block mr-2 animate-pulse">●</span>v2.0 // STITCH & AI DESIGN HUB // LIVE
                </div>

                {/* Main Title with More Layers */}
                <h2 className="text-5xl md:text-8xl font-black leading-[0.95] text-ink mb-10 relative">
                    <span className="inline-block pb-[0.08em] transform hover:scale-105 transition-transform">Community UI</span>
                    <br />
                    <span className="relative inline-block">
                        <span className="bg-primary px-3 py-1 text-ink transform -skew-x-6 inline-block border-4 border-ink shadow-hard-lg hover:shadow-hard hover:translate-x-1 hover:translate-y-1 transition-all cursor-default">
                            Stitch & AI Prompts
                        </span>
                        {/* Decorative Starburst */}
                        <span className="absolute -top-4 -right-4 text-accent-orange text-4xl animate-pulse">✦</span>
                    </span>
                    <br />
                    <span className="inline-block transform hover:scale-105 transition-transform mt-4">For Web & Apps</span>
                </h2>

                {/* Description with Better Styling */}
                <p className="font-mono text-base md:text-xl max-w-3xl mx-auto text-ink/80 bg-white/80 p-6 border-l-8 border-ink backdrop-blur-sm mb-10 shadow-hard-sm">
                    <span className="text-ink font-bold">{'// '} The open hub where developers share AI design prompts</span> for 
                    <a href="https://stitch.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-accent-orange hover:underline ml-1">Stitch (Google)</a>, Claude Design, v0 & Cursor.
                    <br />
                    <span className="text-black font-bold text-base mt-2 block">&gt; Copy full prompt recipes, test results, and publish your web & mobile app ideas.</span>
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 mb-16">
                    <button 
                        onClick={handleStartBrowsing}
                        className="group relative px-10 py-4 bg-ink text-white font-black text-xl border-4 border-ink hover:bg-white hover:text-ink transition-all duration-400 ease-in-out overflow-hidden cursor-pointer"
                    >
                        <span className="absolute top-0 left-0 w-full h-full bg-accent-green transform translate-x-2 translate-y-2 -z-10 border-4 border-ink transition-all duration-400 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:bg-primary" />
                        <span className="relative flex items-center gap-2">
                            <Compass className="w-6 h-6" />
                            Explore Prompt Hub
                        </span>
                    </button>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="group px-10 py-4 bg-white text-ink font-black text-xl border-4 border-ink hover:bg-primary hover:text-ink transition-all duration-400 ease-in-out shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1 cursor-pointer"
                    >
                        <span className="flex items-center gap-2">
                            <HelpCircle className="w-6 h-6" />
                            How it works ?
                        </span>
                    </button>
                </div>

                {/* Stats Counter Section */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary transform rotate-3 group-hover:rotate-6 transition-transform duration-300 ease-in-out" />
                        <div className="relative bg-white border-4 border-ink px-8 py-4 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 ease-in-out">
                            <div className="font-black text-4xl text-accent-orange">{stats ? stats.totalPrompts : '1,247'}</div>
                            <div className="font-mono text-xs uppercase tracking-wider text-ink/60">AI Recipes</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-accent-green transform -rotate-2 group-hover:-rotate-6 transition-transform duration-300 ease-in-out" />
                        <div className="relative bg-white border-4 border-ink px-8 py-4 transform rotate-1 group-hover:rotate-0 transition-transform duration-300 ease-in-out">
                            <div className="font-black text-4xl text-accent-green">{stats ? stats.totalContributors : '342'}</div>
                            <div className="font-mono text-xs uppercase tracking-wider text-ink/60">Developers</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-accent-orange transform rotate-2 group-hover:rotate-6 transition-transform duration-300 ease-in-out" />
                        <div className="relative bg-white border-4 border-ink px-8 py-4 transform -rotate-1 group-hover:rotate-0 transition-transform duration-300 ease-in-out">
                            <div className="font-black text-4xl text-ink">{stats ? formatNumber(stats.totalLikes) : '89K'}</div>
                            <div className="font-mono text-xs uppercase tracking-wider text-ink/60">Community Stars</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b-4 border-ink bg-accent-yellow">
                            <h2 className="font-black text-xl uppercase text-ink flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 fill-ink" />
                                How StitchHub Works
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 hover:bg-black hover:text-white transition-colors border-2 border-ink text-ink rounded-sm cursor-pointer"
                            >
                                <X className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="p-6 md:p-8 flex flex-col gap-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 shrink-0 bg-primary border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center -rotate-2">
                                    <Search className="w-5 h-5 text-ink" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-ink uppercase">1. Discover UI & App Concepts</h3>
                                    <p className="text-ink/80 font-mono text-sm mt-1">Browse real web design & mobile app UI prompts tested by developers in Stitch (Google), Claude Artifacts & v0.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 shrink-0 bg-accent-green border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rotate-3">
                                    <Code className="w-5 h-5 text-ink" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-ink uppercase">2. Copy Prompt & Generate</h3>
                                    <p className="text-ink/80 font-mono text-sm mt-1">Copy the exact multi-paragraph prompt recipe, paste it into <a href="https://stitch.withgoogle.com/" target="_blank" rel="noreferrer" className="underline font-bold text-accent-orange">stitch.withgoogle.com</a> or Claude, and watch your app build instantly.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 shrink-0 bg-accent-orange border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center -rotate-1">
                                    <Share2 className="w-5 h-5 text-ink" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-ink uppercase">3. Publish & Build Portfolio</h3>
                                    <p className="text-ink/80 font-mono text-sm mt-1">Share your best prompts and UI experiments with the developer community, like skills.sh for AI design prompt engineering.</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="mt-4 w-full px-6 py-3 bg-ink text-white font-black uppercase tracking-wider hover:bg-primary hover:text-ink border-4 border-transparent hover:border-ink transition-all duration-300 cursor-pointer"
                            >
                                Got it! Let&apos;s Build
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
