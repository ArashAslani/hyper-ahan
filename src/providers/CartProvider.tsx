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
import { parsePrice } from "@/lib/format";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "@/lib/storage";
import type { CartItem, Product } from "@/types";

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, newQty: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (SSR-safe). Keep effect: lazy useState
  // would miss client restore because React reuses the server snapshot.
  useEffect(() => {
    const saved = getStorageItem<CartItem[]>(STORAGE_KEYS.cartItems);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client hydration
    if (saved) setCartItems(saved);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    setStorageItem(STORAGE_KEYS.cartItems, cartItems);
  }, [cartItems, hydrated]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const lockedPrice = parsePrice(product.price);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000).toISOString();

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          ...product,
          quantity,
          lockedPrice,
          lockedAt: now.toISOString(),
          expiresAt,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: number, newQty: number) => {
      if (newQty <= 0) {
        removeFromCart(id);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const unit = item.lockedPrice ?? parsePrice(item.price);
      return total + unit * item.quantity;
    }, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      clearCart,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
