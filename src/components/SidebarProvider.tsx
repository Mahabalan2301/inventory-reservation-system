"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type SidebarContextValue = {
  mobileOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const open = useCallback(() => setMobileOpen(true), []);
  const close = useCallback(() => setMobileOpen(false), []);
  const toggle = useCallback(() => setMobileOpen((prev) => !prev), []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const value = useMemo(
    () => ({ mobileOpen, open, close, toggle }),
    [mobileOpen, open, close, toggle],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}
