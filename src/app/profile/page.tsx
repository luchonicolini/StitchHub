"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileProjectCard } from "@/components/profile/ProfileProjectCard";
import { NewDesignCard } from "@/components/profile/NewDesignCard";
import { Prompt } from "@/types/prompt";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { CardDetailModal } from "@/components/workshop/CardDetailModal";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { Footer } from "@/components/workshop/Footer";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";



export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [myDesigns, setMyDesigns] = useState<Prompt[]>([]);

    // Create Supabase client locally to ensure fresh session, wrapped in useState for stability
    const [supabase] = useState(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ));
    const [loadingDesigns, setLoadingDesigns] = useState(true);
    const [selectedCard, setSelectedCard] = useState<Prompt | null>(null);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [designToDelete, setDesignToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Fetch user designs
    useEffect(() => {
        async function fetchUserDesigns() {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('designs')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;

                interface DesignDB {
                    id: number;
                    title: string;
                    category: string;
                    prompt_content: string;
                    image_url: string;
                    code_snippet: string;
                    created_at: string;
                    user_id: string;
                }

                // Transform to Prompt type
                const designs: Prompt[] = (data as unknown as DesignDB[]).map((d, index) => ({
                    id: String(d.id), // Ensure string ID for Prompt type
                    title: d.title,
                    tags: [d.category || 'Design'],
                    prompt: d.prompt_content,
                    author: {
                        name: user.username,
                        avatar: user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                    },
                    image: d.image_url || '',
                    imageAlt: d.title,
                    codeSnippet: d.code_snippet,
                    pinColor: "bg-white",
                    rotation: index % 2 === 0 ? "rotate-1" : "-rotate-1",
                    type: "card"
                }));

                setMyDesigns(designs);
            } catch (err) {
                console.error("Error fetching user designs:", err);
            } finally {
                setLoadingDesigns(false);
            }
        }

        if (user) {
            fetchUserDesigns();
        }
    }, [user, supabase]); // dependencies updated

    const handleDeleteClick = (id: string) => {
        setDesignToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!designToDelete) return;
        setIsDeleting(true);

        // ID formats: "db-123" or "123".
        const cleanId = designToDelete.replace('db-', '');

        try {
            const { error } = await supabase
                .from('designs')
                .delete()
                .eq('id', cleanId);

            if (error) throw error;

            setMyDesigns(prev => prev.filter(d => d.id !== designToDelete));
            showToast({ message: "Design deleted", type: "success" });
            setDeleteModalOpen(false);
        } catch (err) {
            console.error("Error deleting design:", err);
            showToast({ message: "Failed to delete design", type: "error" });
        } finally {
            setIsDeleting(false);
            setDesignToDelete(null);
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <Loader2 className="w-8 h-8 animate-spin text-ink" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background-light">
            <WorkshopHeader showSearch={false} />
            <main className="flex-grow">
                <ProfileHeader
                    totalDesigns={myDesigns.length}
                />

                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end gap-6 md:gap-8 overflow-visible px-4">
                        <div className="flex flex-row items-center gap-4 shrink-0">
                            <h2 className="font-black text-5xl md:text-7xl uppercase text-ink leading-none transform -skew-x-[3deg]">
                                My Collection
                            </h2>
                            <div className="bg-accent-yellow text-ink text-sm md:text-base font-black px-4 py-2 border-4 border-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-[12deg] z-10 hover:rotate-6 transition-transform cursor-default translate-y-[-0.5rem] md:translate-y-[-1rem]">
                                {myDesigns.length} ITEMS
                            </div>
                        </div>
                        {/* Thick Line Separator */}
                        <div className="h-4 flex-1 bg-ink shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] w-full block mt-2 md:mt-0 md:translate-y-[-0.5rem] rounded-r-full"></div>
                    </div>

                    {loadingDesigns ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-ink/30" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12">
                            {/* Always show New Design Card first or last? The design implies it's part of the collection */}
                            {myDesigns.map((item) => (
                                <ProfileProjectCard
                                    key={item.id}
                                    {...item}
                                    onClick={() => setSelectedCard(item)}
                                    onDelete={() => handleDeleteClick(item.id)}
                                    onEdit={() => showToast({ message: "Edit feature coming soon!", type: "info" })}
                                />
                            ))}
                            <NewDesignCard />
                        </div>
                    )}
                </div>

                {/* Detail Modal */}
                {selectedCard && (
                    <CardDetailModal
                        card={selectedCard}
                        onClose={() => setSelectedCard(null)}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    loading={isDeleting}
                />
            </main>
            <Footer />
        </div>
    );
}
