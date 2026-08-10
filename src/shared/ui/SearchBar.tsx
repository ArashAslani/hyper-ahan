"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";

type SearchBarProps = {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  sticky?: boolean;
  autoFocus?: boolean;
};

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "جستجوی محصول، سایز، کارخانه...",
  sticky,
  autoFocus = false,
}: SearchBarProps) {
  const hasValue = Boolean(value?.length);

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
          autoFocus={autoFocus}
          aria-label={placeholder}
          className={`min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-surface pr-10 text-base text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 [&::-webkit-search-cancel-button]:hidden ${
            hasValue ? "pl-11" : "pl-4"
          }`}
        />
        {hasValue ? (
          <button
            type="button"
            onClick={() => onChange?.("")}
            aria-label="پاک کردن جستجو"
            className="absolute top-1/2 left-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition hover:bg-bg hover:text-text active:scale-95"
          >
            <FontAwesomeIcon icon={faTimes} className="text-sm" />
          </button>
        ) : null}
      </div>
    </form>
  );
}
