import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const fieldClass =
  "peer w-full min-h-[var(--touch-min)] rounded-[var(--radius-md)] border border-border bg-surface px-4 pt-5 pb-2 text-base text-text placeholder-transparent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

// forwardRef so form libraries (React Hook Form's `register`) can attach a
// DOM ref for focus management — behavior is unchanged for existing callers.
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, id, className = "", ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="relative">
      <input
        ref={ref}
        id={inputId}
        placeholder={label}
        className={`${fieldClass} ${className}`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute top-2 right-4 text-xs text-text-muted transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent"
      >
        {label}
      </label>
    </div>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({
  label,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const inputId = id ?? props.name;
  if (!label) {
    return (
      <textarea
        id={inputId}
        className={`w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-base text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 ${className}`}
        {...props}
      />
    );
  }
  return (
    <div className="relative">
      <textarea
        id={inputId}
        placeholder={label}
        className={`peer w-full rounded-[var(--radius-md)] border border-border bg-surface px-4 pt-6 pb-2 text-base text-text placeholder-transparent focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 ${className}`}
        {...props}
      />
      <label
        htmlFor={inputId}
        className="pointer-events-none absolute top-2 right-4 text-xs text-text-muted transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-accent"
      >
        {label}
      </label>
    </div>
  );
}
