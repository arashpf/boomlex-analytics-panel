// components/layout/Header.tsx
//
// Top bar for the analytics panel.
// Shows the page title (derived from pathname) + logout button.

"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/":          "Overview",
  "/funnels":   "Funnels",
  "/listings":  "Listings",
  "/cities":    "Cities",
  "/sessions":  "Sessions",
  "/agents":    "Agents",
  "/plans": "Upgrade Plans",
  "/realtime":  "Realtime",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  // Match by prefix (e.g. /listings/123)
  const match = Object.keys(PAGE_TITLES).find(
    (p) => p !== "/" && pathname.startsWith(p)
  );
  return match ? PAGE_TITLES[match] : "Ajur Analytics";
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {getTitle(pathname)}
      </h1>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </header>
  );
}