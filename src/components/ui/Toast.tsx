"use client";

import { motion } from "framer-motion";
import { Check, X, AlertCircle, Info } from "lucide-react";

export interface ToastProps {
    id?: string;
    message: string;
    description?: string;
    type?: "success" | "error" | "warning" | "info";
    onClose?: () => void;
}

const iconMap = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info,
};

const colorMap = {
    success: "bg-accent-green",
    error: "bg-red-500",
    warning: "bg-accent-orange",
    info: "bg-primary",
};

export function Toast({ message, description, type = "success", onClose }: ToastProps) {
    const Icon = iconMap[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
            }}
            className="pointer-events-auto relative transform -rotate-1"
        >
            {/* Physical Shadow */}
            <div className="absolute inset-0 bg-ink translate-x-2 translate-y-2 rounded-sm" />

            {/* Toast Content */}
            <div className={`relative ${colorMap[type]} border-4 border-ink p-4 min-w-[280px] max-w-[400px] shadow-[inset_0_4px_0_0_rgba(255,255,255,0.3)]`}>
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-8 h-8 bg-white border-2 border-ink rounded-full flex items-center justify-center shadow-[2px_2px_0_0_#000]">
                        <Icon className="w-5 h-5 text-ink" strokeWidth={3} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p className="font-mono font-black text-base text-ink leading-tight uppercase tracking-tight">
                            {message}
                        </p>
                        {description && (
                            <p className="font-mono font-bold text-sm text-ink/80 mt-1 leading-snug">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Close Button */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="flex-shrink-0 w-6 h-6 flex items-center justify-center border-2 border-transparent hover:border-ink hover:bg-white transition-all rounded-sm group active:translate-y-px"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5 text-ink group-hover:scale-110 transition-transform" strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
