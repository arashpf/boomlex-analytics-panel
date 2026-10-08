// components/layout/Sidebar.tsx
//
// Left-hand navigation for the analytics panel.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Filter,
  Home,
  MapPin,
  Users,
  Zap,
  BarChart3,
  Package
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/",          label: "Overview",  icon: LayoutDashboard },
  { href: "/funnels",   label: "Funnels",   icon: Filter },
  { href: "/listings",  label: "Listings",  icon: Home },
  { href: "/cities",    label: "Cities",    icon: MapPin },
  { href: "/sessions",  label: "Sessions",  icon: Users },
  { href: "/agents",    label: "Agents",    icon: Users },
  { href: "/plans", label: "Plans", icon: Package },
  { href: "/realtime",  label: "Realtime",  icon: Zap },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
      {/* Brand */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-slate-200 dark:border-slate-800">
        <BarChart3 className="w-5 h-5 text-slate-900 dark:text-slate-100" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          Ajur Analytics
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-400 px-3 py-2">
          v1.0 · Internal
        </p>
      </div>
    </aside>
  );
}