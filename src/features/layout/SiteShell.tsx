import type { ReactNode } from "react";
import { TopBar } from "@/features/layout/TopBar";
import { BottomNav } from "@/features/layout/BottomNav";

export function SiteShell({ children }: { children: ReactNode }) {
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
