import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Allo Inventory Reservation System",
  description:
    "Real-time multi-warehouse inventory reservation with concurrency protection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased bg-background`}
      >
        <Providers>
          <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-[260px]">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
