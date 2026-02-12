"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthInitializer() {
    const initialize = useAuth((state) => state.initialize);

    useEffect(() => {
        const init = async () => {
            const subscription = await initialize();
            return subscription;
        };

        const subPromise = init();

        return () => {
            subPromise.then((sub) => sub?.unsubscribe());
        };
    }, [initialize]);

    return null;
}
