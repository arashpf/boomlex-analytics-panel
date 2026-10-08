// app/plans/page.tsx
//
// Upgrade Plans page — sales analytics for the 9 plan catalog.

"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, XCircle, Coins, Package } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { PlansTable } from "@/components/plans/PlansTable";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { formatNumber, formatToman, formatPercent } from "@/lib/formatters";
import type { DateRange, PlansResponse } from "@/lib/types";

export default function PlansPage() {
  const [range, setRange] = useState<DateRange>("7d");
  const [data, setData] = useState<PlansResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/plans?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: PlansResponse) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Upgrade Plans
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Plan sales, revenue, and conversion
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading plans..." />
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
              label="Paid Listings"
              value={data.summary.paid_listings}
              icon={<ShoppingBag className="w-4 h-4 text-slate-400" />}
              hint="Distinct listings bought upgrades"
            />
            <StatCard
              label="Failed / Abandoned"
              value={formatPercent(data.summary.failed_pct)}
              icon={<XCircle className="w-4 h-4 text-slate-400" />}
              hint={`${formatNumber(data.summary.failed_count)} of ${formatNumber(data.summary.total_attempts)} attempts`}
            />
            <StatCard
              label="Total Revenue"
              value={formatToman(data.summary.total_revenue)}
              icon={<Coins className="w-4 h-4 text-slate-400" />}
              hint="From completed payments"
            />
            <StatCard
              label="Plans Sold"
              value={data.summary.total_plans_sold}
              icon={<Package className="w-4 h-4 text-slate-400" />}
              hint="Total plan units"
            />
          </div>

          {/* Top by Sales + Top by Income */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PlansTable
              title="Top 3 by Sales"
              data={data.top_by_sold}
              primaryMetric="sold"
            />
            <PlansTable
              title="Top 3 by Income"
              data={data.top_by_income}
              primaryMetric="revenue"
            />
          </div>

          {/* Least sold */}
          <PlansTable
            title="Least Sold (needs attention)"
            data={data.least_sold}
            primaryMetric="sold"
            highlightLeast
          />
        </>
      )}
    </PageShell>
  );
}