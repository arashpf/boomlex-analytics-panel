// app/listings/page.tsx
//
// Listings page — top viewed and top called listings.

"use client";

import { useEffect, useState } from "react";
import { Eye, Phone, Heart, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { ListingsTable } from "@/components/listings/ListingsTable";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import type { DateRange, ListingsResponse } from "@/lib/types";

export default function ListingsPage() {
  const [range, setRange] = useState<DateRange>("24h");
  const [data, setData] = useState<ListingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/listings?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: ListingsResponse) => {
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
            Listings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Which listings perform best
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading listings..." />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Listings Viewed"
              value={data.summary.listings_viewed}
              icon={<TrendingUp className="w-4 h-4 text-slate-400" />}
              hint="Unique listings"
            />
            <StatCard
              label="Total Views"
              value={data.summary.total_views}
              icon={<Eye className="w-4 h-4 text-slate-400" />}
            />
            <StatCard
              label="Total Calls"
              value={data.summary.total_calls}
              icon={<Phone className="w-4 h-4 text-slate-400" />}
            />
            <StatCard
              label="Total Favorites"
              value={data.summary.total_favorites}
              icon={<Heart className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ListingsTable
              title="Top Viewed Listings"
              data={data.top_viewed}
              primaryMetric="views"
            />
            <ListingsTable
              title="Top Called Listings"
              data={data.top_called}
              primaryMetric="calls"
              emptyText="No calls in this range"
            />
          </div>
        </>
      )}
    </PageShell>
  );
}