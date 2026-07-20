"use client";

import { useId } from "react";
import { useController, useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { AdminField } from "./AdminField";

export type AdminCheckboxOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AdminCheckboxGroupProps = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  options: AdminCheckboxOption[];
  columns?: 1 | 2 | 3;
  className?: string;
};

const COLUMN_CLASSES: Record<1 | 2 | 3, string> = {
  1: "",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

/** Reusable multi-select checkbox list (Tags / Permissions / Categories / ...). */
export function AdminCheckboxGroup({
  name,
  label,
  description,
  required,
  options,
  columns = 2,
  className = "",
}: AdminCheckboxGroupProps) {
  const reactId = useId();
  const groupId = `admin-checkbox-group-${name}-${reactId}`;
  const { control } = useFormContext();
  const { field, fieldState } = useController({ name, control });
  const values: string[] = Array.isArray(field.value) ? field.value : [];

  function toggle(value: string) {
    field.onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  return (
    <AdminField
      label={label}
      htmlFor={groupId}
      required={required}
      description={description}
      error={fieldState.error?.message}
    >
      <div id={groupId} role="group" className={`grid grid-cols-1 gap-2 ${COLUMN_CLASSES[columns]} ${className}`}>
        {options.map((option) => {
          const checked = values.includes(option.value);
          return (
            <label
              key={option.value}
              className={`flex min-h-[var(--touch-min)] cursor-pointer items-center gap-2 rounded-[var(--radius-md)] border px-3 text-sm transition ${
                checked ? "border-accent bg-accent/5 text-text" : "border-border text-text-muted hover:border-accent/50"
              } ${option.disabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={option.disabled}
                onChange={() => toggle(option.value)}
                className="sr-only"
              />
              <span
                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${
                  checked ? "border-accent bg-accent text-white" : "border-border bg-surface"
                }`}
                aria-hidden
              >
                {checked ? <FontAwesomeIcon icon={faCheck} className="text-[10px]" /> : null}
              </span>
              <span className="truncate">{option.label}</span>
            </label>
          );
        })}
      </div>
    </AdminField>
  );
}
