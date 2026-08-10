import { notFound } from "next/navigation";
import Link from "next/link";
import { CatalogProductList } from "@/features/catalog/CatalogProductList";
import { TrackCategoryVisit } from "@/features/catalog/TrackCategoryVisit";
import { catalogService } from "@/services/catalogService";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CatalogCategoryPage({ params }: PageProps) {
  const { id } = await params;

  const [category, products, factories] = await Promise.all([
    catalogService.getCategoryById(id).catch(() => null),
    catalogService.getProductsByCategory(id).catch(() => []),
    catalogService.getFactories().catch(() => []),
  ]);

  if (!category) notFound();

  const children = category.children ?? [];

  return (
    <div>
      <TrackCategoryVisit id={category.id} name={category.name} />
      {children.length > 0 ? (
        <div className="border-b border-border px-4 py-3">
          <p className="mb-2 text-xs font-medium text-text-muted">زیردسته‌ها</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {children.map((child) => (
              <Link
                key={child.id}
                href={routes.catalog.category(child.id)}
                className="shrink-0 rounded-full bg-surface px-3 py-2 text-sm font-medium text-text shadow-[var(--shadow-soft)]"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <CatalogProductList
        title={category.name}
        products={products}
        factories={factories}
        emptyDescription="محصولی در این دسته نیست."
      />
    </div>
  );
}
