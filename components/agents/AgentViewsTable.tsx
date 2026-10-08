// components/agents/AgentViewsTable.tsx
//
// Table of most-visited agents (by listing view count).

import { formatNumber } from "@/lib/formatters";
import type { AgentVisitedStat } from "@/lib/types";

interface Props {
  data: AgentVisitedStat[];
  emptyText?: string;
}

export function AgentViewsTable({
  data,
  emptyText = "No agent activity in this range",
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Most Visited Agents
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          By total listing views
        </p>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-8">{emptyText}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <th className="text-left font-medium px-5 py-2.5 w-12">#</th>
                <th className="text-left font-medium px-3 py-2.5">Agent ID</th>
                <th className="text-right font-medium px-3 py-2.5 w-24">
                  Views
                </th>
                <th className="text-right font-medium px-3 py-2.5 w-28">
                  Listings
                </th>
                <th className="text-right font-medium px-5 py-2.5 w-28">
                  Avg / Listing
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((agent, idx) => {
                const avg =
                  agent.listings_count > 0
                    ? Math.round(agent.views / agent.listings_count)
                    : 0;

                return (
                  <tr
                    key={agent.agent_id}
                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                  >
                    <td className="px-5 py-3 text-xs text-slate-400 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                      #{agent.agent_id}
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatNumber(agent.views)}
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                      {formatNumber(agent.listings_count)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={
                          "inline-block px-2 py-0.5 rounded text-xs font-medium tabular-nums " +
                          (avg >= 10
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : avg >= 5
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400")
                        }
                      >
                        {formatNumber(avg)}
                      </span>
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