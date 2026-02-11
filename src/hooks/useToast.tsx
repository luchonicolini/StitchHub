"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { Toast, ToastProps } from "@/components/ui/Toast";

interface ToastContextType {
    showToast: (toast: Omit<ToastProps, "id" | "onClose">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastWithId extends ToastProps {
    id: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastWithId[]>([]);

    const showToast = useCallback((toast: Omit<ToastProps, "id" | "onClose">) => {
        const id = Math.random().toString(36).substring(7);
        const newToast: ToastWithId = {
            ...toast,
            id,
            onClose: () => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            },
        };
        setToasts((prev) => [...prev, newToast]);

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}
