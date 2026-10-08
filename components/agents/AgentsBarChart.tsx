// components/agents/AgentsBarChart.tsx
//
// Vertical bar chart of Top 5 cities by active agents.
// Persian city names below each bar, blue gradient.

"use client";

import { formatNumber } from "@/lib/formatters";
import type { AgentCityStat } from "@/lib/types";

interface Props {
  data: AgentCityStat[];
}

export function AgentsBarChart({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Top Cities by Active Agents
        </h3>
        <p className="text-sm text-slate-400 text-center py-12">
          No city data in this range
        </p>
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.agent_count), 1);

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Top Cities by Active Agents
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Agents with listings in each city
          </p>
        </div>
      </div>

      {/* Bar chart — height-based vertical bars */}
      <div className="flex items-end justify-around gap-3 h-[220px]">
        {data.map((city, idx) => {
          const heightPct = (city.agent_count / max) * 100;

          // Deep-to-light blue gradient based on rank
          const blues = [
            "from-blue-600 to-blue-800",
            "from-blue-500 to-blue-700",
            "from-blue-500 to-blue-700",
            "from-blue-400 to-blue-600",
            "from-blue-400 to-blue-600",
          ];
          const gradient = blues[idx] || blues[blues.length - 1];

          return (
            <div
              key={city.city_id}
              className="flex-1 flex flex-col items-center justify-end h-full"
            >
              {/* Value above bar */}
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 tabular-nums">
                {formatNumber(city.agent_count)}
              </span>

              {/* The bar */}
              <div
                className={`w-full max-w-[60px] rounded-t-md bg-gradient-to-b ${gradient} transition-all duration-500`}
                style={{
                  height: `${Math.max(heightPct, 3)}%`,
                }}
              />

              {/* City name below bar */}
              <div className="mt-3 text-center">
                <div
                  className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[90px]"
                  title={city.city_title}
                >
                  {city.city_title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}