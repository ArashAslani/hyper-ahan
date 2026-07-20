"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { useAdminAuth } from "./AdminAuthProvider";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(routes.admin.login);
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <span className="spinner-accent" aria-label="در حال بررسی ورود" />
      </div>
    );
  }

  return <>{children}</>;
}
