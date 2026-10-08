// components/layout/PageShell.tsx
//
// Wraps each dashboard page with consistent padding.
// Use inside app/*/page.tsx:
//
//   <PageShell>
//     <h2>...</h2>
//   </PageShell>

import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {children}
    </div>
  );
}