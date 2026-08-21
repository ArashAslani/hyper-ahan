import type { FinalPrice } from "@/types/catalog";

/** Snapshot of Pricing `FinalPrice` stored on a cart line — never rescale on the FE. */
export type QuoteCartQuoteSnapshot = FinalPrice;

/**
 * Explicit per-line quote lifecycle for cart / checkout gates.
 * Derived — not persisted as a separate field.
 * `expiresAt` on a line is ignored for state (no client price hold).
 */
export type QuoteCartLineState =
  | "quoted"
  | "stale_qty"
  | "unsellable"
  | "unavailable"
  | "error";

/**
 * Storefront cart line until Ordering aligns with Catalog Product + OrderUnit.
 * Line identity: (productId, orderUnitId). No productVariantId.
 */
export type QuoteCartItem = {
  productId: string;
  /** Display name at quote time (Catalog may change later). */
  displayName: string;
  orderUnitId: string;
  orderUnitLabel: string;
  quantity: number;
  /**
   * Pricing calculate result for this product/unit/qty.
   * `null` when quantity changed and line awaits re-quote (stale).
   */
  quote: QuoteCartQuoteSnapshot | null;
  quotedAt: string | null;
  /** Retained for persisted JSON shape; never a price-hold clock. Writers set null. */
  expiresAt: string | null;
  /**
   * Optional audit / correlation ref.
   * May be Pricing `priceId`, or engineering handoff (`eng:{qty}:{unit}|tool:…`).
   */
  calculationRef?: string | null;
  /**
   * Engineering handoff audit preserved across re-quote / qty invalidate.
   * Display-only — does not affect line keys or Pricing authority.
   * Format: `eng:{qty}:{unit}|tool:…` (same as formatEngineeringAuditRef).
   */
  engineeringRef?: string | null;
  /**
   * Last quoted `finalPrice` kept for struck display after qty invalidation.
   * Display-only snapshot — never rescale; never used in approximate totals.
   */
  lastKnownFinalPrice?: number | null;
};

export type QuoteCartLineKey = {
  productId: string;
  orderUnitId: string;
};

export function quoteCartLineKey(key: QuoteCartLineKey): string {
  return `${key.productId}::${key.orderUnitId}`;
}

/**
 * Derive line quote state from the stored snapshot.
 * `expiresAt` / clock are ignored — not a cart price lock.
 *
 * - `quote === null` → `stale_qty` (qty change cleared money)
 * - quote present but `!isSellable` → `unsellable`
 * - sellable but no usable `finalPrice` → `unavailable`
 * - sellable money → `quoted`
 *
 * Transient `error` is applied by the UI after a failed re-quote (see overlay).
 */
export function getQuoteCartLineState(
  item: Pick<QuoteCartItem, "quote" | "expiresAt">,
  _nowMs = Date.now(),
): Exclude<QuoteCartLineState, "error"> {
  void _nowMs;
  if (item.quote == null) {
    return "stale_qty";
  }
  if (item.quote.isSellable === false) {
    return "unsellable";
  }
  if (
    item.quote.finalPrice == null ||
    Number.isNaN(item.quote.finalPrice)
  ) {
    return "unavailable";
  }
  return "quoted";
}

/** Effective state when UI tracks a failed re-quote for this line. */
export function resolveQuoteCartLineState(
  item: Pick<QuoteCartItem, "quote" | "expiresAt">,
  options?: { hasError?: boolean; nowMs?: number },
): QuoteCartLineState {
  if (options?.hasError) return "error";
  return getQuoteCartLineState(item, options?.nowMs);
}

export function quoteCartLineNeedsRequote(
  state: QuoteCartLineState,
): boolean {
  return (
    state === "stale_qty" ||
    state === "error" ||
    state === "unsellable" ||
    state === "unavailable"
  );
}

/** Priced checkout requires every line to be a sellable quote snapshot. */
export function quoteCartLineBlocksPricedCheckout(
  state: QuoteCartLineState,
): boolean {
  return state !== "quoted";
}

export function cartHasPricedCheckoutBlockers(
  items: QuoteCartItem[],
  nowMs = Date.now(),
): boolean {
  return items.some((item) =>
    quoteCartLineBlocksPricedCheckout(getQuoteCartLineState(item, nowMs)),
  );
}

export const QUOTE_CART_LINE_STATE_LABEL: Record<QuoteCartLineState, string> =
  {
    quoted: "قیمت معتبر (تقریبی)",
    stale_qty: "مقدار تغییر کرده — نیاز به استعلام مجدد",
    unsellable: "قابل فروش نیست — با کارشناس هماهنگ کنید",
    unavailable: "موجود / قابل قیمت‌گذاری نیست",
    error: "خطا در استعلام قیمت — دوباره تلاش کنید",
  };

/** Prefer dedicated engineeringRef; fall back to eng: calculationRef. */
export function getQuoteCartEngineeringRef(
  item: Pick<QuoteCartItem, "engineeringRef" | "calculationRef">,
): string | null {
  if (item.engineeringRef?.startsWith("eng:")) return item.engineeringRef;
  if (item.calculationRef?.startsWith("eng:")) return item.calculationRef;
  return null;
}

export type ParsedEngineeringCartRef = {
  quantity: number;
  unit: string | null;
};

/** Parse `eng:{qty}:{unit}|tool:…` for cart chips. */
export function parseEngineeringCartRef(
  ref: string | null | undefined,
): ParsedEngineeringCartRef | null {
  if (!ref?.startsWith("eng:")) return null;
  const body = ref.slice(4).split("|")[0] ?? "";
  if (!body) return null;
  const colon = body.indexOf(":");
  const qtyStr = colon === -1 ? body : body.slice(0, colon);
  const unit = colon === -1 ? null : body.slice(colon + 1).trim() || null;
  const quantity = Number(qtyStr);
  if (!Number.isFinite(quantity)) return null;
  return { quantity, unit };
}
