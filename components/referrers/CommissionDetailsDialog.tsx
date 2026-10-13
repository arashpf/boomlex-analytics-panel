// components/referrers/CommissionDetailsDialog.tsx
//
// Modal showing the recent 20 commission records for a referrer.

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface Commission {
  id: number;
  user_id: number;
  user_phone: string | null;
  channel_code: string | null;
  channel_type: string | null;
  payment_amount: number;
  commission_rate: number;
  commission_amount: number;
  platform: string;
  status: string;
  created_at: string | null;
}

interface Props {
  open: boolean;
  referrerId: number | null;
  referrerName?: string;
  onClose: () => void;
}

export function CommissionDetailsDialog({
  open,
  referrerId,
  referrerName,
  onClose,
}: Props) {
  const [rows, setRows] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!open || referrerId === null) return;

    let cancelled = false;
    setLoading(true);

    fetch(`/api/stats/referrers/${referrerId}/commissions?limit=20`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.ok) {
          setRows(json.commissions || []);
          setTotal(json.total || 0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, referrerId]);

  if (!open || referrerId === null) return null;

  function fmt(n: number) {
    return new Intl.NumberFormat("en-US").format(n);
  }

  function fmtDate(s: string | null) {
    if (!s) return "—";
    try {
      return new Date(s).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return "—";
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Commissions
            </h2>
            {referrerName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {referrerName} · {total} total record{total === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">
          {loading ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              Loading…
            </div>
          ) : rows.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-slate-400">
              No commissions yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Agent</th>
                  <th className="text-left py-2">Channel</th>
                  <th className="text-left py-2">Platform</th>
                  <th className="text-right py-2">Payment</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Commission</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 text-slate-600 dark:text-slate-400 tabular-nums">
                      {fmtDate(c.created_at)}
                    </td>
                    <td className="py-2 text-slate-700 dark:text-slate-300 tabular-nums">
                      {c.user_phone || "—"}
                    </td>
                    <td className="py-2 text-slate-700 dark:text-slate-300">
                      {c.channel_type ? (
                        <span className="capitalize">
                          {c.channel_type}
                          {c.channel_code && (
                            <span className="text-xs text-slate-400 ml-1">
                              ({c.channel_code})
                            </span>
                          )}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-2 text-slate-600 dark:text-slate-400 capitalize">
                      {c.platform}
                    </td>
                    <td className="py-2 text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {fmt(c.payment_amount)} T
                    </td>
                    <td className="py-2 text-right text-slate-500 dark:text-slate-400 tabular-nums">
                      {c.commission_rate}%
                    </td>
                    <td className="py-2 text-right font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {fmt(c.commission_amount)} T
                    </td>
                    <td className="py-2 text-center">
                      <span
                        className={
                          "text-[11px] uppercase tracking-wide px-2 py-0.5 rounded " +
                          (c.status === "paid"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            : c.status === "cancelled"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400")
                        }
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}