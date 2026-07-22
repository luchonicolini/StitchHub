import Link from "next/link";
import { ArrowLeft, Scale, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | StitchHub",
    description: "Terms of Service and Community Guidelines for StitchHub.",
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-bg-light text-ink py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-mono font-bold text-sm uppercase px-4 py-2 bg-white border-3 border-ink shadow-hard hover:shadow-hard-sm transition-all"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Workshop
                </Link>

                <header className="bg-white border-4 border-ink p-8 shadow-hard">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                        <Scale className="w-8 h-8" />
                        <span className="font-mono font-black uppercase text-xs tracking-wider bg-accent-yellow text-ink px-3 py-1 border-2 border-ink">
                            Terms & Conditions
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="font-mono text-sm text-ink/60 mt-2">
                        Last Updated: July 22, 2026 • Version 1.0
                    </p>
                </header>

                <div className="bg-white border-4 border-ink p-8 shadow-hard space-y-8 font-mono text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black uppercase border-b-3 border-ink pb-2 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-accent-green" /> 1. Community Guidelines & Acceptable Use
                        </h2>
                        <p className="text-ink/80">
                            StitchHub is a community platform for prompt engineers and digital creators. Users are responsible for the prompts and content they share. You agree not to publish illegal, harmful, hateful, or infringing materials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase border-b-3 border-ink pb-2 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-accent-orange" /> 2. Intellectual Property & License
                        </h2>
                        <p className="text-ink/80">
                            By publishing a prompt publicly on StitchHub, you grant the community a open license to use, remix, and learn from your prompt for creative and commercial endeavors. Private prompts remain strictly your exclusive property.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase border-b-3 border-ink pb-2 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-primary" /> 3. Content Reporting & Moderation
                        </h2>
                        <p className="text-ink/80">
                            We reserve the right to remove any public content that violates our guidelines or report abusive users. To report inappropriate prompts or spam, email <a href="mailto:support@stitchhub.dev" className="underline font-bold text-accent-orange">support@stitchhub.dev</a>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
