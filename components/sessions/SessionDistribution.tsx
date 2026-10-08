// components/sessions/SessionDistribution.tsx
//
// Session length distribution with colored buckets.

import { formatNumber, formatPercent } from "@/lib/formatters";
import type { SessionBucket } from "@/lib/types";

interface Props {
  buckets: SessionBucket[];
  totalSessions: number;
}

const BUCKET_COLORS = [
  "from-red-500 to-red-600",         // 0-30s   — bad (bounce)
  "from-amber-500 to-amber-600",     // 30s-2m  — meh
  "from-emerald-500 to-emerald-600", // 2m-10m  — good
  "from-blue-500 to-blue-600",       // 10m+    — excellent
];

const BUCKET_LABELS: Record<string, string> = {
  "0-30s":  "Instant bounce",
  "30s-2m": "Brief look",
  "2m-10m": "Engaged",
  "10m+":   "Power users",
};

export function SessionDistribution({ buckets, totalSessions }: Props) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Session Length Distribution
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          How long users stay on the site
        </p>
      </div>

      <div className="space-y-4">
        {buckets.map((bucket, idx) => (
          <div key={bucket.bucket}>
            <div className="flex items-center justify-between mb-1.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {bucket.bucket}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  {BUCKET_LABELS[bucket.bucket] || ""}
                </span>
              </div>
              <div className="flex items-center gap-3 tabular-nums">
                <span className="text-xs text-slate-400">
                  {formatPercent(bucket.pct)}
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-100 min-w-[40px] text-right">
                  {formatNumber(bucket.sessions)}
                </span>
              </div>
            </div>

            <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
              <div
                className={`h-full rounded-md bg-gradient-to-r ${BUCKET_COLORS[idx] || BUCKET_COLORS[0]} transition-all duration-500`}
                style={{
                  width: `${Math.max(bucket.pct, 1.5)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{formatNumber(totalSessions)} total sessions</span>
      </div>
    </div>
  );
}