// components/funnels/FunnelBar.tsx
//
// Funnel visualization with centered % overlay on each bar.
// Step 1 = baseline (gray bar, no %).
// Steps 2+ = green bar with big centered % + count on the right.
// Between rows: a compact drop-off indicator.

import { ArrowDown } from "lucide-react";
import { formatNumber } from "@/lib/formatters";
import type { Funnel } from "@/lib/types";

interface Props {
  funnel: Funnel;
}

export function FunnelBar({ funnel }: Props) {
  const maxCount = funnel.steps[0]?.count ?? 0;

  // No data case
  if (maxCount === 0) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {funnel.name}
          </h3>
          <span className="text-xs text-slate-400">No data</span>
        </div>
        <p className="text-sm text-slate-400 py-6 text-center">
          No users entered this funnel in the selected range.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {funnel.name}
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {formatNumber(maxCount)} starting {maxCount === 1 ? "user" : "users"}
        </span>
      </div>

      {/* Steps */}
      <div>
        {funnel.steps.map((step, idx) => {
          const isFirst = idx === 0;
          const widthPct =
            maxCount > 0 ? Math.max((step.count / maxCount) * 100, 1.5) : 1.5;

          const prevStep = funnel.steps[idx - 1];
          const dropOff =
            prevStep && prevStep.count > 0 ? prevStep.count - step.count : 0;

          return (
            <div key={step.event_name}>
              {/* Compact drop-off indicator (between steps) */}
              {!isFirst && prevStep && (
                <div className="flex items-center gap-1.5 py-1.5 pl-3 text-[10px] text-slate-400">
                  <ArrowDown className="w-3 h-3" />
                  {dropOff > 0 ? (
                    <span>{formatNumber(dropOff)} dropped off</span>
                  ) : (
                    <span>no drop-off</span>
                  )}
                </div>
              )}

              {/* Row: label + count above; bar with centered % */}
              <div className="mb-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={
                      isFirst
                        ? "text-sm text-slate-500 dark:text-slate-400"
                        : "text-sm text-slate-700 dark:text-slate-300"
                    }
                  >
                    {step.step}
                  </span>
                  <span
                    className={
                      "text-sm tabular-nums " +
                      (isFirst
                        ? "text-slate-500 dark:text-slate-400"
                        : "font-medium text-slate-900 dark:text-slate-100")
                    }
                  >
                    {formatNumber(step.count)}
                  </span>
                </div>

                {/* Bar with centered % overlay */}
                <div className="relative h-7 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md transition-all duration-500"
                    style={{
                      width: `${widthPct}%`,
                      background: isFirst
                        ? "linear-gradient(90deg, #64748b 0%, #475569 100%)"
                        : "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                    }}
                  />

                  {/* Big centered % overlay (only for steps 2+) */}
                  {!isFirst && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span
                        className="text-white font-bold text-base tracking-wide"
                        style={{
                          textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                        }}
                      >
                        {step.conversion.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}