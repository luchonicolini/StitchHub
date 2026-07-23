"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper-texture flex flex-col items-center justify-center p-6 text-ink dark:text-white">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border-4 border-ink p-8 shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#ffffff] text-center space-y-6">
        
        {/* Error Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF6B6B] text-white px-4 py-1.5 font-mono text-sm font-bold border-2 border-ink shadow-[2px_2px_0px_0px_#000000] rotate-1">
          <AlertTriangle className="w-4 h-4" />
          SOMETHING WENT WRONG!
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black font-display uppercase tracking-wide">
            Unexpected error
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-mono leading-relaxed">
            A temporary problem occurred while loading this section. Please try again.
          </p>
          {error.digest && <p className="font-mono text-xs text-slate-400">Reference: {error.digest}</p>}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#FFDE00] text-ink font-bold font-mono px-6 py-3 border-2 border-ink shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_#000000] transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try again
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-ink dark:text-white font-bold font-mono px-6 py-3 border-2 border-ink shadow-[4px_4px_0px_0px_#000000] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <Home className="w-5 h-5" />
            Back to home
          </Link>
        </div>

      </div>
    </div>
  );
}
