"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface PasswordStrengthProps {
    password: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
    if (score <= 2) return { score, label: "Fair", color: "#f97316" };
    if (score <= 3) return { score, label: "Good", color: "#eab308" };
    if (score <= 4) return { score, label: "Strong", color: "#22c55e" };
    return { score, label: "Very strong", color: "#16a34a" };
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
    const strength = useMemo(() => getStrength(password), [password]);
    const percentage = (strength.score / 5) * 100;

    if (!password) return null;

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-1"
        >
            {/* Bar */}
            <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                        width: `${percentage}%`,
                        backgroundColor: strength.color,
                    }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                />
            </div>
            {/* Label */}
            <div className="flex items-center justify-between">
                <span
                    className="font-mono text-[10px] font-bold uppercase"
                    style={{ color: strength.color }}
                >
                    {strength.label}
                </span>
                <span className="font-mono text-[10px] text-ink/30">
                    {password.length < 8 ? `${8 - password.length} more chars needed` : "✓ Min. length met"}
                </span>
            </div>
        </motion.div>
    );
}
