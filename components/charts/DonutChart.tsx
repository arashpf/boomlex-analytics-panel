// components/charts/DonutChart.tsx
//
// Donut chart for showing share-of-total.
// Renders a center label with the total value.

"use client";

import {
  PieChart as RPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatToman, formatPercent } from "@/lib/formatters";
import type { IncomeDonutSlice } from "@/lib/types";

interface Props {
  data: IncomeDonutSlice[];
  height?: number;
  centerLabel?: string;
  centerValue?: number;
}

const COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#94a3b8", // slate (Other)
];

export function DonutChart({
  data,
  height = 260,
  centerLabel = "Total",
  centerValue,
}: Props) {
  if (!data || data.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-sm text-slate-400"
      >
        No data
      </div>
    );
  }

  const total = centerValue ?? data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={62}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [
              formatToman(value),
              name,
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

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {centerLabel}
        </div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
          {formatToman(total)}
        </div>
      </div>

      {/* Legend below */}
      <div className="absolute -bottom-2 left-0 right-0 flex flex-wrap justify-center gap-3 text-xs">
        {data.map((slice, idx) => (
          <div key={idx} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm"
              style={{ background: COLORS[idx % COLORS.length] }}
            />
            <span className="text-slate-600 dark:text-slate-400">
              {slice.label}
            </span>
            <span className="text-slate-400 font-medium tabular-nums">
              {formatPercent(slice.pct)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}