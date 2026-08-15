import type { CatalogProduct } from "../types/catalog";

const RANGE_STORAGE_KEY = "ha_catalog_plp_loaded_range_v1";

export type CatalogPlpLoadedRange = {
  href: string;
  throughPage: number;
};

/**
 * Append the next Backend page in response order. Rejects mismatched page
 * numbers and skips duplicate Product IDs so stale responses cannot reorder
 * or double-insert items.
 */
export function appendCatalogPlpPageItems(
  existing: CatalogProduct[],
  nextItems: CatalogProduct[],
  expectedPage: number,
  receivedPage: number,
): CatalogProduct[] | null {
  if (
    !Number.isSafeInteger(expectedPage) ||
    expectedPage < 2 ||
    receivedPage !== expectedPage
  ) {
    return null;
  }
  const seen = new Set(existing.map((product) => product.id));
  const appended = [...existing];
  for (const product of nextItems) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    appended.push(product);
  }
  return appended;
}

/** One in-flight request guard for continuous loading. */
export function canStartCatalogPlpPageRequest(options: {
  hasNextPage: boolean;
  loading: boolean;
  queryGeneration: number;
  requestGeneration: number;
}): boolean {
  return (
    options.hasNextPage &&
    !options.loading &&
    options.queryGeneration === options.requestGeneration
  );
}

export type CatalogPlpContinuousLoadStatus = "idle" | "loading" | "error";

/**
 * Sentinel auto-observe is allowed only from idle with more pages and no
 * restore loop. loading/error must not arm or re-arm the observer.
 */
export function canObserveCatalogPlpNextPage(options: {
  hasNextPage: boolean;
  status: CatalogPlpContinuousLoadStatus;
  needsRestorePages: boolean;
}): boolean {
  return (
    options.hasNextPage &&
    options.status === "idle" &&
    !options.needsRestorePages
  );
}

/** Explicit load-more is idle-only; error exposes retry alone. */
export function canShowCatalogPlpLoadMoreControl(options: {
  hasNextPage: boolean;
  status: CatalogPlpContinuousLoadStatus;
}): boolean {
  return options.hasNextPage && options.status === "idle";
}

/** Explicit retry is the sole recovery action while latched in error. */
export function canShowCatalogPlpRetryControl(
  status: CatalogPlpContinuousLoadStatus,
): boolean {
  return status === "error";
}

export function nextCatalogPlpPage(currentThroughPage: number): number {
  if (!Number.isSafeInteger(currentThroughPage) || currentThroughPage < 1) {
    return 1;
  }
  return currentThroughPage + 1;
}

export function parseCatalogPlpLoadedRange(
  raw: string | null,
  categoryHref: string,
): number | null {
  if (!categoryHref || raw == null || raw === "") return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CatalogPlpLoadedRange>;
    if (
      parsed?.href !== categoryHref ||
      typeof parsed.throughPage !== "number" ||
      !Number.isSafeInteger(parsed.throughPage) ||
      parsed.throughPage < 1
    ) {
      return null;
    }
    return parsed.throughPage;
  } catch {
    return null;
  }
}

export function rememberCatalogPlpLoadedThrough(
  categoryHref: string,
  throughPage: number,
): void {
  if (typeof window === "undefined") return;
  if (!categoryHref || !Number.isSafeInteger(throughPage) || throughPage < 1) {
    return;
  }
  try {
    const snapshot: CatalogPlpLoadedRange = {
      href: categoryHref,
      throughPage,
    };
    window.sessionStorage.setItem(RANGE_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* private mode / quota */
  }
}

export function consumeCatalogPlpLoadedThrough(
  categoryHref: string,
): number | null {
  if (typeof window === "undefined") return null;
  if (!categoryHref) return null;
  try {
    const raw = window.sessionStorage.getItem(RANGE_STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(RANGE_STORAGE_KEY);
    return parseCatalogPlpLoadedRange(raw, categoryHref);
  } catch {
    return null;
  }
}

export function discardMismatchedCatalogPlpLoadedThrough(
  currentHref: string,
): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(RANGE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as CatalogPlpLoadedRange;
    if (!parsed || parsed.href !== currentHref) {
      window.sessionStorage.removeItem(RANGE_STORAGE_KEY);
    }
  } catch {
    try {
      window.sessionStorage.removeItem(RANGE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
