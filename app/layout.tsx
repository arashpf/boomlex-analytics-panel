// app/layout.tsx
//
// Root layout — sidebar + header + main content area.
//
// The login page has its own full-screen layout, so we conditionally
// hide the sidebar when the path starts with /login.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ConditionalShell } from "@/components/layout/ConditionalShell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ajur Analytics",
  description: "Internal analytics panel for Ajur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950`}>
        <ConditionalShell sidebar={<Sidebar />} header={<Header />}>
          {children}
        </ConditionalShell>
      </body>
    </html>
  );
}