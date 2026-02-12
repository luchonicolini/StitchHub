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
    featured?: boolean;
    type?: "promo" | "card";
}

export interface PromptCardProps {
    title: string;
    tags: string[];
    prompt: string;
    author: Author;
    image: string;
    imageAlt: string;
    pinColor?: PinColor;
    rotation?: string;
    featured?: boolean;
    onClick?: () => void;
}
