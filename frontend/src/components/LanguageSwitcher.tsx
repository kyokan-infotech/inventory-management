"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const lang = locale === "ja" ? "ja" : "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 font-semibold text-muted-foreground hover:text-foreground">
            <Languages className="size-4" />
            <span className="text-xs uppercase tracking-wider">{lang}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40 p-1">
        <DropdownMenuItem 
          render={
            <Link href={pathname?.replace(`/${locale}`, "/en") || "/en/dashboard"} className="flex items-center gap-2 cursor-pointer font-medium p-2 text-xs">
              <span className={cn("size-2 rounded-full", lang === 'en' ? "bg-primary" : "bg-transparent")} />
              English (EN)
            </Link>
          }
        />
        <DropdownMenuItem 
          render={
            <Link href={pathname?.replace(`/${locale}`, "/ja") || "/ja/dashboard"} className="flex items-center gap-2 cursor-pointer font-medium p-2 text-xs">
              <span className={cn("size-2 rounded-full", lang === 'ja' ? "bg-primary" : "bg-transparent")} />
              Japanese (JA)
            </Link>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
