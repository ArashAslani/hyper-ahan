import Link from "next/link";
import { routes } from "@/lib/routes";
import type { HomeCategory } from "@/types";

type CategoryGridProps = {
  categories: HomeCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">دسته‌بندی‌ها</h2>
        <Link href={routes.categories} className="text-sm font-medium text-accent">
          همه
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            href={routes.products.category(cat.slug)}
            className="flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] bg-surface p-2 text-center shadow-[var(--shadow-soft)] transition active:scale-95"
          >
            <span className="text-2xl" aria-hidden>
              {cat.icon}
            </span>
            <span className="text-xs font-medium text-text">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
