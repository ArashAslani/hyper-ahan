export const STORAGE_KEYS = {
  sessionToken: "ha_sessionToken",
  /** Legacy Ordering cart — cleared on QuoteCart migrate; unused until platform alignment */
  cartId: "ha_cartId",
  cartExpiresAt: "ha_cartExpiresAt",
  /** Legacy mock Product cart — cleared by LocalQuoteCartAdapter; do not write */
  cartItems: "ha_cartItems",
  /** Temporary QuoteCart (productId + orderUnitId + Pricing snapshot) */
  quoteCart: "ha_quote_cart_v1",
  accessToken: "ha_accessToken",
  userId: "ha_userId",
  isProfileComplete: "ha_isProfileComplete",
  /** Legacy mock auth flag — replace with JWT flow in API phase */
  user: "ha_user",
  /** Admin JWT — kept separate from customer token per frontend-auth-integration.md */
  adminAccessToken: "ha_admin_token",
  adminId: "ha_admin_id",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function getStorageItem<T>(key: StorageKey): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setStorageItem<T>(key: StorageKey, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key: StorageKey): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function getStorageString(key: StorageKey): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function setStorageString(key: StorageKey, value: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
}
