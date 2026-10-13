// components/referrers/AddReferrerDialog.tsx
//
// Modal form for creating a new referrer with one or more channels.

"use client";

import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import type { ReferrerChannelType } from "@/lib/types";

const CHANNEL_OPTIONS: { value: ReferrerChannelType; label: string }[] = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube",   label: "YouTube" },
  { value: "telegram",  label: "Telegram" },
  { value: "whatsapp",  label: "WhatsApp" },
  { value: "aparat",    label: "Aparat" },
  { value: "other",     label: "Other" },
];

interface ChannelDraft {
  channel: ReferrerChannelType;
  code: string;
  channel_handle: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddReferrerDialog({ open, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [commissionRate, setCommissionRate] = useState(20);

  const [channels, setChannels] = useState<ChannelDraft[]>([
    { channel: "instagram", code: "", channel_handle: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function generateCode(channel: ReferrerChannelType) {
    // Random 6-char base36 code prefixed by channel
    const rand = Math.random().toString(36).substring(2, 8);
    const prefix =
      channel === "instagram" ? "ig" :
      channel === "youtube"   ? "yt" :
      channel === "telegram"  ? "tg" :
      channel === "whatsapp"  ? "wa" :
      channel === "aparat"    ? "ap" :
      "ot";
    return `${prefix}-${rand}`;
  }

  function updateChannel(index: number, patch: Partial<ChannelDraft>) {
    setChannels((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...patch } : c))
    );
  }

  function addChannel() {
    setChannels((prev) => [
      ...prev,
      { channel: "instagram", code: "", channel_handle: "" },
    ]);
  }

  function removeChannel(index: number) {
    setChannels((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (channels.length === 0) {
      setError("Add at least one channel");
      return;
    }

    for (const c of channels) {
      if (!c.code.trim()) {
        setError("Each channel needs a code");
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(c.code)) {
        setError("Codes can only contain letters, numbers, dash, and underscore");
        return;
      }
    }

    // Check for duplicate codes in the form
    const codes = channels.map((c) => c.code.trim());
    if (new Set(codes).size !== codes.length) {
      setError("Channel codes must be unique");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim() || null,
        description: description.trim() || null,
        commission_rate: Number(commissionRate),
        channels: channels.map((c) => ({
          channel: c.channel,
          code: c.code.trim(),
          channel_handle: c.channel_handle.trim() || null,
        })),
      };

      const res = await fetch("/api/stats/referrers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || `HTTP ${res.status}`);
        setLoading(false);
        return;
      }

      // Success
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Network error");
      setLoading(false);
    }
  }

  function handleClose() {
    if (loading) return;
    setName("");
    setPhone("");
    setDescription("");
    setCommissionRate(20);
    setChannels([{ channel: "instagram", code: "", channel_handle: "" }]);
    setError(null);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Add Referrer
          </h2>
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sara Ahmadi"
                required
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09123456789"
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notes about this referrer..."
                rows={2}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 resize-none"
              />
            </div>

            {/* Commission rate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Commission Rate (%)
              </label>
              <input
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
                min={0}
                max={100}
                step={0.5}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 tabular-nums"
              />
            </div>

            {/* Channels */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Channels <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={addChannel}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add another
                </button>
              </div>

              <div className="space-y-2">
                {channels.map((c, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[140px_1fr_1fr_auto] gap-2 items-center"
                  >
                    <select
                      value={c.channel}
                      onChange={(e) =>
                        updateChannel(idx, {
                          channel: e.target.value as ReferrerChannelType,
                        })
                      }
                      className="px-2 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                    >
                      {CHANNEL_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    <div className="relative">
                      <input
                        type="text"
                        value={c.code}
                        onChange={(e) =>
                          updateChannel(idx, { code: e.target.value })
                        }
                        placeholder="code"
                        required
                        className="w-full px-2 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateChannel(idx, {
                            code: generateCode(c.channel),
                          })
                        }
                        title="Auto-generate code"
                        className="absolute right-1 top-1/2 -translate-y-1/2 px-1.5 py-1 rounded text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        ⚡
                      </button>
                    </div>

                    <input
                      type="text"
                      value={c.channel_handle}
                      onChange={(e) =>
                        updateChannel(idx, { channel_handle: e.target.value })
                      }
                      placeholder="@handle (optional)"
                      className="px-2 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm focus:outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => removeChannel(idx)}
                      disabled={channels.length === 1}
                      className="p-2 rounded-md text-slate-400 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <p className="text-xs text-slate-400 mt-2">
                Tracking link will be:{" "}
                <span className="font-mono">
                  https://ajur.app/?r=
                  {channels[0]?.code || "code"}
                </span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2 sticky bottom-0 bg-white dark:bg-slate-900">
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
              {loading ? "Creating..." : "Create Referrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}