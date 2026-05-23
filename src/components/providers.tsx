"use client";

import { ThemeProvider } from "next-themes";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SWRConfig
        value={{
          revalidateOnFocus: true,
          shouldRetryOnError: true,
        }}
      >
        {children}
        <Toaster
          richColors
          closeButton
          position="top-right"
          toastOptions={{
            className: "font-sans",
          }}
        />
      </SWRConfig>
    </ThemeProvider>
  );
}
