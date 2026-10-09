// components/layout/ConditionalShell.tsx
//
// Shell that hides sidebar on /login and manages sidebar collapse state.
// Imports Sidebar and Header directly to avoid passing functions from
// a server component (app/layout.tsx) to a client component.

"use client";

import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface Props {
  children: ReactNode;
}

export function ConditionalShell({ children }: Props) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [collapsed, setCollapsed] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}