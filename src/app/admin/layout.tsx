import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/features/admin";

export const metadata: Metadata = {
  title: "پنل مدیریت هایپر آهن",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
