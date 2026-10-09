// components/search/FilterTable.tsx
//
// Table of the latest 50 filter applications.

import { formatNumber, formatRelativeTime } from "@/lib/formatters";
import type { FilterRow } from "@/lib/types";

interface Props {
  data: FilterRow[];
}

export function FilterTable({ data }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Last 50 Filters Applied
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Filter combinations and results
          </p>
        </div>
        <span className="text-xs text-slate-400">
          {formatNumber(data.length)} rows
        </span>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">
          No filters applied in this range
        </p>
      ) : (
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
              <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="text-left font-medium px-5 py-2.5 w-12">#</th>
                <th className="text-left font-medium px-3 py-2.5">Filters</th>
                <th className="text-left font-medium px-3 py-2.5 w-36">Context</th>
                <th className="text-right font-medium px-3 py-2.5 w-24">
                  Results
                </th>
                <th className="text-right font-medium px-3 py-2.5 w-32">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                const isZero = row.results_count === 0;

                return (
                  <tr
                    key={row.id}
                    className={
                      "border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition align-top " +
                      (isZero ? "bg-red-50/50 dark:bg-red-950/20" : "")
                    }
                  >
                    <td className="px-5 py-3 text-xs text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>

                    <td className="px-3 py-3">
                      {row.is_reset ? (
                        <span className="inline-block px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-500">
                          Reset filters
                        </span>
                      ) : row.filters.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">
                          No filters
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {row.filters.map((f, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            >
                              <span className="text-slate-500 dark:text-slate-400">
                                {f.key}:
                              </span>
                              <span className="font-medium">{f.value}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-3">
                      <div className="text-xs font-mono text-slate-600 dark:text-slate-400">
                        {row.city_slug || "—"}
                      </div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-500 mt-0.5">
                        {row.category_slug || ""}
                      </div>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <span
                        className={
                          "inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums " +
                          (isZero
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : row.results_count < 5
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400")
                        }
                      >
                        {formatNumber(row.results_count)}
                      </span>
                    </td>

                    <td className="px-3 py-3 text-right text-xs text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(row.created_at)}
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