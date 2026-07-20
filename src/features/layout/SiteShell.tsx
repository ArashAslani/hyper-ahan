"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TopBar } from "@/features/layout/TopBar";
import { BottomNav } from "@/features/layout/BottomNav";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Admin panel owns its own layout (sidebar/header) and must stay
  // separate from the customer storefront chrome.
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col bg-bg">
      <TopBar />
      <main className="flex-1 pb-[calc(var(--bottom-nav-h)+0.5rem)]">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
