"use client";

import { useState } from "react";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
}

const stagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.05 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export function ForgotPasswordForm({ onBackToLogin }: ForgotPasswordFormProps) {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const result = await resetPassword(email);

        if (result.error) {
            setError(result.error);
            toast.error("Could not send reset email", {
                description: result.error,
            });
        } else {
            setSent(true);
            toast.success("Reset email sent! 📧", {
                description: "Check your inbox for the reset link.",
            });
        }

        setLoading(false);
    };

    if (sent) {
        return (
            <motion.div
                className="text-center py-4 space-y-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring" as const, stiffness: 200, damping: 20 }}
            >
                <motion.div
                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 15, delay: 0.15 }}
                >
                    <Mail className="w-8 h-8 text-green-600" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="font-black text-lg text-ink uppercase">Check your email</h3>
                    <p className="font-mono text-sm text-ink/60 mt-2 leading-relaxed">
                        We sent a password reset link to<br />
                        <span className="font-bold text-ink">{email}</span>
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p className="font-mono text-xs text-ink/40 mt-4">
                        Didn&apos;t receive it? Check your spam folder or{" "}
                        <button
                            onClick={() => { setSent(false); setEmail(""); }}
                            className="text-[#3b82f6] font-bold hover:underline underline-offset-2 cursor-pointer"
                        >
                            try again
                        </button>
                    </p>
                </motion.div>
                <motion.button
                    onClick={onBackToLogin}
                    className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-ink/50 hover:text-ink transition-colors cursor-pointer"
                    whileHover={{ x: -3 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={stagger}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={fadeUp}>
                <p className="font-mono text-sm text-ink/60 leading-relaxed mb-4">
                    Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
                </p>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp}>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                    Email address
                </label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full bg-white border border-ink/20 pl-11 pr-4 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] transition-all outline-none rounded-sm"
                    />
                </div>
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-red-50 border-2 border-red-400 px-4 py-3 font-mono text-sm text-red-700 rounded-sm overflow-hidden"
                >
                    {error}
                </motion.div>
            )}

            {/* Submit */}
            <motion.div variants={fadeUp}>
                <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-[#ffe564] text-ink border-2 border-primary/80 px-8 py-3.5 font-black uppercase text-sm shadow-hard-sm hover:shadow-none hover:translate-y-0.5 active:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer rounded-sm"
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                >
                    <Send className="w-4 h-4" />
                    {loading ? "Sending..." : "Send reset link"}
                </motion.button>
            </motion.div>

            {/* Back */}
            <motion.div variants={fadeUp} className="text-center">
                <button
                    type="button"
                    onClick={onBackToLogin}
                    className="inline-flex items-center gap-2 font-mono text-sm text-ink/50 hover:text-ink transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                </button>
            </motion.div>
        </motion.form>
    );
}
