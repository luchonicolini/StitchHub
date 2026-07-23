"use client";

import { useState, useRef } from "react";
import { X, Loader2, Upload, ImageIcon, Camera, Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { uploadProfileImage, getConstraints } from "@/lib/uploadProfileImage";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: {
        username: string;
        email: string;
        id: string;
        avatar_url?: string | null;
        cover_image_url?: string | null;
        bio?: string | null;
        website?: string | null;
    };
}

export function EditProfileModal({ isOpen, onClose, currentUser }: EditProfileModalProps) {
    const { showToast } = useToast();
    const { updateProfile, logout } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState(currentUser.username);
    const [bio, setBio] = useState(currentUser.bio || "");
    const [website, setWebsite] = useState(currentUser.website || "");
    const [loading, setLoading] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deletingAccount, setDeletingAccount] = useState(false);

    // Avatar state
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser.avatar_url || null);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Cover state
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string | null>(currentUser.cover_image_url || null);
    const [coverUploading, setCoverUploading] = useState(false);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const avatarConstraints = getConstraints('avatar');
    const coverConstraints = getConstraints('cover');

    if (!isOpen) return null;

    const handleFileSelect = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'avatar' | 'cover'
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview
        const url = URL.createObjectURL(file);

        if (type === 'avatar') {
            setAvatarFile(file);
            setAvatarPreview(url);
        } else {
            setCoverFile(file);
            setCoverPreview(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let newAvatarUrl: string | undefined;
            let newCoverUrl: string | undefined;

            // Upload avatar if changed
            if (avatarFile) {
                setAvatarUploading(true);
                try {
                    newAvatarUrl = await uploadProfileImage(avatarFile, currentUser.id, 'avatar');
                } catch (err) {
                    const msg = err instanceof Error ? err.message : 'Avatar upload failed';
                    showToast({ message: msg, type: "error" });
                    setAvatarUploading(false);
                    setLoading(false);
                    return;
                }
                setAvatarUploading(false);
            }

            // Upload cover if changed
            if (coverFile) {
                setCoverUploading(true);
                try {
                    newCoverUrl = await uploadProfileImage(coverFile, currentUser.id, 'cover');
                } catch (err) {
                    const msg = err instanceof Error ? err.message : 'Cover upload failed';
                    showToast({ message: msg, type: "error" });
                    setCoverUploading(false);
                    setLoading(false);
                    return;
                }
                setCoverUploading(false);
            }

            // Build profile update
            const updates: { username?: string; avatar_url?: string; cover_image_url?: string; bio?: string; website?: string } = {};
            if (username !== currentUser.username) updates.username = username;
            if (bio !== (currentUser.bio || "")) updates.bio = bio;
            if (website !== (currentUser.website || "")) updates.website = website;
            if (newAvatarUrl) updates.avatar_url = newAvatarUrl;
            if (newCoverUrl) updates.cover_image_url = newCoverUrl;

            if (Object.keys(updates).length > 0) {
                const { error } = await updateProfile(updates);
                if (error) {
                    showToast({ message: error, type: "error" });
                    setLoading(false);
                    return;
                }
            }

            showToast({ message: "Profile updated successfully!", type: "success" });
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast({ message: "Failed to update profile", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const isUploading = avatarUploading || coverUploading;

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== 'DELETE' || deletingAccount) return;
        setDeletingAccount(true);

        try {
            const response = await fetch('/api/account', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmation: deleteConfirmation }),
            });
            const result = await response.json() as { error?: string };
            if (!response.ok) throw new Error(result.error || 'Account deletion failed');

            await logout();
            showToast({ message: 'Your account and data were deleted.', type: 'success' });
            onClose();
            router.replace('/');
            router.refresh();
        } catch (error) {
            showToast({
                message: error instanceof Error ? error.message : 'Account deletion failed',
                type: 'error',
            });
        } finally {
            setDeletingAccount(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-4 border-ink shadow-hard w-full max-w-lg relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-ink bg-gray-50 sticky top-0 z-10">
                    <h2 className="font-black text-lg uppercase text-ink">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        type="button"
                        aria-label="Close profile settings"
                        className="p-1 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-ink transition-colors rounded-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Cover Image Upload */}
                    <div>
                        <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                            <ImageIcon className="w-3.5 h-3.5 inline mr-1.5" />
                            Cover Image
                        </label>
                        <div
                            onClick={() => coverInputRef.current?.click()}
                            className="w-full h-32 border-3 border-dashed border-ink/30 hover:border-ink bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer rounded-sm overflow-hidden relative group"
                        >
                            {coverPreview ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={coverPreview}
                                        alt="Cover preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-white" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-2 text-ink/40 group-hover:text-ink transition-colors">
                                    <Upload className="w-6 h-6" />
                                    <span className="font-mono text-xs font-bold uppercase">Click to upload</span>
                                </div>
                            )}
                            {coverUploading && (
                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-ink" />
                                </div>
                            )}
                        </div>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleFileSelect(e, 'cover')}
                            className="hidden"
                        />
                        <p className="text-[10px] font-mono text-ink/40 mt-1.5">
                            JPG, PNG, WebP • Min {coverConstraints.minWidth}×{coverConstraints.minHeight}px • Max {coverConstraints.maxWidth}×{coverConstraints.maxHeight}px • Max {coverConstraints.maxSizeMB}MB
                        </p>
                    </div>

                    {/* Avatar Upload */}
                    <div>
                        <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                            <Camera className="w-3.5 h-3.5 inline mr-1.5" />
                            Avatar
                        </label>
                        <div className="flex items-center gap-4">
                            <div
                                onClick={() => avatarInputRef.current?.click()}
                                className="w-20 h-20 rounded-full border-3 border-dashed border-ink/30 hover:border-ink bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer overflow-hidden relative group shrink-0"
                            >
                                {avatarPreview ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={avatarPreview}
                                            alt="Avatar preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                            <Camera className="w-5 h-5 text-white" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-ink/40 group-hover:text-ink transition-colors">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src="/images/default-avatar.png" alt="Default Avatar" className="w-full h-full object-cover opacity-50" />
                                        <Camera className="w-6 h-6 absolute" />
                                    </div>
                                )}
                                {avatarUploading && (
                                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-full">
                                        <Loader2 className="w-5 h-5 animate-spin text-ink" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="px-3 py-1.5 bg-white border-2 border-ink font-mono font-bold text-xs uppercase shadow-hard-sm hover:shadow-none hover:translate-y-[1px] transition-all text-ink"
                                >
                                    Choose Photo
                                </button>
                                <p className="text-[10px] font-mono text-ink/40 mt-1.5">
                                    Min {avatarConstraints.minWidth}×{avatarConstraints.minHeight}px • Max {avatarConstraints.maxSizeMB}MB
                                </p>
                            </div>
                        </div>
                        <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleFileSelect(e, 'avatar')}
                            className="hidden"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white border-3 border-ink px-4 py-3 font-mono text-sm text-ink focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none"
                            placeholder="username"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={160}
                            rows={3}
                            className="w-full bg-white border-3 border-ink px-4 py-3 font-mono text-sm text-ink focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none resize-none"
                            placeholder="Crafting prompts & designs for the digital age ✦"
                        />
                        <p className="text-[10px] font-mono text-ink/40 mt-1.5 text-right">
                            {bio.length}/160
                        </p>
                    </div>

                    {/* Website */}
                    <div>
                        <label className="block font-mono font-bold text-xs uppercase text-ink/70 mb-2">
                            Website / Social Link
                        </label>
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="w-full bg-white border-3 border-ink px-4 py-3 font-mono text-sm text-ink focus:ring-0 focus:border-primary focus:shadow-hard-sm transition-all outline-none"
                            placeholder="https://yourwebsite.com"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t-2 border-ink/10">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 bg-white border-2 border-ink font-mono font-bold text-xs uppercase shadow-sm hover:shadow-md transition-all disabled:opacity-50 text-ink"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || isUploading}
                            className="px-5 py-2.5 bg-primary text-ink border-2 border-ink font-mono font-bold text-xs uppercase shadow-hard-sm hover:shadow-none hover:translate-y-[1px] transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {(loading || isUploading) && <Loader2 className="w-3 h-3 animate-spin" />}
                            {isUploading ? 'Uploading...' : 'Save Changes'}
                        </button>
                    </div>

                    <div className="border-3 border-red-600 bg-red-50 p-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                            <div className="min-w-0 flex-1">
                                <h3 className="font-mono text-sm font-black uppercase text-red-700">Danger zone</h3>
                                <p className="mt-1 font-mono text-xs leading-relaxed text-red-900/70">
                                    Permanently delete your account, designs, private vault, profile images, and community activity.
                                </p>
                                {!showDeleteAccount ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteAccount(true)}
                                        className="mt-3 flex items-center gap-2 border-2 border-red-700 bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-red-700 hover:bg-red-700 hover:text-white"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete account
                                    </button>
                                ) : (
                                    <div className="mt-3 space-y-3">
                                        <label htmlFor="delete-account-confirmation" className="block font-mono text-xs font-bold text-red-900">
                                            Type DELETE to confirm
                                        </label>
                                        <input
                                            id="delete-account-confirmation"
                                            value={deleteConfirmation}
                                            onChange={(event) => setDeleteConfirmation(event.target.value)}
                                            className="w-full border-2 border-red-700 bg-white px-3 py-2 font-mono text-sm text-ink outline-none focus:ring-2 focus:ring-red-500"
                                            autoComplete="off"
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={handleDeleteAccount}
                                                disabled={deleteConfirmation !== 'DELETE' || deletingAccount}
                                                className="flex items-center gap-2 border-2 border-ink bg-red-600 px-3 py-2 font-mono text-xs font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                {deletingAccount && <Loader2 className="h-4 w-4 animate-spin" />}
                                                Permanently delete
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowDeleteAccount(false);
                                                    setDeleteConfirmation("");
                                                }}
                                                disabled={deletingAccount}
                                                className="border-2 border-ink bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-ink"
                                            >
                                                Keep account
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
