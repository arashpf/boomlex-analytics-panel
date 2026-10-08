// components/plans/PlansTable.tsx
//
// Reusable table for plan analytics.

import { formatNumber, formatToman } from "@/lib/formatters";
import type { PlanStat } from "@/lib/types";

interface Props {
  title: string;
  data: PlanStat[];
  primaryMetric: "sold" | "revenue";
  emptyText?: string;
  highlightLeast?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  urgent:  "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
  special: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  calls:   "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
};

export function PlansTable({
  title,
  data,
  primaryMetric,
  emptyText = "No data",
  highlightLeast = false,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="text-left font-medium px-5 py-2.5 w-10">#</th>
                <th className="text-left font-medium px-3 py-2.5">Plan</th>
                <th className="text-right font-medium px-3 py-2.5 w-24">
                  Sold
                </th>
                <th className="text-right font-medium px-5 py-2.5 w-36">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((plan, idx) => {
                const typeColor = TYPE_COLORS[plan.plan_type] || "bg-slate-100 text-slate-600";

                return (
                  <tr
                    key={plan.plan_id}
                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3 text-xs text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${typeColor}`}
                        >
                          {plan.plan_type}
                        </span>
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {plan.plan_title}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        {plan.plan_id}
                      </div>
                    </td>
                    <td
                      className={
                        "px-3 py-3 text-right tabular-nums " +
                        (primaryMetric === "sold"
                          ? "text-sm font-semibold text-slate-900 dark:text-slate-100"
                          : "text-sm text-slate-500 dark:text-slate-400")
                      }
                    >
                      {formatNumber(plan.sold)}
                    </td>
                    <td
                      className={
                        "px-5 py-3 text-right tabular-nums " +
                        (primaryMetric === "revenue"
                          ? "text-sm font-semibold text-emerald-600 dark:text-emerald-400"
                          : "text-sm text-slate-500 dark:text-slate-400")
                      }
                    >
                      {plan.revenue > 0 ? formatToman(plan.revenue) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}