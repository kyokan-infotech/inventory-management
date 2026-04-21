"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Warehouse, LogOut, LayoutDashboard, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  
  const locale = pathname?.split("/")[1] || "en";
  const lang = locale === "ja" ? "ja" : "en";

  const handleLogout = () => {
    localStorage.removeItem("stockmate_token");
    router.push(`/${lang}/login`);
  };

  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${lang}/dashboard`} className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/20">
              <Warehouse className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden font-bold sm:inline-block tracking-tight">
              {translations.common.appName}
            </span>
          </Link>

          <nav className="flex items-center space-x-1 text-sm font-medium">
            <Link 
              href={`/${lang}/dashboard`} 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
                isActive("/dashboard") 
                  ? "bg-accent text-accent-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{translations.dashboard.title[lang]}</span>
            </Link>
            <Link 
              href={`/${lang}/inventory`} 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors",
                isActive("/inventory") 
                  ? "bg-accent text-accent-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <Package className="h-4 w-4" />
              <span>{translations.inventory.listTitle[lang]}</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center p-1 rounded-lg bg-muted/30 border border-border/50">
             <Link 
              href={pathname?.replace(`/${locale}`, "/en") || "/en/dashboard"}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all",
                lang === "en" 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" 
                  : "text-muted-foreground hover:text-foreground"
              )}
             >
               EN
             </Link>
             <Link 
              href={pathname?.replace(`/${locale}`, "/ja") || "/ja/dashboard"}
              className={cn(
                "px-2.5 py-1 text-[11px] font-bold rounded-md transition-all",
                lang === "ja" 
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border/50" 
                  : "text-muted-foreground hover:text-foreground"
              )}
             >
               JA
             </Link>
          </div>

          <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs font-semibold hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{translations.common.logout[lang]}</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
