// components/cities/CitiesTable.tsx
//
// Reusable city metric table.
// Shows city name + one primary metric + optional secondary columns.

import { formatNumber, formatToman, formatPercent } from "@/lib/formatters";
import type { CityMetrics } from "@/lib/types";

type MetricKey =
  | "income"
  | "city_views"
  | "category_views"
  | "listing_views";

interface Props {
  title: string;
  data: CityMetrics[];
  metric: MetricKey;
  showIncome?: boolean;
  emptyText?: string;
}

export function CitiesTable({
  title,
  data,
  metric,
  showIncome = false,
  emptyText = "No data in this range",
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      </div>

      {/* Body */}
      {data.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="text-left font-medium px-5 py-2.5 w-10">#</th>
                <th className="text-left font-medium px-3 py-2.5">City</th>
                <th className="text-right font-medium px-3 py-2.5 w-28">
                  {labelFor(metric)}
                </th>
                {metric !== "income" && (
                  <th className="text-right font-medium px-3 py-2.5 w-24">
                    Users
                  </th>
                )}
                {showIncome && metric !== "income" && (
                  <th className="text-right font-medium px-5 py-2.5 w-32">
                    Income
                  </th>
                )}
                {metric === "income" && (
                  <th className="text-right font-medium px-5 py-2.5 w-24">
                    % Total
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.city_id}
                  className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <td className="px-5 py-3 text-xs text-slate-400 tabular-nums">
                    {idx + 1}
                  </td>

                  <td className="px-3 py-3">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {row.city_title}
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {row.city_slug}
                    </div>
                  </td>

                  {/* Primary metric */}
                  <td className="px-3 py-3 text-right tabular-nums text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {metric === "income"
                      ? formatToman(row.income)
                      : formatNumber(row[metric])}
                  </td>

                  {/* Users column (for non-income metrics) */}
                  {metric !== "income" && (
                    <td className="px-3 py-3 text-right tabular-nums text-sm text-slate-500 dark:text-slate-400">
                      {formatNumber(row.unique_users)}
                    </td>
                  )}

                  {/* Income column (for non-income metrics with showIncome) */}
                  {showIncome && metric !== "income" && (
                    <td className="px-5 py-3 text-right tabular-nums text-sm text-slate-500 dark:text-slate-400">
                      {row.income > 0 ? formatToman(row.income) : "—"}
                    </td>
                  )}

                  {/* % Total column (for income metric) */}
                  {metric === "income" && (
                    <td className="px-5 py-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 tabular-nums">
                        {formatPercent(row.income_pct)}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function labelFor(metric: MetricKey): string {
  return {
    income: "Income",
    city_views: "City Views",
    category_views: "Category Views",
    listing_views: "Listing Views",
  }[metric];
}