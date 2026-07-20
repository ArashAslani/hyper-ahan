import { Suspense } from "react";
import { AdminLoginView } from "@/features/admin";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginView />
    </Suspense>
  );
}
