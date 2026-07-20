"use client";

import { useId, useState, type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/shared/ui/Input";
import { AdminField } from "./AdminField";
import { getFieldError } from "./utils";

type AdminTextInputType = "text" | "email" | "tel" | "url" | "password";

type AdminTextInputProps = {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  type?: AdminTextInputType;
  placeholder?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  maxLength?: number;
  showCounter?: boolean;
  loading?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
};

function counterTone(length: number, max: number): string {
  if (length > max) return "text-danger";
  if (length >= max * 0.8) return "text-highlight";
  return "text-text-muted";
}

/** Reusable RHF-integrated text input — wraps the shared `Input` for the plain case, adds icon/clear/password affordances when needed. */
export function AdminTextInput({
  name,
  label,
  description,
  required,
  type = "text",
  placeholder,
  prefix,
  suffix,
  clearable,
  maxLength,
  showCounter,
  loading = false,
  disabled = false,
  autoComplete,
  autoFocus,
  className = "",
}: AdminTextInputProps) {
  const reactId = useId();
  const fieldId = `admin-text-${name}-${reactId}`;
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const error = getFieldError(errors, name);
  const [showPassword, setShowPassword] = useState(false);
  const value: string = watch(name) ?? "";
  const resolvedType = type === "password" ? (showPassword ? "text" : "password") : type;

  const counter =
    showCounter && maxLength ? (
      <span className={`text-xs ${counterTone(value.length, maxLength)}`}>
        {value.length}/{maxLength}
      </span>
    ) : undefined;

  const hasAffordance = Boolean(prefix || suffix || clearable || loading || type === "password");

  if (!hasAffordance) {
    return (
      <AdminField htmlFor={fieldId} required={required} description={description} error={error} counter={counter}>
        <Input
          id={fieldId}
          label={required && label ? `${label} *` : label ?? ""}
          type={resolvedType}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={error ? "border-danger focus:border-danger" : ""}
          {...register(name)}
        />
      </AdminField>
    );
  }

  return (
    <AdminField
      label={label}
      htmlFor={fieldId}
      required={required}
      description={description}
      error={error}
      counter={counter}
    >
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-muted">
            {prefix}
          </span>
        ) : null}
        <input
          id={fieldId}
          type={resolvedType}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          {...register(name)}
          className={`min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border bg-surface text-base text-text transition placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? "border-danger focus:border-danger" : "border-border focus:border-accent"
          } ${prefix ? "pr-10" : "pr-4"} ${
            suffix || clearable || loading || type === "password" ? "pl-10" : "pl-4"
          } ${className}`}
        />
        <div className="absolute top-1/2 left-3 flex -translate-y-1/2 items-center gap-2">
          {loading ? (
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-text-muted" aria-hidden />
          ) : (
            <>
              {clearable && value ? (
                <button
                  type="button"
                  onClick={() => setValue(name, "", { shouldDirty: true, shouldValidate: true })}
                  aria-label="پاک کردن"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition hover:bg-bg hover:text-text"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              ) : null}
              {type === "password" ? (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "پنهان کردن رمز عبور" : "نمایش رمز عبور"}
                  className="text-text-muted transition hover:text-accent"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              ) : null}
              {suffix ? <span className="text-text-muted">{suffix}</span> : null}
            </>
          )}
        </div>
      </div>
    </AdminField>
  );
}
