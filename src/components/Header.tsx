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
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-secondary-text">Welcome back to Allo Inventory</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-success/20 border border-success/40 text-success hidden sm:inline-flex">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
            Live Inventory
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </Button>

          {mounted && (
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" || resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}

          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">Admin</p>
              <p className="text-xs text-secondary-text">Manager</p>
            </div>
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center font-bold text-black text-sm">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
