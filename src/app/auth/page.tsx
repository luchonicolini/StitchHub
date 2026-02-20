"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type AuthTab = "login" | "register" | "forgot";

export default function AuthPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";
    const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab as AuthTab);

    // Redirect if already logged in
    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, loading, router]);

    // Don't render auth page if already authenticated
    if (loading || isAuthenticated) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-ink/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const getTitle = () => {
        switch (activeTab) {
            case "login": return "Sign in to StitchHub";
            case "register": return "Create your account";
            case "forgot": return "Reset your password";
        }
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
                initial={{ y: -40, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            >
                <Link href="/" className="relative z-10 flex items-center gap-3 group mb-6">
                    <motion.div
                        className="w-12 h-12 bg-ink text-white flex items-center justify-center border-2 border-ink shadow-hard-sm"
                        initial={{ rotate: -12 }}
                        animate={{ rotate: -3 }}
                        whileHover={{ rotate: 0, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 12 }}
                    >
                        <Construction className="w-7 h-7" />
                    </motion.div>
                    <span className="text-3xl font-black tracking-tight uppercase text-ink">
                        StitchHub
                    </span>
                </Link>
            </motion.div>

            {/* Title */}
            <motion.h1
                className="relative z-10 text-xl font-mono text-ink/70 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                key={activeTab}
            >
                {getTitle()}
            </motion.h1>

            {/* Form Card */}
            <motion.div
                className="relative z-10 w-full max-w-sm"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 18, delay: 0.35 }}
            >
                <div className="bg-white border border-ink/15 p-7 shadow-sm rounded-md">
                    <AnimatePresence mode="wait">
                        {activeTab === "login" && (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <LoginForm
                                    onSwitchToRegister={() => setActiveTab("register")}
                                    onForgotPassword={() => setActiveTab("forgot")}
                                />
                            </motion.div>
                        )}
                        {activeTab === "register" && (
                            <motion.div
                                key="register"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
                            </motion.div>
                        )}
                        {activeTab === "forgot" && (
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            >
                                <ForgotPasswordForm onBackToLogin={() => setActiveTab("login")} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Switch card — only show for login/register */}
                {activeTab !== "forgot" && (
                    <motion.div
                        className="mt-4 bg-white border border-ink/15 p-4 text-center shadow-sm rounded-md"
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                    >
                        {activeTab === "login" ? (
                            <p className="font-mono text-sm text-ink/60">
                                New to StitchHub?{" "}
                                <button
                                    onClick={() => setActiveTab("register")}
                                    className="text-[#3b82f6] font-bold hover:underline underline-offset-2 cursor-pointer"
                                >
                                    Create an account
                                </button>
                            </p>
                        ) : (
                            <p className="font-mono text-sm text-ink/60">
                                Already have an account?{" "}
                                <button
                                    onClick={() => setActiveTab("login")}
                                    className="text-[#3b82f6] font-bold hover:underline underline-offset-2 cursor-pointer"
                                >
                                    Sign in
                                </button>
                            </p>
                        )}
                    </motion.div>
                )}
            </motion.div>

            {/* Back to Home */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                <Link
                    href="/"
                    className="relative z-10 mt-6 flex items-center gap-2 font-mono text-sm text-ink/40 hover:text-ink/70 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to home
                </Link>
            </motion.div>

            {/* Footer links */}
            <motion.div
                className="relative z-10 mt-8 flex items-center gap-4 font-mono text-xs text-ink/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
            >
                <Link href="/" className="hover:text-ink/60 transition-colors underline underline-offset-2">
                    Home
                </Link>
                <span>•</span>
                <button className="hover:text-ink/60 transition-colors underline underline-offset-2 cursor-pointer">
                    Terms
                </button>
                <span>•</span>
                <button className="hover:text-ink/60 transition-colors underline underline-offset-2 cursor-pointer">
                    Privacy
                </button>
                <span>•</span>
                <button className="hover:text-ink/60 transition-colors underline underline-offset-2 cursor-pointer">
                    Contact
                </button>
            </motion.div>
        </div>
    );
}
