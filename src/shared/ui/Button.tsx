import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary-alt",
  accent: "bg-accent text-white hover:bg-highlight",
  outline:
    "border border-border bg-surface text-text hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-text-muted hover:bg-border/40",
  danger: "bg-danger text-white hover:opacity-90",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = "accent",
  children,
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-[var(--touch-min)] items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 text-base font-medium transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
