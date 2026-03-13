"use client";

import { useState } from "react";
import { X, Loader2, Sparkles, Code2, Tag, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/useToast";
import { Prompt } from "@/types/prompt";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { uploadDesignImages } from "@/lib/uploadImage";

interface EditDesignModalProps {
    isOpen: boolean;
    onClose: () => void;
    design: Prompt;
    onSave: (updatedDesign: Partial<Prompt>) => void;
}

export function EditDesignModal({ isOpen, onClose, design, onSave }: EditDesignModalProps) {
    const { showToast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState(design.title);
    const [category, setCategory] = useState(design.tags[0] || "COMPONENT");
    const [promptContent, setPromptContent] = useState(design.prompt);
    const [codeSnippet, setCodeSnippet] = useState(design.codeSnippet || "");

    // Image State
    const [existingImages, setExistingImages] = useState<string[]>(
        design.gallery && design.gallery.length > 0 ? design.gallery : [design.image].filter(Boolean)
    );
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const MAX_IMAGES = 4;
    const [dragActive, setDragActive] = useState(false);

    if (!isOpen) return null;

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files: File[]) => {
        const currentTotal = existingImages.length + newImageFiles.length;
        const availableSlots = MAX_IMAGES - currentTotal;

        if (availableSlots <= 0) {
            showToast({ message: `Max ${MAX_IMAGES} images allowed`, type: 'error' });
            return;
        }

        const filesToAdd = files.slice(0, availableSlots);
        const validFiles: File[] = [];

        for (const file of filesToAdd) {
            if (!file.type.startsWith('image/')) {
                showToast({ message: `${file.name} is not an image`, type: 'error' });
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast({ message: `${file.name} size exceeds 5MB`, type: 'error' });
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            setNewImageFiles(prev => [...prev, ...validFiles]);

            validFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setNewImagePreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, idx) => idx !== index));
    };

    const removeNewImage = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, idx) => idx !== index));
        setNewImagePreviews(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Clean ID based on how we mapped it in ProfilePage ("db-123" -> "123")
            const cleanId = design.id.replace('db-', '');
            const idAsNumber = parseInt(cleanId, 10);

            // Prevent empty images error
            if (existingImages.length === 0 && newImageFiles.length === 0) {
                showToast({ message: "Upload at least one image.", type: "error" });
                setLoading(false);
                return;
            }

            let finalImageUrls = [...existingImages];

            // Upload any new images added
            if (newImageFiles.length > 0) {
                if (!user) throw new Error("Authentication required to upload images.");
                const uploadedUrls = await uploadDesignImages(newImageFiles, user.id, supabase);
                finalImageUrls = [...finalImageUrls, ...uploadedUrls];
            }

            // If it's a mock design (ID is not a number), simulate success locally
            if (isNaN(idAsNumber)) {
                onSave({
                    title,
                    tags: [category],
                    prompt: promptContent,
                    codeSnippet: codeSnippet,
                    image: finalImageUrls[0] || "",
                    gallery: finalImageUrls
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
                    code_snippet: codeSnippet,
                    image_url: finalImageUrls[0] || "",
                    image_urls: finalImageUrls
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
                codeSnippet: codeSnippet,
                image: finalImageUrls[0] || "",
                gallery: finalImageUrls
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

                        {/* Images Section */}
                        <div>
                            <label className="block font-black font-mono text-xs uppercase tracking-wider text-ink mb-2 flex items-center justify-between">
                                <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> Images</span>
                                <span className="text-ink/60 font-medium normal-case">({existingImages.length + newImageFiles.length}/{MAX_IMAGES})</span>
                            </label>
                            
                            {/* Previews Grid */}
                            {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    {/* Existing Images */}
                                    {existingImages.map((imgUrl, idx) => (
                                        <div key={`existing-${idx}`} className="relative border-3 border-ink bg-white aspect-video p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {idx === 0 && (
                                                <span className="absolute top-1 left-1 bg-accent-yellow text-ink text-[10px] font-black px-1.5 py-0.5 border-2 border-ink z-10 uppercase">Cover</span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 border-2 border-ink hover:bg-black transition-colors z-10"
                                            >
                                                <X className="w-3 h-3" strokeWidth={3} />
                                            </button>
                                            <div className="relative w-full h-full">
                                                <Image src={imgUrl} alt={`Uploaded ${idx + 1}`} fill className="object-cover" />
                                            </div>
                                        </div>
                                    ))}

                                    {/* New Images */}
                                    {newImagePreviews.map((preview, idx) => (
                                        <div key={`new-${idx}`} className="relative border-3 border-ink bg-white aspect-video p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {existingImages.length === 0 && idx === 0 && (
                                                <span className="absolute top-1 left-1 bg-accent-yellow text-ink text-[10px] font-black px-1.5 py-0.5 border-2 border-ink z-10 uppercase">Cover</span>
                                            )}
                                            <span className="absolute bottom-1 right-1 bg-accent-green text-white text-[10px] font-black px-1.5 py-0.5 border-2 border-ink z-10 uppercase">New</span>
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 border-2 border-ink hover:bg-black transition-colors z-10"
                                            >
                                                <X className="w-3 h-3" strokeWidth={3} />
                                            </button>
                                            <div className="relative w-full h-full">
                                                <Image src={preview} alt={`New Preview ${idx + 1}`} fill className="object-cover" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Upload Zone */}
                            {existingImages.length + newImageFiles.length < MAX_IMAGES && (
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative border-3 border-dashed ${dragActive ? 'border-accent-orange bg-accent-orange/10' : 'border-ink/40 hover:border-ink hover:bg-ink/5'
                                        } bg-background-light p-6 text-center transition-all cursor-pointer`}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileInput}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-ink/40" strokeWidth={2} />
                                    <p className="font-mono text-ink text-sm font-bold">
                                        Click or drag to add images
                                    </p>
                                </div>
                            )}
                        </div>

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
