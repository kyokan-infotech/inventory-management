import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StockMate — Inventory Management",
  description: "Bilingual inventory management system for StockMate admin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body
        style={{
          fontFamily: `var(--geist-sans), Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif`,
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" closeButton richColors />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}