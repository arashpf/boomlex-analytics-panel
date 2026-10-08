// components/listings/ListingsTable.tsx
//
// Reusable table for listings: shows listing_id, views, calls, conversion %.
// Rows link to the live listing on ajur.app in a new tab.

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { formatNumber } from "@/lib/formatters";
import type { ListingStat } from "@/lib/types";

interface Props {
  title: string;
  data: ListingStat[];
  // Which column to emphasize (bold + big)
  primaryMetric: "views" | "calls";
  emptyText?: string;
}

export function ListingsTable({
  title,
  data,
  primaryMetric,
  emptyText = "No listings in this range",
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
                <th className="text-left font-medium px-5 py-2.5 w-12">#</th>
                <th className="text-left font-medium px-3 py-2.5">
                  Listing ID
                </th>
                <th className="text-right font-medium px-3 py-2.5 w-24">
                  Views
                </th>
                <th className="text-right font-medium px-3 py-2.5 w-24">
                  Calls
                </th>
                <th className="text-right font-medium px-5 py-2.5 w-28">
                  Conversion
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, idx) => (
                <tr
                  key={row.listing_id}
                  className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  {/* Rank */}
                  <td className="px-5 py-3 text-xs text-slate-400 tabular-nums">
                    {idx + 1}
                  </td>

                  {/* Listing ID — clickable */}
                  <td className="px-3 py-3">
                    <Link
                      href={`https://ajur.app/worker/${row.listing_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition group"
                    >
                      <span className="tabular-nums">
                        #{row.listing_id}
                      </span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-60 transition" />
                    </Link>
                  </td>

                  {/* Views */}
                  <td
                    className={
                      "px-3 py-3 text-right tabular-nums " +
                      (primaryMetric === "views"
                        ? "text-sm font-semibold text-slate-900 dark:text-slate-100"
                        : "text-sm text-slate-500 dark:text-slate-400")
                    }
                  >
                    {formatNumber(row.views)}
                  </td>

                  {/* Calls */}
                  <td
                    className={
                      "px-3 py-3 text-right tabular-nums " +
                      (primaryMetric === "calls"
                        ? "text-sm font-semibold text-slate-900 dark:text-slate-100"
                        : "text-sm text-slate-500 dark:text-slate-400")
                    }
                  >
                    {formatNumber(row.calls)}
                  </td>

                  {/* Conversion */}
                  <td className="px-5 py-3 text-right">
                    <ConversionBadge value={row.conversion} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Conversion badge with color coding
// ─────────────────────────────────────────────────────────────

function ConversionBadge({ value }: { value: number }) {
  if (value === 0) {
    return (
      <span className="inline-block text-xs text-slate-400 tabular-nums">
        0%
      </span>
    );
  }

  const color =
    value >= 50
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
      : value >= 20
        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums ${color}`}
    >
      {value.toFixed(1)}%
    </span>
  );
}