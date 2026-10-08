// components/realtime/LiveIndicator.tsx
//
// Pulsing green dot + "Live · Xs refresh" label.

"use client";

export function LiveIndicator({ refreshing }: { refreshing: boolean }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${
            refreshing ? "animate-ping" : ""
          }`}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="font-medium">Live</span>
      <span className="text-slate-400">·</span>
      <span>5s refresh</span>
    </div>
  );
}