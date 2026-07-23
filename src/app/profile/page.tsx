"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileProjectCard } from "@/components/profile/ProfileProjectCard";
import { NewDesignCard } from "@/components/profile/NewDesignCard";
import { Prompt } from "@/types/prompt";
import { DesignDB, mapDesignToPrompt } from "@/types/design";
import { Bookmark, LayoutGrid, Loader2, Pin, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { CardDetailModal } from "@/components/workshop/CardDetailModal";
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal";
import { EditDesignModal } from "@/components/profile/EditDesignModal";
import { Footer } from "@/components/workshop/Footer";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";
import { deleteDesignImages } from "@/lib/uploadImage";



export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const authToastShown = useRef(false);
    const [myDesigns, setMyDesigns] = useState<Prompt[]>([]);
    const [savedDesigns, setSavedDesigns] = useState<Prompt[]>([]);
    const [userLikes, setUserLikes] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState<"designs" | "saved" | "pinned">("designs");

    const [loadingDesigns, setLoadingDesigns] = useState(true);
    const [loadingSaved, setLoadingSaved] = useState(true);
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

    useEffect(() => {
        if (user && searchParams.get("auth") === "success" && !authToastShown.current) {
            authToastShown.current = true;
            showToast({
                message: "Signed in successfully",
                description: "Welcome to StitchHub. Your profile is ready!",
                type: "success",
            });
            router.replace("/profile", { scroll: false });
        }
    }, [router, searchParams, showToast, user]);

    // Fetch user likes
    useEffect(() => {
        if (!user) {
            setUserLikes(new Set());
            setSavedDesigns([]);
            setLoadingSaved(false);
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
                    const likedIds = data.map(l => l.design_id);
                    setUserLikes(new Set(likedIds));

                    if (likedIds.length === 0) {
                        setSavedDesigns([]);
                        return;
                    }

                    const { data: designs, error: designsError } = await supabase
                        .from('designs')
                        .select('*, profiles(username, avatar_url)')
                        .in('id', likedIds)
                        .order('created_at', { ascending: false });

                    if (designsError) throw designsError;
                    setSavedDesigns((designs as unknown as DesignDB[]).map((design, index) => ({
                        ...mapDesignToPrompt(design, index),
                        isLikedByUser: true,
                    })));
                }
            } catch (err) {
                console.error("Error fetching user likes:", err);
            } finally {
                setLoadingSaved(false);
            }
        };

        fetchUserLikes();
    }, [user]);

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
                    category: string | null;
                    prompt_content: string | null;
                    description: string | null;
                    tool_used: string | null;
                    image_url: string | null;
                    image_urls: string[] | null;
                    code_snippet: string | null;
                    created_at: string;
                    user_id: string;
                    is_pinned: boolean | null;
                    likes_count: number | null;
                    is_public: boolean | null;
                }

                // Transform to Prompt type
                const designs: Prompt[] = (data as unknown as DesignDB[]).map((d, index) => ({
                    id: String(d.id), // Ensure string ID for Prompt type
                    userId: d.user_id,
                    title: d.title,
                    tags: [d.category || 'Design'],
                    prompt: d.prompt_content || '',
                    description: d.description || undefined,
                    toolUsed: d.tool_used || undefined,
                    author: {
                        name: user.username,
                        avatar: user.avatar_url || "/images/default-avatar.png"
                    },
                    image: d.image_url || '/images/placeholder.png',
                    gallery: d.image_urls?.length
                        ? d.image_urls
                        : [d.image_url || '/images/placeholder.png'],
                    imageAlt: d.title,
                    codeSnippet: d.code_snippet || undefined,
                    pinColor: "bg-white",
                    rotation: index % 2 === 0 ? "rotate-1" : "-rotate-1",
                    type: "card",
                    isPinned: d.is_pinned || false,
                    likesCount: d.likes_count || 0,
                    isPublic: d.is_public !== false,
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
    }, [user]);

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
        if (!user) return;
        const newPinnedState = !design.isPinned;

        // Check pin limit if we're trying to pin a new design
        if (newPinnedState) {
            const currentPinnedCount = myDesigns.filter(d => d.isPinned).length;
            if (currentPinnedCount >= 3) {
                showToast({ message: "You can only pin up to 3 designs. Unpin one first.", type: "error" });
                return;
            }
        }

        // Optimistic update

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
                .eq('id', idAsNumber)
                .eq('user_id', user.id);

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

    const handleToggleLike = async () => {
        showToast({
            message: "Action not allowed",
            description: "You cannot like your own designs.",
            type: "warning",
        });
        return;
    };

    const handleRemoveSaved = async (design: Prompt) => {
        if (!user) return;
        const designId = Number.parseInt(design.id.replace('db-', ''), 10);
        if (Number.isNaN(designId)) return;

        setSavedDesigns(prev => prev.filter(item => item.id !== design.id));
        setUserLikes(prev => {
            const next = new Set(prev);
            next.delete(designId);
            return next;
        });

        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('user_id', user.id)
            .eq('design_id', designId);

        if (error) {
            setSavedDesigns(prev => [design, ...prev]);
            setUserLikes(prev => new Set(prev).add(designId));
            showToast({ message: "Unable to remove saved design", type: "error" });
            return;
        }

        showToast({ message: "Removed from saved", type: "success" });
    };

    const handleDeleteClick = (id: string) => {
        setDesignToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!designToDelete || !user) return;
        setIsDeleting(true);

        // ID formats: "db-123" or "123".
        const cleanId = designToDelete.replace('db-', '');

        try {
            const { data: designRecord, error: lookupError } = await supabase
                .from('designs')
                .select('image_url, image_urls')
                .eq('id', cleanId)
                .eq('user_id', user.id)
                .single();

            if (lookupError) throw lookupError;

            const { error } = await supabase
                .from('designs')
                .delete()
                .eq('id', cleanId)
                .eq('user_id', user.id);

            if (error) throw error;

            const imageReferences = designRecord.image_urls?.length
                ? designRecord.image_urls
                : [designRecord.image_url].filter((value): value is string => Boolean(value));
            await deleteDesignImages(imageReferences, supabase).catch(cleanupError => {
                console.error("Design deleted, but its images could not be cleaned up:", cleanupError);
            });

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

    const pinnedDesigns = myDesigns.filter(design => design.isPinned);
    const visibleDesigns = activeTab === "saved"
        ? savedDesigns
        : activeTab === "pinned"
            ? pinnedDesigns
            : myDesigns;
    const isCollectionLoading = loadingDesigns || (activeTab === "saved" && loadingSaved);
    const collectionTitle = activeTab === "saved" ? "Saved Designs" : activeTab === "pinned" ? "Pinned Designs" : "My Designs";

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
                    <div className="mb-8 px-2 md:px-4">
                        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="flex items-center gap-4">
                                <h2 className="font-black text-4xl md:text-6xl uppercase text-ink leading-none transform -skew-x-[3deg]">
                                    {collectionTitle}
                                </h2>
                                <div className="bg-primary text-ink text-xs md:text-sm font-black px-3 py-2 border-3 border-ink shadow-hard-sm transform rotate-6">
                                    {visibleDesigns.length} ITEMS
                                </div>
                            </div>
                            <p className="max-w-md font-mono text-xs leading-relaxed text-ink/55 md:text-right">
                                Organize your work, revisit saved inspiration, and keep your strongest projects pinned.
                            </p>
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3 border-b-4 border-ink pb-4" role="tablist" aria-label="Profile collections">
                            {[
                                { id: "designs" as const, label: "My Designs", icon: LayoutGrid, count: myDesigns.length },
                                { id: "saved" as const, label: "Saved", icon: Bookmark, count: savedDesigns.length },
                                { id: "pinned" as const, label: "Pinned", icon: Pin, count: pinnedDesigns.length },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`inline-flex items-center gap-2 border-3 border-ink px-4 py-2 font-mono text-xs font-black uppercase transition-all ${activeTab === tab.id
                                        ? "translate-x-0.5 translate-y-0.5 bg-ink text-white shadow-none"
                                        : "bg-white text-ink shadow-hard-sm hover:bg-primary hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                        }`}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    {tab.label}
                                    <span className={activeTab === tab.id ? "text-primary" : "text-ink/45"}>{tab.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {isCollectionLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-ink/30" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-12">
                            {visibleDesigns.map((item) => (
                                <ProfileProjectCard
                                    key={item.id}
                                    {...item}
                                    onClick={() => setSelectedCard(item)}
                                    onDelete={activeTab !== "saved" ? () => handleDeleteClick(item.id) : undefined}
                                    onEdit={activeTab !== "saved" ? () => handleEditClick(item) : undefined}
                                    onTogglePin={activeTab !== "saved" ? () => handleTogglePin(item) : undefined}
                                    isLikedByUser={userLikes.has(parseInt(item.id.replace('db-', ''), 10))}
                                    onToggleLike={activeTab === "saved" ? () => handleRemoveSaved(item) : handleToggleLike}
                                />
                            ))}

                            {visibleDesigns.length === 0 && (
                                <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center border-4 border-dashed border-ink/25 bg-white/60 px-6 py-12 text-center">
                                    <div className="mb-5 grid h-16 w-16 place-items-center border-3 border-ink bg-primary shadow-hard-sm rotate-3">
                                        <Sparkles className="h-8 w-8 text-ink" />
                                    </div>
                                    <h3 className="font-black text-2xl uppercase text-ink">
                                        {activeTab === "designs" ? "Your creative space is ready" : activeTab === "saved" ? "Nothing saved yet" : "No pinned designs yet"}
                                    </h3>
                                    <p className="mt-2 max-w-lg font-mono text-sm leading-relaxed text-ink/60">
                                        {activeTab === "designs"
                                            ? "Publish your first prompt and start building a portfolio the community can explore."
                                            : activeTab === "saved"
                                                ? "Explore the workshop and save designs you want to revisit later."
                                            : "Pin up to three of your strongest designs to keep them easy to find."}
                                    </p>
                                    {activeTab !== "pinned" && (
                                        <Link
                                            href={activeTab === "designs" ? "/submit" : "/#explore-section"}
                                            className="mt-6 border-3 border-ink bg-ink px-6 py-3 font-mono text-xs font-black uppercase text-white shadow-hard-sm transition-all hover:bg-primary hover:text-ink hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                                        >
                                            {activeTab === "designs" ? "Create first design" : "Explore workshop"}
                                        </Link>
                                    )}
                                </div>
                            )}

                            {activeTab === "designs" && myDesigns.length > 0 && <NewDesignCard />}
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
