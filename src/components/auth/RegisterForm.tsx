"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

interface RegisterFormProps {
    onSwitchToLogin: () => void;
}

const stagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: 0.05 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

// Spinner component
function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
    );
}

// Email validation
function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
    const { loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get("returnUrl");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [shake, setShake] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    const emailValid = useMemo(() => isValidEmail(email), [email]);
    const showEmailFeedback = emailTouched && email.length > 0;
    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            setShake(true);
            toast.error("Passwords don't match", {
                description: "Please make sure both passwords are the same.",
            });
            setTimeout(() => setShake(false), 500);
            setLoading(false);
            return;
        }

        if (!acceptTerms) {
            setError("Please accept the terms and conditions");
            setShake(true);
            toast.error("Terms required", {
                description: "Please accept the terms and conditions to continue.",
            });
            setTimeout(() => setShake(false), 500);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    full_name: username
                }
            }
        });

        if (error) {
            setError(error.message);
            setShake(true);
            toast.error("Registration failed", {
                description: error.message,
            });
            setTimeout(() => setShake(false), 500);
        } else {
            if (data.user) {
                await new Promise(resolve => setTimeout(resolve, 500));
                await supabase
                    .from('profiles')
                    .update({ username })
                    .eq('id', data.user.id);
            }

            toast.success("Account created! 🎉", {
                description: "Welcome to StitchHub!",
            });
            setTimeout(() => router.push(returnUrl || "/"), 600);
        }

        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
    };

    const inputClasses = "w-full bg-white border border-ink/20 pl-11 pr-4 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] transition-all outline-none rounded-sm";
    const inputClassesWithToggle = "w-full bg-white border border-ink/20 pl-11 pr-12 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] transition-all outline-none rounded-sm";

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={stagger}
            initial="hidden"
            animate="show"
            style={shake ? { animation: "shake 0.4s ease-in-out" } : {}}
        >
            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    15% { transform: translateX(-6px); }
                    30% { transform: translateX(5px); }
                    45% { transform: translateX(-4px); }
                    60% { transform: translateX(3px); }
                    75% { transform: translateX(-2px); }
                }
            `}</style>

            {/* Username */}
            <motion.div variants={fadeUp}>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                    Username
                </label>
                <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="coolcreator"
                        required
                        className={inputClasses}
                    />
                </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp}>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                    Email
                </label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/30 group-focus-within:text-primary transition-colors" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => setEmailTouched(true)}
                        placeholder="your@email.com"
                        required
                        className={`w-full bg-white border pl-11 pr-10 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] transition-all outline-none rounded-sm ${showEmailFeedback
                                ? emailValid
                                    ? "border-green-400"
                                    : "border-red-400"
                                : "border-ink/20"
                            }`}
                    />
                    {/* Validation icon */}
                    <AnimatePresence>
                        {showEmailFeedback && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                                {emailValid ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-red-400" />
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <AnimatePresence>
                    {showEmailFeedback && !emailValid && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="font-mono text-[10px] text-red-400 mt-1"
                        >
                            Please enter a valid email address
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp}>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                    Password
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
                        className={inputClassesWithToggle}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors cursor-pointer"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {/* Password Strength */}
                <PasswordStrength password={password} />
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
                        className={`w-full bg-white border pl-11 pr-12 py-3 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-primary focus:shadow-[0_0_0_3px_rgba(255,215,0,0.2)] transition-all outline-none rounded-sm ${passwordsMatch
                                ? "border-green-400"
                                : passwordsMismatch
                                    ? "border-red-400"
                                    : "border-ink/20"
                            }`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors cursor-pointer"
                    >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {/* Match feedback */}
                <AnimatePresence>
                    {passwordsMatch && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="font-mono text-[10px] text-green-500 mt-1 flex items-center gap-1"
                        >
                            <CheckCircle2 className="w-3 h-3" />
                            Passwords match
                        </motion.p>
                    )}
                    {passwordsMismatch && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="font-mono text-[10px] text-red-400 mt-1 flex items-center gap-1"
                        >
                            <AlertCircle className="w-3 h-3" />
                            Passwords don&apos;t match
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Terms */}
            <motion.div variants={fadeUp}>
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-5 h-5 border-2 border-ink/20 accent-primary cursor-pointer mt-0.5 flex-shrink-0"
                        required
                    />
                    <span className="font-mono text-xs text-ink/60 group-hover:text-ink transition-colors leading-relaxed">
                        I accept the{" "}
                        <button type="button" className="text-[#3b82f6] font-bold hover:underline underline-offset-2 cursor-pointer">
                            Terms & Conditions
                        </button>{" "}
                        and{" "}
                        <button type="button" className="text-[#3b82f6] font-bold hover:underline underline-offset-2 cursor-pointer">
                            Privacy Policy
                        </button>
                    </span>
                </label>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-50 border-2 border-red-400 px-4 py-3 font-mono text-sm text-red-700 rounded-sm overflow-hidden"
                    >
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sign Up Button */}
            <motion.div variants={fadeUp}>
                <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-accent-green hover:bg-accent-green/90 text-white border-2 border-accent-green/80 px-8 py-3.5 font-black uppercase text-sm shadow-hard-sm hover:shadow-none hover:translate-y-0.5 active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer rounded-sm"
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                >
                    {loading ? <Spinner /> : <UserPlus className="w-5 h-5" />}
                    {loading ? "Creating..." : "Sign Up"}
                </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp} className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-ink/15" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-4 font-mono text-xs text-ink/40 uppercase font-bold">or</span>
                </div>
            </motion.div>

            {/* Google */}
            <motion.div variants={fadeUp}>
                <motion.button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full bg-white hover:bg-gray-50 text-ink border border-ink/20 px-6 py-3 font-mono font-bold text-sm shadow-sm hover:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer rounded-sm"
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.01 }}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </motion.button>
            </motion.div>
        </motion.form>
    );
}
