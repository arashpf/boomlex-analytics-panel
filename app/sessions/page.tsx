// app/sessions/page.tsx
//
// Sessions page — session length, duration, and bounce rate.

"use client";

import { useEffect, useState } from "react";
import { Users, Clock, LogOut } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { SessionDistribution } from "@/components/sessions/SessionDistribution";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { formatDuration, formatNumber, formatPercent } from "@/lib/formatters";
import type { DateRange, SessionsResponse } from "@/lib/types";

export default function SessionsPage() {
  const [range, setRange] = useState<DateRange>("7d");
  const [data, setData] = useState<SessionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/sessions?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: SessionsResponse) => {
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
            Sessions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            How long users stay on the site
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading sessions..." />
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Total Sessions"
              value={data.total_sessions}
              icon={<Users className="w-4 h-4 text-slate-400" />}
              hint="30-min windows"
            />
            <StatCard
              label="Avg Duration"
              value={formatDuration(data.avg_session_seconds)}
              icon={<Clock className="w-4 h-4 text-slate-400" />}
              hint="Per session"
            />
            <StatCard
              label="Bounce Rate"
              value={formatPercent(data.bounce_rate)}
              icon={<LogOut className="w-4 h-4 text-slate-400" />}
              hint="Single-event sessions"
            />
          </div>

          {/* Distribution */}
          <SessionDistribution
            buckets={data.distribution}
            totalSessions={data.total_sessions}
          />

          {/* Insight box */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              What this means
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">●</span>
                <span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {formatNumber(
                      data.distribution.find((b) => b.bucket === "2m-10m")
                        ?.sessions || 0
                    )}{" "}
                    engaged sessions
                  </strong>{" "}
                  in the 2-10 minute range — users who really explored listings.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">●</span>
                <span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {formatNumber(
                      data.distribution.find((b) => b.bucket === "10m+")
                        ?.sessions || 0
                    )}{" "}
                    power users
                  </strong>{" "}
                  stayed 10+ minutes — your most valuable visitors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">●</span>
                <span>
                  <strong className="text-slate-800 dark:text-slate-200">
                    {formatNumber(
                      data.distribution.find((b) => b.bucket === "0-30s")
                        ?.sessions || 0
                    )}{" "}
                    bounces
                  </strong>{" "}
                  left within 30 seconds — worth investigating.
                </span>
              </li>
            </ul>
          </div>
        </>
      )}
    </PageShell>
  );
}