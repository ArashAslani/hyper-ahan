import { useId, type ReactNode } from "react";

type AdminFieldProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  description?: string;
  error?: string;
  /** Slot rendered next to the label — typically a character counter. */
  counter?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Standard labeled field wrapper — label, required marker, description, error, counter slot. */
export function AdminField({
  label,
  htmlFor,
  required,
  description,
  error,
  counter,
  children,
  className = "",
}: AdminFieldProps) {
  const reactId = useId();
  const baseId = htmlFor ?? reactId;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label || counter ? (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <label htmlFor={htmlFor} className="text-sm font-medium text-text">
              {label}
              {required ? <span className="text-danger"> *</span> : null}
            </label>
          ) : (
            <span />
          )}
          {counter}
        </div>
      ) : null}

      {children}

      {error ? (
        <p id={`${baseId}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : description ? (
        <p id={`${baseId}-description`} className="text-xs text-text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}
