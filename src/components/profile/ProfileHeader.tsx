"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit2, Link as LinkIcon, Calendar, ExternalLink, Share2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { FollowersModal } from "@/components/profile/FollowersModal";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

interface ProfileHeaderProps {
    totalDesigns: number;
}

export function ProfileHeader({ totalDesigns }: ProfileHeaderProps) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; type: "followers" | "following" }>({
        isOpen: false,
        type: "followers",
    });

    useEffect(() => {
        if (!user?.id) return;
        const fetchCounts = async () => {
            try {
                const { count: fCount } = await supabase
                    .from('followers')
                    .select('*', { count: 'exact', head: true })
                    .eq('following_id', user.id);
                setFollowerCount(fCount || 0);

                const { count: flCount } = await supabase
                    .from('followers')
                    .select('*', { count: 'exact', head: true })
                    .eq('follower_id', user.id);
                setFollowingCount(flCount || 0);
            } catch (err) {
                console.error("Error fetching follow counts:", err);
            }
        };
        fetchCounts();
    }, [user?.id]);

    if (!user) return null;

    const parsedJoinedAt = new Date(user.joinedAt);
    const joinedDate = Number.isNaN(parsedJoinedAt.getTime())
        ? "Recently"
        : new Intl.DateTimeFormat("en", {
            month: "short",
            year: "numeric",
        }).format(parsedJoinedAt);

    const handleShareProfile = async () => {
        const profileUrl = `${window.location.origin}/profile/${encodeURIComponent(user.username)}`;
        try {
            await navigator.clipboard.writeText(profileUrl);
            showToast({ message: "Profile link copied", description: "Your public profile is ready to share.", type: "success" });
        } catch {
            showToast({ message: "Unable to copy link", description: profileUrl, type: "warning" });
        }
    };

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
                            className="absolute -bottom-2 -right-2 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-accent-cyan border-4 border-ink rounded-full text-ink hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 group-hover:rotate-12 hover:bg-primary active:translate-y-1 active:shadow-none cursor-pointer"
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
                                {user.bio || "No bio yet."}
                            </p>
                            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="inline-flex items-center gap-2 border-3 border-ink bg-primary px-4 py-2 font-mono text-xs font-black uppercase text-ink shadow-hard-sm transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit profile
                                </button>
                                <Link
                                    href={`/profile/${encodeURIComponent(user.username)}`}
                                    className="inline-flex items-center gap-2 border-3 border-ink bg-white px-4 py-2 font-mono text-xs font-black uppercase text-ink shadow-hard-sm transition-all hover:bg-accent-cyan hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Public view
                                </Link>
                                <button
                                    onClick={handleShareProfile}
                                    className="inline-flex items-center gap-2 border-3 border-ink bg-white px-4 py-2 font-mono text-xs font-black uppercase text-ink shadow-hard-sm transition-all hover:bg-accent-green hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                >
                                    <Share2 className="h-4 w-4" />
                                    Share
                                </button>
                            </div>
                        </div>

                        {/* Meta Tags as Badges */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono font-bold text-ink uppercase tracking-wide mt-2">
                            {user.website && (
                                <a 
                                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-translate-y-0.5 transition-all cursor-pointer hover:bg-white active:shadow-none active:translate-y-1 text-ink no-underline"
                                >
                                    <LinkIcon className="w-4 h-4" />
                                    <span>
                                        {user.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                    </span>
                                </a>
                            )}
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {joinedDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Stats */}
                    <div className="flex items-center justify-center md:justify-end gap-4 shrink-0 mt-4 md:mt-0">
                        <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                            <div className="font-black text-3xl md:text-4xl text-ink leading-none">{totalDesigns}</div>
                            <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider">Designs</div>
                        </div>
                        
                        <button
                            onClick={() => setModalConfig({ isOpen: true, type: "followers" })}
                            className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-accent-green shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                            title="View your followers"
                            aria-label="View your followers"
                        >
                            <div className="font-black text-3xl md:text-4xl text-ink leading-none group-hover:scale-110 transition-transform">{followerCount}</div>
                            <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider group-hover:underline">Followers</div>
                        </button>

                        <button
                            onClick={() => setModalConfig({ isOpen: true, type: "following" })}
                            className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-accent-cyan shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
                            title="View accounts you follow"
                            aria-label="View accounts you follow"
                        >
                            <div className="font-black text-3xl md:text-4xl text-ink leading-none group-hover:scale-110 transition-transform">{followingCount}</div>
                            <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider group-hover:underline">Following</div>
                        </button>
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

            {modalConfig.isOpen && (
                <FollowersModal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                    targetUserId={user.id}
                    username={user.username}
                    type={modalConfig.type}
                />
            )}
        </div>
    );
}

