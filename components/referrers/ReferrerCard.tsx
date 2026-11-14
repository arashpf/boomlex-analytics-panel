// components/referrers/ReferrerCard.tsx
//
// Single referrer card showing name, commission, and channels.
// Each channel has a copy-link button for its tracking URL.

"use client";

import { useState } from "react";
import {
  Camera,          // for Instagram
  PlayCircle,      // for YouTube
  Send,            // for Telegram
  MessageCircle,   // for WhatsApp
  Video,           // for Aparat
  Globe,           // for Other
  Copy,
  Check,
  Plus,
  KeyRound,
  User,
  Phone,
} from "lucide-react";
import type { Referrer, ReferrerChannel } from "@/lib/types";
import { CommissionSummary } from "./CommissionSummary"; // ← ADDED

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Camera,
  youtube:   PlayCircle,
  telegram:  Send,
  whatsapp:  MessageCircle,
  aparat:    Video,
  other:     Globe,
};

const CHANNEL_COLORS: Record<string, string> = {
  instagram: "text-pink-500",
  youtube:   "text-red-500",
  telegram:  "text-sky-500",
  whatsapp:  "text-emerald-500",
  aparat:    "text-orange-500",
  other:     "text-slate-500",
};

interface Props {
  referrer: Referrer;
  onAddChannel: (referrerId: number) => void;
  onGenerateToken: (referrerId: number) => void;
  onViewCommissions?: (referrerId: number) => void; // ← ADDED
}

export function ReferrerCard({
  referrer,
  onAddChannel,
  onGenerateToken,
  onViewCommissions, // ← ADDED
}: Props) {
  // Track which channel's copy button was clicked recently (for the "Copied!" state)
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function handleCopyLink(code: string) {
    const url = `https://boomlex.ir/?r=${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      // Fallback for browsers that block clipboard without user gesture
      window.prompt("لینک را کپی کنید:", url);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      {/* ─── Header ─── */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {referrer.name}
              </h3>

              {!referrer.is_active && (
                <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">
                  Disabled
                </span>
              )}

              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 tabular-nums font-medium">
                {referrer.commission_rate.toFixed(1)}% commission
              </span>
            </div>

            {/* Meta line */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
              {referrer.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {referrer.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <User className="w-3 h-3" />
                {referrer.users_count} {referrer.users_count === 1 ? "agent" : "agents"}
              </span>
              <span>
                {referrer.channels.length}{" "}
                {referrer.channels.length === 1 ? "channel" : "channels"}
              </span>
            </div>

            {referrer.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                {referrer.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onAddChannel(referrer.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add channel
            </button>

            <button
              type="button"
              onClick={() => onGenerateToken(referrer.id)}
              title={referrer.has_token ? "Regenerate portal token" : "Generate portal token"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {referrer.has_token ? "Regenerate token" : "Generate token"}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Channels ─── */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
        {referrer.channels.length === 0 ? (
          <div className="px-5 py-6 text-center text-sm text-slate-400">
            No channels yet. Click "Add channel" to create one.
          </div>
        ) : (
          referrer.channels.map((channel) => (
            <ChannelRow
              key={channel.id}
              channel={channel}
              isCopied={copiedCode === channel.code}
              onCopy={() => handleCopyLink(channel.code)}
            />
          ))
        )}
      </div>

      {/* ─── Commission summary ─── */} {/* ← ADDED */}
      <CommissionSummary
        referrerId={referrer.id}
        onViewDetails={onViewCommissions}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Single channel row
// ─────────────────────────────────────────────────────────────

function ChannelRow({
  channel,
  isCopied,
  onCopy,
}: {
  channel: ReferrerChannel;
  isCopied: boolean;
  onCopy: () => void;
}) {
  const Icon = CHANNEL_ICONS[channel.channel] || CHANNEL_ICONS.other;
  const iconColor = CHANNEL_COLORS[channel.channel] || CHANNEL_COLORS.other;
  const trackingUrl = `https://boomlex.ir/?r=${channel.code}`;

  return (
    <div className="px-5 py-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
      {/* Icon */}
      <div className={`shrink-0 ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Channel name + code + handle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
            {channel.channel}
          </span>
          {channel.channel_handle && (
            <span className="text-xs text-slate-400 truncate">
              {channel.channel_handle}
            </span>
          )}
          {!channel.is_active && (
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              Disabled
            </span>
          )}
        </div>
        <div className="text-xs font-mono text-slate-400 mt-0.5 truncate">
          {trackingUrl}
        </div>
      </div>

      {/* Copy button */}
      <button
        type="button"
        onClick={onCopy}
        className={
          "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition " +
          (isCopied
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700")
        }
      >
        {isCopied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}