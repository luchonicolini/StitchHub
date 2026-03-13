"use client";

import { Prompt } from '@/types/prompt';
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import Image from 'next/image';
import { FollowButton } from '@/components/profile/FollowButton';
import { WorkshopFeed } from '@/components/workshop/WorkshopFeed';

interface PublicProfileClientProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any;
    designs: Prompt[];
    totalDesigns: number;
    followerCount: number;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    followingCount: number;
}

export default function PublicProfileClient({ profile, designs, totalDesigns, followerCount, followingCount }: PublicProfileClientProps) {
    const joinedYear = profile.created_at ? new Date(profile.created_at).getFullYear() : '2026';

    return (
        <div className="flex flex-col w-full overflow-x-hidden">
            <div className="bg-background-light border-b-8 border-ink mb-12 relative w-full overflow-x-hidden">
                {/* Cover Image */}
                <div className="h-48 md:h-64 w-full bg-accent-yellow relative overflow-hidden flex items-center justify-center border-b-2 border-ink/20">
                    {profile.cover_image_url ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={profile.cover_image_url}
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
                            <div className="absolute top-8 left-12 md:left-24 text-ink opacity-20 transform -rotate-12 select-none pointer-events-none">
                                <span className="text-8xl md:text-[10rem] font-black leading-none">*</span>
                            </div>
                            <div className="absolute bottom-8 right-12 md:right-32 w-16 h-16 md:w-32 md:h-32 border-[12px] border-ink opacity-20 transform rotate-12 select-none pointer-events-none"></div>
                        </>
                    )}

                    {!profile.cover_image_url && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-ink opacity-10 select-none pointer-events-none whitespace-nowrap">
                            <span className="text-[10rem] md:text-[16rem] font-black uppercase tracking-tighter mix-blend-overlay">CREATOR</span>
                        </div>
                    )}
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
                    {/* Avatar */}
                    <div className="flex justify-center md:justify-start -mt-16 md:-mt-20 mb-4">
                        <div className="relative z-10 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <div
                                className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden bg-gray-100 relative pointer-events-none"
                                style={{
                                    boxShadow: '0 0 0 2px #000, 0 0 0 5px #fff, 0 0 0 7px #000'
                                }}
                            >
                                <Image
                                    src={profile.avatar_url || "/images/default-avatar.png"}
                                    alt={profile.username}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* User Info + Stats */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 text-center md:text-left">
                        <div className="space-y-4">
                            <div>
                                <h1 className="font-black text-5xl md:text-7xl text-ink uppercase tracking-tighter leading-none mb-2 transform -skew-x-[5deg] origin-left">
                                    {profile.username}
                                </h1>
                                <p className="text-sm md:text-base text-ink/70 font-mono max-w-md mb-3 leading-relaxed">
                                    {profile.bio || "No bio yet."}
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink text-white font-mono text-xs md:text-sm font-bold uppercase shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] border-2 border-transparent transform rotate-1 hover:-rotate-1 transition-transform">
                                    <span className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse border border-white"></span>
                                    Designer & Creator
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono font-bold text-ink uppercase tracking-wide mt-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-magenta border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                                    <MapPin className="w-4 h-4" />
                                    <span>Global</span>
                                </div>
                                {profile.website && (
                                    <a
                                        href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-translate-y-0.5 transition-all cursor-pointer hover:bg-white active:shadow-none active:translate-y-1 text-ink no-underline"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        <span>
                                            {profile.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                        </span>
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-ink shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform cursor-default">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {joinedYear}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats & Actions */}
                        <div className="flex items-center justify-center md:justify-end gap-4 shrink-0 mt-4 md:mt-0">
                            {/* Follow Button */}
                            <FollowButton targetUserId={profile.id} targetUsername={profile.username} />

                            <div className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:rotate-0 transition-transform cursor-default">
                                <div className="font-black text-3xl md:text-4xl text-ink leading-none">{totalDesigns}</div>
                                <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider">Prints</div>
                            </div>

                            <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 border-4 border-ink bg-accent-green shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:rotate-0 transition-transform cursor-default">
                                <div className="font-black text-3xl md:text-4xl text-ink leading-none">{followerCount}</div>
                                <div className="text-[10px] font-black font-mono text-ink uppercase mt-1 tracking-wider">Followers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Public Designs Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black uppercase text-ink transform -rotate-1 bg-white inline-block px-4 py-2 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Collection
                    </h2>
                </div>

                {designs.length > 0 ? (
                    <WorkshopFeed initialPrompts={designs} activeFilter={null} />
                ) : (
                    <div className="bg-white border-4 border-ink p-16 text-center shadow-hard rounded-sm transform rotate-1">
                        <h3 className="text-2xl font-black text-ink mb-4 uppercase">No Designs Yet</h3>
                        <p className="text-ink/60 font-mono max-w-md mx-auto">
                            This creator hasn&apos;t published any designs to their public profile yet. Check back later!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
