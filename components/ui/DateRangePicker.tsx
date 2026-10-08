// components/ui/DateRangePicker.tsx
//
// Range selector: 24h / 7d / 30d / 3m / 6m / 1y / all

"use client";

import clsx from "clsx";
import type { DateRange } from "@/lib/types";

const OPTIONS: { value: DateRange; label: string }[] = [
  { value: "24h", label: "24h" },
  { value: "7d",  label: "7d"  },
  { value: "30d", label: "30d" },
  { value: "3m",  label: "3m"  },
  { value: "6m",  label: "6m"  },
  { value: "1y",  label: "1y"  },
  { value: "all", label: "All" },
];

interface Props {
  value: DateRange;
  onChange: (v: DateRange) => void;
}

export function DateRangePicker({ value, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "px-2.5 py-1 text-xs font-medium rounded transition",
            value === opt.value
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}