"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Construction, Lock, Eye, EyeOff, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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

export default function ResetPasswordPage() {
    const { updatePassword } = useAuth();
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            toast.error("Passwords don't match");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            toast.error("Password too short");
            setLoading(false);
            return;
        }

        const result = await updatePassword(password);

        if (result.error) {
            setError(result.error);
            toast.error("Could not update password", {
                description: result.error,
            });
        } else {
            setSuccess(true);
            toast.success("Password updated! 🔐", {
                description: "You can now sign in with your new password.",
            });
            setTimeout(() => router.push("/auth"), 2000);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background-light flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
            {/* Background grid */}
            <div
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, #1a1a1a 0px, #1a1a1a 1px, transparent 1px, transparent 28px), repeating-linear-gradient(90deg, #1a1a1a 0px, #1a1a1a 1px, transparent 1px, transparent 28px)",
                }}
            />

            {/* Logo */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
                <Link href="/" className="relative z-10 flex items-center gap-3 group mb-6">
                    <div className="w-12 h-12 bg-ink text-white flex items-center justify-center border-2 border-ink shadow-hard-sm transform -rotate-3 group-hover:rotate-0 transition-transform">
                        <Construction className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black tracking-tight uppercase text-ink">
                        StitchHub
                    </span>
                </Link>
            </motion.div>

            <motion.h1
                className="relative z-10 text-xl font-mono text-ink/70 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                Set new password
            </motion.h1>

            <motion.div
                className="relative z-10 w-full max-w-sm"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.3 }}
            >
                <div className="bg-white border border-ink/15 p-7 shadow-sm rounded-md">
                    {success ? (
                        <motion.div
                            className="text-center py-4 space-y-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <motion.div
                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                                <Check className="w-8 h-8 text-green-600" />
                            </motion.div>
                            <h3 className="font-black text-lg text-ink uppercase">Password updated!</h3>
                            <p className="font-mono text-sm text-ink/60">
                                Redirecting you to sign in...
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            variants={stagger}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={fadeUp}>
                                <p className="font-mono text-sm text-ink/60 leading-relaxed mb-4">
                                    Enter your new password below. Make sure it&apos;s at least 8 characters.
                                </p>
                            </motion.div>

                            {/* New Password */}
                            <motion.div variants={fadeUp}>
                                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                                    New Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min. 8 characters"
                                        required
                                        minLength={8}
                                        className="w-full bg-white border border-ink/20 pl-11 pr-12 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] transition-all outline-none rounded-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Confirm Password */}
                            <motion.div variants={fadeUp}>
                                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-white border border-ink/20 pl-11 pr-12 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] transition-all outline-none rounded-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors cursor-pointer"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
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
                                    {loading ? "Updating..." : "Update password"}
                                </motion.button>
                            </motion.div>
                        </motion.form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
