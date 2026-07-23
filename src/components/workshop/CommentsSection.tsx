"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Comment } from "@/types/comment";

interface CommentsSectionProps {
    designId: string; // The raw numeric DB id (without 'db-' prefix)
}

function timeAgo(date: string): string {
    const now = Date.now();
    const then = new Date(date).getTime();
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

const AVATAR_FALLBACK = "https://api.dicebear.com/7.x/identicon/png?seed=";

export function CommentsSection({ designId }: CommentsSectionProps) {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const PAGE_SIZE = 10;

    const fetchComments = useCallback(async (offset = 0) => {
        const { data, error } = await supabase
            .from("comments")
            .select(`
                id,
                design_id,
                user_id,
                content,
                created_at,
                profiles (
                    username,
                    avatar_url
                )
            `)
            .eq("design_id", designId)
            .order("created_at", { ascending: false })
            .range(offset, offset + PAGE_SIZE - 1);

        if (!error && data) {
            const mapped = data as unknown as Comment[];
            if (offset === 0) {
                setComments(mapped);
            } else {
                setComments(prev => [...prev, ...mapped]);
            }
            setHasMore(mapped.length === PAGE_SIZE);
        }
        setLoading(false);
    }, [designId]);

    useEffect(() => {
        const initialFetch = window.setTimeout(() => {
            void fetchComments(0);
        }, 0);
        return () => window.clearTimeout(initialFetch);
    }, [fetchComments]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showToast({ message: "Login required", description: "Please sign in to leave a comment.", type: "warning" });
            return;
        }
        const trimmed = content.trim();
        if (!trimmed || trimmed.length < 2) return;

        setSubmitting(true);
        const { data, error } = await supabase
            .from("comments")
            .insert({ design_id: parseInt(designId), user_id: user.id, content: trimmed })
            .select(`id, design_id, user_id, content, created_at, profiles(username, avatar_url)`)
            .single();

        if (error) {
            showToast({ message: "Failed to post comment", type: "error" });
        } else {
            setComments(prev => [data as unknown as Comment, ...prev]);
            setContent("");
        }
        setSubmitting(false);
    };

    const handleDelete = async (commentId: string) => {
        const { error } = await supabase.from("comments").delete().eq("id", commentId);
        if (!error) {
            setComments(prev => prev.filter(c => c.id !== commentId));
        } else {
            showToast({ message: "Failed to delete comment", type: "error" });
        }
    };

    return (
        <div className="mt-8 border-t-4 border-ink pt-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
                <MessageCircle className="w-5 h-5 text-ink" />
                <h3 className="font-black text-lg uppercase text-ink tracking-tight">
                    Comments {comments.length > 0 && <span className="font-mono text-ink/50 text-sm">({comments.length})</span>}
                </h3>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="flex gap-3 items-start">
                    {/* User avatar or placeholder */}
                    <div className="w-9 h-9 border-2 border-ink bg-primary flex-shrink-0 overflow-hidden relative">
                        {user?.avatar_url ? (
                            <Image
                                src={user.avatar_url}
                                alt={user.username}
                                fill
                                className="object-cover"
                                unoptimized={user.avatar_url.endsWith('.svg') || user.avatar_url.includes('/svg?')}
                            />
                        ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={`${AVATAR_FALLBACK}${user?.username || "anon"}`}
                                alt="You"
                                className="w-full h-full"
                            />
                        )}
                    </div>
                    <div className="flex-1 border-3 border-ink bg-white focus-within:border-primary focus-within:shadow-hard-sm transition-all">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value.slice(0, 1000))}
                            placeholder={user ? "Share your thoughts, tips, or remix ideas..." : "Sign in to leave a comment"}
                            disabled={!user || submitting}
                            rows={2}
                            className="w-full px-4 pt-3 pb-1 font-mono text-sm text-ink placeholder:text-ink/40 outline-none resize-none bg-transparent disabled:opacity-50"
                        />
                        <div className="flex justify-between items-center px-4 pb-2">
                            <span className="font-mono text-xs text-ink/30">{content.length}/1000</span>
                            <button
                                type="submit"
                                disabled={!user || submitting || content.trim().length < 2}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-ink text-white font-mono font-bold text-xs uppercase border-2 border-ink hover:bg-primary hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <Send className="w-3 h-3" />
                                {submitting ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                            <div className="w-9 h-9 bg-ink/10 border-2 border-ink/10 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-ink/10 w-24" />
                                <div className="h-3 bg-ink/10 w-full" />
                                <div className="h-3 bg-ink/10 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-10 border-3 border-dashed border-ink/20 bg-white">
                    <MessageCircle className="w-10 h-10 text-ink/20 mx-auto mb-2" />
                    <p className="font-mono text-sm text-ink/40">No comments yet. Be the first!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map(comment => {
                        const profile = comment.profiles;
                        const isOwn = user?.id === comment.user_id;
                        const avatarSrc = profile?.avatar_url || `${AVATAR_FALLBACK}${profile?.username || comment.user_id}`;

                        return (
                            <div key={comment.id} className="flex gap-3 group">
                                <div className="w-9 h-9 border-2 border-ink bg-neutral-100 flex-shrink-0 overflow-hidden relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={avatarSrc} alt={profile?.username || "user"} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-mono font-bold text-xs text-ink">
                                            @{profile?.username || "anonymous"}
                                        </span>
                                        <span className="font-mono text-xs text-ink/40">{timeAgo(comment.created_at)}</span>
                                        {isOwn && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600"
                                                title="Delete comment"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="font-mono text-sm text-ink/80 leading-relaxed whitespace-pre-wrap break-words">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {hasMore && (
                        <button
                            onClick={() => fetchComments(comments.length)}
                            className="w-full py-2 font-mono text-xs font-bold uppercase text-ink/50 hover:text-ink border-2 border-dashed border-ink/20 hover:border-ink transition-all"
                        >
                            Load more comments
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
