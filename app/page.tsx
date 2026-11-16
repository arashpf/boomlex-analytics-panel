// app/page.tsx
//
// Overview page — real data from Laravel.
// Net Income | Listing Calls | Listing SMS | Active Users | Listings Views

"use client";

import { useEffect, useState } from "react";
import { Coins, Activity, Users, Eye, MessageSquare } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { TrendCard } from "@/components/cards/TrendCard";
import { StatCard } from "@/components/cards/StatCard";
import { TopListCard } from "@/components/cards/TopListCard";
import { ActiveUsersCard } from "@/components/cards/ActiveUsersCard";
import { LineChart } from "@/components/charts/LineChart";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatNumber, formatToman } from "@/lib/formatters";
import type { DateRange, OverviewResponse } from "@/lib/types";

export default function OverviewPage() {
  // const [range, setRange] = useState<DateRange>("7d");
  const [range, setRange] = useState<DateRange>("24h");
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/overview?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: OverviewResponse) => {
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
            Overview
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time snapshot  is here
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading..." />
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* KPI cards - Changed to lg:grid-cols-5 to fit the new SMS card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <TrendCard
              label="Net Income"
              value={data.net_income.total}
              changePercent={data.net_income.trend}
              icon={<Coins className="w-4 h-4 text-slate-400" />}
              formatter={(v) => formatToman(v)}
            />
            <TrendCard
              label="Listing Calls"
              value={data.listing_calls.total}
              changePercent={data.listing_calls.trend}
              icon={<Activity className="w-4 h-4 text-slate-400" />}
            />
            {/* NEW: Listing SMS Card */}
            <TrendCard
              label="Listing SMS"
              value={data.listing_sms?.total || 0}
              changePercent={data.listing_sms?.trend}
              icon={<MessageSquare className="w-4 h-4 text-slate-400" />}
            />
            <ActiveUsersCard
              data={data.active_users}
              icon={<Users className="w-4 h-4 text-slate-400" />}
            />
            <TrendCard
              label="Listings Views"
              value={data.listings_views.total}
              changePercent={data.listings_views.trend}
              icon={<Eye className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Chart + Top Events */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Net Income Over Time
              </h3>
              <LineChart
                data={data.net_income.points}
                dataKey="amount"
                color="#10b981"
                labelFormatter={(v) => formatToman(v)}
              />
            </div>

            <TopListCard
              title="Top Events"
              items={data.top_events.map((e) => ({
                label: e.event_name,
                value: formatNumber(e.count),
              }))}
              emptyText="No events yet"
            />
          </div>
        </>
      )}
    </PageShell>
  );
}