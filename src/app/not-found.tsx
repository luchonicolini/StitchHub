"use client";

import Link from "next/link";
import { AlertOctagon, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-paper-texture flex flex-col items-center justify-center p-6 text-ink dark:text-white">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border-4 border-ink p-8 shadow-[8px_8px_0px_0px_#000000] dark:shadow-[8px_8px_0px_0px_#ffffff] text-center space-y-6">
        
        {/* Top sticker / badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF6B6B] text-white px-4 py-1.5 font-mono text-sm font-bold border-2 border-ink shadow-[2px_2px_0px_0px_#000000] -rotate-2">
          <AlertOctagon className="w-4 h-4" />
          ERROR 404
        </div>

        {/* Big Neo-Brutalist Title */}
        <div className="space-y-2">
          <h1 className="text-7xl font-black tracking-tight font-mono text-[#FFDE00] drop-shadow-[3px_3px_0px_#000000]">
            404
          </h1>
          <h2 className="text-2xl font-bold font-display uppercase tracking-wide">
            Página no encontrada
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm font-mono leading-relaxed">
            Parece que el diseño o la ruta que estás buscando no existe o fue movida a otro taller.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#FFDE00] text-ink font-bold font-mono px-6 py-3 border-2 border-ink shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000000] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_#000000] transition-all"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-ink dark:text-white font-bold font-mono px-6 py-3 border-2 border-ink shadow-[4px_4px_0px_0px_#000000] hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Regresar a la página anterior
          </button>
        </div>

      </div>
    </div>
  );
}
