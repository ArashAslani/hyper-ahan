import type { FinalPrice } from "@/types/catalog";

/** Snapshot of Pricing `FinalPrice` stored on a cart line — never rescale on the FE. */
export type QuoteCartQuoteSnapshot = FinalPrice;

/**
 * Provisional QuoteCart line TTL (until Ordering expiresAt exists).
 * Same window used when writing quotes from Add-to-Cart and re-quote.
 */
export const CART_QUOTE_TTL_MS = 30 * 60 * 1000;

/**
 * Explicit per-line quote lifecycle for cart / checkout gates.
 * Derived — not persisted as a separate field.
 */
export type QuoteCartLineState =
  | "quoted"
  | "stale_qty"
  | "expired"
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

export function isQuoteCartLineExpired(
  item: Pick<QuoteCartItem, "expiresAt">,
  nowMs = Date.now(),
): boolean {
  if (!item.expiresAt) return false;
  return new Date(item.expiresAt).getTime() < nowMs;
}

/**
 * Derive line quote state from the stored snapshot + clock.
 *
 * - `expiresAt` in the past → `expired` (quote kept; never auto-removed)
 * - `quote === null` → `stale_qty` (qty change cleared money)
 * - quote present but `!isSellable` → `unsellable`
 * - sellable but no usable `finalPrice` → `unavailable`
 * - fresh sellable money → `quoted`
 *
 * Transient `error` is applied by the UI after a failed re-quote (see overlay).
 */
export function getQuoteCartLineState(
  item: Pick<QuoteCartItem, "quote" | "expiresAt">,
  nowMs = Date.now(),
): Exclude<QuoteCartLineState, "error"> {
  if (isQuoteCartLineExpired(item, nowMs)) {
    return "expired";
  }
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
    state === "expired" ||
    state === "error" ||
    state === "unsellable" ||
    state === "unavailable"
  );
}

/** Priced checkout requires every line to be a fresh sellable quote. */
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
    expired: "منقضی — استعلام مجدد لازم است",
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

/** Remaining ms until line expiresAt; null if no expiry set. */
export function getQuoteRemainingMs(
  expiresAt: string | null | undefined,
  nowMs = Date.now(),
): number | null {
  if (!expiresAt) return null;
  return new Date(expiresAt).getTime() - nowMs;
}

/**
 * Human label for provisional quote hold on a quoted line.
 * e.g. «معتبر تا ۱۲:۳۰ (حدود ۱۸ دقیقه)»
 */
export function formatQuoteValidityLabel(
  expiresAt: string | null | undefined,
  nowMs = Date.now(),
): string | null {
  const remaining = getQuoteRemainingMs(expiresAt, nowMs);
  if (remaining == null || remaining <= 0 || !expiresAt) return null;
  const minutes = Math.max(1, Math.ceil(remaining / 60_000));
  const until = new Date(expiresAt).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `معتبر تا ${until} (حدود ${minutes} دقیقه)`;
}
