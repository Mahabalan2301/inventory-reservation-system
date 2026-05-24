"use client";

import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import { SidebarProvider } from "@/components/SidebarProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        shouldRetryOnError: true,
      }}
    >
      <SidebarProvider>
        {children}
        <Toaster
          closeButton
          position="top-right"
          toastOptions={{
            className: "font-sans",
          }}
        />
      </SidebarProvider>
    </SWRConfig>
  );
}
