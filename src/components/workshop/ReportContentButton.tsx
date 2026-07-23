"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flag, Loader2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";

interface ReportContentButtonProps {
    designId: number;
    ownerId?: string;
}

export function ReportContentButton({ designId, ownerId }: ReportContentButtonProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("spam");
    const [details, setDetails] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (user?.id === ownerId) return null;

    const openReport = () => {
        if (!user) {
            showToast({ message: "Login required", description: "Sign in to report content.", type: "warning" });
            return;
        }
        setIsOpen(true);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user || submitting) return;

        setSubmitting(true);
        const { error } = await supabase.from("content_reports").insert({
            reporter_id: user.id,
            design_id: designId,
            reason,
            details: details.trim() || null,
        });

        if (error) {
            const duplicate = error.code === "23505";
            showToast({
                message: duplicate ? "You already reported this design." : "Unable to submit report.",
                description: duplicate ? "Your original report is still available for review." : error.message,
                type: duplicate ? "info" : "error",
            });
        } else {
            showToast({ message: "Report received.", description: "Thank you for helping keep StitchHub safe.", type: "success" });
            setDetails("");
            setIsOpen(false);
        }
        setSubmitting(false);
    };

    return (
        <>
            <button type="button" onClick={openReport} className="flex w-full items-center justify-center gap-2 border-2 border-ink bg-white px-4 py-3 font-mono text-xs font-bold uppercase text-ink transition-colors hover:bg-red-50 hover:text-red-700">
                <Flag className="h-4 w-4" /> Report content
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="report-content-title" onClick={() => setIsOpen(false)}>
                        <motion.form initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }} onSubmit={handleSubmit} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg border-4 border-ink bg-white p-6 shadow-hard">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h2 id="report-content-title" className="text-xl font-black uppercase text-ink">Report content</h2>
                                    <p className="mt-1 font-mono text-xs text-ink/60">Reports are private and reviewed by the StitchHub team.</p>
                                </div>
                                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close report dialog" className="border-2 border-ink p-1 text-ink hover:bg-ink hover:text-white"><X className="h-5 w-5" /></button>
                            </div>
                            <label htmlFor="detail-report-reason" className="mb-2 block font-mono text-xs font-bold uppercase text-ink">Reason</label>
                            <select id="detail-report-reason" value={reason} onChange={(event) => setReason(event.target.value)} className="mb-4 w-full border-3 border-ink bg-white px-3 py-2 font-mono text-sm text-ink">
                                <option value="spam">Spam or misleading</option>
                                <option value="harassment">Harassment</option>
                                <option value="copyright">Copyright concern</option>
                                <option value="unsafe">Unsafe content</option>
                                <option value="other">Other</option>
                            </select>
                            <label htmlFor="detail-report-details" className="mb-2 block font-mono text-xs font-bold uppercase text-ink">Details (optional)</label>
                            <textarea id="detail-report-details" value={details} onChange={(event) => setDetails(event.target.value.slice(0, 1000))} rows={4} className="w-full resize-none border-3 border-ink bg-white px-3 py-2 font-mono text-sm text-ink" />
                            <div className="mt-5 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="border-2 border-ink bg-white px-4 py-2 font-mono text-xs font-bold uppercase text-ink">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex items-center gap-2 border-2 border-ink bg-red-600 px-4 py-2 font-mono text-xs font-black uppercase text-white disabled:opacity-50">
                                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Submit report
                                </button>
                            </div>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
