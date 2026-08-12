"use client";

import { useMemo } from "react";
import { CatalogPlpControls } from "@/features/catalog/CatalogPlpControls";
import { CatalogProductCard } from "@/features/catalog/CatalogProductCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import type { CatalogPlpUrlState } from "@/lib/catalogPlpQuery";
import type {
  CatalogFactory,
  CatalogPlpMetadata,
  CatalogPlpProductPage,
  CatalogProduct,
} from "@/types/catalog";

type CatalogProductListProps = {
  title: string;
  result?: {
    metadata: CatalogPlpMetadata;
    products: CatalogPlpProductPage;
  };
  /** Legacy factory page input; category PLP uses `result`. */
  products?: CatalogProduct[];
  factories: CatalogFactory[];
  urlState?: CatalogPlpUrlState;
  pathname?: string;
  emptyDescription?: string;
};

export function CatalogProductList({
  title,
  result,
  products,
  factories,
  urlState,
  pathname,
  emptyDescription = "محصولی در این فهرست نیست.",
}: CatalogProductListProps) {
  const items = result?.products.items ?? products ?? [];
  const factoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of factories) map.set(f.id, f.name);
    for (const option of result?.metadata.factoryFacet?.options ?? []) {
      map.set(option.factoryId, option.label);
    }
    return map;
  }, [factories, result?.metadata.factoryFacet]);

  return (
    <div className="px-4 py-4">
      <h1 className="mb-3 text-xl font-bold text-text">{title}</h1>

      {result && urlState && pathname ? (
        <CatalogPlpControls
          metadata={result.metadata}
          productPage={result.products}
          urlState={urlState}
          pathname={pathname}
        />
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          title="محصولی یافت نشد"
          description={emptyDescription}
          icon="📦"
        />
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((product) => (
            <CatalogProductCard
              key={product.id}
              product={product}
              factoryName={factoryMap.get(product.factoryId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
