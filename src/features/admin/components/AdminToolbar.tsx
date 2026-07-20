"use client";

import type { ReactNode } from "react";
import { AdminSearchInput } from "./AdminSearchInput";

type AdminToolbarProps = {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  searchLoading?: boolean;
  /** Filter controls (selects, chips, date pickers, ...). */
  filters?: ReactNode;
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  sticky?: boolean;
  className?: string;
};

/** Reusable filter/search/action bar for Admin list screens. */
export function AdminToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  searchLoading,
  filters,
  leftActions,
  rightActions,
  sticky = false,
  className = "",
}: AdminToolbarProps) {
  return (
    <div
      className={`flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-3 sm:flex-row sm:items-center sm:justify-between ${
        sticky ? "sticky top-0 z-10 bg-surface/95 backdrop-blur" : ""
      } ${className}`}
    >
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {onSearchChange ? (
          <AdminSearchInput
            value={searchValue ?? ""}
            onValueChange={onSearchChange}
            placeholder={searchPlaceholder}
            loading={searchLoading}
            className="w-full sm:max-w-xs"
          />
        ) : null}

        {filters ? (
          <div className="flex flex-wrap items-center gap-2">{filters}</div>
        ) : null}

        {leftActions ? (
          <div className="flex flex-wrap items-center gap-2">{leftActions}</div>
        ) : null}
      </div>

      {rightActions ? (
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{rightActions}</div>
      ) : null}
    </div>
  );
}
