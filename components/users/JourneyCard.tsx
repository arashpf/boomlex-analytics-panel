// components/users/JourneyCard.tsx
//
// Single user journey card with a vertical event timeline.

import {
    Home,
    FileText,
    Phone,
    Search,
    Filter as FilterIcon,
    MapPin,
    Heart,
    Share2,
    User,
    MessageCircle,
    CheckCircle,
    Zap,
    Clock,
  } from "lucide-react";
  import { formatRelativeTime, formatDuration } from "@/lib/formatters";
  import type { UserJourney, TimelineItem, TimelineEvent } from "@/lib/types";
  
  const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    category_view:          FileText,
    city_view:              MapPin,
    listing_view:           Home,
    listing_call:           Phone,
    listing_favorite:       Heart,
    listing_share:          Share2,
    contact_call_click:     Phone,
    contact_intent:         MessageCircle,
    contact_form_started:   FileText,
    contact_form_submitted: FileText,
    contact_form_verified:  CheckCircle,
    contact_success:        CheckCircle,
    search:                 Search,
    filter_apply:           FilterIcon,
    city_select:            MapPin,
    auth:                   User,
  };
  
  const COLORS: Record<string, string> = {
    listing_view:    "text-blue-500 bg-blue-50 dark:bg-blue-950/40",
    listing_call:    "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    contact_intent:  "text-teal-500 bg-teal-50 dark:bg-teal-950/40",
    contact_success: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    search:          "text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40",
    filter_apply:    "text-orange-500 bg-orange-50 dark:bg-orange-950/40",
    city_view:       "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40",
    category_view:   "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
    city_select:     "text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40",
    auth:            "text-slate-500 bg-slate-100 dark:bg-slate-800",
  };
  
  const DEFAULT_ICON = Zap;
  const DEFAULT_COLOR = "text-slate-500 bg-slate-100 dark:bg-slate-800";
  
  interface Props {
    journey: UserJourney;
  }
  
  export function JourneyCard({ journey }: Props) {
    const shortId = journey.anonymous_id.slice(0, 8);
  
    // Flags for header badges
    const badges: string[] = [];
    if (journey.has_call) badges.push("Called");
    if (journey.has_intent) badges.push("Contact");
    if (journey.has_search) badges.push("Searched");
    if (journey.has_filter) badges.push("Filtered");
  
    return (
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                {shortId}…
              </span>
  
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{journey.event_count} events</span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>
                  {journey.visit_count} {journey.visit_count === 1 ? "visit" : "visits"}
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span>{formatDuration(journey.duration_seconds)}</span>
              </div>
            </div>
  
            <div className="flex items-center gap-1.5 shrink-0">
              {badges.slice(0, 3).map((b) => (
                <span
                  key={b}
                  className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
  
          <div className="mt-1.5 text-xs text-slate-400 truncate">
            Started {formatRelativeTime(journey.started_at)} · Exited on{" "}
            <span className="text-slate-500 dark:text-slate-400">
              {journey.last_page}
            </span>
          </div>
        </div>
  
        {/* Timeline */}
        <div className="p-5">
          <div className="relative">
            {journey.timeline.map((item, idx) => (
              <TimelineRow
                key={idx}
                item={item}
                isLast={idx === journey.timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // ─────────────────────────────────────────────────────────────
  // Timeline row — either an event or a gap marker
  // ─────────────────────────────────────────────────────────────
  
  function TimelineRow({
    item,
    isLast,
  }: {
    item: TimelineItem;
    isLast: boolean;
  }) {
    if (item.type === "gap") {
      return (
        <div className="relative flex items-center gap-3 py-2">
          <div className="w-6 flex justify-center">
            <Clock className="w-3 h-3 text-slate-400" />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 border-t border-dashed border-slate-300 dark:border-slate-700" />
            <span
              className={
                "text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap " +
                (item.is_return
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400")
              }
            >
              {item.is_return
                ? `⏱ Returned ${formatGapDuration(item.gap_seconds)} later`
                : `${formatGapDuration(item.gap_seconds)} gap`}
            </span>
            <div className="flex-1 border-t border-dashed border-slate-300 dark:border-slate-700" />
          </div>
        </div>
      );
    }
  
    return <TimelineEventRow event={item} isLast={isLast} />;
  }
  
  function TimelineEventRow({
    event,
    isLast,
  }: {
    event: TimelineEvent;
    isLast: boolean;
  }) {
    const Icon = ICONS[event.event_name] || DEFAULT_ICON;
    const color = COLORS[event.event_name] || DEFAULT_COLOR;
  
    return (
      <div className="relative flex items-start gap-3">
        {/* Icon bubble */}
        <div
          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${color}`}
        >
          <Icon className="w-3 h-3" />
        </div>
  
        {/* Vertical line */}
        {!isLast && (
          <div className="absolute left-3 top-6 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />
        )}
  
        {/* Content */}
        <div className="flex-1 min-w-0 pb-3">
          <div className="text-sm text-slate-700 dark:text-slate-300 leading-tight">
            {event.label}
          </div>
  
          {/* Full payload — rendered as key/value chips */}
          {event.payload && Object.keys(event.payload).length > 0 && (
            <PayloadViewer payload={event.payload} />
          )}
  
          <div className="text-[10px] text-slate-400 mt-1.5">
            {formatRelativeTime(event.created_at)}
          </div>
        </div>
      </div>
    );
  }
  
  // ─────────────────────────────────────────────────────────────
  // Payload viewer — human-readable rendering of the event payload
  // ─────────────────────────────────────────────────────────────
  
  function PayloadViewer({ payload }: { payload: Record<string, unknown> }) {
    // Fields to hide (noise)
    const HIDDEN_FIELDS = new Set([
      "from_page",
      "has_neighborhoods",
      "has_features",
      "has_sort",
    ]);
  
    const entries = Object.entries(payload).filter(([key, value]) => {
      // Skip known noise
      if (HIDDEN_FIELDS.has(key)) return false;
  
      // Skip empty/null/undefined values
      if (value === null || value === undefined || value === "") return false;
  
      // Skip empty arrays
      if (Array.isArray(value) && value.length === 0) return false;
  
      // Skip empty objects
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0
      ) {
        return false;
      }
  
      return true;
    });
  
    if (entries.length === 0) return null;
  
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {entries.map(([key, value]) => (
          <PayloadChip key={key} label={key} value={value} />
        ))}
      </div>
    );
  }
  
  function PayloadChip({ label, value }: { label: string; value: unknown }) {
    // Nested object → flatten into sub-chips
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const nested = Object.entries(value as Record<string, unknown>);
      if (nested.length === 0) return null;
  
      return (
        <>
          {nested.map(([k, v]) => (
            <PayloadChip key={`${label}.${k}`} label={k} value={v} />
          ))}
        </>
      );
    }
  
    // Array → join values
    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400">{label}:</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {value.map((v) => String(v)).join(", ")}
          </span>
        </span>
      );
    }
  
    // Boolean → checkmark
    if (typeof value === "boolean") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400">{label}:</span>
          <span
            className={
              "font-medium " +
              (value
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-500 dark:text-slate-400")
            }
          >
            {value ? "✓" : "✗"}
          </span>
        </span>
      );
    }
  
    // Number → format with commas
    if (typeof value === "number") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 dark:text-slate-400">{label}:</span>
          <span className="font-medium text-slate-800 dark:text-slate-200 tabular-nums">
            {value.toLocaleString("en-US")}
          </span>
        </span>
      );
    }
  
    // String (possibly numeric)
    const str = String(value);
    const numeric = /^\d+$/.test(str) ? parseInt(str, 10) : null;
    const display =
      numeric !== null && numeric > 9999
        ? numeric.toLocaleString("en-US")
        : str;
  
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-full">
        <span className="text-slate-500 dark:text-slate-400 shrink-0">{label}:</span>
        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
          {display}
        </span>
      </span>
    );
  }
  
  // ─────────────────────────────────────────────────────────────
  // Format a gap duration in human-readable form
  // ─────────────────────────────────────────────────────────────
  
  function formatGapDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.round((seconds % 3600) / 60);
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    const days = Math.floor(seconds / 86400);
    const hours = Math.round((seconds % 86400) / 3600);
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
  }