"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, Package, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
  },
  {
    label: "Reservations",
    href: "/reservations",
    icon: ShoppingCart,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    if (href === "/") {
      // Scroll to top after navigation to home
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-sidebar-bg border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center text-xl font-bold text-black shadow-lg">
            A
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Allo Inventory</p>
            <p className="text-xs text-secondary-text">Logistics</p>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 group text-left",
                isActive
                  ? "bg-primary/20 border border-primary/40 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary-bg/50"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Help Section */}
      <div className="p-4 border-t border-border">
        <div className="bg-secondary-bg/50 border border-border rounded-2xl p-4 text-center">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Need help?
          </p>
          <a
            href="#"
            className="text-xs text-primary hover:text-primary-light transition-colors"
          >
            Contact support
          </a>
        </div>
      </div>
    </aside>
  );
}
