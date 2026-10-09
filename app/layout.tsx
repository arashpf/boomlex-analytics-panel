// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}