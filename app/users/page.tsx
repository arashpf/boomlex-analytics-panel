// app/users/page.tsx
//
// User Journeys — the full story of what each user did on the site.

"use client";

import { useEffect, useState } from "react";
import { Route, Phone, MessageCircle, Search } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { JourneyCard } from "@/components/users/JourneyCard";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { DateRange, UserJourneysResponse } from "@/lib/types";

export default function UsersPage() {
  const [range, setRange] = useState<DateRange>("24h");
  const [data, setData] = useState<UserJourneysResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/user-journeys?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: UserJourneysResponse) => {
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
            User Journeys
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            The full story of what each user did
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading journeys..." />
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
              label="Landed → Navigated"
              value={formatPercent(data.summary.navigated_pct)}
              icon={<Route className="w-4 h-4 text-slate-400" />}
              hint={`${formatNumber(data.summary.navigated_count)} of ${formatNumber(data.summary.total_users)} users`}
            />
            <StatCard
              label="Landed → Called"
              value={formatPercent(data.summary.called_pct)}
              icon={<Phone className="w-4 h-4 text-slate-400" />}
              hint={`${formatNumber(data.summary.called_count)} of ${formatNumber(data.summary.total_users)} users`}
            />
            <StatCard
              label="Landed → Contact Intent"
              value={formatPercent(data.summary.intent_pct)}
              icon={<MessageCircle className="w-4 h-4 text-slate-400" />}
              hint={`${formatNumber(data.summary.intent_count)} of ${formatNumber(data.summary.total_users)} users`}
            />
            <StatCard
              label="Landed → Searched/Filtered"
              value={formatPercent(data.summary.searched_pct)}
              icon={<Search className="w-4 h-4 text-slate-400" />}
              hint={`${formatNumber(data.summary.searched_count)} of ${formatNumber(data.summary.total_users)} users`}
            />
          </div>

          {/* Journeys list */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Latest {data.journeys.length} User Journeys
              </h3>
              <span className="text-xs text-slate-400">
                Of {formatNumber(data.summary.total_users)} total users
              </span>
            </div>

            {data.journeys.length === 0 ? (
              <EmptyState
                title="No journeys yet"
                description="Users will appear here once they start browsing."
              />
            ) : (
              <div className="space-y-4">
                {data.journeys.map((journey) => (
                  <JourneyCard key={journey.anonymous_id} journey={journey} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </PageShell>
  );
}