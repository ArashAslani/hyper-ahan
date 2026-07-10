import type { ReactNode } from "react";
import { Header } from "@/features/layout/Header";
import { Footer } from "@/features/layout/Footer";
import { MobileFooter } from "@/features/layout/MobileFooter";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header />
      <main className="flex-grow pb-20 md:pb-0">{children}</main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
