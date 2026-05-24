"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/SidebarProvider";

const menuItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Products", href: "/products", icon: Package },
  { label: "Reservations", href: "/reservations", icon: ShoppingCart },
] as const;

function SidebarLogo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
      onClick={onNavigate}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
        A
      </div>
      <div>
        <p className="text-[15px] font-bold text-foreground">Allo Inventory</p>
        <p className="text-xs text-muted-foreground">Management</p>
      </div>
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    onNavigate?.();
    if (href === "/") {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => handleNavigation(item.href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-[14px] px-3.5 py-2.5 text-left text-[14px] transition-colors duration-200",
              active
                ? "bg-primary-soft font-semibold text-primary"
                : "font-medium text-muted-foreground hover:bg-secondary-bg hover:text-foreground",
            )}
          >
            <Icon className="h-[18px] w-[18px] flex-shrink-0" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const { mobileOpen, close } = useSidebar();

  const asideClassName =
    "fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-border bg-sidebar-bg shadow-lg";

  return (
    <>
      {/* Backdrop — mobile only */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={close}
        aria-hidden={!mobileOpen}
      />

      {/* Desktop — always visible from md breakpoint */}
      <aside className={cn(asideClassName, "hidden md:flex")}>
        <div className="px-5 py-6">
          <SidebarLogo />
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile — slide-in drawer */}
      <aside
        className={cn(
          asideClassName,
          "transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal={mobileOpen}
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
          <SidebarLogo onNavigate={close} />
          <button
            type="button"
            onClick={close}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary-bg hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav onNavigate={close} />
      </aside>
    </>
  );
}
