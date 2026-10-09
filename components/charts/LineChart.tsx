// components/charts/LineChart.tsx
//
// Generic line chart. Works with either `count` or `amount` as the Y value.

"use client";

import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatDateShort, formatCompact, formatNumber } from "@/lib/formatters";

interface Props {
  data: Array<{ date: string; count?: number; amount?: number }>;
  height?: number;
  color?: string;
  dataKey?: "count" | "amount";
  labelFormatter?: (value: number) => string;
}

export function LineChart({
  data,
  height = 280,
  color = "#ffffff",
  dataKey = "count",
  labelFormatter,
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

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tickFormatter={formatDateShort}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCompact(v)}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
                    <Tooltip
            labelFormatter={(v) => formatDateShort(v as string)}
            formatter={(value) => {
              const num = typeof value === "number" ? value : 0;
              return labelFormatter ? labelFormatter(num) : formatNumber(num);
            }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #334155",
              background: "#0f172a",
              fontSize: 12,
              color: "#e2e8f0",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}