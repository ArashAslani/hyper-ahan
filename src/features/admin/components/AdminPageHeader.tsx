import Link from "next/link";
import type { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export type AdminBreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: AdminBreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
};

/** Standard page header for every Admin screen — title, description, breadcrumb trail, action slot. */
export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className = "",
}: AdminPageHeaderProps) {
  return (
    <header className={`space-y-3 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="مسیر صفحه" className="flex flex-wrap items-center gap-1 text-xs text-text-muted">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={`${item.label}-${index}`} className="flex items-center gap-1">
                {item.href && !isLast ? (
                  <Link href={item.href} className="transition hover:text-accent">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-text" : ""}>{item.label}</span>
                )}
                {!isLast ? (
                  <FontAwesomeIcon icon={faChevronLeft} className="text-[10px] text-text-muted/60" />
                ) : null}
              </span>
            );
          })}
        </nav>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-text md:text-2xl">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-text-muted">{description}</p>
          ) : null}
        </div>

        {actions ? (
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
