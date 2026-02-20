"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

interface AuthState {
    isAuthModalOpen: boolean;
    isAuthenticated: boolean;
    user: { username: string; email: string; id: string; avatar_url: string | null } | null;
    loading: boolean;
    returnUrl: string | null;
    openAuthModal: (returnUrl?: string) => void;
    closeAuthModal: () => void;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    register: (username: string, email: string, password: string) => Promise<{ error: string | null }>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (username: string) => Promise<{ error: string | null }>;
    resetPassword: (email: string) => Promise<{ error: string | null }>;
    updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
    initialize: () => Promise<{ unsubscribe: () => void }>;
}

export const useAuth = create<AuthState>((set, get) => ({
    isAuthModalOpen: false,
    isAuthenticated: false,
    user: null,
    loading: true,
    returnUrl: null,

    openAuthModal: (returnUrl?: string) => set({ isAuthModalOpen: true, returnUrl: returnUrl || null }),
    closeAuthModal: () => set({ isAuthModalOpen: false, returnUrl: null }),

    initialize: async () => {
        try {
            // Get initial session
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;

            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', session.user.id)
                    .single();

                set({
                    isAuthenticated: true,
                    user: {
                        id: session.user.id,
                        email: session.user.email!,
                        username: profile?.username || session.user.email!.split('@')[0],
                        avatar_url: profile?.avatar_url || null
                    },
                    loading: false
                });
            } else {
                set({ loading: false });
            }
        } catch (error) {
            console.error("Auth initialization error:", error);
            set({ loading: false });
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', session.user.id)
                    .single();

                set({
                    isAuthenticated: true,
                    user: {
                        id: session.user.id,
                        email: session.user.email!,
                        username: profile?.username || session.user.email!.split('@')[0],
                        avatar_url: profile?.avatar_url || null
                    }
                });
            } else {
                set({
                    isAuthenticated: false,
                    user: null
                });
            }
        });

        return subscription;
    },

    login: async (email: string, password: string) => {
        console.log('Attempting login...', { email });
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        console.log('Login result:', { data, error });

        if (error) {
            console.error('Login error:', error);
            return { error: error.message };
        }

        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, avatar_url')
                .eq('id', data.user.id)
                .single();

            set({
                isAuthenticated: true,
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                    username: profile?.username || data.user.email!.split('@')[0],
                    avatar_url: profile?.avatar_url || null
                }
            });
        }

        return { error: null };
    },

    register: async (username: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    full_name: username
                }
            }
        });

        if (error) {
            return { error: error.message };
        }

        // The trigger will create the profile automatically
        // We just need to update the username if needed
        if (data.user) {
            // Wait a bit for the trigger to complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Update username in profile
            await supabase
                .from('profiles')
                .update({ username })
                .eq('id', data.user.id);

            set({
                isAuthenticated: true,
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                    username,
                    avatar_url: null
                }
            });
        }

        return { error: null };
    },

    loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });

        if (error) {
            console.error('Google login error:', error);
        }
    },

    updateProfile: async (username: string) => {
        try {
            const user = get().user;
            if (!user) return { error: "No user logged in" };

            const { error } = await supabase
                .from('profiles')
                .update({ username })
                .eq('id', user.id);

            if (error) {
                // Check for unique violation (Postgres code 23505)
                if (error.code === '23505') {
                    return { error: "Username is already taken" };
                }
                return { error: error.message };
            }

            // Update local state
            set({
                user: {
                    ...user,
                    username
                }
            });

            return { error: null };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "An unexpected error occurred";
            return { error: message };
        }
    },

    logout: async () => {
        await supabase.auth.signOut();
        set({
            isAuthenticated: false,
            user: null
        });
    },

    resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?type=recovery`
        });
        if (error) return { error: error.message };
        return { error: null };
    },

    updatePassword: async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { error: error.message };
        return { error: null };
    }
}));

// Hook to initialize auth on app load
export function useAuthInitialize() {
    useEffect(() => {
        useAuth.getState().initialize();
    }, []);
}
