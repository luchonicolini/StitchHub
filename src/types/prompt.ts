// Core type definitions for the StitchHub application

export interface Author {
    name: string;
    avatar: string;
}

export type PinColor = "bg-primary" | "bg-accent-orange" | "bg-accent-green" | "bg-ink" | "bg-white";

export interface Prompt {
    id: string;
    title: string;
    tags: string[];
    prompt: string;
    author: Author;
    image: string;
    imageAlt: string;
    gallery?: string[];
    codeSnippet?: string;
    pinColor?: PinColor;
    rotation?: string;
    type?: "promo" | "card";
    isPinned?: boolean;
    likesCount?: number;
    isLikedByUser?: boolean;
    featured?: boolean;
}

export interface PromptCardProps {
    title: string;
    tags: string[];
    prompt: string;
    author: Author;
    image: string;
    imageAlt: string;
    gallery?: string[];
    pinColor?: PinColor;
    rotation?: string;
    featured?: boolean;
    onClick?: () => void;
    showActions?: boolean;
    onDelete?: () => void;
    likesCount?: number;
    isLikedByUser?: boolean;
    onToggleLike?: () => void;
    onTagClick?: (tag: string) => void;
}
