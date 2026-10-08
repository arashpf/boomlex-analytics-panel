// components/cards/TrendCard.tsx

import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatNumber } from "@/lib/formatters";

interface TrendCardProps {
  label: string;
  value: number;
  changePercent?: number;
  icon?: ReactNode;
  formatter?: (v: number) => string;
}

export function TrendCard({
  label,
  value,
  changePercent,
  icon,
  formatter,
}: TrendCardProps) {
  const trend =
    changePercent === undefined || changePercent === 0
      ? "flat"
      : changePercent > 0
        ? "up"
        : "down";

  const formattedValue = formatter ? formatter(value) : formatNumber(value);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          {formattedValue}
        </span>
        {changePercent !== undefined && (
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
            {changePercent > 0 && "+"}
            {changePercent.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}