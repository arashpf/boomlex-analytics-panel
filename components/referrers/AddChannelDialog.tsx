// components/referrers/AddChannelDialog.tsx
//
// Modal for adding a new channel to an existing referrer.

"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import type { ReferrerChannelType } from "@/lib/types";

const CHANNEL_OPTIONS: { value: ReferrerChannelType; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube",   label: "YouTube" },
  { value: "telegram",  label: "Telegram" },
  { value: "whatsapp",  label: "WhatsApp" },
  { value: "aparat",    label: "Aparat" },
  { value: "other",     label: "Other" },
];

interface Props {
  open: boolean;
  referrerId: number | null;
  referrerName?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddChannelDialog({
  open,
  referrerId,
  referrerName,
  onClose,
  onSuccess,
}: Props) {
  const [channel, setChannel] = useState<ReferrerChannelType>("instagram");
  const [code, setCode] = useState("");
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || referrerId === null) return null;

  function generateCode(ch: ReferrerChannelType) {
    const rand = Math.random().toString(36).substring(2, 8);
    const prefix =
      ch === "instagram" ? "ig" :
      ch === "youtube"   ? "yt" :
      ch === "telegram"  ? "tg" :
      ch === "whatsapp"  ? "wa" :
      ch === "aparat"    ? "ap" :
      "ot";
    return `${prefix}-${rand}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError("Code is required");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(code)) {
      setError("Code can only contain letters, numbers, dash, and underscore");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/stats/referrers/${referrerId}/channels`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel,
          code: code.trim(),
          channel_handle: handle.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Network error");
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setChannel("instagram");
    setCode("");
    setHandle("");
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Add Channel
            </h2>
            {referrerName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                to {referrerName}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Channel type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Platform <span className="text-red-500">*</span>
              </label>
              <select
                value={channel}
                onChange={(e) =>
                  setChannel(e.target.value as ReferrerChannelType)
                }
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              >
                {CHANNEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tracking Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. ig-sara1"
                  required
                  className="w-full px-3 py-2 pr-10 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setCode(generateCode(channel))}
                  title="Auto-generate"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 rounded text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  ⚡
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                → https://boomlex.ir/?r={code || "code"}
              </p>
            </div>

            {/* Handle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Handle (optional)
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@sara_real"
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white disabled:opacity-50 transition"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? "Adding..." : "Add Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}