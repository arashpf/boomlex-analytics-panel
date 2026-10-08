// app/cities/page.tsx
//
// Cities page — income + views breakdown by city.

"use client";

import { useEffect, useState } from "react";
import { MapPin, Activity, Coins } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { CitiesTable } from "@/components/cities/CitiesTable";
import { DonutChart } from "@/components/charts/DonutChart";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { formatToman } from "@/lib/formatters";
import type { DateRange, CitiesResponse } from "@/lib/types";

export default function CitiesPage() {
  const [range, setRange] = useState<DateRange>("7d");
  const [data, setData] = useState<CitiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/cities?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: CitiesResponse) => {
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
            Cities
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Where users browse and where revenue comes from
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading cities..." />
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
              label="Cities Active"
              value={data.summary.cities_active}
              icon={<MapPin className="w-4 h-4 text-slate-400" />}
              hint="Cities with activity"
            />
            <StatCard
              label="Total Events"
              value={data.summary.total_events}
              icon={<Activity className="w-4 h-4 text-slate-400" />}
              hint="Across all cities"
            />
            <StatCard
              label="Total Income"
              value={formatToman(data.summary.total_income)}
              icon={<Coins className="w-4 h-4 text-slate-400" />}
              hint="From paid listings"
            />
          </div>

          {/* Income table + donut */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <CitiesTable
                title="Top Cities by Income"
                data={data.top_by_income}
                metric="income"
                emptyText="No income in this range"
              />
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 pb-12">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Income Split
              </h3>
              <DonutChart
                data={data.income_donut}
                centerLabel="Total"
                centerValue={data.summary.total_income}
              />
            </div>
          </div>

          {/* Views tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CitiesTable
              title="Top Cities by City Views"
              data={data.top_by_city_views}
              metric="city_views"
              showIncome
              emptyText="No city views"
            />
            <CitiesTable
              title="Top Cities by Category Views"
              data={data.top_by_category_views}
              metric="category_views"
              showIncome
              emptyText="No category views"
            />
            <CitiesTable
              title="Top Cities by Listing Views"
              data={data.top_by_listing_views}
              metric="listing_views"
              showIncome
              emptyText="No listing views"
            />
          </div>
        </>
      )}
    </PageShell>
  );
}