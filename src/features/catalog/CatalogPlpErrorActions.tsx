"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";

type CatalogPlpErrorActionsProps = {
  resetHref: string;
  message?: string;
};

export function CatalogPlpErrorActions({
  resetHref,
  message,
}: CatalogPlpErrorActionsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 text-4xl" aria-hidden="true">
        ⚠️
      </div>
      <h2 className="text-lg font-bold text-text">بارگذاری محصولات ناموفق بود</h2>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        {message || "لطفاً دوباره تلاش کنید یا فیلترها را پاک کنید."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={() => router.refresh()}>
          تلاش مجدد
        </Button>
        <Link
          href={resetHref}
          className="inline-flex min-h-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface px-4 text-base font-medium text-text transition hover:border-accent hover:text-accent active:scale-95"
        >
          پاک‌کردن فیلترها
        </Link>
      </div>
    </div>
  );
}
