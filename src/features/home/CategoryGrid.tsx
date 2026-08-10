import Link from "next/link";
import { routes } from "@/lib/routes";
import type { HomeCategory } from "@/types";

type CategoryGridProps = {
  categories: HomeCategory[];
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="home-section-enter px-4 py-6" style={{ animationDelay: "100ms" }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">دسته‌بندی‌ها</h2>
        <Link
          href={routes.catalog.root}
          className="text-sm font-medium text-accent transition duration-200 hover:opacity-80"
        >
          همه
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {categories.slice(0, 8).map((cat) => (
          <Link
            key={cat.id}
            href={routes.catalog.category(cat.id)}
            className="home-card-lift flex min-h-[88px] flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] bg-surface p-2 text-center shadow-[var(--shadow-soft)]"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-bold text-accent"
              aria-hidden
            >
              {cat.icon ?? cat.name.slice(0, 1)}
            </span>
            <span className="text-xs font-medium text-text">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
