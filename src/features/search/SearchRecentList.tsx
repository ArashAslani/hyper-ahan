"use client";

import { useState } from "react";
import Link from "next/link";
import { catalogRecent } from "@/lib/catalogRecent";
import { routes } from "@/lib/routes";

export function SearchRecentList() {
  const [searches] = useState(() => catalogRecent.getSearches());

  if (searches.length === 0) {
    return (
      <p className="mt-4 text-sm text-text-muted">
        نام محصول، دسته، مقاله یا محاسبه‌گر را جستجو کنید.
      </p>
    );
  }

  return (
    <section aria-label="جستجوهای اخیر" className="mt-4 space-y-2">
      <h2 className="text-sm font-semibold text-text">جستجوهای اخیر</h2>
      <ul className="flex flex-wrap gap-2">
        {searches.map((s) => (
          <li key={s.q}>
            <Link
              href={`${routes.search}?q=${encodeURIComponent(s.q)}&page=1`}
              className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-surface px-3 text-sm font-medium text-text shadow-[var(--shadow-soft)]"
            >
              {s.q}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
