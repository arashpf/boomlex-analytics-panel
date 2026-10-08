// components/cards/TopListCard.tsx
//
// Compact numbered list of top items (top events, top listings, etc.)

import { ReactNode } from "react";

export interface TopListItem {
  label: string;
  value: number | string;
  sublabel?: string;
  icon?: ReactNode;
}

interface TopListCardProps {
  title: string;
  items: TopListItem[];
  emptyText?: string;
}

export function TopListCard({ title, items, emptyText = "No data yet" }: TopListCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <div className="p-2">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">{emptyText}</p>
        ) : (
          <ol className="space-y-0.5">
            {items.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <span className="w-5 text-xs text-slate-400 text-right shrink-0">
                  {idx + 1}
                </span>
                <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
                  {item.label}
                  {item.sublabel && (
                    <span className="text-xs text-slate-400 block">{item.sublabel}</span>
                  )}
                </span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 shrink-0">
                  {item.value}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}