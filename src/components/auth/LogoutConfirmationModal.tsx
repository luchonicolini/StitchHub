"use client";

import { X, LogOut, AlertTriangle } from "lucide-react";

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LogoutConfirmationModal({ isOpen, onClose, onConfirm }: LogoutConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-4 border-ink shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md relative animate-in fade-in zoom-in duration-200 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b-4 border-ink bg-accent-orange shrink-0">
                    <h2 className="font-black text-xl uppercase text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 fill-white text-accent-orange" />
                        Log Out
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-ink rounded-sm"
                        type="button"
                    >
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 bg-background-light">
                    <p className="font-mono text-ink text-sm font-bold leading-relaxed">
                        Are you sure you want to log out? You will need to sign back in to submit new designs or edit your profile.
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t-4 border-ink bg-gray-50 flex justify-end gap-4 shrink-0 mt-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 bg-white border-3 border-ink font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all text-ink"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-red-500 text-white border-3 border-ink font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
