import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ToastProvider } from "@/hooks/useToast";
import { AuthInitializer } from "@/components/auth/AuthInitializer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StitchHub Neo-Brutalist Workshop",
  description: "Hand-Picked Stitch Prompts for Humans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased bg-background-light dark:bg-background-dark text-ink dark:text-white font-display`}
      >
        <AuthInitializer />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-space-mono)',
              border: '2px solid #1a1a1a',
              borderRadius: '4px',
              boxShadow: '3px 3px 0 0 #1a1a1a',
            },
          }}
        />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
