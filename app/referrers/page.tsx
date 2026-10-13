// app/referrers/page.tsx
//
// Referrers management page — list all referrers with their channels.

"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Radio } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/cards/StatCard";
import { ReferrerCard } from "@/components/referrers/ReferrerCard";
import { AddReferrerDialog } from "@/components/referrers/AddReferrerDialog";
import { AddChannelDialog } from "@/components/referrers/AddChannelDialog";
import { TokenDialog } from "@/components/referrers/TokenDialog";
import { CommissionDetailsDialog } from "@/components/referrers/CommissionDetailsDialog"; // ← ADDED
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ReferrersListResponse, Referrer } from "@/lib/types";

export default function ReferrersPage() {
  const [data, setData] = useState<Referrer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [showAddReferrer, setShowAddReferrer] = useState(false);
  const [addChannelFor, setAddChannelFor] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [tokenInfo, setTokenInfo] = useState<{
    token: string;
    url: string;
    name: string;
  } | null>(null);

  // Commission details dialog state // ← ADDED
  const [commissionDialog, setCommissionDialog] = useState<{
    id: number;
    name: string;
  } | null>(null);

  async function fetchReferrers() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stats/referrers", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ReferrersListResponse = await res.json();
      setData(json.referrers || []);
    } catch (err: any) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReferrers();
  }, []);

  function handleAddChannel(referrerId: number) {
    const ref = data.find((r) => r.id === referrerId);
    if (!ref) return;
    setAddChannelFor({ id: referrerId, name: ref.name });
  }

  async function handleGenerateToken(referrerId: number) {
    const ref = data.find((r) => r.id === referrerId);

    // Confirm before regenerating if they already have a token
    if (ref?.has_token) {
      const ok = confirm(
        `Regenerate token for ${ref.name}? The old URL will stop working.`
      );
      if (!ok) return;
    }

    try {
      const res = await fetch(
        `/api/stats/referrers/${referrerId}/generate-token`,
        { method: "POST" }
      );
      const json = await res.json();

      if (!res.ok || !json.ok) {
        alert(json.error || "Failed to generate token");
        return;
      }

      setTokenInfo({
        token: json.token,
        url: json.url,
        name: ref?.name || "referrer",
      });

      // Refresh list to update `has_token` flag
      fetchReferrers();
    } catch (err: any) {
      alert(err?.message || "Network error");
    }
  }

  // Open the commissions dialog for a referrer // ← ADDED
  function handleViewCommissions(referrerId: number) {
    const ref = data.find((r) => r.id === referrerId);
    if (!ref) return;
    setCommissionDialog({ id: ref.id, name: ref.name });
  }

  const totalReferrers = data.length;
  const activeReferrers = data.filter((r) => r.is_active).length;
  const totalChannels = data.reduce((sum, r) => sum + r.channels.length, 0);
  const totalAgents = data.reduce((sum, r) => sum + r.users_count, 0);

  return (
    <PageShell>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Referrers
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Influencers, channels, and commission tracking
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddReferrer(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition"
        >
          <Plus className="w-4 h-4" />
          Add Referrer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Referrers"
          value={totalReferrers}
          icon={<Users className="w-4 h-4 text-slate-400" />}
        />
        <StatCard
          label="Active"
          value={activeReferrers}
          icon={<Radio className="w-4 h-4 text-slate-400" />}
        />
        <StatCard
          label="Total Channels"
          value={totalChannels}
          icon={<Radio className="w-4 h-4 text-slate-400" />}
        />
        <StatCard
          label="Agents Attributed"
          value={totalAgents}
          icon={<Users className="w-4 h-4 text-slate-400" />}
        />
      </div>

      {/* List */}
      {loading && (
        <div className="h-[200px] flex items-center justify-center">
          <Spinner label="Loading referrers..." />
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 rounded-lg text-sm text-red-700 dark:text-red-400">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {data.length === 0 ? (
            <EmptyState
              title="No referrers yet"
              description="Click 'Add Referrer' to create your first one."
            />
          ) : (
            <div className="space-y-4">
              {data.map((referrer) => (
                <ReferrerCard
                  key={referrer.id}
                  referrer={referrer}
                  onAddChannel={handleAddChannel}
                  onGenerateToken={handleGenerateToken}
                  onViewCommissions={handleViewCommissions} // ← ADDED
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Dialogs */}
      <AddReferrerDialog
        open={showAddReferrer}
        onClose={() => setShowAddReferrer(false)}
        onSuccess={fetchReferrers}
      />

      <AddChannelDialog
        open={addChannelFor !== null}
        referrerId={addChannelFor?.id ?? null}
        referrerName={addChannelFor?.name}
        onClose={() => setAddChannelFor(null)}
        onSuccess={fetchReferrers}
      />

      <TokenDialog
        open={tokenInfo !== null}
        token={tokenInfo?.token ?? null}
        url={tokenInfo?.url ?? null}
        referrerName={tokenInfo?.name}
        onClose={() => setTokenInfo(null)}
      />

      {/* Commission details dialog — NEW */}
      <CommissionDetailsDialog
        open={commissionDialog !== null}
        referrerId={commissionDialog?.id ?? null}
        referrerName={commissionDialog?.name}
        onClose={() => setCommissionDialog(null)}
      />
    </PageShell>
  );
}