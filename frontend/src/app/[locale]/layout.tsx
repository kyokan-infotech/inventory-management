"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {!isAuthPage && <Navbar />}
      <main className={cn(
        "flex-1",
        !isAuthPage ? "animate-in fade-in slide-in-from-bottom-2 duration-500" : ""
      )}>
        {children}
      </main>
      {!isAuthPage && (
        <footer className="border-t border-border py-4 px-6 text-center text-xs text-muted-foreground flex items-center justify-between">
           <span>&copy; 2026 StockMate</span>
           <div className="flex gap-4">
              <span className="font-medium hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="font-medium hover:text-foreground cursor-pointer transition-colors">Terms</span>
           </div>
        </footer>
      )}
    </div>
  );
}