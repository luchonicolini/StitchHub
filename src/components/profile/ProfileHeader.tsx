"use client";

import { useState } from "react";
import { Edit2, MapPin, Link as LinkIcon, Calendar } from "lucide-react";
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
        <div className="bg-background-light border-b-8 border-ink mb-12 relative w-full overflow-x-hidden">
            {/* Cover Image */}
            <div className="h-48 md:h-64 w-full bg-accent-yellow relative overflow-hidden flex items-center justify-center border-b-2 border-ink/20">
                {user.cover_image_url ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={user.cover_image_url}
                            alt="Profile cover"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </>
                ) : (
                    <>
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                                backgroundSize: '24px 24px'
                            }}
                        ></div>

                        {/* Decorative Elements */}
                        <div className="absolute top-8 left-12 md:left-24 text-ink opacity-20 transform -rotate-12 select-none pointer-events-none">
                            <span className="text-8xl md:text-[10rem] font-black leading-none">*</span>
                        </div>
                        <div className="absolute bottom-8 right-12 md:right-32 w-16 h-16 md:w-32 md:h-32 border-[12px] border-ink opacity-20 transform rotate-12 select-none pointer-events-none"></div>
                    </>
                )}

                {/* Large Background Text - only show when no cover image */}
                {!user.cover_image_url && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ink opacity-10 select-none pointer-events-none whitespace-nowrap">
                        <span className="text-[10rem] md:text-[16rem] font-black uppercase tracking-tighter mix-blend-overlay">CREATOR</span>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                {/* Avatar - overlaps the cover */}
                <div className="flex justify-center md:justify-start -mt-16 md:-mt-20 mb-4">
                    <div className="relative z-10 shrink-0 group transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <div
                            className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden bg-gray-100 relative"
                            style={{
                                boxShadow: '0 0 0 2px #000, 0 0 0 5px #fff, 0 0 0 7px #000'
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={user.avatar_url || "/images/default-avatar.png"}
                                alt={user.username}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Quick Edit Icon */}
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="absolute -bottom-2 -right-2 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-accent-cyan border-4 border-ink rounded-full text-ink hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 group-hover:rotate-12 hover:bg-primary active:translate-y-1 active:shadow-none"
                            title="Change Avatar"
                        >
                            <Edit2 className="w-5 h-5 md:w-6 md:h-6 font-black" />
                        </button>
                    </div>
                </div>

                {/* User Info + Stats - fully below the cover */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 text-center md:text-left">

                    {/* User Info */}
                    <div className="space-y-4">
                        <div>
                            <h1 className="font-black text-5xl md:text-7xl text-ink uppercase tracking-tighter leading-none mb-2 transform -skew-x-[5deg] origin-left">
                                {user.username}
                            </h1>
                            <p className="text-sm md:text-base text-ink/70 font-mono max-w-md mb-3 leading-relaxed">
                                Crafting prompts & designs for the digital age ✦
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink text-white font-mono text-xs md:text-sm font-bold uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] border-2 border-transparent transform rotate-1 hover:-rotate-1 transition-transform">
                                <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse border border-white"></span>
                                Designer & Prompt Engineer
                            </div>
                        </div>

                        {/* Meta Tags as Badges */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono font-bold text-ink uppercase tracking-wide mt-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-magenta border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                                <MapPin className="w-4 h-4" />
                                <span>Digital Nomad</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-translate-y-0.5 transition-all cursor-pointer hover:bg-white active:shadow-none active:translate-y-1">
                                <LinkIcon className="w-4 h-4" />
                                <span>stitchhub.dev/{user.username}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                                <Calendar className="w-4 h-4" />
                                <span>Joined 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 shrink-0 mt-4 md:mt-0">
                        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                            <div className="font-black text-3xl md:text-4xl text-ink leading-none">{totalDesigns}</div>
                            <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider">Prints</div>
                        </div>
                        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform opacity-90 cursor-default">
                            <div className="font-black text-3xl md:text-4xl text-ink leading-none">0</div>
                            <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider">Remixes</div>
                        </div>
                        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-accent-green shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform opacity-90 cursor-default">
                            <div className="font-black text-3xl md:text-4xl text-ink leading-none">0</div>
                            <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider">Likes</div>
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
