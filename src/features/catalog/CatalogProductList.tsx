"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { CatalogProductCard } from "@/features/catalog/CatalogProductCard";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Fab } from "@/shared/ui/Fab";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import type { CatalogFactory, CatalogProduct } from "@/types/catalog";

type CatalogProductListProps = {
  title: string;
  products: CatalogProduct[];
  factories: CatalogFactory[];
  emptyDescription?: string;
};

export function CatalogProductList({
  title,
  products,
  factories,
  emptyDescription = "محصولی در این فهرست نیست.",
}: CatalogProductListProps) {
  const [factoryId, setFactoryId] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  const factoryMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const f of factories) map.set(f.id, f.name);
    return map;
  }, [factories]);

  const usedFactories = useMemo(() => {
    const ids = new Set(products.map((p) => p.factoryId));
    return factories.filter((f) => ids.has(f.id));
  }, [products, factories]);

  const filtered =
    factoryId === "all"
      ? products
      : products.filter((p) => p.factoryId === factoryId);

  return (
    <div className="px-4 py-4">
      <h1 className="mb-3 text-xl font-bold text-text">{title}</h1>

      {filtered.length === 0 ? (
        <EmptyState title="محصولی یافت نشد" description={emptyDescription} icon="📦" />
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((product) => (
            <CatalogProductCard
              key={product.id}
              product={product}
              factoryName={factoryMap.get(product.factoryId)}
            />
          ))}
        </div>
      )}

      {usedFactories.length > 1 ? (
        <>
          <Fab onClick={() => setSheetOpen(true)} aria-label="فیلتر">
            <FontAwesomeIcon icon={faSliders} />
          </Fab>
          <BottomSheet
            isOpen={sheetOpen}
            onClose={() => setSheetOpen(false)}
            title="فیلتر کارخانه"
          >
            <div className="space-y-2">
              <Button
                type="button"
                variant={factoryId === "all" ? "accent" : "outline"}
                className="w-full"
                onClick={() => {
                  setFactoryId("all");
                  setSheetOpen(false);
                }}
              >
                همه کارخانه‌ها
              </Button>
              {usedFactories.map((f) => (
                <Button
                  key={f.id}
                  type="button"
                  variant={factoryId === f.id ? "accent" : "outline"}
                  className="w-full"
                  onClick={() => {
                    setFactoryId(f.id);
                    setSheetOpen(false);
                  }}
                >
                  {f.name}
                </Button>
              ))}
            </div>
          </BottomSheet>
        </>
      ) : null}
    </div>
  );
}
