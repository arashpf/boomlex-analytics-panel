// components/agents/AgentPaidTable.tsx
//
// Table of most-paid agents (by completed payments).

import { formatNumber, formatToman } from "@/lib/formatters";
import type { AgentPaidStat } from "@/lib/types";

interface Props {
  data: AgentPaidStat[];
  emptyText?: string;
}

export function AgentPaidTable({
  data,
  emptyText = "No payments in this range",
}: Props) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Most Paid Agents
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          By total completed payment revenue
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
                  Payments
                </th>
                <th className="text-right font-medium px-5 py-2.5 w-40">
                  Total Income
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((agent, idx) => (
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
                  <td className="px-3 py-3 text-right text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                    {formatNumber(agent.payments)}
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatToman(agent.total_income)}
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