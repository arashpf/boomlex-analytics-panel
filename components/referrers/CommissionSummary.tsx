// components/referrers/CommissionSummary.tsx
//
// Small 4-stat strip that shows on each referrer card.
// Fetches from /api/stats/referrers/{id}/commissions/summary.

"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Clock, DollarSign, List } from "lucide-react";

interface Summary {
  total_records: number;
  total_commission: number;
  pending_commission: number;
  paid_commission: number;
  this_month: number;
}

interface Props {
  referrerId: number;
  onViewDetails?: (referrerId: number) => void;
}

export function CommissionSummary({ referrerId, onViewDetails }: Props) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(
          `/api/stats/referrers/${referrerId}/commissions/summary`,
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!cancelled && json.ok) {
          setSummary(json.summary);
        }
      } catch {
        // silent — summary is informational
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [referrerId]);

  function fmt(n: number) {
    // Toman with thousand separators
    return new Intl.NumberFormat("en-US").format(n);
  }

  if (loading) {
    return (
      <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="h-12 flex items-center justify-center text-xs text-slate-400">
          Loading commissions…
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat
          icon={<TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
          label="Lifetime"
          value={`${fmt(summary.total_commission)} T`}
        />
        <Stat
          icon={<Clock className="w-3.5 h-3.5 text-sky-500" />}
          label="This month"
          value={`${fmt(summary.this_month)} T`}
        />
        <Stat
          icon={<DollarSign className="w-3.5 h-3.5 text-amber-500" />}
          label="Pending"
          value={`${fmt(summary.pending_commission)} T`}
        />
        <Stat
          icon={<List className="w-3.5 h-3.5 text-slate-400" />}
          label="Records"
          value={String(summary.total_records)}
          onClick={
            onViewDetails && summary.total_records > 0
              ? () => onViewDetails(referrerId)
              : undefined
          }
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={
        "text-left " +
        (onClick
          ? "hover:bg-white dark:hover:bg-slate-800 rounded p-1 -m-1 transition"
          : "")
      }
    >
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 tabular-nums">
        {value}
      </div>
    </Tag>
  );
}