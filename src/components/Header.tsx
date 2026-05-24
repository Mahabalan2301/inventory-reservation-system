"use client";

import Link from "next/link";
import { Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 md:gap-4 px-4 md:px-6 py-3 md:py-4">
        <div className="hidden md:block">
          <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-secondary-text">Welcome back to Allo Inventory</p>
        </div>
        <div className="md:hidden">
          <h2 className="text-base font-bold text-foreground">Allo</h2>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Badge className="bg-success/20 border border-success/40 text-success hidden sm:inline-flex text-xs md:text-sm">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
            Live Inventory
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 md:h-10 md:w-10"
          >
            <Bell className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground hover:text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {mounted && (
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" || resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <Moon className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </Button>
          )}

          <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-border hidden md:flex">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-secondary-text">Manager</p>
            </div>
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center font-bold text-black text-sm">
              A
            </div>
          </div>

          <div className="w-9 h-9 md:hidden rounded-full gradient-hero flex items-center justify-center font-bold text-black text-xs">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
