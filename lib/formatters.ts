// lib/formatters.ts
//
// Small pure helpers for formatting numbers, dates, and durations
// inside the analytics panel.

import { format, formatDistanceToNow } from "date-fns";

// ─────────────────────────────────────────────────────────────
// Numbers
// ─────────────────────────────────────────────────────────────

/** 1234 → "1,234" */
export function formatNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("en-US");
}

/** 1234 → "1.2K", 1_234_567 → "1.2M" */
export function formatCompact(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** 0.1234 → "12.3%" */
export function formatPercent(
  value: number | null | undefined,
  digits = 1
): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(digits)}%`;
}

/** +12.3% / -5.1% / — */
export function formatTrendChange(
  change: number | null | undefined
): string {
  if (change === null || change === undefined) return "—";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

// ─────────────────────────────────────────────────────────────
// Dates
// ─────────────────────────────────────────────────────────────

/** ISO date string → "Oct 6, 2026" */
export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return format(d, "MMM d, yyyy");
}

/** ISO date string → "Oct 6" (short) */
export function formatDateShort(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return format(d, "MMM d");
}

/** ISO datetime → "Oct 6, 2026 14:22" */
export function formatDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return format(d, "MMM d, yyyy HH:mm");
}

/** "3 minutes ago", "2 hours ago" */
export function formatRelativeTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return formatDistanceToNow(d, { addSuffix: true });
}

// ─────────────────────────────────────────────────────────────
// Durations
// ─────────────────────────────────────────────────────────────

/** 95 seconds → "1m 35s" */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "—";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h}h ${rm}m`;
}

// ─────────────────────────────────────────────────────────────
// Truncation
// ─────────────────────────────────────────────────────────────

/** Long user-agent → short readable label */
export function shortUserAgent(ua: string | null | undefined): string {
  if (!ua) return "—";
  // Try to detect common patterns
  if (/iPhone|iPad/i.test(ua)) return "iOS Safari";
  if (/Android/i.test(ua)) return "Android";
  if (/Macintosh/i.test(ua)) {
    if (/Chrome/i.test(ua)) return "macOS Chrome";
    if (/Safari/i.test(ua)) return "macOS Safari";
    if (/Firefox/i.test(ua)) return "macOS Firefox";
    return "macOS";
  }
  if (/Windows/i.test(ua)) {
    if (/Chrome/i.test(ua)) return "Windows Chrome";
    if (/Firefox/i.test(ua)) return "Windows Firefox";
    if (/Edg/i.test(ua)) return "Windows Edge";
    return "Windows";
  }
  if (/Linux/i.test(ua)) return "Linux";
  return ua.slice(0, 30) + (ua.length > 30 ? "…" : "");
}

/** Generic truncate for text */
export function truncate(text: string, max = 40): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}


/** 39000 → "39,000 تومان" */
export function formatToman(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return `${formatNumber(amount)} تومان`;
}

/** 39000 → "39K" — for chart axes */
export function formatTomanCompact(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return formatCompact(amount);
}