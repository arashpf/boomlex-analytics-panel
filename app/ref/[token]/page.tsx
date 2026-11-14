// app/ref/[token]/page.tsx
//
// Public read-only portal for referrers.
// No auth required — the URL token IS the access.
// Bilingual: Persian (default, RTL) + English (LTR). Toggle in the top bar.

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  TrendingUp,
  CalendarClock,
  Clock,
  Copy,
  Check,
  Camera,
  PlayCircle,
  Send,
  MessageCircle,
  Video,
  Globe,
  Languages,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Channel {
  id: number;
  code: string;
  channel: string;
  channel_handle: string | null;
}

interface ReferrerMe {
  id: number;
  name: string;
  commission_rate: number;
  channels: Channel[];
}

interface Summary {
  agents_count: number;
  channels_count: number;
  total_records: number;
  total_payment: number;
  total_commission: number;
  pending_commission: number;
  paid_commission: number;
  this_month: number;
  last_30_days: number;
}

interface Commission {
  id: number;
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

// ─────────────────────────────────────────────
// i18n dictionary
// ─────────────────────────────────────────────

type Lang = "fa" | "en";

const DICT = {
  fa: {
    dir: "rtl",
    brand: "داشبورد معرف",
    rateSuffix: "٪ کمیسیون",
    // Stat cards
    agents: "مشاور املاک معرفی‌شده",
    lifetime: "درآمد کل",
    thisMonth: "این ماه",
    pending: "در انتظار پرداخت",
    // Channels section
    channelsTitle: "لینک‌های رهگیری شما",
    channelsDesc:
      "این لینک‌ها را در کانال‌های خود به اشتراک بگذارید. هر مشاور املاکی که از طریق آن‌ها ثبت‌نام کند، برای همیشه به شما منتسب می‌شود.",
    channelsNote:
      "توجه کنید که هر زمان مشاور معرفی شده پلنی خریداری کند درصد شما لحاظ خواهد شد و در ابتدای هر ماه به حسابتان واریز می‌شود.\nحداقل مقدار قابل برداشت ۵۰۰ هزار تومان می‌باشد.",
    noChannels: "هنوز کانال فعالی ندارید.",
    // Commission history
    historyTitle: "تاریخچه کمیسیون",
    historyEmpty:
      "هنوز کمیسیونی ثبت نشده است. زمانی که مشاور املاکی که معرفی کرده‌اید پرداختی انجام دهد، درآمد شما اینجا نمایش داده می‌شود.",
    colDate: "تاریخ",
    colChannel: "کانال",
    colPayment: "پرداخت",
    colRate: "نرخ",
    colYourCut: "سهم شما",
    // Copy button
    copyLink: "کپی لینک",
    copied: "کپی شد",
    // Footer
    footer:
      "این یک داشبورد خصوصی است. این آدرس را با کسی به اشتراک نگذارید — دسترسی فقط خواندنی به آمار شما می‌دهد.",
    // Error / loading states
    loading: "در حال بارگذاری داشبورد…",
    notFoundTitle: "لینک پیدا نشد",
    notFoundDesc:
      "این لینک پورتال نامعتبر است یا غیرفعال شده. لطفاً با کسی که این آدرس را برایتان ارسال کرده تماس بگیرید.",
    // Currency suffix
    currency: "تومان",
    // Language toggle label
    switchTo: "English",
  },
  en: {
    dir: "ltr",
    brand: "Referral dashboard",
    rateSuffix: "% commission",
    agents: "Referred agents",
    lifetime: "Lifetime earnings",
    thisMonth: "This month",
    pending: "Pending payout",
    channelsTitle: "Your tracking links",
    channelsDesc:
      "Share these links on your channels. Every agent who signs up through them is permanently attributed to you.",
    channelsNote:
      "Each time a referred agent buys a plan, your commission is calculated and paid to your account at the start of the following month.\nMinimum withdrawal: 500,000 Toman.",
    noChannels: "No active channels yet.",
    historyTitle: "Commission history",
    historyEmpty:
      "No commissions yet. When an agent you referred makes a payment, your earnings will appear here.",
    colDate: "Date",
    colChannel: "Channel",
    colPayment: "Payment",
    colRate: "Rate",
    colYourCut: "Your cut",
    copyLink: "Copy link",
    copied: "Copied",
    footer:
      "This is a private dashboard. Don't share this URL with anyone — it grants read-only access to your stats.",
    loading: "Loading your dashboard…",
    notFoundTitle: "Link not found",
    notFoundDesc:
      "This portal link is invalid or has been deactivated. Please contact the person who sent you this URL.",
    currency: "Toman",
    switchTo: "فارسی",
  },
} as const;

// ─────────────────────────────────────────────
// Icon maps
// ─────────────────────────────────────────────

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Camera,
  youtube: PlayCircle,
  telegram: Send,
  whatsapp: MessageCircle,
  aparat: Video,
  other: Globe,
};

const CHANNEL_COLORS: Record<string, string> = {
  instagram: "text-pink-500",
  youtube: "text-red-500",
  telegram: "text-sky-500",
  whatsapp: "text-emerald-500",
  aparat: "text-orange-500",
  other: "text-slate-500",
};

// Channel brand names — kept identical in both languages
const CHANNEL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  aparat: "Aparat",
  other: "Other",
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

export default function ReferrerPortalPage() {
  const params = useParams();
  const token = params?.token as string;

  const [me, setMe] = useState<ReferrerMe | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // ─── Language state (Persian default) ───
  const [lang, setLang] = useState<Lang>("fa");
  const t = DICT[lang];

  // ─── Read saved language preference on mount ───
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ref-portal-lang") as Lang | null;
      if (saved === "fa" || saved === "en") setLang(saved);
    } catch {
      // ignore
    }
  }, []);

  // ─── Persist language choice + apply dir/lang on <html> ───
  useEffect(() => {
    try {
      localStorage.setItem("ref-portal-lang", lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  // ─── Hide admin sidebar/header chrome while this page is mounted ───
  useEffect(() => {
    document.body.classList.add("ref-portal-mode");
    return () => {
      document.body.classList.remove("ref-portal-mode");
    };
  }, []);

  // ─── Load data ───
  useEffect(() => {
    if (!token) return;

    async function load() {
      try {
        const [meRes, statsRes, commRes] = await Promise.all([
          fetch(`/api/ref-portal/${token}?action=me`, { cache: "no-store" }),
          fetch(`/api/ref-portal/${token}?action=stats`, { cache: "no-store" }),
          fetch(`/api/ref-portal/${token}/commissions?limit=20`, {
            cache: "no-store",
          }),
        ]);

        if (meRes.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const meJson = await meRes.json();
        const statsJson = await statsRes.json();
        const commJson = await commRes.json();

        if (meJson.ok) setMe(meJson.referrer);
        if (statsJson.ok) setSummary(statsJson.summary);
        if (commJson.ok) setCommissions(commJson.commissions || []);
      } catch (e) {
        console.error("[portal] load error", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  // ─────────────────────────────────────────────
  // Loading / not found states
  // ─────────────────────────────────────────────

  if (loading) {
    return (
      <div
        dir={t.dir}
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center"
      >
        <div className="text-sm text-slate-500">{t.loading}</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div
        dir={t.dir}
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6"
      >
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {t.notFoundTitle}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.notFoundDesc}
          </p>
        </div>
      </div>
    );
  }

  if (!me) return null;

  function fmt(n: number) {
    return new Intl.NumberFormat("en-US").format(n);
  }

  // ─────────────────────────────────────────────
  // Main render
  // ─────────────────────────────────────────────

  return (
    <div dir={t.dir} className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Top bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {me.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.brand} · {me.commission_rate}
              {lang === "fa" ? "٪" : "%"}{" "}
              {lang === "fa" ? "کمیسیون" : "commission"}
            </p>
          </div>

          {/* Language toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === "fa" ? "en" : "fa")}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Languages className="w-3.5 h-3.5" />
            {t.switchTo}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* ─── Summary cards ─── */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat
              icon={<Users className="w-4 h-4 text-sky-500" />}
              label={t.agents}
              value={String(summary.agents_count)}
            />
            <Stat
              icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
              label={t.lifetime}
              value={`${fmt(summary.total_commission)} ${t.currency}`}
            />
            <Stat
              icon={<CalendarClock className="w-4 h-4 text-violet-500" />}
              label={t.thisMonth}
              value={`${fmt(summary.this_month)} ${t.currency}`}
            />
            <Stat
              icon={<Clock className="w-4 h-4 text-amber-500" />}
              label={t.pending}
              value={`${fmt(summary.pending_commission)} ${t.currency}`}
            />
          </div>
        )}

        {/* ─── Channels ─── */}
        <Section title={t.channelsTitle}>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            {t.channelsDesc}
          </p>

          {/* Extra note under the description */}
          <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 py-3 mb-5">
  <p className="text-xs leading-6 text-slate-600 dark:text-slate-400 whitespace-pre-line">
    {t.channelsNote}
  </p>
</div>

          {me.channels.length === 0 ? (
            <div className="text-sm text-slate-400 py-6 text-center">
              {t.noChannels}
            </div>
          ) : (
            <div className="space-y-3">
              {me.channels.map((ch) => (
                <ChannelRow key={ch.id} channel={ch} t={t} />
              ))}
            </div>
          )}
        </Section>

        {/* ─── Commission history ─── */}
        <Section title={t.historyTitle}>
          {commissions.length === 0 ? (
            <div className="text-sm text-slate-400 py-8 text-center">
              {t.historyEmpty}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6 md:mx-0">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="text-start py-2 px-6 md:px-3">
                      {t.colDate}
                    </th>
                    <th className="text-start py-2 px-3">{t.colChannel}</th>
                    <th className="text-end py-2 px-3">{t.colPayment}</th>
                    <th className="text-end py-2 px-3">{t.colRate}</th>
                    <th className="text-end py-2 px-6 md:px-3">
                      {t.colYourCut}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {commissions.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-6 md:px-3 text-slate-600 dark:text-slate-400 tabular-nums whitespace-nowrap">
                        {c.created_at
                          ? new Date(c.created_at).toLocaleDateString(
                              lang === "fa" ? "fa-IR" : "en-GB",
                              {
                                year: "numeric",
                                month: "short",
                                day: "2-digit",
                              }
                            )
                          : "—"}
                      </td>
                      <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                        {c.channel_type
                          ? CHANNEL_LABELS[c.channel_type] || c.channel_type
                          : "—"}
                      </td>
                      <td className="py-2 px-3 text-end text-slate-700 dark:text-slate-300 tabular-nums">
                        {fmt(c.payment_amount)} {t.currency}
                      </td>
                      <td className="py-2 px-3 text-end text-slate-500 dark:text-slate-400 tabular-nums">
                        {c.commission_rate}
                        {lang === "fa" ? "٪" : "%"}
                      </td>
                      <td className="py-2 px-6 md:px-3 text-end font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {fmt(c.commission_amount)} {t.currency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Footer */}
        <p className="text-[11px] text-center text-slate-400 pt-4">
          {t.footer}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Small components
// ─────────────────────────────────────────────

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-2 tabular-nums">
        {value}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function ChannelRow({
  channel,
  t,
}: {
  channel: Channel;
  t: (typeof DICT)[Lang];
}) {
  const [copied, setCopied] = useState(false);
  const Icon = CHANNEL_ICONS[channel.channel] || CHANNEL_ICONS.other;
  const color = CHANNEL_COLORS[channel.channel] || CHANNEL_COLORS.other;
  const url = `https://boomlex.ir/?r=${channel.code}`;
  const label = CHANNEL_LABELS[channel.channel] || channel.channel;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className={`shrink-0 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {label}
          </span>
          {channel.channel_handle && (
            <span className="text-xs text-slate-400 truncate" dir="ltr">
              {channel.channel_handle}
            </span>
          )}
        </div>
        <div
          className="text-xs font-mono text-slate-400 mt-0.5 truncate"
          dir="ltr"
        >
          {url}
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        className={
          "shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition " +
          (copied
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700")
        }
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" /> {t.copied}
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" /> {t.copyLink}
          </>
        )}
      </button>
    </div>
  );
}