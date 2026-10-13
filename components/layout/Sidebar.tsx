// components/layout/Sidebar.tsx
//
// Left-hand navigation. Collapsible: expands/collapses on toggle.

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
  Briefcase,
  Route,
  Package,
  Monitor,

  Search as SearchIcon,
} from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/",          label: "Overview",  icon: LayoutDashboard },
  { href: "/funnels",   label: "Funnels",   icon: Filter },
  { href: "/search",    label: "Search",    icon: SearchIcon },
  { href: "/listings",  label: "Listings",  icon: Home },
  { href: "/cities",    label: "Cities",    icon: MapPin },
  { href: "/users",     label: "Users",     icon: Route },       
  { href: "/sessions",  label: "Sessions",  icon: Users },
  { href: "/agents",    label: "Agents",    icon: Briefcase },
  { href: "/plans",     label: "Plans",     icon: Package },
  { href: "/platform", label: "Platform", icon: Monitor },
  { href: "/referrers", label: "Referrers", icon: Users },
  { href: "/realtime",  label: "Realtime",  icon: Zap },
];

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col transition-all duration-200",
        collapsed ? "w-[64px]" : "w-60"
      )}
    >
      {/* Brand */}
      <div
        className={clsx(
          "h-16 flex items-center border-b border-slate-200 dark:border-slate-800 transition-all",
          collapsed ? "justify-center px-0" : "gap-2 px-5"
        )}
      >
        <BarChart3 className="w-5 h-5 text-slate-900 dark:text-slate-100 shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap overflow-hidden">
            Ajur Analytics
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={clsx(
                "flex items-center rounded-md text-sm font-medium transition",
                collapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2",
                isActive
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={clsx(
          "p-3 border-t border-slate-200 dark:border-slate-800",
          collapsed ? "text-center" : ""
        )}
      >
        {collapsed ? (
          <span className="text-[10px] text-slate-400">v1</span>
        ) : (
          <p className="text-xs text-slate-400 px-3 py-2">v1.0 · Internal</p>
        )}
      </div>
    </aside>
  );
}