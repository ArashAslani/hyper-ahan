import Link from "next/link";

type BlogPaginationProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

export function BlogPagination({ currentPage, totalPages, buildHref }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="صفحه‌بندی مقالات" className="mt-8 flex items-center justify-center gap-2">
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`flex min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] border border-border px-3 text-sm transition ${
          currentPage === 1 ? "pointer-events-none opacity-40" : "hover:border-accent hover:text-accent"
        }`}
      >
        قبلی
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] border text-sm transition ${
            page === currentPage
              ? "border-accent bg-accent text-white"
              : "border-border text-text hover:border-accent hover:text-accent"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`flex min-h-[var(--touch-min)] min-w-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] border border-border px-3 text-sm transition ${
          currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:border-accent hover:text-accent"
        }`}
      >
        بعدی
      </Link>
    </nav>
  );
}
