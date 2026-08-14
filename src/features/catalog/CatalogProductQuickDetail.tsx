"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import {
  formatStorefrontNumber,
  resolveStorefrontLocale,
} from "@/lib/plpCommercialFormat";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { CatalogImportantSpecifications } from "@/features/catalog/CatalogImportantSpecifications";
import type { CatalogProduct } from "@/types/catalog";

type CatalogProductQuickDetailProps = {
  isOpen: boolean;
  onClose: () => void;
  product: CatalogProduct;
  canDirectPurchase: boolean;
  onPurchase?: () => void;
  productHref?: string;
  onNavigateToProduct?: () => void;
};

/**
 * Progressive Quick Detail — OrderUnits / MOQ context not already on the card.
 * Reuses existing AddToCartSheet / Contact / PDP; no commercial duplication.
 * Numbers use generic storefront formatting; CTA copy matches the card.
 */
export function CatalogProductQuickDetail({
  isOpen,
  onClose,
  product,
  canDirectPurchase,
  onPurchase,
  productHref,
  onNavigateToProduct,
}: CatalogProductQuickDetailProps) {
  const locale = resolveStorefrontLocale();
  const units = product.orderUnits;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={product.displayName}>
      <div className="space-y-4">
        <CatalogImportantSpecifications
          items={product.importantSpecifications}
        />

        {units.length > 0 ? (
          <section className="space-y-2">
            <ul className="space-y-2">
              {units.map((unit) => {
                const parts = [
                  formatStorefrontNumber(unit.minimumOrderQuantity, locale),
                ];
                if (unit.maximumOrderQuantity != null) {
                  parts.push(
                    formatStorefrontNumber(unit.maximumOrderQuantity, locale),
                  );
                }
                return (
                  <li
                    key={unit.id}
                    className="rounded-[var(--radius-md)] bg-bg px-3 py-2 text-sm text-text"
                  >
                    <p className="font-medium">
                      {unit.unit}
                      {unit.isDefault ? (
                        <span className="mr-2 text-xs font-normal text-accent">
                          *
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted" dir="ltr">
                      {parts.join(" – ")}
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <div className="flex flex-col gap-2 pt-1">
          {canDirectPurchase && onPurchase ? (
            <Button
              type="button"
              variant="accent"
              fullWidth
              onClick={() => {
                onClose();
                onPurchase();
              }}
            >
              افزودن به سبد
            </Button>
          ) : (
            <a href={routes.phone.call} className="block">
              <Button type="button" variant="outline" fullWidth>
                تماس با کارشناس
              </Button>
            </a>
          )}
          <Link
            href={productHref ?? routes.catalog.product(product.id)}
            className="block"
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                onClose();
                return;
              }
              onNavigateToProduct?.();
              onClose();
            }}
          >
            <Button type="button" variant="ghost" fullWidth>
              مشاهده صفحه محصول
            </Button>
          </Link>
        </div>
      </div>
    </BottomSheet>
  );
}
