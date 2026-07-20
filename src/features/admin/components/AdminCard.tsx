import type { ReactNode } from "react";

type AdminCardVariant = "default" | "outlined" | "flat" | "danger";

type AdminCardProps = {
  children: ReactNode;
  variant?: AdminCardVariant;
  className?: string;
};

const VARIANT_CLASSES: Record<AdminCardVariant, string> = {
  default: "bg-surface shadow-[var(--shadow-soft)] border border-transparent",
  outlined: "bg-surface border border-border",
  flat: "bg-bg border border-transparent",
  danger: "bg-danger/5 border border-danger/20",
};

/** Reusable dashboard/CRUD surface card — variants layer on top of shared design tokens. */
export function AdminCard({ children, variant = "default", className = "" }: AdminCardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] p-4 transition-shadow duration-200 ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
