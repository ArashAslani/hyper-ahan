import type { ReactNode } from "react";
import { ProtectedRoute, AdminShell } from "@/features/admin";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
