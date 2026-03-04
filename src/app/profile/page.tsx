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
import { EditDesignModal } from "@/components/profile/EditDesignModal";
import { Footer } from "@/components/workshop/Footer";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";



export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [myDesigns, setMyDesigns] = useState<Prompt[]>([]);
    const [userLikes, setUserLikes] = useState<Set<number>>(new Set());

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

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [designToEdit, setDesignToEdit] = useState<Prompt | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    // Fetch user likes
    useEffect(() => {
        if (!user) {
            setUserLikes(new Set());
            return;
        }

        const fetchUserLikes = async () => {
            try {
                const { data, error } = await supabase
                    .from('likes')
                    .select('design_id')
                    .eq('user_id', user.id);

                if (error) throw error;
                if (data) {
                    setUserLikes(new Set(data.map(l => l.design_id)));
                } // Remove empty blocks
            } catch (err) {
                console.error("Error fetching user likes:", err);
            }
        };

        fetchUserLikes();
    }, [user, supabase]);

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
                    is_pinned: boolean;
                    likes_count: number;
                }

                // Transform to Prompt type
                const designs: Prompt[] = (data as unknown as DesignDB[]).map((d, index) => ({
                    id: String(d.id), // Ensure string ID for Prompt type
                    title: d.title,
                    tags: [d.category || 'Design'],
                    prompt: d.prompt_content,
                    author: {
                        name: user.username,
                        avatar: user.avatar_url || "/images/default-avatar.png"
                    },
                    image: d.image_url || '',
                    imageAlt: d.title,
                    codeSnippet: d.code_snippet,
                    pinColor: "bg-white",
                    rotation: index % 2 === 0 ? "rotate-1" : "-rotate-1",
                    type: "card",
                    isPinned: d.is_pinned || false,
                    likesCount: d.likes_count || 0
                }));

                // Sort: pinned designs first, then by created_at (which is already done by the query)
                designs.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return 0;
                });

                setMyDesigns(designs);
            } catch (err) {
                console.error("Error fetching user designs:", err);
            } finally {
                setLoadingDesigns(false);
            }
        }

        if (user?.id) {
            fetchUserDesigns();
        }
    }, [user?.id, user?.username, user?.avatar_url]); // dependencies updated to avoid loops

    const handleEditClick = (design: Prompt) => {
        setDesignToEdit(design);
        setEditModalOpen(true);
    };

    const handleEditSave = (updatedDesign: Partial<Prompt>) => {
        setMyDesigns(prev => prev.map(d => {
            if (d.id === designToEdit?.id) {
                return { ...d, ...updatedDesign };
            }
            return d;
        }));
    };

    const handleTogglePin = async (design: Prompt) => {
        // Optimistic update
        const newPinnedState = !design.isPinned;

        setMyDesigns(prev => {
            const updated = prev.map(d =>
                d.id === design.id ? { ...d, isPinned: newPinnedState } : d
            );
            // Re-sort so pinned items jump to top immediately
            return updated.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                return 0;
            });
        });

        // Clean ID
        const cleanId = design.id.replace('db-', '');
        const idAsNumber = parseInt(cleanId, 10);

        if (isNaN(idAsNumber)) {
            showToast({ message: newPinnedState ? "Design pinned!" : "Design unpinned", type: "success" });
            return;
        }

        try {
            const { error } = await supabase
                .from('designs')
                .update({ is_pinned: newPinnedState })
                .eq('id', idAsNumber);

            if (error) throw error;

            showToast({ message: newPinnedState ? "Design pinned!" : "Design unpinned", type: "success" });
        } catch (err) {
            console.error("Error toggling pin:", err);
            showToast({ message: "Failed to pin design", type: "error" });
            // Revert optimistic update on failure
            setMyDesigns(prev => {
                const reverted = prev.map(d =>
                    d.id === design.id ? { ...d, isPinned: !newPinnedState } : d
                );
                return reverted.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return 0;
                });
            });
        }
    };

    const handleToggleLike = async (design: Prompt) => {
        if (!user) return;

        const numericId = parseInt(design.id.replace('db-', ''), 10);
        if (isNaN(numericId)) return;

        const isCurrentlyLiked = userLikes.has(numericId);

        // Optimistic update
        setUserLikes(prev => {
            const next = new Set(prev);
            if (isCurrentlyLiked) next.delete(numericId);
            else next.add(numericId);
            return next;
        });

        setMyDesigns(prev => prev.map(d => {
            if (d.id === design.id) {
                return {
                    ...d,
                    likesCount: Math.max(0, (d.likesCount || 0) + (isCurrentlyLiked ? -1 : 1))
                };
            }
            return d;
        }));

        try {
            if (isCurrentlyLiked) {
                const { error } = await supabase
                    .from('likes')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('design_id', numericId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('likes')
                    .insert({ user_id: user.id, design_id: numericId });
                if (error) throw error;
            }
        } catch (err) {
            console.error("Error toggling like:", err);
            // Revert
            setUserLikes(prev => {
                const next = new Set(prev);
                if (isCurrentlyLiked) next.add(numericId);
                else next.delete(numericId);
                return next;
            });
            setMyDesigns(prev => prev.map(d => {
                if (d.id === design.id) {
                    return {
                        ...d,
                        likesCount: Math.max(0, (d.likesCount || 0) + (isCurrentlyLiked ? 1 : -1))
                    };
                }
                return d;
            }));
        }
    };

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
                                    onEdit={() => handleEditClick(item)}
                                    onTogglePin={() => handleTogglePin(item)}
                                    isLikedByUser={userLikes.has(parseInt(item.id.replace('db-', ''), 10))}
                                    onToggleLike={() => handleToggleLike(item)}
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

                {/* Edit Design Modal */}
                {designToEdit && (
                    <EditDesignModal
                        isOpen={editModalOpen}
                        onClose={() => {
                            setEditModalOpen(false);
                            setTimeout(() => setDesignToEdit(null), 200); // fade out
                        }}
                        design={designToEdit}
                        onSave={handleEditSave}
                    />
                )}
            </main>
            <Footer />
        </div>
    );
}
