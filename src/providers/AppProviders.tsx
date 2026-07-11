"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/providers/CartProvider";
import { ToastProvider } from "@/shared/ui/Toast";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>{children}</ToastProvider>
    </CartProvider>
  );
}
