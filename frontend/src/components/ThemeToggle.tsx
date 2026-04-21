"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="h-9 w-9 text-muted-foreground hover:text-foreground">
            <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-40 p-1">
        <DropdownMenuItem 
          render={
            <button onClick={() => setTheme("light")} className="w-full flex items-center gap-2 cursor-pointer font-medium p-2 text-xs">
              <Sun className="size-3" /> Light
            </button>
          }
        />
        <DropdownMenuItem 
          render={
            <button onClick={() => setTheme("dark")} className="w-full flex items-center gap-2 cursor-pointer font-medium p-2 text-xs">
              <Moon className="size-3" /> Dark
            </button>
          }
        />
        <DropdownMenuItem 
          render={
            <button onClick={() => setTheme("system")} className="w-full flex items-center gap-2 cursor-pointer font-medium p-2 text-xs">
              <span className="size-3 flex items-center justify-center font-bold text-[10px]">S</span> System
            </button>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
