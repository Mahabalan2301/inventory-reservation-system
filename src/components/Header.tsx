"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/SidebarProvider";

export function Header() {
  const { toggle } = useSidebar();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex items-center gap-3 px-4 py-3 md:gap-4 md:px-8 md:py-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl md:hidden"
          onClick={toggle}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden flex-1 max-w-md md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-text" />
          <Input
            type="search"
            placeholder="Search products, SKU, warehouses…"
            className="h-10 rounded-xl border-border bg-background pl-10 text-[14px]"
            readOnly
            aria-label="Search"
          />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-2 md:flex-none md:justify-end md:gap-3">
          <div className="min-w-0 md:hidden">
            <h2 className="truncate text-base font-bold text-foreground">
              Allo Inventory
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <Badge
              variant="success"
              className="hidden rounded-full px-3 py-1 sm:inline-flex"
            >
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success" />
              Live inventory
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-xl"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px] text-muted-foreground" />
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
            </Button>

            <div className="hidden items-center gap-3 border-l border-border pl-3 md:flex">
              <div className="text-right">
                <p className="text-[14px] font-semibold text-foreground">
                  Admin
                </p>
                <p className="text-xs text-muted-foreground">
                  Operations Manager
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                A
              </div>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground md:hidden">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
