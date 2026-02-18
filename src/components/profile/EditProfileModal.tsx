"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: { username: string; email: string; id: string };
}

export function EditProfileModal({ isOpen, onClose, currentUser }: EditProfileModalProps) {
    const { showToast } = useToast();
    const { updateProfile } = useAuth(); // Get updateProfile
    const [username, setUsername] = useState(currentUser.username);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await updateProfile(username);

            if (error) {
                showToast({ message: error, type: "error" });
                return;
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

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-4 border-ink shadow-hard w-full max-w-md relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-ink bg-gray-50">
                    <h2 className="font-black text-lg uppercase text-ink">Edit Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-red-500 hover:text-white border-2 border-transparent hover:border-ink transition-colors rounded-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border-2 border-ink font-mono font-bold text-xs uppercase shadow-sm hover:shadow-md transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-accent-green text-white border-2 border-ink font-mono font-bold text-xs uppercase shadow-hard-sm hover:shadow-none hover:translate-y-[1px] transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
