import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}
