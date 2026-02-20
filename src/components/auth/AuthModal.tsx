"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Construction } from "lucide-react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative bg-white border-4 border-ink shadow-hard-lg max-w-md w-full overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-white border-2 border-ink/20 rounded-full flex items-center justify-center hover:bg-accent-orange hover:border-ink hover:text-white transition-all z-10 cursor-pointer"
                    >
                        <X className="w-4 h-4" strokeWidth={3} />
                    </button>

                    {/* Header */}
                    <div className="bg-primary border-b-4 border-ink px-8 pt-8 pb-6 text-center">
                        <div className="w-14 h-14 bg-ink text-white mx-auto mb-4 flex items-center justify-center border-2 border-ink shadow-hard-sm transform -rotate-3">
                            <Construction className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black uppercase text-ink tracking-tight">
                            {activeTab === "login" ? "Welcome Back" : "Join StitchHub"}
                        </h2>
                        <p className="font-mono text-xs text-ink/60 mt-1">
                            {activeTab === "login"
                                ? "Sign in to your account"
                                : "Create your free account"
                            }
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex border-b-3 border-ink">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-3 font-mono font-bold uppercase text-sm tracking-wider transition-all cursor-pointer ${activeTab === "login"
                                    ? "bg-white text-ink border-b-4 border-primary -mb-[3px]"
                                    : "bg-background-light text-ink/40 hover:text-ink/60"
                                }`}
                        >
                            Log In
                        </button>
                        <div className="w-[3px] bg-ink" />
                        <button
                            onClick={() => setActiveTab("register")}
                            className={`flex-1 py-3 font-mono font-bold uppercase text-sm tracking-wider transition-all cursor-pointer ${activeTab === "register"
                                    ? "bg-white text-ink border-b-4 border-accent-green -mb-[3px]"
                                    : "bg-background-light text-ink/40 hover:text-ink/60"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === "login" ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <LoginForm onSwitchToRegister={() => setActiveTab("register")} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <RegisterForm onSwitchToLogin={() => setActiveTab("login")} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
