// components/ui/Spinner.tsx

import { Loader2 } from "lucide-react";

interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({ label, className = "" }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 text-slate-500 ${className}`}>
      <Loader2 className="w-4 h-4 animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}