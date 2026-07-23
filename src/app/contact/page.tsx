"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";
import { Footer } from "@/components/workshop/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const [topic, setTopic] = useState('technical');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user || message.trim().length < 10 || submitting) return;

        setSubmitting(true);
        const { error } = await supabase.from('support_requests').insert({
            user_id: user.id,
            topic,
            message: message.trim(),
        });

        if (error) {
            showToast({ message: 'Unable to send your request.', description: error.message, type: 'error' });
        } else {
            setMessage('');
            showToast({ message: 'Support request received.', description: 'The request is securely linked to this account.', type: 'success' });
        }
        setSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-background-light text-ink">
            <WorkshopHeader showSearch={false} />
            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                <div className="mb-8 inline-flex -rotate-1 items-center gap-2 border-3 border-ink bg-primary px-4 py-2 shadow-hard-sm">
                    <MessageSquare className="h-5 w-5" />
                    <span className="font-mono text-sm font-black uppercase">Support desk</span>
                </div>
                <h1 className="mb-4 text-4xl font-black uppercase sm:text-6xl">Contact StitchHub</h1>
                <p className="mb-10 max-w-2xl font-mono text-sm leading-relaxed text-ink/70">
                    Use this private form for account, privacy, technical, or content questions. Requests are linked to your account and are not displayed publicly.
                </p>

                {loading ? (
                    <div className="flex items-center gap-3 border-4 border-ink bg-white p-6 font-mono"><Loader2 className="h-5 w-5 animate-spin" /> Checking your session…</div>
                ) : !user ? (
                    <div className="border-4 border-ink bg-white p-8 shadow-hard">
                        <h2 className="text-xl font-black uppercase">Sign in to contact support</h2>
                        <p className="mt-2 font-mono text-sm text-ink/60">Authentication protects the support desk from spam and lets us associate the request with the correct account.</p>
                        <Link href="/auth?returnUrl=/contact" className="mt-6 inline-block border-3 border-ink bg-primary px-6 py-3 font-mono text-sm font-black uppercase shadow-hard-sm">Sign in</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 border-4 border-ink bg-white p-6 shadow-hard sm:p-8">
                        <div>
                            <label htmlFor="support-topic" className="mb-2 block font-mono text-xs font-black uppercase">Topic</label>
                            <select id="support-topic" value={topic} onChange={(event) => setTopic(event.target.value)} className="w-full border-3 border-ink bg-white px-4 py-3 font-mono text-sm">
                                <option value="account">Account</option>
                                <option value="privacy">Privacy or data request</option>
                                <option value="technical">Technical problem</option>
                                <option value="content">Content or moderation</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between gap-4">
                                <label htmlFor="support-message" className="font-mono text-xs font-black uppercase">Message</label>
                                <span className="font-mono text-xs text-ink/40">{message.length}/2000</span>
                            </div>
                            <textarea id="support-message" value={message} onChange={(event) => setMessage(event.target.value.slice(0, 2000))} minLength={10} required rows={8} className="w-full resize-y border-3 border-ink bg-white px-4 py-3 font-mono text-sm" placeholder="Tell us what happened and what you need…" />
                        </div>
                        <button type="submit" disabled={submitting || message.trim().length < 10} className="flex items-center gap-2 border-3 border-ink bg-primary px-6 py-3 font-mono text-sm font-black uppercase shadow-hard-sm disabled:cursor-not-allowed disabled:opacity-40">
                            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />} Send request
                        </button>
                    </form>
                )}
            </main>
            <Footer />
        </div>
    );
}
