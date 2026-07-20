"use client";

import type { ReactNode } from "react";
import { Button } from "@/shared/ui/Button";

type AdminEmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
};

/** Reusable empty state for Admin lists/tables — icon, copy, and up to two actions. */
export function AdminEmptyState({
  icon,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: AdminEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}>
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-2xl text-accent">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-bold text-text">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-sm text-sm text-text-muted">{description}</p>
      ) : null}
      {primaryActionLabel || secondaryActionLabel ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {secondaryActionLabel ? (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          ) : null}
          {primaryActionLabel ? (
            <Button variant="accent" onClick={onPrimaryAction}>
              {primaryActionLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
