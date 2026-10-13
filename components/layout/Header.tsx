// components/layout/Header.tsx
//
// Top bar. Contains the hamburger toggle for the sidebar + logout button.

"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/":          "Overview",
  "/funnels":   "Funnels",
  "/search":    "Search & Filter",
  "/listings":  "Listings",
  "/cities":    "Cities",
  "/sessions":  "Sessions",
  "/agents":    "Agents",
  "/plans":     "Upgrade Plans",
  "/users": "User Journeys",
  "/platform": "Platform",
  "/referrers": "Referrers",
  "/realtime":  "Realtime",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const match = Object.keys(PAGE_TITLES).find(
    (p) => p !== "/" && pathname.startsWith(p)
  );
  return match ? PAGE_TITLES[match] : "Ajur Analytics";
}

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {getTitle(pathname)}
        </h1>
      </div>

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