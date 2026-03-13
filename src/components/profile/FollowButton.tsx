"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';

interface FollowButtonProps {
    targetUserId: string;
    targetUsername: string;
}

export function FollowButton({ targetUserId, targetUsername }: FollowButtonProps) {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        if (!user || user.id === targetUserId) {
            setIsLoading(false);
            return;
        }

        const checkFollowStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from('followers')
                    .select('id')
                    .eq('follower_id', user.id)
                    .eq('following_id', targetUserId)
                    .maybeSingle();

                if (error) {
                    if (error.code === '42P01') {
                        console.warn("Followers table not found. Please run create_followers.sql");
                        setIsFollowing(false);
                        return;
                    }
                    if (error.code !== 'PGRST116') throw error; // PGRST116 is no rows
                }
                setIsFollowing(!!data);
            } catch (err) {
                console.error("Error checking follow status:", err);
            } finally {
                setIsLoading(false);
            }
        };

        checkFollowStatus();
    }, [user, targetUserId]);

    const handleToggleFollow = async () => {
        if (!user) {
            showToast({
                message: "Login Required",
                description: "Log in to follow other creators.",
                type: "warning",
            });
            return;
        }

        if (isLoading || isToggling) return;
        setIsToggling(true);

        try {
            if (isFollowing) {
                const { error } = await supabase
                    .from('followers')
                    .delete()
                    .eq('follower_id', user.id)
                    .eq('following_id', targetUserId);

                if (error) throw error;
                setIsFollowing(false);
                showToast({
                    message: "Unfollowed",
                    description: `You are no longer following ${targetUsername}`,
                    type: "success",
                });
            } else {
                const { error } = await supabase
                    .from('followers')
                    .insert({ follower_id: user.id, following_id: targetUserId });

                if (error) throw error;
                setIsFollowing(true);
                showToast({
                    message: "Following",
                    description: `You are now following ${targetUsername}!`,
                    type: "success",
                });
            }
        } catch (err: any) {
            console.error("Error toggling follow:", err);
            
            // Check if table missing directly inside toggle flow too
            if (err.code === '42P01') {
                showToast({
                    message: "Data Missing",
                    description: "Please run create_followers.sql in Supabase to enable following.",
                    type: "error",
                });
                return;
            }

            const errorMessage = err instanceof Error ? err.message : "Failed to update follow status";
            showToast({
                message: "Error",
                description: errorMessage,
                type: "error",
            });
        } finally {
            setIsToggling(false);
        }
    };

    // Don't show the button if it's their own profile
    if (user?.id === targetUserId) return null;

    if (isLoading) {
        return (
            <button disabled className="px-6 py-2 bg-gray-200 text-ink/50 border-4 border-ink/20 font-black uppercase flex items-center gap-2 cursor-not-allowed">
                <Loader2 className="w-5 h-5 animate-spin" />
                Wait...
            </button>
        );
    }

    return (
        <button
            onClick={handleToggleFollow}
            disabled={isToggling}
            className={`
                group px-6 py-2 border-4 border-ink font-black uppercase flex items-center gap-2 transition-all duration-300 transform rotate-1 cursor-pointer
                ${isFollowing
                    ? 'bg-white text-ink hover:bg-gray-100 hover:rotate-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-0 translate-y-0 hover:translate-x-1 hover:translate-y-1'
                    : 'bg-primary text-ink hover:bg-accent-orange hover:text-white hover:rotate-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-x-0 translate-y-0 hover:translate-x-1 hover:translate-y-1'
                }
                ${isToggling ? 'opacity-70 pointer-events-none' : ''}
            `}
        >
            {isToggling ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : isFollowing ? (
                <>
                    <UserMinus className="w-5 h-5" />
                    Unfollow
                </>
            ) : (
                <>
                    <UserPlus className="w-5 h-5" />
                    Follow
                </>
            )}
        </button>
    );
}
