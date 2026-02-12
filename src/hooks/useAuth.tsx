"use client";

import { create } from "zustand";

interface AuthState {
    isAuthModalOpen: boolean;
    isAuthenticated: boolean;
    user: { username: string; email: string } | null;
    openAuthModal: () => void;
    closeAuthModal: () => void;
    login: (email: string, password: string) => void;
    register: (username: string, email: string, password: string) => void;
    logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
    isAuthModalOpen: false,
    isAuthenticated: false,
    user: null,

    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),

    login: (email: string, password: string) => {
        // TODO: Replace with actual API call
        console.log("Login attempt:", { email, password });

        // Mock login success
        set({
            isAuthenticated: true,
            user: { username: email.split("@")[0], email },
            isAuthModalOpen: false,
        });
    },

    register: (username: string, email: string, password: string) => {
        // TODO: Replace with actual API call
        console.log("Register attempt:", { username, email, password });

        // Mock registration success
        set({
            isAuthenticated: true,
            user: { username, email },
            isAuthModalOpen: false,
        });
    },

    logout: () => {
        set({
            isAuthenticated: false,
            user: null,
        });
    },
}));
