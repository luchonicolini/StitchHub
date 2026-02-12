"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LoginFormProps {
    onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                    Email Address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full bg-white border-3 border-ink pl-11 pr-4 py-3 font-mono text-sm text-ink placeholder:text-ink/40 focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none"
                    />
                </div>
            </div>

            {/* Password Input */}
            <div>
                <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                    Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-white border-3 border-ink pl-11 pr-12 py-3 font-mono text-sm text-ink placeholder:text-ink/40 focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 border-2 border-ink accent-primary cursor-pointer"
                    />
                    <span className="font-mono text-xs text-ink/70 group-hover:text-ink transition-colors">
                        Remember me
                    </span>
                </label>
                <button
                    type="button"
                    className="font-mono text-xs text-ink/70 hover:text-primary underline underline-offset-2 transition-colors"
                >
                    Forgot password?
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-ink border-4 border-ink px-8 py-4 font-black uppercase text-sm shadow-hard hover:shadow-hard-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
            >
                Login
            </button>

            {/* Divider */}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-ink/20"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-4 font-mono text-xs text-ink/50 uppercase font-bold">Or</span>
                </div>
            </div>

            {/* Google Sign In Button */}
            <button
                type="button"
                onClick={() => {
                    // TODO: Implement Google OAuth
                    console.log("Google Sign In clicked");
                }}
                className="w-full bg-white hover:bg-gray-50 text-ink border-3 border-ink px-6 py-3 font-mono font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </button>

            {/* Switch to Register */}
            <p className="text-center font-mono text-xs text-ink/60">
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-primary font-bold hover:underline underline-offset-2"
                >
                    Create one
                </button>
            </p>
        </form>
    );
}
