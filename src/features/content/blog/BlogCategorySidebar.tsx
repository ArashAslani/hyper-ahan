import Link from "next/link";
import { routes } from "@/lib/routes";
import type { BlogCategory } from "@/types";

type BlogCategorySidebarProps = {
  categories: BlogCategory[];
  activeSlug?: string;
};

export function BlogCategorySidebar({ categories, activeSlug }: BlogCategorySidebarProps) {
  return (
    <nav
      aria-label="دسته‌بندی مقالات"
      className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]"
    >
      <h2 className="mb-3 text-sm font-bold text-text">دسته‌بندی مقالات</h2>
      <ul className="space-y-1">
        <li>
          <Link
            href={routes.blog.list}
            className={`block rounded-[var(--radius-sm)] px-3 py-2 text-sm transition ${
              !activeSlug ? "bg-accent/10 font-semibold text-accent" : "text-text-muted hover:bg-bg"
            }`}
          >
            همه مقالات
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={routes.blog.category(category.slug)}
              className={`block rounded-[var(--radius-sm)] px-3 py-2 text-sm transition ${
                activeSlug === category.slug
                  ? "bg-accent/10 font-semibold text-accent"
                  : "text-text-muted hover:bg-bg"
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
