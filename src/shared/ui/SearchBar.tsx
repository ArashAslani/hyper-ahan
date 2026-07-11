"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  sticky?: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "جستجوی محصول، سایز، کارخانه...",
  sticky,
}: SearchBarProps) {
  return (
    <form
      className={`flex gap-2 ${sticky ? "sticky top-[var(--topbar-h)] z-30 bg-bg/95 py-2 backdrop-blur" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
    >
      <div className="relative flex-1">
        <FontAwesomeIcon
          icon={faSearch}
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-surface pr-10 pl-4 text-base text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
    </form>
  );
}
