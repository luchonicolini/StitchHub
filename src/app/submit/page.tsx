"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DesignUploadForm } from "@/components/submit/DesignUploadForm";
import { WorkshopHeader } from "@/components/workshop/WorkshopHeader";

export default function SubmitPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light flex items-center justify-center">
                <div className="font-mono text-ink text-lg">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background-light">
            <WorkshopHeader />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="font-display text-5xl font-black text-ink mb-2">
                            SUBMIT YOUR DESIGN
                        </h1>
                        <p className="font-mono text-ink/60">
                            Share your Stitch prompt and design with the community
                        </p>
                    </div>
                    <DesignUploadForm />
                </div>
            </main>
        </div>
    );
}
