// components/cards/StatCard.tsx

import { ReactNode } from "react";
import { formatNumber } from "@/lib/formatters";

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: ReactNode;
  hint?: string;
}

export function StatCard({ label, value, icon, hint }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
        {typeof value === "number" ? formatNumber(value) : value}
      </div>
      {hint && (
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{hint}</div>
      )}
    </div>
  );
}