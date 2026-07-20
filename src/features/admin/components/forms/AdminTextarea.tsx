"use client";

import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { AdminField } from "./AdminField";
import { getFieldError, mergeRefs } from "./utils";

type AdminTextareaProps = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
  autoResize?: boolean;
  disabled?: boolean;
  className?: string;
};

function counterTone(length: number, max: number): string {
  if (length > max) return "text-danger";
  if (length >= max * 0.8) return "text-highlight";
  return "text-text-muted";
}

/** Reusable RHF-integrated textarea with optional auto-resize and character counter. */
export function AdminTextarea({
  name,
  label,
  description,
  required,
  placeholder,
  rows = 4,
  maxLength,
  showCounter,
  autoResize = true,
  disabled = false,
  className = "",
}: AdminTextareaProps) {
  const fieldId = `admin-textarea-${name}`;
  const { register, watch, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);
  const value: string = watch(name) ?? "";
  const localRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: rhfRef, onChange, ...rest } = register(name);

  function resize(el: HTMLTextAreaElement | null) {
    if (!el || !autoResize) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }

  useEffect(() => {
    resize(localRef.current);
    // Only needs to run once, to size the field for any pre-filled default value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counter =
    showCounter && maxLength ? (
      <span className={`text-xs ${counterTone(value.length, maxLength)}`}>
        {value.length}/{maxLength}
      </span>
    ) : undefined;

  return (
    <AdminField
      label={label}
      htmlFor={fieldId}
      required={required}
      description={description}
      error={error}
      counter={counter}
    >
      <textarea
        id={fieldId}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        ref={mergeRefs(rhfRef, localRef)}
        onChange={(event) => {
          onChange(event);
          resize(event.target);
        }}
        {...rest}
        className={`w-full resize-none rounded-[var(--radius-md)] border bg-surface px-4 py-3 text-base text-text transition placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 ${
          error ? "border-danger focus:border-danger" : "border-border focus:border-accent"
        } ${className}`}
      />
    </AdminField>
  );
}
