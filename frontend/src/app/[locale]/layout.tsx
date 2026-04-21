"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  SidebarProvider, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.includes("/login") || pathname?.includes("/register");

  return (
    <SidebarProvider>
      <TooltipProvider>
        {!isAuthPage && <AppSidebar />}
        <SidebarInset className="flex flex-col h-svh overflow-y-auto overflow-x-hidden bg-background">
          {!isAuthPage && (
            <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-30">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 h-8 w-8" />
              </div>
              <div className="flex items-center gap-4">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </header>
          )}
          <div className={cn(
            "flex-1 w-full",
            !isAuthPage ? "animate-in fade-in slide-in-from-bottom-2 duration-500" : ""
          )}>
            {children}
          </div>
        </SidebarInset>
      </TooltipProvider>
    </SidebarProvider>
  );
}