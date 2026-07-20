"use client";

import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";

type AdminSwitchProps = {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

/** Reusable boolean toggle (Published / Featured / Active / Allow comments / ...). */
export function AdminSwitch({ name, label, description, disabled = false, className = "" }: AdminSwitchProps) {
  const reactId = useId();
  const fieldId = `admin-switch-${name}-${reactId}`;
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const checked = Boolean(field.value);

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-3 ${className}`}
    >
      <div className="min-w-0">
        <label htmlFor={fieldId} className="text-sm font-medium text-text">
          {label}
        </label>
        {description ? <p className="mt-0.5 text-xs text-text-muted">{description}</p> : null}
        {fieldState.error ? (
          <p role="alert" className="mt-1 text-xs text-danger">
            {fieldState.error.message}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        id={fieldId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => field.onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <span
          className={`absolute h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
            checked ? "right-[22px]" : "right-0.5"
          }`}
          aria-hidden
        />
      </button>
    </div>
  );
}
