"use client";


import Link from "next/link";
import { Search, Construction, Plus, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogoutConfirmationModal } from "@/components/auth/LogoutConfirmationModal";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface WorkshopHeaderProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    showSearch?: boolean;
}

export function WorkshopHeader({ searchQuery = "", onSearchChange, showSearch = true }: WorkshopHeaderProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleExplore = () => {
        if (pathname === '/') {
            document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push('/#explore-section');
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b-4 border-ink bg-background-light py-4 shadow-[0_4px_0_0_#000000]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo Area */}
                    <Link className="flex items-center gap-3 group" href="/">
                        <div className="w-12 h-12 bg-ink text-white flex items-center justify-center border-2 border-transparent transform -rotate-3 group-hover:rotate-0 transition-transform duration-300 ease-in-out shadow-hard-sm">
                            <Construction className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight uppercase transform skew-x-[-10deg] text-ink">
                            STITCHHUB
                        </h1>
                    </Link>

                    {/* Search Bar */}
                    {showSearch && (
                        <div className="relative w-full md:w-auto flex-1 max-w-md mx-4">
                            <div className="relative flex items-center">
                                {/* Search icon (left side, inline) */}
                                <Search className="absolute left-3 w-4 h-4 text-ink/40 stroke-[2.5] pointer-events-none" />
                                <input
                                    className="w-full bg-white border-3 border-ink pl-10 pr-12 py-2.5 font-mono text-sm font-bold text-ink 
                                focus:ring-0 focus:border-ink focus:shadow-hard-sm
                                transition-all placeholder-ink/35 outline-none rounded-none shadow-hard-sm"
                                    placeholder="Search prompts..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange?.(e.target.value)}
                                />
                                {/* Clear button when there's text */}
                                {searchQuery && (
                                    <button
                                        onClick={() => onSearchChange?.("")}
                                        className="absolute right-3 w-6 h-6 rounded-full bg-ink/10 text-ink hover:bg-ink hover:text-white transition-colors duration-200 flex items-center justify-center"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-3.5 h-3.5 stroke-[3]" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Nav Actions */}
                    <nav className="flex items-center gap-6">
                        {pathname !== '/' && (
                            <>
                                <button
                                    onClick={handleExplore}
                                    className="font-mono font-bold text-lg hover:underline decoration-4 decoration-primary underline-offset-4 hidden sm:block text-ink transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                                >
                                    Explore
                                </button>
                                <Link
                                    className="font-mono font-bold text-lg hover:underline decoration-4 decoration-accent-green underline-offset-4 hidden sm:block text-ink transition-all duration-300 ease-in-out hover:scale-105"
                                    href={isAuthenticated ? "/profile" : "/auth?returnUrl=/profile"}
                                >
                                    Workshop
                                </Link>
                            </>
                        )}

                        {/* User Actions */}
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-3">
                                <NotificationBell />
                                
                                <Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-ink hover:bg-gray-50 transition-colors">
                                    <User className="w-4 h-4 text-ink" />
                                    <span className="font-mono font-bold text-sm text-ink">{user.username}</span>
                                </Link>
                                <button
                                    onClick={() => setIsLogoutModalOpen(true)}
                                    className="p-2 bg-red-500 border-2 border-ink hover:bg-red-600 transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] group"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth"
                                className="font-mono font-bold text-lg hover:underline decoration-4 decoration-primary underline-offset-4 text-ink transition-all duration-300 ease-in-out hover:scale-105 flex items-center gap-2"
                            >
                                <User className="w-5 h-5" />
                                Login
                            </Link>
                        )}

                        {/* Enhanced Submit Button */}
                        <motion.div
                            whileTap={{ scale: 0.95 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-accent-green border-2 border-ink translate-x-2 translate-y-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:translate-y-1" />
                            {isAuthenticated ? (
                                <Link
                                    href="/submit"
                                    className="relative bg-primary hover:bg-[#ffe564] text-ink font-black uppercase tracking-widest px-6 py-2.5 border-4 border-ink flex items-center gap-2 cursor-pointer transform rotate-2 hover:rotate-0 transition-all duration-300 ease-in-out"
                                >
                                    <Plus className="w-5 h-5" strokeWidth={3} />
                                    SUBMIT
                                </Link>
                            ) : (
                                <Link
                                    href="/auth?returnUrl=/submit"
                                    className="relative bg-primary hover:bg-[#ffe564] text-ink font-black uppercase tracking-widest px-6 py-2.5 border-4 border-ink flex items-center gap-2 cursor-pointer transform rotate-2 hover:rotate-0 transition-all duration-300 ease-in-out"
                                >
                                    <Plus className="w-5 h-5" strokeWidth={3} />
                                    SUBMIT
                                </Link>
                            )}
                        </motion.div>
                    </nav>
                </div>
            </header>

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={() => {
                    setIsLogoutModalOpen(false);
                    logout();
                }}
            />
        </>
    );
}
