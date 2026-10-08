// components/layout/ConditionalShell.tsx
//
// Wraps children with sidebar + header, EXCEPT on /login.

"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function ConditionalShell({ sidebar, header, children }: Props) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {sidebar}
      <div className="flex-1 flex flex-col min-w-0">
        {header}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}