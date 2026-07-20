"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { AdminField } from "./AdminField";

export type AdminSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AdminSelectProps = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  options: AdminSelectOption[];
  placeholder?: string;
  /** Renders a filterable listbox instead of a native `<select>`. */
  searchable?: boolean;
  loading?: boolean;
  disabled?: boolean;
  emptyLabel?: string;
  className?: string;
};

/** Reusable RHF-integrated select — native `<select>` by default, filterable listbox when `searchable`. */
export function AdminSelect({
  name,
  label,
  description,
  required,
  options,
  placeholder = "انتخاب کنید",
  searchable = false,
  loading = false,
  disabled = false,
  emptyLabel = "موردی یافت نشد",
  className = "",
}: AdminSelectProps) {
  const reactId = useId();
  const fieldId = `admin-select-${name}-${reactId}`;
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const { ref: selectRef, ...selectField } = field;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const isBusy = disabled || loading;

  const selected = options.find((option) => option.value === selectField.value) ?? null;
  const filtered =
    searchable && query
      ? options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()))
      : options;

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!searchable) {
    return (
      <AdminField
        label={label}
        htmlFor={fieldId}
        required={required}
        description={description}
        error={fieldState.error?.message}
      >
        <div className="relative">
          <select
            id={fieldId}
            ref={selectRef}
            {...selectField}
            value={selectField.value ?? ""}
            disabled={isBusy}
            aria-invalid={Boolean(fieldState.error)}
            className={`min-h-[var(--touch-min)] w-full appearance-none rounded-[var(--radius-md)] border bg-surface pr-4 pl-10 text-base text-text transition focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 ${
              fieldState.error ? "border-danger focus:border-danger" : "border-border focus:border-accent"
            } ${className}`}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <FontAwesomeIcon
            icon={loading ? faSpinner : faChevronDown}
            className={`pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-text-muted ${
              loading ? "animate-spin" : ""
            }`}
          />
        </div>
      </AdminField>
    );
  }

  return (
    <AdminField
      label={label}
      htmlFor={fieldId}
      required={required}
      description={description}
      error={fieldState.error?.message}
    >
      <div ref={containerRef} className="relative">
        <button
          type="button"
          id={fieldId}
          onClick={() => setOpen((prev) => !prev)}
          disabled={isBusy}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`flex min-h-[var(--touch-min)] w-full items-center justify-between rounded-[var(--radius-md)] border bg-surface px-4 text-base transition focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 ${
            fieldState.error ? "border-danger" : "border-border"
          } ${selected ? "text-text" : "text-text-muted"} ${className}`}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <FontAwesomeIcon
            icon={loading ? faSpinner : faChevronDown}
            className={`text-xs text-text-muted ${loading ? "animate-spin" : ""}`}
          />
        </button>

        {open ? (
          <div
            role="listbox"
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface shadow-[var(--shadow-card)]"
          >
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو..."
              className="w-full border-b border-border px-3 py-2 text-sm text-text focus:outline-none"
            />
            <div className="max-h-56 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-sm text-text-muted">{emptyLabel}</p>
              ) : (
                filtered.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={option.value === selectField.value}
                    disabled={option.disabled}
                    onClick={() => {
                      selectField.onChange(option.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex min-h-[var(--touch-min)] w-full items-center justify-between px-3 text-sm transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50 ${
                      option.value === selectField.value ? "text-accent" : "text-text"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    {option.value === selectField.value ? (
                      <FontAwesomeIcon icon={faCheck} className="text-xs" />
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : null}
      </div>
    </AdminField>
  );
}
