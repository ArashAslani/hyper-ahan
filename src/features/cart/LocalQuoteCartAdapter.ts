import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from "@/lib/storage";
import type { CartIntentionPort } from "@/features/cart/CartIntentionPort";
import {
  getQuoteCartEngineeringRef,
  getQuoteCartLineState,
  type QuoteCartItem,
} from "@/types/quoteCart";

function clearLegacyCartStorage(): void {
  removeStorageItem(STORAGE_KEYS.cartItems);
  removeStorageItem(STORAGE_KEYS.cartId);
  removeStorageItem(STORAGE_KEYS.cartExpiresAt);
}

function findLineIndex(
  items: QuoteCartItem[],
  productId: string,
  orderUnitId: string,
): number {
  return items.findIndex(
    (item) =>
      item.productId === productId && item.orderUnitId === orderUnitId,
  );
}

/**
 * Qty change invalidates Pricing money. Keeps last quoted finalPrice and
 * engineering audit for display only — never rescales.
 */
function withStaleQuote(
  item: QuoteCartItem,
  quantity: number,
): QuoteCartItem {
  const priorFinal =
    item.quote?.finalPrice != null && !Number.isNaN(item.quote.finalPrice)
      ? item.quote.finalPrice
      : (item.lastKnownFinalPrice ?? null);
  const engineeringRef = getQuoteCartEngineeringRef(item);

  return {
    ...item,
    quantity,
    quote: null,
    quotedAt: null,
    expiresAt: null,
    // Drop priceId correlation; keep eng audit via engineeringRef.
    calculationRef: engineeringRef,
    engineeringRef,
    lastKnownFinalPrice: priorFinal,
  };
}

/**
 * localStorage-backed QuoteCart. New key only — does not convert legacy
 * `ha_cartItems` / Ordering cart keys (incompatible model).
 */
export function createLocalQuoteCartAdapter(): CartIntentionPort {
  let legacyCleared = false;

  const ensureLegacyCleared = () => {
    if (legacyCleared) return;
    legacyCleared = true;
    clearLegacyCartStorage();
  };

  const read = (): QuoteCartItem[] => {
    ensureLegacyCleared();
    return getStorageItem<QuoteCartItem[]>(STORAGE_KEYS.quoteCart) ?? [];
  };

  const write = (items: QuoteCartItem[]): QuoteCartItem[] => {
    ensureLegacyCleared();
    setStorageItem(STORAGE_KEYS.quoteCart, items);
    return items;
  };

  const port: CartIntentionPort = {
    load() {
      return read();
    },

    addOrUpdate(item) {
      const items = read();
      const index = findLineIndex(items, item.productId, item.orderUnitId);
      if (index === -1) {
        return write([...items, item]);
      }
      const next = [...items];
      next[index] = item;
      return write(next);
    },

    remove(productId, orderUnitId) {
      return write(
        read().filter(
          (item) =>
            !(
              item.productId === productId && item.orderUnitId === orderUnitId
            ),
        ),
      );
    },

    updateQuantity(productId, orderUnitId, quantity) {
      if (quantity <= 0) {
        return port.remove(productId, orderUnitId);
      }
      const items = read();
      const index = findLineIndex(items, productId, orderUnitId);
      if (index === -1) return items;
      const next = [...items];
      next[index] = withStaleQuote(next[index], quantity);
      return write(next);
    },

    clear() {
      write([]);
    },

    getApproximateTotal(items) {
      const now = Date.now();
      return items.reduce((sum, item) => {
        // Only fresh sellable quotes — never rescale; never include invalid lines.
        if (getQuoteCartLineState(item, now) !== "quoted") return sum;
        const finalPrice = item.quote?.finalPrice;
        if (finalPrice == null || Number.isNaN(finalPrice)) return sum;
        return sum + finalPrice;
      }, 0);
    },
  };

  return port;
}

/** Singleton used by CartProvider (client-only). */
export const localQuoteCartAdapter = createLocalQuoteCartAdapter();
