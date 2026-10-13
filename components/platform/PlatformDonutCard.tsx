// components/platform/PlatformDonutCard.tsx
//
// A single donut card showing Web vs App split for one metric.

"use client";

import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber, formatToman, formatPercent } from "@/lib/formatters";
import type { PlatformBreakdownRow } from "@/lib/types";

const WEB_COLOR = "#3b82f6";   // blue-500
const APP_COLOR = "#a855f7";   // purple-500

interface Props {
  row: PlatformBreakdownRow;
  featured?: boolean;
}

export function PlatformDonutCard({ row, featured = false }: Props) {
  const isMoney = row.is_money;

  // Empty state
  if (row.total === 0) {
    return (
      <div
        className={
          "rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 " +
          (featured ? "col-span-full" : "")
        }
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {row.label}
          </h3>
          <span className="text-xs text-slate-400">No data</span>
        </div>
        <div className="h-[180px] flex items-center justify-center text-sm text-slate-400">
          —
        </div>
      </div>
    );
  }

  // Build pie data (skip zero values so the donut renders cleanly)
  const pieData: { name: string; value: number; color: string; pct: number }[] = [];
  if (row.web > 0) {
    pieData.push({ name: "Web", value: row.web, color: WEB_COLOR, pct: row.web_pct });
  }
  if (row.app > 0) {
    pieData.push({ name: "App", value: row.app, color: APP_COLOR, pct: row.app_pct });
  }

  const formatValue = (v: number) => (isMoney ? formatToman(v) : formatNumber(v));

  return (
    <div
      className={
        "rounded-lg border bg-white dark:bg-slate-900 p-5 transition " +
        (featured
          ? "col-span-full border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/30 to-transparent dark:from-emerald-950/20"
          : "border-slate-200 dark:border-slate-800")
      }
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {row.label}
          </h3>
          {featured && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              Money
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 tabular-nums">
          {formatValue(row.total)}
        </span>
      </div>

      <div className={featured ? "flex items-center justify-center gap-12" : ""}>
        {/* Donut chart */}
        <div
          className="relative"
          style={{
            height: featured ? 220 : 180,
            width: featured ? 220 : "100%",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RPieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={featured ? 90 : 65}
                innerRadius={featured ? 62 : 45}
                paddingAngle={2}
                stroke="none"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  formatValue(typeof value === "number" ? value : 0),
                  String(name ?? ""),
                ]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #334155",
                  background: "#0f172a",
                  fontSize: 12,
                  color: "#e2e8f0",
                }}
              />
            </RPieChart>
          </ResponsiveContainer>

          {/* Center label — Web % */}
          {row.web > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-[10px] uppercase tracking-wide text-slate-400">
                Web
              </div>
              <div
                className={
                  "font-bold tabular-nums " +
                  (featured ? "text-2xl" : "text-lg") +
                  " text-slate-900 dark:text-slate-100"
                }
              >
                {formatPercent(row.web_pct)}
              </div>
            </div>
          )}
        </div>

        {/* Legend — inline for featured, below for regular */}
        {featured ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ background: WEB_COLOR }} />
                <span className="text-sm text-slate-600 dark:text-slate-400">Web</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatValue(row.web)}
              </div>
              <div className="text-xs text-slate-400">{formatPercent(row.web_pct)}</div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block w-3 h-3 rounded-sm" style={{ background: APP_COLOR }} />
                <span className="text-sm text-slate-600 dark:text-slate-400">App</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                {formatValue(row.app)}
              </div>
              <div className="text-xs text-slate-400">{formatPercent(row.app_pct)}</div>
            </div>
          </div>
        ) : (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-block w-2 h-2 rounded-sm" style={{ background: WEB_COLOR }} />
                <span className="text-slate-500 dark:text-slate-400">Web</span>
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                {formatValue(row.web)}
                <span className="text-slate-400 font-normal ml-1">
                  ({formatPercent(row.web_pct)})
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-block w-2 h-2 rounded-sm" style={{ background: APP_COLOR }} />
                <span className="text-slate-500 dark:text-slate-400">App</span>
              </div>
              <div className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                {formatValue(row.app)}
                <span className="text-slate-400 font-normal ml-1">
                  ({formatPercent(row.app_pct)})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}