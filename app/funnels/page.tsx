// app/funnels/page.tsx
//
// Funnels page — conversion analysis across multiple user journeys.

"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { FunnelBar } from "@/components/funnels/FunnelBar";
import { DateRangePicker } from "@/components/ui/DateRangePicker";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { DateRange, FunnelsResponse } from "@/lib/types";

export default function FunnelsPage() {
  const [range, setRange] = useState<DateRange>("24h");
  const [data, setData] = useState<FunnelsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/stats/funnels?range=${range}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((json: FunnelsResponse) => {
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
            Funnels
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            User journeys and conversion rates
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading funnels..." />
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-4">
          {data.funnels.length === 0 ? (
            <EmptyState
              title="No funnels"
              description="Nothing to show for this range."
            />
          ) : (
            data.funnels.map((funnel) => (
              <FunnelBar key={funnel.name} funnel={funnel} />
            ))
          )}
        </div>
      )}
    </PageShell>
  );
}