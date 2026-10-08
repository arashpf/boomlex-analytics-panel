// app/agents/page.tsx
//
// Agents page — real-estate agent activity & revenue.
// 4 KPIs + vertical bar chart + 2 tables.

"use client";

import { useEffect, useState } from "react";
import { Users, CreditCard, FileX, RotateCcw } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { AgentsBarChart } from "@/components/agents/AgentsBarChart";
import { AgentViewsTable } from "@/components/agents/AgentViewsTable";
import { AgentPaidTable } from "@/components/agents/AgentPaidTable";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { DateRange, AgentsResponse } from "@/lib/types";

export default function AgentsPage() {
  const [range, setRange] = useState<DateRange>("7d");
  const [data, setData] = useState<AgentsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/agents?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: AgentsResponse) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Agents
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-estate agent activity and revenue
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading agents..." />
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* 4 KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Agents"
              value={data.summary.total_agents}
              icon={<Users className="w-4 h-4 text-slate-400" />}
              hint="Active in range"
            />
            <StatCard
              label="Paid Agents"
              value={`${formatPercent(data.summary.paid_agents_pct)} (${
                data.summary.paid_agents_count
              })`}
              icon={<CreditCard className="w-4 h-4 text-slate-400" />}
              hint="At least 1 payment"
            />
            <StatCard
              label="No-Listing Agents"
              value={data.summary.no_listing_agents}
              icon={<FileX className="w-4 h-4 text-slate-400" />}
              hint="Signed up, never posted"
            />
            <StatCard
              label="Returned Agents"
              value={formatPercent(data.summary.returned_agents_pct)}
              icon={<RotateCcw className="w-4 h-4 text-slate-400" />}
              hint="Posted again in range"
            />
          </div>

          {/* Vertical bar chart — Top 5 cities */}
          <AgentsBarChart data={data.top_cities} />

          {/* Two tables side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AgentViewsTable data={data.top_visited_agents} />
            <AgentPaidTable data={data.top_paid_agents} />
          </div>
        </>
      )}
    </PageShell>
  );
}