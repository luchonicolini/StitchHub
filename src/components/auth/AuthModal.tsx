"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
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

                {/* Modal Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.9, opacity: 0, rotate: 2 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full transform rotate-1"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute -top-3 -right-3 w-10 h-10 bg-accent-orange border-3 border-ink rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shadow-hard-sm z-10"
                    >
                        <X className="w-5 h-5 text-white" strokeWidth={3} />
                    </button>

                    {/* Header with Tabs */}
                    <div className="border-b-4 border-ink bg-background-light p-6">
                        <h2 className="text-3xl font-black uppercase text-ink mb-4 transform -skew-x-6">
                            Welcome to StitchHub
                        </h2>

                        {/* Tab Switcher */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab("login")}
                                className={`flex-1 py-2 px-4 font-mono font-bold uppercase text-sm border-2 border-ink transition-all ${activeTab === "login"
                                        ? "bg-primary text-ink shadow-hard-sm"
                                        : "bg-white text-ink/60 hover:bg-gray-100"
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setActiveTab("register")}
                                className={`flex-1 py-2 px-4 font-mono font-bold uppercase text-sm border-2 border-ink transition-all ${activeTab === "register"
                                        ? "bg-primary text-ink shadow-hard-sm"
                                        : "bg-white text-ink/60 hover:bg-gray-100"
                                    }`}
                            >
                                Register
                            </button>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="p-6">
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
