"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Heart, UserPlus, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";

interface Notification {
    id: string;
    type: 'like' | 'follow' | 'comment';
    entity_id: string | null;
    is_read: boolean;
    created_at: string;
    actor: {
        username: string;
        avatar_url: string | null;
    };
}

export function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch initial notifications
    useEffect(() => {
        if (!user) return;

        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select(`
                    id, type, entity_id, is_read, created_at,
                    actor:profiles!notifications_actor_id_fkey(username, avatar_url)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                console.error("Error fetching notifications:", error);
                return;
            }

            // Map the data to our interface
            const formattedData = (data as any[]).map(n => ({
                id: n.id,
                type: n.type,
                entity_id: n.entity_id,
                is_read: n.is_read,
                created_at: n.created_at,
                actor: {
                    username: n.actor?.username || 'Unknown',
                    avatar_url: n.actor?.avatar_url || null,
                }
            }));

            setNotifications(formattedData);
            setUnreadCount(formattedData.filter(n => !n.is_read).length);
        };

        fetchNotifications();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                () => {
                    // Refetch when a new notification arrives to ensure we get joined profile data
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        if (!user) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);
    };

    const markAllAsRead = async () => {
        if (!user || unreadCount === 0) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'like': return <Heart className="w-4 h-4 text-accent-magenta fill-accent-magenta" />;
            case 'follow': return <UserPlus className="w-4 h-4 text-primary" />;
            case 'comment': return <MessageSquare className="w-4 h-4 text-accent-cyan" />;
            default: return <Bell className="w-4 h-4 text-ink" />;
        }
    };

    const getMessage = (type: string, username: string) => {
        switch (type) {
            case 'like': return <><span className="font-bold">{username}</span> liked your design</>;
            case 'follow': return <><span className="font-bold">{username}</span> started following you</>;
            case 'comment': return <><span className="font-bold">{username}</span> commented on your design</>;
            default: return <><span className="font-bold">{username}</span> interacted with you</>;
        }
    };

    const getLink = (type: string, entity_id: string | null, username: string) => {
        if (type === 'follow') return `/profile/${username}`;
        if (type === 'like' && entity_id) return `/design/${entity_id}`;
        return '#';
    };

    const formatTimestamp = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    if (!user) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 bg-white border-2 border-ink hover:bg-accent-yellow transition-all hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)] group"
                title="Notifications"
            >
                <Bell className="w-5 h-5 text-ink group-hover:-translate-x-0.5 transition-transform" />
                
                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[100] flex flex-col max-h-[85vh]">
                    <div className="flex items-center justify-between p-4 border-b-4 border-ink bg-accent-yellow sticky top-0 shrink-0">
                        <h3 className="font-black text-lg uppercase text-ink flex items-center gap-2">
                            <Bell className="w-5 h-5 fill-ink" />
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs font-bold font-mono text-ink/70 hover:text-ink underline decoration-2 underline-offset-2"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="overflow-y-auto flex-col flex bg-background-light">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-ink/60 font-mono text-sm">
                                You have no notifications yet.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <Link 
                                    href={getLink(notif.type, notif.entity_id, notif.actor.username)}
                                    key={notif.id}
                                    onClick={() => {
                                        if (!notif.is_read) markAsRead(notif.id);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-start gap-4 p-4 border-b-2 border-ink/20 hover:bg-white transition-colors relative cursor-pointer ${!notif.is_read ? 'bg-white' : ''}`}
                                >
                                    {/* Unread Indicator */}
                                    {!notif.is_read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-orange" />
                                    )}

                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-10 h-10 rounded-full border-2 border-ink overflow-hidden bg-gray-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img 
                                                src={notif.actor.avatar_url || '/images/default-avatar.png'} 
                                                alt={notif.actor.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-white border-2 border-ink rounded-full p-0.5">
                                            {getIcon(notif.type)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm text-ink ${!notif.is_read ? 'font-medium' : ''} pr-4 leading-snug`}>
                                            {getMessage(notif.type, notif.actor.username)}
                                        </p>
                                        <p className="text-xs text-ink/50 font-mono mt-1 font-bold">
                                            {formatTimestamp(notif.created_at)}
                                        </p>
                                    </div>
                                    
                                    {/* Read Circle Toggle */}
                                    {!notif.is_read && (
                                        <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-accent-orange border border-ink self-center" />
                                    )}
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
