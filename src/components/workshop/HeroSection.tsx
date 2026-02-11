"use client";

export function HeroSection() {
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
                    <span className="inline-block mr-2 animate-pulse">●</span>v2.0 // WORKSHOP_MODE // LIVE
                </div>

                {/* Main Title with More Layers */}
                <h2 className="text-5xl md:text-8xl font-black leading-[0.85] text-ink mb-10 relative">
                    <span className="inline-block transform hover:scale-105 transition-transform">Hand-Picked</span>
                    <br />
                    <span className="relative inline-block">
                        <span className="bg-primary px-3 py-1 text-ink transform -skew-x-6 inline-block border-4 border-ink shadow-hard-lg hover:shadow-hard hover:translate-x-1 hover:translate-y-1 transition-all cursor-default">
                            Stitch Prompts
                        </span>
                        {/* Decorative Starburst */}
                        <span className="absolute -top-4 -right-4 text-accent-orange text-4xl animate-pulse">✦</span>
                    </span>
                    <br />
                    <span className="inline-block transform hover:scale-105 transition-transform mt-4">for Humans</span>
                </h2>

                {/* Description with Better Styling */}
                <p className="font-mono text-base md:text-xl max-w-2xl mx-auto text-ink/80 bg-white/70 p-6 border-l-8 border-ink backdrop-blur-sm mb-10 shadow-hard-sm">
                    <span className="text-ink font-bold">{'//'} A collaborative repository</span> for crafting the perfect
                    UI generation strings.
                    <br />
                    <span className="text-accent-orange font-bold text-lg">&gt; No robots allowed (mostly).</span>
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="mt-12 flex flex-wrap justify-center gap-6 mb-16">
                    <button className="group relative px-10 py-4 bg-ink text-white font-black text-xl border-4 border-ink hover:bg-white hover:text-ink transition-all duration-400 ease-in-out overflow-hidden">
                        <span className="absolute top-0 left-0 w-full h-full bg-accent-green transform translate-x-2 translate-y-2 -z-10 border-4 border-ink transition-all duration-400 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:bg-primary" />
                        <span className="relative flex items-center gap-2">
                            <span className="material-icons">explore</span>
                            Start Browsing
                        </span>
                    </button>
                    <button className="group px-10 py-4 bg-white text-ink font-black text-xl border-4 border-ink hover:bg-primary hover:text-ink transition-all duration-400 ease-in-out shadow-hard hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                        <span className="flex items-center gap-2">
                            <span className="material-icons">help_outline</span>
                            How it works ?
                        </span>
                    </button>
                </div>

                {/* Stats Counter Section */}
                <div className="flex flex-wrap justify-center gap-6 md:gap-12">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary transform rotate-3 group-hover:rotate-6 transition-transform duration-300 ease-in-out" />
                        <div className="relative bg-white border-4 border-ink px-8 py-4 transform -rotate-2 group-hover:rotate-0 transition-transform duration-300 ease-in-out">
                            <div className="font-black text-4xl text-accent-orange">1,247</div>
                            <div className="font-mono text-xs uppercase tracking-wider text-ink/60">Prompts</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-accent-green transform -rotate-2 group-hover:-rotate-6 transition-transform duration-300 ease-in-out" />
                        <div className="relative bg-white border-4 border-ink px-8 py-4 transform rotate-1 group-hover:rotate-0 transition-transform duration-300 ease-in-out">
                            <div className="font-black text-4xl text-accent-green">342</div>
                            <div className="font-mono text-xs uppercase tracking-wider text-ink/60">Contributors</div>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-accent-orange transform rotate-2 group-hover:rotate-6 transition-transform duration-300 ease-in-out" />
                        <div className="relative bg-white border-4 border-ink px-8 py-4 transform -rotate-1 group-hover:rotate-0 transition-transform duration-300 ease-in-out">
                            <div className="font-black text-4xl text-ink">89K</div>
                            <div className="font-mono text-xs uppercase tracking-wider text-ink/60">Copies</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
