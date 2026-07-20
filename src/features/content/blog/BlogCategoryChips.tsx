"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { BlogCategory } from "@/types";

type BlogCategoryChipsProps = {
  categories: BlogCategory[];
  activeSlug?: string;
  sticky?: boolean;
};

export function BlogCategoryChips({ categories, activeSlug, sticky = true }: BlogCategoryChipsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildHref = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    params.delete("page");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <nav
      aria-label="فیلتر دسته‌بندی مقالات"
      className={`${
        sticky ? "sticky top-[var(--topbar-h)] z-20 bg-bg/95 backdrop-blur-sm" : ""
      } -mx-4 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
    >
      <ul className="flex w-max gap-2">
        <li>
          <Link
            href={buildHref(undefined)}
            aria-current={!activeSlug ? "page" : undefined}
            className={`flex min-h-[var(--touch-min)] items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition active:scale-95 ${
              !activeSlug
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
            }`}
          >
            همه دسته‌ها
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={buildHref(category.slug)}
              aria-current={activeSlug === category.slug ? "page" : undefined}
              className={`flex min-h-[var(--touch-min)] items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition active:scale-95 ${
                activeSlug === category.slug
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
