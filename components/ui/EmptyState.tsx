// components/ui/EmptyState.tsx

import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No data",
  description = "There's nothing to show here yet.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-3" />
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{description}</p>
    </div>
  );
}