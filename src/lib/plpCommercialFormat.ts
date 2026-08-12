/**
 * Locale-aware PLP commercial presentation helpers.
 * Locale changes number/date formatting and UI chrome labels only —
 * never amount, currency identifier, or ComparisonUnit identity/label ownership.
 */

export type StorefrontLocale = "fa" | "en" | "ar";

const LOCALE_TAGS: Record<StorefrontLocale, string> = {
  fa: "fa-IR",
  en: "en-US",
  ar: "ar-SA",
};

/** UI chrome for Backend commercial states — not unit/currency vocabulary. */
const COMMERCIAL_STATE_LABELS: Record<
  "Purchasable" | "ContactUs",
  Record<StorefrontLocale, string>
> = {
  Purchasable: {
    fa: "قابل خرید",
    en: "Purchasable",
    ar: "قابل للشراء",
  },
  ContactUs: {
    fa: "تماس بگیرید",
    en: "Contact us",
    ar: "تواصل معنا",
  },
};

export function resolveStorefrontLocale(
  input?: string | null,
): StorefrontLocale {
  const raw =
    input?.trim().toLowerCase() ||
    (typeof document !== "undefined"
      ? document.documentElement.lang?.toLowerCase()
      : "") ||
    "fa";
  if (raw.startsWith("en")) return "en";
  if (raw.startsWith("ar")) return "ar";
  return "fa";
}

export function storefrontLocaleTag(locale: StorefrontLocale): string {
  return LOCALE_TAGS[locale];
}

export function storefrontDirection(locale: StorefrontLocale): "rtl" | "ltr" {
  return locale === "en" ? "ltr" : "rtl";
}

export function isValidCommercialAmount(
  amount: number | null | undefined,
): amount is number {
  return typeof amount === "number" && Number.isFinite(amount);
}

/**
 * Backend currency must be a usable ISO 4217 code.
 * No Front-owned currency fallback (e.g. IRR).
 */
export function isValidCurrencyCode(
  currencyCode: string | null | undefined,
): currencyCode is string {
  const code = currencyCode?.trim().toUpperCase() ?? "";
  if (!/^[A-Z]{3}$/.test(code)) return false;
  try {
    new Intl.NumberFormat("en", { style: "currency", currency: code }).format(0);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format Backend amount with Backend currency code.
 * Returns null when currency is missing/invalid — never invents a currency.
 * Locale affects digits/grouping only.
 */
export function formatCommercialPrice(
  amount: number,
  currencyCode: string | null | undefined,
  locale: StorefrontLocale = resolveStorefrontLocale(),
): string | null {
  if (!isValidCurrencyCode(currencyCode)) return null;
  const code = currencyCode.trim().toUpperCase();
  try {
    return new Intl.NumberFormat(storefrontLocaleTag(locale), {
      style: "currency",
      currency: code,
      currencyDisplay: "code",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return null;
  }
}

export function formatCommercialStateLabel(
  state: "Purchasable" | "ContactUs",
  locale: StorefrontLocale = resolveStorefrontLocale(),
): string {
  return COMMERCIAL_STATE_LABELS[state][locale];
}

/** Locale-aware number formatting for storefront chrome (not currency). */
export function formatStorefrontNumber(
  value: number,
  locale: StorefrontLocale = resolveStorefrontLocale(),
): string {
  return new Intl.NumberFormat(storefrontLocaleTag(locale), {
    maximumFractionDigits: 6,
  }).format(value);
}

/**
 * Direct-purchase CTA eligibility from Backend commercial contract + Catalog shape.
 * ContactUs / missing commercial never qualifies.
 */
export function canDirectPurchase(product: {
  saleMode: number;
  orderUnits: readonly unknown[];
  commercial?: {
    state: "Purchasable" | "ContactUs";
    amount: number | null;
    currency: string;
  } | null;
}): boolean {
  if (product.saleMode !== 1) return false;
  if (product.orderUnits.length === 0) return false;
  const commercial = product.commercial;
  if (!commercial || commercial.state !== "Purchasable") return false;
  if (!isValidCommercialAmount(commercial.amount)) return false;
  if (!isValidCurrencyCode(commercial.currency)) return false;
  return true;
}

/** Locale-aware freshness for optional Backend priceUpdatedAt. */
export function formatPriceUpdatedAt(
  iso: string,
  locale: StorefrontLocale = resolveStorefrontLocale(),
): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const formatted = new Intl.DateTimeFormat(storefrontLocaleTag(locale), {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  const prefixes: Record<StorefrontLocale, string> = {
    fa: "به‌روزرسانی",
    en: "Updated",
    ar: "آخر تحديث",
  };
  return `${prefixes[locale]}: ${formatted}`;
}
