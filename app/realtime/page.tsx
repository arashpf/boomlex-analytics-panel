// app/realtime/page.tsx
//
// Realtime page — live event feed with auto-refresh.

"use client";

import { useEffect, useState, useRef } from "react";
import { Activity, Users, Clock } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { EventRow } from "@/components/realtime/EventRow";
import { LiveIndicator } from "@/components/realtime/LiveIndicator";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDuration } from "@/lib/formatters";
import type { RealtimeResponse } from "@/lib/types";

const REFRESH_INTERVAL_MS = 5000;

export default function RealtimePage() {
  const [data, setData] = useState<RealtimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchData(isInitial = false) {
    if (isInitial) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch("/api/stats/realtime");
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json: RealtimeResponse = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    // Initial load
    fetchData(true);

    // Set up auto-refresh
    intervalRef.current = setInterval(() => {
      fetchData(false);
    }, REFRESH_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Realtime
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Live activity as it happens
          </p>
        </div>
        <LiveIndicator refreshing={refreshing} />
      </div>

      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Connecting to live feed..." />
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
              label="Events (last 5 min)"
              value={data.recent_events}
              icon={<Activity className="w-4 h-4 text-slate-400" />}
              hint="Live activity"
            />
            <StatCard
              label="Active Users"
              value={data.active_users}
              icon={<Users className="w-4 h-4 text-slate-400" />}
              hint="Unique in last 5 min"
            />
            <StatCard
              label="Last Event"
              value={
                data.seconds_since_last !== null
                  ? `${data.seconds_since_last}s ago`
                  : "—"
              }
              icon={<Clock className="w-4 h-4 text-slate-400" />}
              hint="Since most recent"
            />
          </div>

          {/* Live feed */}
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Live Event Feed
              </h3>
              <span className="text-xs text-slate-400">
                Last {data.events.length} events
              </span>
            </div>

            {data.events.length === 0 ? (
              <EmptyState
                title="No events yet"
                description="Events will appear here as users interact with your site."
              />
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                {data.events.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </PageShell>
  );
}