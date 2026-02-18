"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit2, MapPin, Link as LinkIcon, Calendar, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

interface ProfileHeaderProps {
    totalDesigns: number;
}

export function ProfileHeader({ totalDesigns }: ProfileHeaderProps) {
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!user) return null;

    // Use specific avatar or default
    // Note: user object from useAuth might need to be enriched if we want avatar_url directly
    // For now we might depend on what's available or fetch it.
    // Actually useAuth initializes user with data from profiles table if available.
    // Let's assume user object has what we need or we might need to fetch profile specifically here if extra fields are needed.
    // looking at useAuth, it maps: id, email, username. It does NOT map avatar_url yet.
    // We should probably update useAuth to include avatar_url or fetch it here.
    // For MVP, let's use a placeholder if missing or update useAuth.
    // useAuth.tsx line 46:
    // user: { id, email, username }

    // Let's rely on a reliable placeholder for now or updated auth later. 
    // Actually, let's look at how we get the avatar. The profile table has it.
    // I can fetch the full profile here to be sure.

    return (
        <div className="bg-white border-b-4 border-ink mb-12 relative">
            {/* Cover Image */}
            <div className="h-48 md:h-64 w-full bg-accent-yellow relative border-b-4 border-ink overflow-hidden group">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-20">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-ink shadow-hard-sm hover:translate-y-[1px] hover:shadow-none hover:bg-gray-50 transition-all font-bold font-mono text-sm uppercase"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                <div className="flex flex-col md:flex-row items-end -mt-12 md:-mt-16 mb-6 gap-6 md:gap-8">

                    {/* Avatar Container */}
                    <div className="relative z-10 shrink-0 mx-auto md:mx-0">
                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-ink bg-white p-1.5 shadow-hard relative group">
                            <div className="w-full h-full rounded-full overflow-hidden relative border-2 border-ink/10">
                                <Image
                                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                    alt={user.username}
                                    fill
                                    className="object-cover bg-gray-100"
                                />
                            </div>

                            {/* Quick Edit Icon */}
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="absolute bottom-2 right-2 p-2.5 bg-accent-orange border-2 border-ink rounded-full text-white hover:scale-110 transition-transform shadow-sm z-20 group-hover:rotate-12"
                                title="Change Avatar"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Check if we need to wrap the rest in a full width container to push button to right */}
                    <div className="flex-1 flex flex-col md:flex-row md:items-end md:justify-between gap-6 w-full text-center md:text-left pb-2">

                        {/* User Info */}
                        <div className="space-y-3">
                            <div>
                                <h1 className="font-black text-4xl md:text-6xl text-ink uppercase tracking-tighter leading-none mb-1">
                                    {user.username}
                                </h1>
                                <p className="font-mono text-ink/70 text-sm md:text-base font-bold flex items-center justify-center md:justify-start gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Designer & Prompt Engineer
                                </p>
                            </div>

                            {/* Meta Tags */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-xs font-mono font-bold text-ink/50 uppercase tracking-wide">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>Digital Nomad</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-primary cursor-pointer transition-colors">
                                    <LinkIcon className="w-3.5 h-3.5" />
                                    <span>stitchhub.dev/{user.username}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>Joined 2026</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions Node */}
                        <div className="flex flex-col items-center md:items-end gap-4 shrink-0 mt-4 md:mt-0">

                            {/* Stats */}
                            <div className="flex items-center gap-3">
                                <div className="text-center px-4 py-1.5 border-2 border-ink bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="font-black text-xl text-ink leading-none">{totalDesigns}</div>
                                    <div className="text-[9px] font-mono text-ink/50 uppercase font-bold mt-0.5">Designs</div>
                                </div>
                                <div className="text-center px-4 py-1.5 border-2 border-ink bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-60">
                                    <div className="font-black text-xl text-ink leading-none">0</div>
                                    <div className="text-[9px] font-mono text-ink/50 uppercase font-bold mt-0.5">Remixes</div>
                                </div>
                                <div className="text-center px-4 py-1.5 border-2 border-ink bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-60">
                                    <div className="font-black text-xl text-ink leading-none">0</div>
                                    <div className="text-[9px] font-mono text-ink/50 uppercase font-bold mt-0.5">Likes</div>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="w-full md:w-auto px-6 py-2.5 bg-white text-ink border-2 border-ink font-mono font-bold text-sm uppercase shadow-hard-sm hover:translate-y-[1px] hover:shadow-none hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    currentUser={user}
                />
            )}
        </div>
    );
}
