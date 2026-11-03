// app/search/page.tsx
//
// Search & Filter analytics page.

"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, Hash, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { SearchTable } from "@/components/search/SearchTable";
import { FilterTable } from "@/components/search/FilterTable";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { formatNumber, formatPercent } from "@/lib/formatters";
import type { DateRange, SearchFilterResponse } from "@/lib/types";

export default function SearchPage() {
  const [range, setRange] = useState<DateRange>("24h");
  const [data, setData] = useState<SearchFilterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/search-filter?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: SearchFilterResponse) => {
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
            Search & Filter
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            What users are looking for and what they find
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading search data..." />
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
              label="Total Searches"
              value={data.summary.total_searches}
              icon={<Search className="w-4 h-4 text-slate-400" />}
              hint="In selected range"
            />
            <StatCard
              label="Zero Results"
              value={formatPercent(data.summary.zero_result_pct)}
              icon={<AlertCircle className="w-4 h-4 text-slate-400" />}
              hint={`${formatNumber(data.summary.zero_results)} searches with no results`}
            />
            <StatCard
              label="Unique Queries"
              value={data.summary.unique_queries}
              icon={<Hash className="w-4 h-4 text-slate-400" />}
              hint="Distinct search terms"
            />
            <StatCard
              label="Top City"
              value={data.summary.top_city?.city_title || "—"}
              icon={<MapPin className="w-4 h-4 text-slate-400" />}
              hint={
                data.summary.top_city
                  ? `${formatNumber(data.summary.top_city.search_count)} searches`
                  : "No data"
              }
            />
          </div>

          {/* Top 5 Cities by Search */}
          {data.top_cities.length > 0 && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Top Cities by Search
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Where users are searching from
                </p>
              </div>

              {(() => {
                const max = Math.max(
                  ...data.top_cities.map((c) => c.search_count),
                  1
                );

                return (
                  <div className="space-y-3">
                    {data.top_cities.map((city, idx) => {
                      const pct = (city.search_count / max) * 100;

                      const blues = [
                        "from-blue-600 to-blue-800",
                        "from-blue-500 to-blue-700",
                        "from-blue-500 to-blue-700",
                        "from-blue-400 to-blue-600",
                        "from-blue-400 to-blue-600",
                      ];
                      const gradient = blues[idx] || blues[blues.length - 1];

                      return (
                        <div key={city.city_slug}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {city.city_title}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                              {formatNumber(city.search_count)}
                            </span>
                          </div>
                          <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                            <div
                              className={`h-full rounded-md bg-gradient-to-r ${gradient} transition-all duration-500`}
                              style={{ width: `${Math.max(pct, 2)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Searches + Filters tables */}
          <SearchTable data={data.last_searches} />
          <FilterTable data={data.last_filters} />
        </>
      )}
    </PageShell>
  );
}