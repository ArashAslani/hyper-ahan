import type { QuoteCartItem } from "@/types/quoteCart";

/**
 * Port for storefront cart intention (QuoteCart).
 *
 * Temporary until Ordering cart accepts Catalog productId + orderUnitId.
 * Implementations must not invent productVariantId or fake SKU/Variant maps.
 *
 * Quantity changes invalidate the Pricing quote: adapters clear `quote` /
 * timestamps so the UI re-calls Pricing calculate before treating money as valid.
 * Never rescale `finalPrice` on the client.
 */
export interface CartIntentionPort {
  load(): QuoteCartItem[];

  /** Upsert by (productId, orderUnitId). Replaces the line when the key matches. */
  addOrUpdate(item: QuoteCartItem): QuoteCartItem[];

  remove(productId: string, orderUnitId: string): QuoteCartItem[];

  /**
   * Updates quantity and marks the line quote stale (clears quote / quotedAt /
   * expiresAt). Caller must re-quote via Pricing before checkout authority.
   * Quantity ≤ 0 removes the line.
   */
  updateQuantity(
    productId: string,
    orderUnitId: string,
    quantity: number,
  ): QuoteCartItem[];

  clear(): void;

  /**
   * Sum of fresh sellable line `quote.finalPrice` values (`quoted` state only).
   * Labeled estimate only — not checkout / order authority.
   */
  getApproximateTotal(items: QuoteCartItem[]): number;
}
