"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";

type AdminSearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value: string;
  onValueChange: (value: string) => void;
  /** Debounce delay (ms) before `onValueChange` fires after typing stops. */
  debounceMs?: number;
  loading?: boolean;
  /** Keyboard shortcut key (without modifiers) that focuses the input, e.g. "/". */
  shortcutKey?: string;
  className?: string;
};

/** Debounced, reusable search input for Admin toolbars and tables. */
export function AdminSearchInput({
  value,
  onValueChange,
  debounceMs = 350,
  loading = false,
  shortcutKey = "/",
  placeholder = "جستجو...",
  className = "",
  ...props
}: AdminSearchInputProps) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the local draft in sync when the controlled value changes externally
  // (e.g. cleared by a parent filter reset) — not a reaction to user typing.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setDraft(value);
  }, [value]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (draft === value) return;
    const timeout = setTimeout(() => onValueChange(draft), debounceMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, debounceMs]);

  useEffect(() => {
    if (!shortcutKey) return;
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === shortcutKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutKey]);

  return (
    <div className={`relative ${className}`}>
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted"
      />
      <input
        ref={inputRef}
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-surface pr-10 pl-10 text-sm text-text placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        {...props}
      />
      <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-1.5">
        {loading ? (
          <FontAwesomeIcon icon={faSpinner} className="animate-spin text-text-muted" aria-label="در حال جستجو" />
        ) : draft ? (
          <button
            type="button"
            onClick={() => {
              setDraft("");
              onValueChange("");
              inputRef.current?.focus();
            }}
            aria-label="پاک کردن جستجو"
            className="flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition hover:bg-bg hover:text-text"
          >
            <FontAwesomeIcon icon={faXmark} className="text-xs" />
          </button>
        ) : shortcutKey ? (
          <kbd className="hidden rounded border border-border bg-bg px-1.5 py-0.5 text-[10px] text-text-muted sm:inline">
            {shortcutKey}
          </kbd>
        ) : null}
      </div>
    </div>
  );
}
