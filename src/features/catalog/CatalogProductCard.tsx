"use client";

import { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { SALE_MODE_LABELS } from "@/lib/catalogLabels";
import { canDirectPurchase } from "@/lib/plpCommercialFormat";
import { AddToCartSheet } from "@/features/catalog/AddToCartSheet";
import { CatalogImportantSpecifications } from "@/features/catalog/CatalogImportantSpecifications";
import { CatalogProductCommercialBlock } from "@/features/catalog/CatalogProductCommercialBlock";
import { CatalogProductQuickDetail } from "@/features/catalog/CatalogProductQuickDetail";
import { Button } from "@/shared/ui/Button";
import type { CatalogProduct } from "@/types/catalog";

type CatalogProductCardProps = {
  product: CatalogProduct;
  factoryName?: string;
};

/** Catalog PLP card — commercial projection and purchase CTA from Backend contract. */
export function CatalogProductCard({
  product,
  factoryName,
}: CatalogProductCardProps) {
  const [cartOpen, setCartOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const purchasable = canDirectPurchase(product);
  const registrationLabel = product.registrationUnit.label.trim();

  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-card)] transition hover:-translate-y-0.5">
      <Link
        href={routes.catalog.product(product.id)}
        className="block p-4 pb-3"
      >
        <h3 className="text-base font-bold text-text">{product.displayName}</h3>
        {factoryName ? (
          <p className="mt-1 text-sm text-text-muted">{factoryName}</p>
        ) : null}
        <CatalogImportantSpecifications
          items={product.importantSpecifications}
          compact
        />
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-muted">
          {registrationLabel ? (
            <span className="rounded-full bg-bg px-2 py-1">
              {registrationLabel}
            </span>
          ) : null}
          <span className="rounded-full bg-accent/10 px-2 py-1 text-accent">
            {SALE_MODE_LABELS[product.saleMode] ?? "—"}
          </span>
        </div>
        <CatalogProductCommercialBlock
          commercial={product.commercial}
          compact
        />
      </Link>

      <div className="flex gap-2 border-t border-border px-4 py-3">
        {purchasable ? (
          <Button
            type="button"
            variant="accent"
            className="flex-[1.2]"
            onClick={() => setCartOpen(true)}
          >
            افزودن به سبد
          </Button>
        ) : (
          <a href={routes.phone.call} className="flex-[1.2]">
            <Button type="button" variant="outline" fullWidth>
              تماس با کارشناس
            </Button>
          </a>
        )}
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => setQuickOpen(true)}
        >
          جزئیات
        </Button>
      </div>

      <CatalogProductQuickDetail
        isOpen={quickOpen}
        onClose={() => setQuickOpen(false)}
        product={product}
        canDirectPurchase={purchasable}
        onPurchase={
          purchasable
            ? () => {
                setQuickOpen(false);
                setCartOpen(true);
              }
            : undefined
        }
      />

      {purchasable ? (
        <AddToCartSheet
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          product={product}
        />
      ) : null}
    </article>
  );
}
