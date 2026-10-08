// components/cards/ActiveUsersCard.tsx
//
// Active Users card with new/returning breakdown.

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatNumber } from "@/lib/formatters";
import type { ActiveUsers } from "@/lib/types";

interface Props {
  data: ActiveUsers;
  icon?: ReactNode;
}

export function ActiveUsersCard({ data, icon }: Props) {
  const trend =
    data.trend === 0 ? "flat" : data.trend > 0 ? "up" : "down";

  const newPct =
    data.total > 0 ? Math.round((data.new / data.total) * 100) : 0;
  const returningPct = 100 - newPct;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Active Users
        </span>
        {icon}
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {formatNumber(data.total)}
        </span>
        <span
          className={
            "flex items-center gap-0.5 text-xs font-medium " +
            (trend === "up"
              ? "text-emerald-600 dark:text-emerald-400"
              : trend === "down"
                ? "text-red-600 dark:text-red-400"
                : "text-slate-400")
          }
        >
          {trend === "up" && <TrendingUp className="w-3 h-3" />}
          {trend === "down" && <TrendingDown className="w-3 h-3" />}
          {trend === "flat" && <Minus className="w-3 h-3" />}
          {data.trend > 0 && "+"}
          {data.trend.toFixed(1)}%
        </span>
      </div>

      {/* New / Returning mini-breakdown */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            New
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {formatNumber(data.new)}{" "}
            <span className="text-slate-400 font-normal">({newPct}%)</span>
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Returning
          </span>
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            {formatNumber(data.returning)}{" "}
            <span className="text-slate-400 font-normal">({returningPct}%)</span>
          </span>
        </div>
      </div>
    </div>
  );
}