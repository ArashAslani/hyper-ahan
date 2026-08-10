import Link from "next/link";
import { routes } from "@/lib/routes";
import { EmptyState } from "@/shared/ui/EmptyState";
import type { CatalogCategory } from "@/types/catalog";

type CatalogCategoryTreeProps = {
  categories: CatalogCategory[];
};

function CategoryBranch({
  category,
  depth = 0,
}: {
  category: CatalogCategory;
  depth?: number;
}) {
  const children = category.children ?? [];
  return (
    <li>
      <Link
        href={routes.catalog.category(category.id)}
        className="flex min-h-[var(--touch-min)] items-center justify-between rounded-[var(--radius-md)] px-3 py-2 text-text transition hover:bg-bg"
        style={{ paddingInlineStart: `${12 + depth * 16}px` }}
      >
        <span className="font-medium">{category.name}</span>
        <span className="text-sm text-accent">←</span>
      </Link>
      {children.length > 0 ? (
        <ul className="border-r border-border/60 mr-3">
          {children.map((child) => (
            <CategoryBranch key={child.id} category={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function CatalogCategoryTree({ categories }: CatalogCategoryTreeProps) {
  if (categories.length === 0) {
    return (
      <EmptyState
        title="دسته‌ای یافت نشد"
        description="از جستجو برای پیدا کردن محصولات استفاده کنید."
        icon="📂"
      />
    );
  }

  return (
    <ul className="space-y-1 rounded-[var(--radius-lg)] bg-surface p-2 shadow-[var(--shadow-soft)]">
      {categories.map((cat) => (
        <CategoryBranch key={cat.id} category={cat} />
      ))}
    </ul>
  );
}
