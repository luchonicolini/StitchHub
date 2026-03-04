"use client";

import { useState } from "react";
import { X, Loader2, Sparkles, Code2, Tag } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { Prompt } from "@/types/prompt";
import { supabase } from "@/lib/supabase";

interface EditDesignModalProps {
    isOpen: boolean;
    onClose: () => void;
    design: Prompt;
    onSave: (updatedDesign: Partial<Prompt>) => void;
}

export function EditDesignModal({ isOpen, onClose, design, onSave }: EditDesignModalProps) {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState(design.title);
    const [category, setCategory] = useState(design.tags[0] || "COMPONENT");
    const [promptContent, setPromptContent] = useState(design.prompt);
    const [codeSnippet, setCodeSnippet] = useState(design.codeSnippet || "");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Clean ID based on how we mapped it in ProfilePage ("db-123" -> "123")
            const cleanId = design.id.replace('db-', '');
            const idAsNumber = parseInt(cleanId, 10);

            // If it's a mock design (ID is not a number), simulate success locally
            if (isNaN(idAsNumber)) {
                onSave({
                    title,
                    tags: [category],
                    prompt: promptContent,
                    codeSnippet: codeSnippet
                });
                showToast({ message: "Mock design updated locally!", type: "success" });
                onClose();
                return;
            }

            // Update database for real designs
            const { error } = await supabase
                .from('designs')
                .update({
                    title,
                    category,
                    prompt_content: promptContent,
                    code_snippet: codeSnippet
                })
                .eq('id', idAsNumber);

            if (error) {
                console.error("Error updating design:", error);
                showToast({ message: "Failed to update design", type: "error" });
                return;
            }

            // Call onSave with updated partial data so ProfilePage can update UI safely
            onSave({
                title,
                tags: [category],
                prompt: promptContent,
                codeSnippet: codeSnippet
            });

            showToast({ message: "Design updated successfully!", type: "success" });
            onClose();
        } catch (error) {
            console.error('Error in edit modal submit:', error);
            showToast({ message: "An unexpected error occurred", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-4 border-ink bg-accent-yellow sticky top-0 z-10 shrink-0">
                    <h2 className="font-black text-xl uppercase text-ink flex items-center gap-2">
                        <Sparkles className="w-5 h-5 fill-ink" />
                        Edit Design
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-black hover:text-white transition-colors border-2 border-ink text-ink rounded-sm"
                        type="button"
                    >
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                {/* Scrollable Form Body */}
                <form onSubmit={handleSubmit} className="flex flex-col overflow-y-auto">
                    <div className="p-6 space-y-6">

                        {/* Title Input */}
                        <div>
                            <label className="block font-black font-mono text-xs uppercase tracking-wider text-ink mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full bg-background-light border-3 border-ink px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:ring-none focus:border-accent-orange focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                placeholder="E.g. Neon Dashboard"
                            />
                        </div>

                        {/* Category Input */}
                        <div>
                            <label className="block font-black font-mono text-xs uppercase tracking-wider text-ink mb-2 flex items-center gap-1.5">
                                <Tag className="w-4 h-4" /> Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-background-light border-3 border-ink px-4 py-3 font-mono text-sm text-ink focus:outline-none focus:ring-none focus:border-accent-orange focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none uppercase"
                            >
                                <option value="UI/UX">UI/UX</option>
                                <option value="COMPONENT">Component</option>
                                <option value="PAGE">Page</option>
                                <option value="APP">App</option>
                                <option value="DASHBOARD">Dashboard</option>
                                <option value="EXPERIMENTAL">Experimental</option>
                            </select>
                        </div>

                        {/* Prompt Input */}
                        <div>
                            <label className="block font-black font-mono text-xs uppercase tracking-wider text-ink mb-2 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" /> The Prompt
                            </label>
                            <textarea
                                value={promptContent}
                                onChange={(e) => setPromptContent(e.target.value)}
                                required
                                rows={5}
                                className="w-full bg-background-light border-3 border-ink px-4 py-3 font-mono text-sm leading-relaxed text-ink focus:outline-none focus:ring-none focus:border-accent-orange focus:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-y"
                                placeholder="Describe the design to the AI..."
                            />
                        </div>

                        {/* Code Snippet Input */}
                        <div>
                            <label className="block font-black font-mono text-xs uppercase tracking-wider text-ink mb-2 flex items-center gap-1.5">
                                <Code2 className="w-4 h-4" /> Code Snippet (Optional)
                            </label>
                            <textarea
                                value={codeSnippet}
                                onChange={(e) => setCodeSnippet(e.target.value)}
                                rows={6}
                                className="w-full bg-ink text-white border-3 border-ink px-4 py-3 font-mono text-xs leading-relaxed focus:outline-none focus:ring-none focus:border-accent-orange shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-all resize-y"
                                placeholder="<div className='flex...'></div>"
                            />
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t-4 border-ink bg-gray-50 flex justify-end gap-4 shrink-0 mt-auto">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-6 py-3 bg-white border-3 border-ink font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all disabled:opacity-50 text-ink"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-primary text-ink border-3 border-ink font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Saving...' : 'Save Design'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
