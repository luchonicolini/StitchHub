"use client";

import { X, Trash2, AlertTriangle } from "lucide-react";
import { Loader2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    loading?: boolean;
    title?: string;
    message?: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    loading = false,
    title = "Delete Design?",
    message = "Are you sure you want to delete this design? This action cannot be undone."
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-4 border-ink shadow-hard w-full max-w-md relative animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-ink bg-gray-50">
                    <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-6 h-6" strokeWidth={2.5} />
                        <h2 className="font-black text-lg uppercase text-ink">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-1 hover:bg-gray-200 border-2 border-transparent hover:border-ink transition-colors rounded-sm"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="font-mono text-sm text-ink/80 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer / Actions */}
                <div className="flex justify-end gap-3 p-4 border-t-2 border-ink bg-gray-50">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-white text-ink border-2 border-ink font-mono font-bold text-xs uppercase shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 text-white border-2 border-ink font-mono font-bold text-xs uppercase shadow-hard-sm hover:shadow-none hover:translate-y-[1px] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
