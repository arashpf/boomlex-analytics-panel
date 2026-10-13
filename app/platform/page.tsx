// app/platform/page.tsx
//
// Platform page — Web vs App split across every event type.

"use client";

import { useEffect, useState } from "react";
import { Activity, Monitor, Smartphone, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { PlatformDonutCard } from "@/components/platform/PlatformDonutCard";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { DateRange, PlatformResponse } from "@/lib/types";

export default function PlatformPage() {
  const [range, setRange] = useState<DateRange>("7d");
  const [data, setData] = useState<PlatformResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/platform?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: PlatformResponse) => {
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
            Platform
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Web vs App — where your users are
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading platform data..." />
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Events"
              value={data.summary.total_events}
              icon={<Activity className="w-4 h-4 text-slate-400" />}
              hint="All platforms"
            />
            <StatCard
              label="Web Share"
              value={formatPercent(data.summary.web_pct)}
              icon={<Monitor className="w-4 h-4 text-blue-500" />}
              hint={`${formatNumber(data.summary.web_count)} events`}
            />
            <StatCard
              label="App Share"
              value={formatPercent(data.summary.app_pct)}
              icon={<Smartphone className="w-4 h-4 text-purple-500" />}
              hint={`${formatNumber(data.summary.app_count)} events`}
            />
            <StatCard
              label="Web / App Ratio"
              value={data.summary.ratio !== null ? `${data.summary.ratio}x` : "—"}
              icon={<TrendingUp className="w-4 h-4 text-slate-400" />}
              hint={
                data.summary.ratio !== null && data.summary.ratio > 1
                  ? "More web users"
                  : "More app users"
              }
            />
          </div>

          {/* Income — featured wide card */}
          <PlatformDonutCard row={data.income} featured />

          {/* Event breakdown grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Event Types
              </h3>
              <span className="text-xs text-slate-400">
                {data.breakdown.length} metrics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.breakdown.map((row) => (
                <PlatformDonutCard key={row.event_key} row={row} />
              ))}
            </div>
          </div>
        </>
      )}
    </PageShell>
  );
}