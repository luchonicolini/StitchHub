"use client";

import { useState, useEffect } from "react";
import { X, Users, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FollowButton } from "./FollowButton";

interface FollowerUser {
    id: string;
    username: string;
    avatar_url: string | null;
    bio?: string | null;
}

interface FollowersModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetUserId: string;
    username: string;
    type: "followers" | "following";
}

export function FollowersModal({ isOpen, onClose, targetUserId, username, type }: FollowersModalProps) {
    const [users, setUsers] = useState<FollowerUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !targetUserId) return;

        const fetchList = async () => {
            setIsLoading(true);
            try {
                if (type === "followers") {
                    // Fetch creators who follow targetUserId
                    const { data, error } = await supabase
                        .from('followers')
                        .select(`
                            follower_id,
                            profile:profiles!followers_follower_id_fkey(id, username, avatar_url, bio)
                        `)
                        .eq('following_id', targetUserId);

                    if (error) throw error;
                    if (data) {
                        const formatted = data
                            .map((item: any) => item.profile)
                            .filter(Boolean) as FollowerUser[];
                        setUsers(formatted);
                    }
                } else {
                    // Fetch creators targetUserId is following
                    const { data, error } = await supabase
                        .from('followers')
                        .select(`
                            following_id,
                            profile:profiles!followers_following_id_fkey(id, username, avatar_url, bio)
                        `)
                        .eq('follower_id', targetUserId);

                    if (error) throw error;
                    if (data) {
                        const formatted = data
                            .map((item: any) => item.profile)
                            .filter(Boolean) as FollowerUser[];
                        setUsers(formatted);
                    }
                }
            } catch (err) {
                console.error(`Error fetching ${type}:`, err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchList();
    }, [isOpen, targetUserId, type]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-white border-4 border-ink shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-4 border-ink bg-accent-yellow shrink-0">
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-ink" />
                        <h2 className="text-xl font-black uppercase text-ink tracking-tight font-mono">
                            {type === "followers" ? `Seguidores de @${username}` : `@${username} sigue a`}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 bg-red-500 text-white border-2 border-ink hover:bg-red-600 hover:scale-105 active:scale-95 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center"
                        title="Cerrar"
                    >
                        <X className="w-5 h-5 stroke-[3]" />
                    </button>
                </div>

                {/* Content List */}
                <div className="p-4 overflow-y-auto flex-1 bg-background-light space-y-3">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-ink/60 font-mono gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-ink" />
                            <span>Cargando lista...</span>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12 px-4 bg-white border-2 border-ink shadow-hard-sm">
                            <p className="font-mono text-sm text-ink/70">
                                {type === "followers"
                                    ? `@${username} aún no tiene seguidores.`
                                    : `@${username} aún no sigue a ningún creador.`}
                            </p>
                        </div>
                    ) : (
                        users.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center justify-between gap-4 p-3 bg-white border-2 border-ink shadow-hard-sm hover:translate-x-1 transition-transform"
                            >
                                <Link
                                    href={`/profile/${encodeURIComponent(u.username)}`}
                                    onClick={onClose}
                                    className="flex items-center gap-3 min-w-0 group cursor-pointer"
                                >
                                    <div className="w-12 h-12 rounded-full border-2 border-ink overflow-hidden relative shrink-0 bg-gray-100 group-hover:scale-105 transition-transform">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={u.avatar_url || "/images/default-avatar.png"}
                                            alt={u.username}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-sm text-ink font-mono group-hover:underline truncate">
                                            @{u.username}
                                        </h4>
                                        {u.bio && (
                                            <p className="text-xs text-ink/60 font-mono truncate max-w-[200px]">
                                                {u.bio}
                                            </p>
                                        )}
                                    </div>
                                </Link>

                                <div className="shrink-0">
                                    <FollowButton targetUserId={u.id} targetUsername={u.username} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
