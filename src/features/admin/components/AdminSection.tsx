import type { ReactNode } from "react";

type AdminSectionProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Reusable vertical section block for composing Admin pages — heading row + content. */
export function AdminSection({
  title,
  description,
  actions,
  children,
  className = "",
}: AdminSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      {title || actions ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title ? <h2 className="text-base font-bold text-text">{title}</h2> : null}
            {description ? (
              <p className="mt-1 text-sm text-text-muted">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
