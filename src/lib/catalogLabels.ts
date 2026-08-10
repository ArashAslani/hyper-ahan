import type { SaleMode, SearchContentType, OutOfStockDisplayPolicy } from "@/types/catalog";

export const SALE_MODE_LABELS: Record<SaleMode, string> = {
  1: "خرید آنلاین",
  2: "سفارشی نیمه‌آماده",
  3: "کاملاً سفارشی",
};

export const OOS_POLICY_LABELS: Record<OutOfStockDisplayPolicy, string> = {
  1: "مخفی",
  2: "ناموجود",
  3: "تماس بگیرید",
};

export const SEARCH_CONTENT_TYPE_LABELS: Record<SearchContentType, string> = {
  1: "محصولات",
  2: "دسته‌بندی‌ها",
  3: "مقالات",
  4: "محاسبه‌گرها",
};

/** Display order for search groups — Products → Categories → Articles → Tools */
export const SEARCH_DISPLAY_ORDER: SearchContentType[] = [1, 2, 3, 4];

export function searchContentTypeName(type: SearchContentType): string {
  const names: Record<SearchContentType, string> = {
    1: "Product",
    2: "Category",
    3: "Article",
    4: "CalculationTool",
  };
  return names[type];
}
