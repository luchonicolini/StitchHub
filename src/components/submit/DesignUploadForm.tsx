"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Sparkles, ChevronDown, Globe, Lock, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { createBrowserClient } from "@supabase/ssr";
import { submitDesign, type DesignSubmission } from "@/lib/submitDesign";
import { useToast } from "@/hooks/useToast";
import { revalidateWorkshopAfterPublish } from "@/app/actions/workshop";

const CATEGORIES = [
    "Dashboard",
    "Mobile App",
    "Landing Page",
    "E-commerce",
    "Portfolio",
    "Blog",
    "SaaS",
    "Other"
];

const TOOLS: { name: string; label: string; color: string }[] = [
    { name: "Google Stitch", label: "Google Stitch", color: "bg-blue-100 border-blue-400 text-blue-800" },
    { name: "Claude Artifacts", label: "Claude Artifacts", color: "bg-orange-100 border-orange-400 text-orange-800" },
    { name: "v0 by Vercel", label: "v0 by Vercel", color: "bg-neutral-100 border-neutral-500 text-neutral-800" },
    { name: "Figma AI", label: "Figma AI", color: "bg-purple-100 border-purple-400 text-purple-800" },
    { name: "Cursor", label: "Cursor", color: "bg-green-100 border-green-400 text-green-800" },
    { name: "Other", label: "Other / Custom", color: "bg-yellow-100 border-yellow-400 text-yellow-800" },
];

const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function DesignUploadForm() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [promptContent, setPromptContent] = useState("");
    const [description, setDescription] = useState("");
    const [toolUsed, setToolUsed] = useState("");
    const [category, setCategory] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showCodeSnippet, setShowCodeSnippet] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Form dirty state check
    const hasUnsavedChanges = Boolean(
        title.trim() ||
        promptContent.trim() ||
        description.trim() ||
        codeSnippet.trim() ||
        imageFiles.length > 0
    );

    // Prevent accidental tab closure if unsaved changes exist
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

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
        const currentCount = imageFiles.length;
        const availableSlots = MAX_IMAGES - currentCount;

        if (availableSlots <= 0) {
            showToast({ message: `Max ${MAX_IMAGES} images allowed`, type: 'error' });
            return;
        }

        const filesToAdd = files.slice(0, availableSlots);
        const validFiles: File[] = [];

        for (const file of filesToAdd) {
            const mimeType = file.type.toLowerCase();

            // Strict format validation
            if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
                showToast({
                    message: `Invalid format: ${file.name}`,
                    description: 'Only JPG, PNG, and WebP images are allowed.',
                    type: 'error'
                });
                continue;
            }

            if (file.size > MAX_FILE_SIZE) {
                showToast({
                    message: `File too large: ${file.name}`,
                    description: 'Maximum file size allowed is 5MB.',
                    type: 'error'
                });
                continue;
            }
            validFiles.push(file);
        }

        if (validFiles.length > 0) {
            // Synchronous ObjectURL creation guarantees 1:1 exact array index ordering!
            const newPreviews = validFiles.map(file => URL.createObjectURL(file));

            setImageFiles(prev => [...prev, ...validFiles]);
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        // Clean up memory for ObjectURL
        if (imagePreviews[indexToRemove]) {
            URL.revokeObjectURL(imagePreviews[indexToRemove]);
        }
        setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleCancel = () => {
        if (hasUnsavedChanges) {
            setShowCancelModal(true);
        } else {
            router.push('/');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (imageFiles.length === 0) {
            showToast({ message: '⚠️ Missing Images', description: 'Please upload at least one screenshot of your design result.', type: 'error' });
            return;
        }

        if (!title.trim() || title.trim().length < 3) {
            showToast({ message: '⚠️ Title Required', description: 'Please enter a title with at least 3 characters.', type: 'error' });
            return;
        }

        if (!toolUsed) {
            showToast({ message: '⚠️ Tool Required', description: 'Please select the AI tool you used to generate this design.', type: 'error' });
            return;
        }

        if (!category) {
            showToast({ message: '⚠️ Category Required', description: 'Please select a category for your design.', type: 'error' });
            return;
        }

        if (!promptContent.trim() || promptContent.trim().length < 50) {
            showToast({ message: '⚠️ Prompt Too Short', description: 'The prompt must be at least 50 characters to be useful.', type: 'error' });
            return;
        }

        if (!user) {
            showToast({ message: '⚠️ Login Required', description: 'You must be logged in to publish designs.', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const submission: DesignSubmission = {
                title,
                promptContent,
                description: description || undefined,
                toolUsed,
                category,
                codeSnippet: codeSnippet || undefined,
                isPublic,
                imageFiles
            };

            await submitDesign(submission, user.id, supabase);

            if (isPublic) {
                try {
                    const { revalidated } = await revalidateWorkshopAfterPublish();
                    if (!revalidated) {
                        console.warn('The workshop cache could not be refreshed for this session.');
                    }
                } catch (revalidationError) {
                    // The design is already saved, so a cache refresh failure must
                    // not turn a successful publication into a failed submission.
                    console.error('Unable to refresh the workshop cache:', revalidationError);
                }
            }

            if (isPublic) {
                showToast({
                    message: 'Published to the workshop! 🎉',
                    description: 'Your prompt is now live for everyone in the community.',
                    type: 'success'
                });
            } else {
                showToast({
                    message: 'Saved to your private collection! 🔒',
                    description: 'Your prompt is safely stored in your private vault.',
                    type: 'success'
                });
            }

            // Redirect to user's profile to view their design
            router.push('/profile');
        } catch (error) {
            console.error('Submission error:', error);
            showToast({
                message: error instanceof Error ? error.message : 'Failed to publish design',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-10 relative z-20" noValidate>
                {/* Image Upload */}
                <div>
                    <label className="block font-mono font-bold text-sm uppercase text-ink mb-1 flex items-center justify-between">
                        <span>Result Screenshots *</span>
                        <span className="text-xs text-ink/40">({imageFiles.length}/{MAX_IMAGES})</span>
                    </label>
                    <p className="font-mono text-xs text-ink/50 mb-3">Upload screenshots of the UI generated by the AI tool using your prompt.</p>

                    {/* Previews Grid */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {imagePreviews.map((preview, idx) => (
                                <div key={`preview-${idx}`} className="relative border-4 border-ink bg-white aspect-video">
                                    {idx === 0 && (
                                        <span className="absolute top-2 left-2 bg-primary text-ink text-xs font-bold px-2 py-1 border-2 border-ink z-10">
                                            COVER
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 border-2 border-ink shadow-hard hover:shadow-hard-sm transition-all z-10"
                                        aria-label={`Remove image ${idx + 1}`}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <Image
                                        src={preview}
                                        alt={`Preview ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {imageFiles.length < MAX_IMAGES && (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`relative border-4 border-dashed ${dragActive ? 'border-primary bg-primary/10' : 'border-ink/30'
                                } bg-white p-12 text-center transition-all cursor-pointer hover:border-primary hover:bg-primary/5`}
                        >
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                multiple
                                onChange={handleFileInput}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                aria-label="Upload screenshots"
                            />
                            <Upload className="w-16 h-16 mx-auto mb-4 text-ink/40" strokeWidth={2} />
                            <p className="font-mono text-ink font-bold mb-2">
                                Drop files here or click to browse
                            </p>
                            <p className="font-mono text-xs text-ink/50">
                                JPG, PNG, or WebP • Max 5MB per file
                            </p>
                        </div>
                    )}
                </div>

                {/* Title */}
                <div>
                    <label htmlFor="title-input" className="block font-mono font-bold text-sm uppercase text-ink mb-3">
                        Title * <span className="text-ink/40 text-xs">({title.length}/100)</span>
                    </label>
                    <input
                        id="title-input"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                        placeholder="E.g. Dark Mode SaaS Dashboard with Glassmorphism"
                        required
                        className="w-full bg-white border-4 border-ink px-6 py-4 font-mono text-lg text-ink placeholder:text-ink/40 focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none"
                    />
                </div>

                {/* Tool Used */}
                <div>
                    <label className="block font-mono font-bold text-sm uppercase text-ink mb-1">
                        AI Tool Used *
                    </label>
                    <p className="font-mono text-xs text-ink/50 mb-3">Which tool did you use to generate this UI?</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {TOOLS.map((tool) => {
                            const isSelected = toolUsed === tool.name;
                            return (
                                <button
                                    key={tool.name}
                                    type="button"
                                    onClick={() => setToolUsed(tool.name)}
                                    aria-pressed={isSelected}
                                    className={`px-4 py-3 font-mono font-bold text-sm border-3 transition-all text-left flex items-center gap-2 ${isSelected
                                        ? 'bg-ink border-ink text-white shadow-hard'
                                        : 'bg-white border-ink/30 text-ink/70 hover:border-ink hover:shadow-sm'
                                        }`}
                                >
                                    {isSelected && (
                                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                                    )}
                                    {tool.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block font-mono font-bold text-sm uppercase text-ink mb-3">
                        Category *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {CATEGORIES.map((cat) => {
                            const isSelected = category === cat;
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setCategory(cat)}
                                    aria-pressed={isSelected}
                                    className={`px-4 py-3 font-mono font-bold text-sm border-3 transition-all ${isSelected
                                        ? 'bg-primary border-ink text-ink shadow-hard'
                                        : 'bg-white border-ink/30 text-ink/60 hover:border-ink hover:shadow-sm'
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Visibility Selector (Public vs Private) */}
                <div>
                    <label className="block font-mono font-bold text-sm uppercase text-ink mb-1">
                        Visibility *
                    </label>
                    <p className="font-mono text-xs text-ink/50 mb-3">Choose whether your prompt is public to the community or private to you.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setIsPublic(true)}
                            aria-pressed={isPublic === true}
                            className={`p-4 border-3 text-left font-mono transition-all flex items-start gap-3 ${isPublic
                                ? 'bg-primary border-ink shadow-hard text-ink'
                                : 'bg-white border-ink/30 text-ink/60 hover:border-ink hover:shadow-sm'
                                }`}
                        >
                            <Globe className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-sm uppercase">🌐 Public Workshop</p>
                                <p className="text-xs text-ink/60 mt-0.5">Visible to everyone. Appears in search, feed, and trending lists.</p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsPublic(false)}
                            aria-pressed={isPublic === false}
                            className={`p-4 border-3 text-left font-mono transition-all flex items-start gap-3 ${!isPublic
                                ? 'bg-ink border-ink shadow-hard text-white'
                                : 'bg-white border-ink/30 text-ink/60 hover:border-ink hover:shadow-sm'
                                }`}
                        >
                            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-orange" />
                            <div>
                                <p className="font-bold text-sm uppercase">🔒 Private Vault</p>
                                <p className={`text-xs mt-0.5 ${!isPublic ? 'text-white/70' : 'text-ink/60'}`}>Only visible to you in your personal profile. Hidden from the public feed.</p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Prompt Content */}
                <div>
                    <label htmlFor="prompt-input" className="block font-mono font-bold text-sm uppercase text-ink mb-1">
                        The Prompt * <span className="text-ink/40 text-xs">({promptContent.length}/10000)</span>
                    </label>
                    <p className="font-mono text-xs text-ink/50 mb-3">
                        Paste the exact prompt you used in {toolUsed || "the AI tool"}. The more detailed, the more useful for the community.
                    </p>
                    <textarea
                        id="prompt-input"
                        value={promptContent}
                        onChange={(e) => setPromptContent(e.target.value.slice(0, 10000))}
                        placeholder={`Create a modern SaaS analytics dashboard with the following requirements:\n\n1. Dark mode color scheme with deep navy (#0F172A) background\n2. Sidebar navigation with collapsible sections\n3. KPI cards showing MRR, Churn Rate, Active Users and NPS score\n4. Interactive line chart for revenue over the last 12 months\n5. Data table with sortable columns and pagination`}
                        required
                        rows={10}
                        className="w-full bg-white border-4 border-ink px-6 py-4 font-mono text-sm text-ink placeholder:text-ink/40 focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none resize-none"
                    />
                    {promptContent.length < 50 && promptContent.length > 0 ? (
                        <p className="font-mono text-xs text-red-600 mt-2">
                            Minimum 50 characters required
                        </p>
                    ) : null}
                </div>

                {/* Process Description (Optional) */}
                <div>
                    <label htmlFor="description-input" className="block font-mono font-bold text-sm uppercase text-ink mb-1">
                        Process & Notes <span className="text-ink/40 text-xs">(Optional)</span>
                    </label>
                    <p className="font-mono text-xs text-ink/50 mb-3">
                        Share tips, iterations, or context about what worked and what didn&apos;t.
                    </p>
                    <textarea
                        id="description-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value.slice(0, 2000))}
                        placeholder={`I tried several variations before landing on this. Key insights:\n\n- Specifying hex colors helped avoid generic palettes\n- Adding "glassmorphism effect" gave much better results than "transparent cards"`}
                        rows={6}
                        className="w-full bg-white border-4 border-ink/30 px-6 py-4 font-mono text-sm text-ink placeholder:text-ink/30 focus:ring-0 focus:border-ink focus:shadow-sm transition-all outline-none resize-none"
                    />
                    <p className="font-mono text-xs text-ink/40 mt-1 text-right">{description.length}/2000</p>
                </div>

                {/* Code Snippet (Optional, collapsible) */}
                <div>
                    <button
                        type="button"
                        onClick={() => setShowCodeSnippet(prev => !prev)}
                        aria-expanded={showCodeSnippet}
                        className="flex items-center gap-2 font-mono font-bold text-sm text-ink/60 hover:text-ink transition-colors mb-3"
                    >
                        <ChevronDown className={`w-4 h-4 transition-transform ${showCodeSnippet ? 'rotate-180' : ''}`} />
                        {showCodeSnippet ? 'Hide Code Snippet' : '+ Add Code Snippet'} <span className="text-xs text-ink/40">(Optional)</span>
                    </button>

                    {showCodeSnippet && (
                        <div id="codeSnippetContainer">
                            <label htmlFor="code-snippet-input" className="sr-only">Code Snippet</label>
                            <p className="font-mono text-xs text-ink/50 mb-3">Paste the generated HTML/JSX/CSS if you want to show the code output.</p>
                            <textarea
                                id="code-snippet-input"
                                value={codeSnippet}
                                onChange={(e) => setCodeSnippet(e.target.value)}
                                placeholder={'<div className="dashboard">\n  <aside className="sidebar">...</aside>\n</div>'}
                                rows={8}
                                className="w-full bg-ink/5 border-3 border-ink/20 px-6 py-4 font-mono text-xs text-ink placeholder:text-ink/40 focus:ring-0 focus:border-ink focus:shadow-sm transition-all outline-none resize-none"
                            />
                        </div>
                    )}
                </div>

                {/* Submit Button Area */}
                <div className="flex gap-4 pt-4 border-t-4 border-ink">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-8 py-4 bg-white border-4 border-ink font-mono font-black uppercase text-sm text-ink shadow-hard hover:shadow-hard-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-8 py-4 bg-accent-green border-4 border-ink font-mono font-black uppercase text-sm text-white shadow-hard hover:shadow-hard-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>Processing...</>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                {isPublic ? 'Publish to Workshop' : 'Save to Private Vault'}
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="bg-white border-4 border-ink p-6 max-w-md w-full shadow-hard space-y-4">
                        <div className="flex items-center gap-3 text-amber-600">
                            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                            <h3 className="font-black text-lg uppercase text-ink">Discard unsaved changes?</h3>
                        </div>
                        <p className="font-mono text-sm text-ink/70">
                            You have entered information in this form. If you cancel now, your unsaved changes will be lost.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 py-3 bg-white border-2 border-ink font-mono font-bold text-xs uppercase hover:bg-gray-100 transition-colors"
                            >
                                Keep Editing
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/')}
                                className="flex-1 py-3 bg-red-600 border-2 border-ink font-mono font-bold text-xs uppercase text-white shadow-sm hover:bg-red-700 transition-colors"
                            >
                                Discard & Exit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
