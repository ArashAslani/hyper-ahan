"use client";

import {
  formatCommercialPrice,
  formatCommercialStateLabel,
  formatPriceUpdatedAt,
  isValidCommercialAmount,
  isValidCurrencyCode,
  resolveStorefrontLocale,
  storefrontDirection,
} from "@/lib/plpCommercialFormat";
import type { ProductCommercial } from "@/types/catalog";

type CatalogProductCommercialBlockProps = {
  commercial: ProductCommercial | null | undefined;
  /** Compact card vs Quick Detail emphasis. */
  compact?: boolean;
};

/**
 * Renders Backend PLP commercial projection only.
 * Unit label comes from Backend comparisonUnit.label; code is machine identity only.
 * No Pricing calls, conversion, unit vocabulary, or currency fallback.
 */
export function CatalogProductCommercialBlock({
  commercial,
  compact = false,
}: CatalogProductCommercialBlockProps) {
  if (!commercial) return null;

  const locale = resolveStorefrontLocale();
  const dir = storefrontDirection(locale);
  const stateLabel = formatCommercialStateLabel(commercial.state, locale);
  const unitLabel = commercial.comparisonUnit.label.trim();

  const formattedPrice =
    commercial.state === "Purchasable" &&
    isValidCommercialAmount(commercial.amount) &&
    isValidCurrencyCode(commercial.currency)
      ? formatCommercialPrice(commercial.amount, commercial.currency, locale)
      : null;

  const freshness =
    formattedPrice && commercial.priceUpdatedAt
      ? formatPriceUpdatedAt(commercial.priceUpdatedAt, locale)
      : null;

  return (
    <div
      dir={dir}
      className={compact ? "mt-3 space-y-1" : "space-y-2"}
      data-comparison-unit={commercial.comparisonUnit.code}
      data-currency={commercial.currency}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
            commercial.state === "Purchasable"
              ? "bg-success/15 text-success"
              : "bg-bg text-text-muted"
          }`}
        >
          {stateLabel}
        </span>
        {formattedPrice ? (
          <p
            className={
              compact
                ? "text-base font-bold text-text"
                : "text-lg font-bold text-text"
            }
          >
            <span>{formattedPrice}</span>
            {unitLabel ? (
              <span className="mr-1 text-xs font-normal text-text-muted">
                / {unitLabel}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>
      {freshness ? (
        <p className="text-xs text-text-muted">{freshness}</p>
      ) : null}
    </div>
  );
}
