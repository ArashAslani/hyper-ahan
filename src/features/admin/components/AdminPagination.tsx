"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

/** Builds a compact page list with `"ellipsis"` markers for large page counts. */
function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}

/** Reusable pagination control for Admin lists/tables. */
export function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav
      aria-label="صفحه‌بندی"
      className={`flex items-center justify-between gap-2 sm:justify-center ${className}`}
    >
      <button
        type="button"
        onClick={() => canGoPrev && onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        aria-label="صفحه قبلی"
        className="flex min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border px-3 text-sm text-text transition hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
        <span className="hidden sm:inline">قبلی</span>
      </button>

      {/* Mobile: compact "current / total" indicator instead of full page list */}
      <span className="text-sm text-text-muted sm:hidden">
        {currentPage} / {totalPages}
      </span>

      <div className="hidden items-center gap-1 sm:flex">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-text-muted">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={`flex min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] border text-sm transition ${
                page === currentPage
                  ? "border-accent bg-accent text-white"
                  : "border-border text-text hover:border-accent hover:text-accent"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="صفحه بعدی"
        className="flex min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border px-3 text-sm text-text transition hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
      >
        <span className="hidden sm:inline">بعدی</span>
        <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
      </button>
    </nav>
  );
}
