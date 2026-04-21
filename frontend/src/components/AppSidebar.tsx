"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Warehouse, 
  LogOut, 
  Languages, 
  ChevronRight,
  Settings,
  User
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const locale = pathname?.split("/")[1] || "en";
  const lang = locale === "ja" ? "ja" : "en";
  const t = translations;

  const handleLogout = () => {
    localStorage.removeItem("stockmate_token");
    router.push(`/${lang}/login`);
  };

  const isActive = (path: string) => {
    return pathname?.includes(path);
  };

  return (
    <Sidebar variant="inset" collapsible="icon" className="border-r border-sidebar-border bg-sidebar shadow-sm">
      <SidebarHeader className="h-14 flex items-center justify-center border-b border-sidebar-border/50">
        <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 px-2 transition-all hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-data-[collapsible=icon]:scale-90">
            <Warehouse className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight truncate group-data-[collapsible=icon]:hidden">
            {t.common.appName}
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2 group-data-[collapsible=icon]:hidden">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                render={
                  <Link href={`/${lang}/dashboard`} className="flex items-center gap-3">
                    <LayoutDashboard className={cn("size-4", isActive("/dashboard") ? "text-primary" : "text-muted-foreground")} />
                    <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">{t.dashboard.title[lang]}</span>
                    {isActive("/dashboard") && <ChevronRight className="ml-auto size-3 opacity-50 group-data-[collapsible=icon]:hidden" />}
                  </Link>
                }
                isActive={isActive("/dashboard")}
                tooltip={t.dashboard.title[lang]}
                className={cn(
                  "h-10 transition-colors",
                  isActive("/dashboard") ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "hover:bg-sidebar-accent/50"
                )}
              />
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton 
                render={
                  <Link href={`/${lang}/inventory`} className="flex items-center gap-3">
                    <Package className={cn("size-4", isActive("/inventory") ? "text-primary" : "text-muted-foreground")} />
                    <span className="font-semibold text-sm group-data-[collapsible=icon]:hidden">{t.inventory.listTitle[lang]}</span>
                    {isActive("/inventory") && <ChevronRight className="ml-auto size-3 opacity-50 group-data-[collapsible=icon]:hidden" />}
                  </Link>
                }
                isActive={isActive("/inventory")}
                tooltip={t.inventory.listTitle[lang]}
                className={cn(
                  "h-10 transition-colors",
                  isActive("/inventory") ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "hover:bg-sidebar-accent/50"
                )}
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 bg-muted/5 border-t border-sidebar-border/50">
        <SidebarMenu>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger 
                render={
                  <SidebarMenuButton
                    tooltip="Account Options"
                    className="h-12 mt-1 hover:bg-sidebar-accent shadow-none transition-all"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                      <User className="size-3.5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5 text-left group-data-[collapsible=icon]:hidden">
                      <span className="text-xs font-bold leading-tight">Admin User</span>
                      <span className="text-[10px] text-muted-foreground leading-tight truncate w-32">admin@stockmate.io</span>
                    </div>
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="right" align="end" className="w-56 p-1">
                <div className="px-2 py-1.5 mb-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border/50">
                  Settings
                </div>
                <DropdownMenuItem className="gap-2 cursor-pointer p-2 font-medium">
                  <Settings className="size-4 opacity-70" />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="gap-2 cursor-pointer p-2 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors"
                >
                  <LogOut className="size-4" />
                  <span>{t.common.logout[lang]}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
