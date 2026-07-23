import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | StitchHub",
    description: "Privacy Policy and Data Protection guidelines for StitchHub users.",
};

export default function PrivacyPage() {
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
                    <div className="flex items-center gap-3 mb-4 text-accent-orange">
                        <Shield className="w-8 h-8" />
                        <span className="font-mono font-black uppercase text-xs tracking-wider bg-primary text-ink px-3 py-1 border-2 border-ink">
                            Legal & Trust
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="font-mono text-sm text-ink/60 mt-2">
                        Last Updated: July 22, 2026 • Version 1.1
                    </p>
                </header>

                <div className="bg-white border-4 border-ink p-8 shadow-hard space-y-8 font-mono text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-black uppercase border-b-3 border-ink pb-2 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-accent-green" /> 1. Data We Collect & Store
                        </h2>
                        <p className="mb-4 text-ink/80">
                            StitchHub respects your privacy. When you register an account or interact with our platform, we collect:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-ink/80">
                            <li><strong>Account Information:</strong> Your email address, username, and profile avatar.</li>
                            <li><strong>Prompt Content:</strong> Prompts, titles, categories, descriptions, code snippets, and screenshots you submit.</li>
                            <li><strong>User Content Visibility:</strong> Public prompts are visible to all users. Private prompts are access-controlled through PostgreSQL Row Level Security (RLS).</li>
                            <li><strong>Community and Support Activity:</strong> Likes, comments, follows, content reports, and support requests associated with your account.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase border-b-3 border-ink pb-2 mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" /> 2. Private Vault Guarantee
                        </h2>
                        <p className="text-ink/80">
                            Prompts designated as <strong>Private</strong> are stored in a non-public Supabase Storage bucket with strict Row Level Security. Private images are served via temporary, signed 10-minute URLs accessible only to your authenticated account session.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase border-b-3 border-ink pb-2 mb-4 flex items-center gap-2">
                            <Eye className="w-5 h-5 text-primary" /> 3. Service Providers & Diagnostics
                        </h2>
                        <p className="text-ink/80">
                            StitchHub uses Supabase for authentication, database, and storage; Vercel for hosting, aggregate traffic analytics, and performance measurements; and, when configured, Sentry for application error diagnostics. We do not intentionally send prompt contents or account passwords as analytics events.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-black uppercase border-b-3 border-ink pb-2 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-accent-orange" /> 4. Data Deletion & Account Erasure
                        </h2>
                        <p className="text-ink/80">
                            You own your data. You can permanently delete your account and associated content from Profile Settings. For another privacy or content-removal request, use our authenticated <Link href="/contact" className="underline font-bold text-accent-orange">support form</Link>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
