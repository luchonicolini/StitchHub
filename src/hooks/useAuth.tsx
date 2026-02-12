"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";

interface AuthState {
    isAuthModalOpen: boolean;
    isAuthenticated: boolean;
    user: { username: string; email: string; id: string } | null;
    loading: boolean;
    returnUrl: string | null;
    openAuthModal: (returnUrl?: string) => void;
    closeAuthModal: () => void;
    login: (email: string, password: string) => Promise<{ error: string | null }>;
    register: (username: string, email: string, password: string) => Promise<{ error: string | null }>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
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
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', session.user.id)
                .single();

            set({
                isAuthenticated: true,
                user: {
                    id: session.user.id,
                    email: session.user.email!,
                    username: profile?.username || session.user.email!.split('@')[0]
                },
                loading: false
            });
        } else {
            set({ loading: false });
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', session.user.id)
                    .single();

                set({
                    isAuthenticated: true,
                    user: {
                        id: session.user.id,
                        email: session.user.email!,
                        username: profile?.username || session.user.email!.split('@')[0]
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
                .select('username')
                .eq('id', data.user.id)
                .single();

            set({
                isAuthenticated: true,
                user: {
                    id: data.user.id,
                    email: data.user.email!,
                    username: profile?.username || data.user.email!.split('@')[0]
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
                    username
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

    logout: async () => {
        await supabase.auth.signOut();
        set({
            isAuthenticated: false,
            user: null
        });
    }
}));

// Hook to initialize auth on app load
export function useAuthInitialize() {
    useEffect(() => {
        useAuth.getState().initialize();
    }, []);
}
