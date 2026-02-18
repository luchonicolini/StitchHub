import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Sparkles } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { createBrowserClient } from "@supabase/ssr";
import { submitDesign, type DesignSubmission } from "@/lib/submitDesign";
import { useToast } from "@/hooks/useToast";

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

export function DesignUploadForm() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [promptContent, setPromptContent] = useState("");
    const [category, setCategory] = useState("");
    const [codeSnippet, setCodeSnippet] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showToast({ message: 'Please upload an image file', type: 'error' });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast({ message: 'Image must be less than 5MB', type: 'error' });
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showToast({ message: 'You must be logged in', type: 'error' });
            return;
        }

        if (!imageFile) {
            showToast({ message: 'Please upload an image', type: 'error' });
            return;
        }

        if (title.length < 3) {
            showToast({ message: 'Title must be at least 3 characters', type: 'error' });
            return;
        }

        if (promptContent.length < 50) {
            showToast({ message: 'Prompt must be at least 50 characters', type: 'error' });
            return;
        }

        if (!category) {
            showToast({ message: 'Please select a category', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const submission: DesignSubmission = {
                title,
                promptContent,
                category,
                codeSnippet: codeSnippet || undefined,
                imageFile
            };

            await submitDesign(submission, user.id, supabase);

            showToast({ message: 'Design published successfully! 🎉', type: 'success' });
            router.push('/');
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
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload */}
            <div>
                <label className="block font-mono font-bold text-sm uppercase text-ink mb-3">
                    Design Image *
                </label>

                {!imagePreview ? (
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
                            accept="image/*"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="w-16 h-16 mx-auto mb-4 text-ink/40" strokeWidth={2} />
                        <p className="font-mono text-ink font-bold mb-2">
                            Drop your image here or click to browse
                        </p>
                        <p className="font-mono text-xs text-ink/50">
                            JPG, PNG, or WebP • Max 5MB
                        </p>
                    </div>
                ) : (
                    <div className="relative border-4 border-ink bg-white p-4">
                        <button
                            type="button"
                            onClick={removeImage}
                            className="absolute top-6 right-6 bg-red-500 text-white p-2 border-2 border-ink shadow-hard hover:shadow-hard-sm transition-all z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <Image
                            src={imagePreview}
                            alt="Preview"
                            width={800}
                            height={600}
                            className="w-full h-auto border-2 border-ink"
                        />
                    </div>
                )}
            </div>

            {/* Title */}
            <div>
                <label className="block font-mono font-bold text-sm uppercase text-ink mb-3">
                    Title * <span className="text-ink/40 text-xs">({title.length}/100)</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                    placeholder="E-commerce Dashboard UI"
                    required
                    className="w-full bg-white border-4 border-ink px-6 py-4 font-mono text-lg text-ink placeholder:text-ink/40 focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block font-mono font-bold text-sm uppercase text-ink mb-3">
                    Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-3 font-mono font-bold text-sm border-3 transition-all ${category === cat
                                ? 'bg-primary border-ink text-ink shadow-hard'
                                : 'bg-white border-ink/30 text-ink/60 hover:border-ink hover:shadow-sm'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Prompt Content */}
            <div>
                <label className="block font-mono font-bold text-sm uppercase text-ink mb-3">
                    Stitch Prompt * <span className="text-ink/40 text-xs">({promptContent.length}/2000)</span>
                </label>
                <textarea
                    value={promptContent}
                    onChange={(e) => setPromptContent(e.target.value.slice(0, 2000))}
                    placeholder="Create a modern e-commerce dashboard with product analytics, sales charts, and inventory management. Use a clean, professional design with card-based layout..."
                    required
                    rows={8}
                    className="w-full bg-white border-4 border-ink px-6 py-4 font-mono text-sm text-ink placeholder:text-ink/40 focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none resize-none"
                />
                {promptContent.length < 50 && promptContent.length > 0 && (
                    <p className="mt-2 font-mono text-xs text-red-600">
                        Minimum 50 characters required
                    </p>
                )}
            </div>

            {/* Code Snippet (Optional) */}
            <div>
                <label className="block font-mono font-bold text-sm uppercase text-ink mb-3">
                    Code Snippet <span className="text-ink/40 text-xs">(Optional)</span>
                </label>
                <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="<div className='dashboard'>...</div>"
                    rows={6}
                    className="w-full bg-ink/5 border-3 border-ink/20 px-6 py-4 font-mono text-xs text-ink placeholder:text-ink/40 focus:ring-0 focus:border-ink focus:shadow-sm transition-all outline-none resize-none"
                />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={() => router.push('/')}
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
                            Publish Design
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
