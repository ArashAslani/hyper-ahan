"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { localQuoteCartAdapter } from "@/features/cart/LocalQuoteCartAdapter";
import type { CartIntentionPort } from "@/features/cart/CartIntentionPort";
import { pricingService } from "@/services/pricingService";
import {
  CART_QUOTE_TTL_MS,
  getQuoteCartEngineeringRef,
  getQuoteCartLineState,
  quoteCartLineNeedsRequote,
  type QuoteCartItem,
  type QuoteCartLineState,
  type QuoteCartQuoteSnapshot,
} from "@/types/quoteCart";

export type RequoteLineResult = {
  productId: string;
  orderUnitId: string;
  previousFinalPrice: number | null;
  nextFinalPrice: number | null;
  state: QuoteCartLineState;
};

type CartContextValue = {
  items: QuoteCartItem[];
  addOrUpdate: (item: QuoteCartItem) => void;
  remove: (productId: string, orderUnitId: string) => void;
  /**
   * Marks line quote stale — Pricing re-quote required before money is valid.
   * Quantity ≤ 0 removes the line.
   */
  updateQuantity: (
    productId: string,
    orderUnitId: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  /** Estimate only: sum of non-expired quoted finalPrices. */
  getApproximateTotal: () => number;
  getTotalItems: () => number;
  /**
   * Re-quote one line via Pricing calculate.
   * Preserves productId, orderUnitId, quantity. Never rescales money.
   */
  requoteLine: (
    productId: string,
    orderUnitId: string,
  ) => Promise<RequoteLineResult>;
  /** Re-quote every line that is not a fresh sellable quote. */
  requoteAllNeedingRefresh: () => Promise<RequoteLineResult[]>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

type CartProviderProps = {
  children: ReactNode;
  /** Inject for tests; defaults to localStorage QuoteCart adapter. */
  port?: CartIntentionPort;
};

function applyCalculateResult(
  item: QuoteCartItem,
  quote: QuoteCartQuoteSnapshot,
): QuoteCartItem {
  const quotedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + CART_QUOTE_TTL_MS).toISOString();
  // Preserve eng audit across re-quote; priceId is Pricing correlation only.
  const engineeringRef = getQuoteCartEngineeringRef(item);
  const priceId = quote.priceId ?? null;
  const calculationRef =
    engineeringRef && priceId
      ? `${engineeringRef}|priceId:${priceId}`
      : (engineeringRef ?? priceId);

  return {
    ...item,
    // Identity + qty preserved — never auto-change unit or rescale money.
    productId: item.productId,
    orderUnitId: item.orderUnitId,
    quantity: item.quantity,
    quote,
    quotedAt,
    expiresAt,
    calculationRef,
    engineeringRef,
    // Fresh quote supersedes struck snapshot.
    lastKnownFinalPrice: null,
  };
}

export function CartProvider({ children, port }: CartProviderProps) {
  const adapter = port ?? localQuoteCartAdapter;
  const [items, setItems] = useState<QuoteCartItem[]>([]);

  // Hydrate from port after mount (SSR-safe).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client hydration
    setItems(adapter.load());
  }, [adapter]);

  const addOrUpdate = useCallback(
    (item: QuoteCartItem) => {
      setItems(adapter.addOrUpdate(item));
    },
    [adapter],
  );

  const remove = useCallback(
    (productId: string, orderUnitId: string) => {
      setItems(adapter.remove(productId, orderUnitId));
    },
    [adapter],
  );

  const updateQuantity = useCallback(
    (productId: string, orderUnitId: string, quantity: number) => {
      setItems(adapter.updateQuantity(productId, orderUnitId, quantity));
    },
    [adapter],
  );

  const clearCart = useCallback(() => {
    adapter.clear();
    setItems([]);
  }, [adapter]);

  const getApproximateTotal = useCallback(() => {
    return adapter.getApproximateTotal(items);
  }, [adapter, items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const requoteLine = useCallback(
    async (productId: string, orderUnitId: string): Promise<RequoteLineResult> => {
      const current = adapter.load();
      const item = current.find(
        (line) =>
          line.productId === productId && line.orderUnitId === orderUnitId,
      );
      if (!item) {
        throw new Error("قلم سبد یافت نشد");
      }

      const previousFinalPrice =
        item.quote?.finalPrice ?? item.lastKnownFinalPrice ?? null;

      const quote = await pricingService.calculate({
        productId: item.productId,
        orderUnitId: item.orderUnitId,
        quantity: item.quantity,
      });

      const next = applyCalculateResult(item, quote);
      setItems(adapter.addOrUpdate(next));

      return {
        productId: item.productId,
        orderUnitId: item.orderUnitId,
        previousFinalPrice,
        nextFinalPrice: quote.finalPrice ?? null,
        state: getQuoteCartLineState(next),
      };
    },
    [adapter],
  );

  const requoteAllNeedingRefresh = useCallback(async (): Promise<
    RequoteLineResult[]
  > => {
    const current = adapter.load();
    const targets = current.filter((item) =>
      quoteCartLineNeedsRequote(getQuoteCartLineState(item)),
    );
    const results: RequoteLineResult[] = [];
    for (const item of targets) {
      results.push(await requoteLine(item.productId, item.orderUnitId));
    }
    return results;
  }, [adapter, requoteLine]);

  const value = useMemo(
    () => ({
      items,
      addOrUpdate,
      remove,
      updateQuantity,
      clearCart,
      getApproximateTotal,
      getTotalItems,
      requoteLine,
      requoteAllNeedingRefresh,
    }),
    [
      items,
      addOrUpdate,
      remove,
      updateQuantity,
      clearCart,
      getApproximateTotal,
      getTotalItems,
      requoteLine,
      requoteAllNeedingRefresh,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
