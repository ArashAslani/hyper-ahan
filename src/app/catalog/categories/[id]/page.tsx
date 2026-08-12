import { notFound } from "next/navigation";
import Link from "next/link";
import { CatalogPlpErrorActions } from "@/features/catalog/CatalogPlpErrorActions";
import { CatalogProductList } from "@/features/catalog/CatalogProductList";
import { TrackCategoryVisit } from "@/features/catalog/TrackCategoryVisit";
import { catalogService } from "@/services/catalogService";
import {
  decodeCatalogPlpUrl,
  toCatalogPlpQuery,
  toUrlSearchParams,
  type CatalogPlpSearchParams,
} from "@/lib/catalogPlpQuery";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<CatalogPlpSearchParams>;
};

export default async function CatalogCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const [{ id }, rawSearchParams] = await Promise.all([params, searchParams]);
  const pathname = routes.catalog.category(id);
  const urlState = decodeCatalogPlpUrl(toUrlSearchParams(rawSearchParams));
  const query = toCatalogPlpQuery(id, urlState);

  const [category, plpOutcome, factories] = await Promise.all([
    catalogService.getCategoryById(id),
    catalogService
      .queryCategoryPlp(query)
      .then((result) => ({ result, error: null }))
      .catch((error: unknown) => ({ result: null, error })),
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
      {plpOutcome.result ? (
        <CatalogProductList
          title={category.name}
          result={plpOutcome.result}
          factories={factories}
          urlState={urlState}
          pathname={pathname}
          emptyDescription="محصولی با این فیلترها در این دسته نیست."
        />
      ) : (
        <section className="px-4 py-4">
          <h1 className="text-xl font-bold text-text">{category.name}</h1>
          <CatalogPlpErrorActions
            resetHref={pathname}
            message={
              plpOutcome.error instanceof Error
                ? plpOutcome.error.message
                : undefined
            }
          />
        </section>
      )}
    </div>
  );
}
