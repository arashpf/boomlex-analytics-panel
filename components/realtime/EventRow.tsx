// components/realtime/EventRow.tsx
//
// Single event row in the live feed.

import {
    Eye,
    MapPin,
    Phone,
    Search,
    FolderOpen,
    Filter,
    Heart,
    Share2,
    User,
    FileText,
    MessageCircle,
    CheckCircle,
    Zap,
  } from "lucide-react";
  import { formatRelativeTime } from "@/lib/formatters";
  import type { RealtimeEvent } from "@/lib/types";
  
  const EVENT_CONFIG: Record<
    string,
    { icon: React.ComponentType<{ className?: string }>; color: string; label: string }
  > = {
    listing_view:           { icon: Eye,          color: "text-blue-500",    label: "Viewed listing" },
    listing_call:           { icon: Phone,        color: "text-emerald-500", label: "Called" },
    listing_favorite:       { icon: Heart,        color: "text-pink-500",    label: "Favorited" },
    listing_share:          { icon: Share2,       color: "text-purple-500",  label: "Shared" },
    city_view:              { icon: MapPin,       color: "text-indigo-500",  label: "Viewed city" },
    city_select:            { icon: MapPin,       color: "text-indigo-400",  label: "Selected city" },
    category_view:          { icon: FolderOpen,   color: "text-amber-500",   label: "Viewed category" },
    search:                 { icon: Search,       color: "text-cyan-500",    label: "Searched" },
    filter_apply:           { icon: Filter,       color: "text-orange-500",  label: "Applied filter" },
    auth:                   { icon: User,         color: "text-slate-500",   label: "Auth" },
    contact_intent:         { icon: MessageCircle, color: "text-teal-500",   label: "Contact intent" },
    contact_form_started:   { icon: FileText,     color: "text-sky-500",     label: "Form started" },
    contact_form_submitted: { icon: FileText,     color: "text-sky-600",     label: "Form submitted" },
    contact_form_verified:  { icon: CheckCircle,  color: "text-emerald-600", label: "Form verified" },
    contact_success:        { icon: CheckCircle,  color: "text-emerald-500", label: "Contact success" },
    contact_call_click:     { icon: Phone,        color: "text-emerald-500", label: "Call clicked" },
  };
  
  const DEFAULT_CONFIG = {
    icon: Zap,
    color: "text-slate-400",
    label: "Event",
  };
  
  interface Props {
    event: RealtimeEvent;
  }
  
  export function EventRow({ event }: Props) {
    const config = EVENT_CONFIG[event.event_name] || DEFAULT_CONFIG;
    const Icon = config.icon;
  
    // Build a readable context string
    const contextParts: string[] = [];
    if (event.listing_id) contextParts.push(`#${event.listing_id}`);
    if (event.city_slug) contextParts.push(event.city_slug);
    if (event.category_slug) contextParts.push(event.category_slug);
    if (event.query) contextParts.push(`"${event.query}"`);
  
    const context = contextParts.join(" · ");
  
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
        {/* Icon */}
        <div className={`shrink-0 ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
  
        {/* Event name + context */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-slate-800 dark:text-slate-200 truncate">
            <span className="font-medium">{config.label}</span>
            {context && (
              <>
                <span className="text-slate-400 mx-1.5">·</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {context}
                </span>
              </>
            )}
          </div>
        </div>
  
        {/* Time */}
        <div className="shrink-0 text-xs text-slate-400 tabular-nums whitespace-nowrap">
          {formatRelativeTime(event.created_at)}
        </div>
      </div>
    );
  }