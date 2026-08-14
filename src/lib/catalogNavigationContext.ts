export const CATALOG_RETURN_PARAM = "from";
export const CATALOG_NAV_PARAM = "nav";
export const CALCULATOR_HANDOFF_PARAMS = [
  "applyQty",
  "applyUnit",
  "openAtc",
] as const;
const ONE_SHOT_QUERY_PARAMS = [
  ...CALCULATOR_HANDOFF_PARAMS,
  CATALOG_NAV_PARAM,
] as const;

const CATALOG_ROOT = "/catalog";
const UUID_BODY =
  "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const CATEGORY_PATHNAME = new RegExp(
  `^${escapeRegex(CATALOG_ROOT)}/categories/${UUID_BODY}$`,
  "i",
);
const PRODUCT_PATHNAME = new RegExp(
  `^${escapeRegex(CATALOG_ROOT)}/products/${UUID_BODY}$`,
  "i",
);
const TOOL_PATHNAME = /^\/tools\/calculators\/[a-z0-9]+(?:-[a-z0-9]+)*$/i;
const SCROLL_STORAGE_KEY = "ha_catalog_plp_scroll_v1";
const OWNERSHIP_STORAGE_KEY = "ha_catalog_nav_own_v5";
const ADOPT_STORAGE_KEY = "ha_catalog_nav_adopt_v5";
const TICKET_STORAGE_KEY = "ha_catalog_nav_ticket_v5";
const NAV_ID = new RegExp(`^${UUID_BODY}$`, "i");
const ENTRY_ID = /^[A-Za-z0-9._:-]{1,128}$/;

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function catalogProductPath(productId: string): string {
  return `${CATALOG_ROOT}/products/${productId}`;
}

function singleString(
  raw: string | string[] | null | undefined,
): string | null {
  if (Array.isArray(raw)) {
    return raw.length === 1 ? raw[0] : null;
  }
  return raw ?? null;
}

function rejectUnsafeHref(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return true;
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return true;
  if (/[\r\n\t]/.test(trimmed) || trimmed.includes("\\")) return true;
  return false;
}

function splitPathAndSearch(href: string): {
  pathname: string;
  search: string;
} | null {
  if (rejectUnsafeHref(href)) return null;
  const trimmed = href.trim();
  const hashIndex = trimmed.indexOf("#");
  const withoutHash = hashIndex === -1 ? trimmed : trimmed.slice(0, hashIndex);
  const qIndex = withoutHash.indexOf("?");
  const pathname = qIndex === -1 ? withoutHash : withoutHash.slice(0, qIndex);
  const search = qIndex === -1 ? "" : withoutHash.slice(qIndex + 1);
  if (pathname.includes("//") || pathname.includes("/.")) return null;
  return { pathname, search };
}

/** Accept only an internal Catalog Category pathname plus its exact query string. */
export function canonicalizeCatalogCategoryHref(
  raw: string | string[] | null | undefined,
): string | null {
  const value = singleString(raw);
  if (value == null || value.trim() === "") return null;
  const parts = splitPathAndSearch(value);
  if (!parts || !CATEGORY_PATHNAME.test(parts.pathname)) return null;
  return parts.search ? `${parts.pathname}?${parts.search}` : parts.pathname;
}

export const CATALOG_FALLBACK_HREF = CATALOG_ROOT;

/** Visible unknown-context return is always Catalog root. `from` is transport only. */
export function resolveCatalogReturnHref(
  _raw?: string | string[] | null,
): string {
  void _raw;
  return CATALOG_FALLBACK_HREF;
}

export function buildCatalogProductHref(
  productId: string,
  categoryHref?: string | string[] | null,
): string {
  const productPath = catalogProductPath(productId);
  const from = canonicalizeCatalogCategoryHref(categoryHref);
  if (!from) return productPath;
  const params = new URLSearchParams();
  params.set(CATALOG_RETURN_PARAM, from);
  return `${productPath}?${params.toString()}`;
}

export function readCatalogReturnParam(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
): string | string[] | null {
  if (searchParams instanceof URLSearchParams) {
    const values = searchParams.getAll(CATALOG_RETURN_PARAM);
    if (values.length === 0) return null;
    return values.length === 1 ? values[0] : values;
  }
  return searchParams[CATALOG_RETURN_PARAM] ?? null;
}

/** Internal PDP href for this product, preserving a validated Category `from`. */
export function canonicalizeCatalogProductHref(
  raw: string | null | undefined,
  productId: string,
): string | null {
  if (raw == null || raw.trim() === "") return null;
  const parts = splitPathAndSearch(raw);
  if (!parts || parts.pathname !== catalogProductPath(productId)) {
    return null;
  }
  if (!PRODUCT_PATHNAME.test(parts.pathname)) return null;
  const params = new URLSearchParams(parts.search);
  const from = canonicalizeCatalogCategoryHref(
    params.getAll(CATALOG_RETURN_PARAM),
  );
  return from
    ? buildCatalogProductHref(productId, from)
    : catalogProductPath(productId);
}

export function readCatalogNavParam(
  raw: string | string[] | URLSearchParams | null | undefined,
): string | null {
  if (raw instanceof URLSearchParams) {
    const values = raw.getAll(CATALOG_NAV_PARAM);
    if (values.length !== 1) return null;
    return NAV_ID.test(values[0]) ? values[0] : null;
  }
  const value = singleString(raw);
  if (!value || !NAV_ID.test(value)) return null;
  return value;
}

export function readCatalogNavFromHref(href: string): string | null {
  const parts = splitPathAndSearch(href);
  if (!parts) return null;
  return readCatalogNavParam(new URLSearchParams(parts.search));
}

export function appendCatalogNavParam(href: string, nav: string): string {
  if (!NAV_ID.test(nav)) return href;
  const parts = splitPathAndSearch(href);
  if (!parts) return href;
  const params = new URLSearchParams(parts.search);
  if (params.getAll(CATALOG_NAV_PARAM).length > 0) return href;
  params.set(CATALOG_NAV_PARAM, nav);
  return `${parts.pathname}?${params.toString()}`;
}

export function mergeCalculatorHandoff(
  returnPath: string | null | undefined,
  productId: string,
  handoff: { applyQty: string; applyUnit?: string | null; nav?: string | null },
): string {
  const productHref =
    canonicalizeCatalogProductHref(returnPath, productId) ??
    catalogProductPath(productId);
  const url = new URL(productHref, "https://hyperahan.invalid");
  url.searchParams.set("applyQty", handoff.applyQty);
  if (handoff.applyUnit) url.searchParams.set("applyUnit", handoff.applyUnit);
  url.searchParams.set("openAtc", "1");
  const nav = readCatalogNavParam(handoff.nav);
  if (nav) url.searchParams.set(CATALOG_NAV_PARAM, nav);
  return `${url.pathname}${url.search}`;
}

export function stripCalculatorHandoffParams(
  searchParams: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(searchParams);
  for (const key of ONE_SHOT_QUERY_PARAMS) next.delete(key);
  return next;
}

export function buildCleanedProductHref(
  productId: string,
  searchParams: URLSearchParams,
): string {
  const cleaned = stripCalculatorHandoffParams(searchParams);
  const from = canonicalizeCatalogCategoryHref(
    cleaned.getAll(CATALOG_RETURN_PARAM),
  );
  return from
    ? buildCatalogProductHref(productId, from)
    : catalogProductPath(productId);
}

export function canonicalizeCurrentProductHref(
  raw: string | null | undefined,
): string | null {
  if (raw == null || raw.trim() === "") return null;
  const parts = splitPathAndSearch(raw);
  if (!parts || !PRODUCT_PATHNAME.test(parts.pathname)) return null;
  const productId = parts.pathname.slice(parts.pathname.lastIndexOf("/") + 1);
  return buildCleanedProductHref(productId, new URLSearchParams(parts.search));
}

export function canonicalizeCalculatorHref(
  raw: string | null | undefined,
): string | null {
  if (raw == null || raw.trim() === "") return null;
  const parts = splitPathAndSearch(raw);
  if (!parts || !TOOL_PATHNAME.test(parts.pathname)) return null;
  const params = new URLSearchParams(parts.search);
  if (params.getAll(CATALOG_NAV_PARAM).length > 1) return null;
  return parts.search ? `${parts.pathname}?${parts.search}` : parts.pathname;
}

export function readCatalogNavigationEntryId(): string | null {
  if (typeof window === "undefined") return null;
  const navigation = (
    window as Window & {
      navigation?: { currentEntry?: { id?: unknown } };
    }
  ).navigation;
  return readStoredEntryId(navigation?.currentEntry?.id);
}

function readStoredEntryId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  return ENTRY_ID.test(value) ? value : null;
}

function sameEntryIdentity(left: string | null, right: string | null): boolean {
  return Boolean(left) && Boolean(right) && left === right;
}

export type CatalogNavigationPhase =
  | "created"
  | "pdp-bound"
  | "calc-activated"
  | "calc-entry-bound"
  | "continuation-issued"
  | "returned-pdp-bound";

export type CatalogNavigationOwnership = {
  plpHref: string;
  pdpHref: string;
  plpIdx: number | null;
  plpLength: number | null;
  pdpIdx: number | null;
  pdpLength: number | null;
  pdpEntryId: string | null;
  bound: boolean;
  phase: CatalogNavigationPhase;
  chainId: string;
  activationId: string | null;
  activationConsumed: boolean;
  continuationId: string | null;
  continuationConsumed: boolean;
  calcEntryHref: string | null;
  calcEntryId: string | null;
  calcEntryIdx: number | null;
  calcEntryLength: number | null;
  calcReturnIdx: number | null;
  calcReturnLength: number | null;
  calcReturnEntryId: string | null;
  suspended: boolean;
};

const PHASES = new Set<CatalogNavigationPhase>([
  "created",
  "pdp-bound",
  "calc-activated",
  "calc-entry-bound",
  "continuation-issued",
  "returned-pdp-bound",
]);

export type CatalogHistoryCursor = {
  idx: number | null;
  length: number | null;
};

export type CatalogTransitionTicket = {
  plpHref: string;
  pdpHref: string;
  plpIdx: number | null;
  plpLength: number | null;
};

export type CatalogReturnDecision =
  | "back"
  | "replace"
  | { mode: "go"; delta: number };

const MAX_OWNED_HISTORY_DELTA = 20;

function finiteInt(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sameHistoryEntry(
  stored: number | null,
  current: number | null,
): boolean {
  return stored != null && current != null && stored === current;
}

function ownedHistoryDecision(delta: number): CatalogReturnDecision {
  if (delta === -1) return "back";
  if (delta < -1 && delta >= -MAX_OWNED_HISTORY_DELTA) {
    return { mode: "go", delta };
  }
  return "replace";
}

function currentMatchesOwnedPdp(
  currentHref: string,
  ownership: CatalogNavigationOwnership,
): boolean {
  const current = canonicalizeCurrentProductHref(currentHref);
  return current != null && current === ownership.pdpHref;
}

function isImmediatePlpSuccessor(
  ownership: CatalogNavigationOwnership,
  cursor: CatalogHistoryCursor,
): boolean {
  if (sameHistoryEntry(ownership.plpIdx, cursor.idx == null ? null : cursor.idx - 1)) {
    return true;
  }
  return sameHistoryEntry(
    ownership.plpLength,
    cursor.length == null ? null : cursor.length - 1,
  );
}

function isSameEntryAsPlp(
  ownership: CatalogNavigationOwnership,
  cursor: CatalogHistoryCursor,
): boolean {
  if (sameHistoryEntry(ownership.plpIdx, cursor.idx)) return true;
  return (
    ownership.plpIdx == null &&
    sameHistoryEntry(ownership.plpLength, cursor.length)
  );
}

type CatalogDocumentNavType = "reload" | "back_forward" | "navigate";

let documentNavTypeAvailable = true;
let documentNavType: CatalogDocumentNavType | null | undefined;

function peekDocumentNavigationType(): CatalogDocumentNavType | null {
  if (typeof performance === "undefined") return null;
  const entry = performance.getEntriesByType("navigation")[0] as
    | { type?: string }
    | undefined;
  if (entry?.type === "reload" || entry?.type === "back_forward" || entry?.type === "navigate") {
    return entry.type;
  }
  return null;
}

export function readCatalogNavigationType(): CatalogDocumentNavType | null {
  if (!documentNavTypeAvailable) return null;
  if (documentNavType === undefined) {
    documentNavType = peekDocumentNavigationType();
  }
  return documentNavType;
}

function consumeCatalogNavigationDocumentType(): CatalogDocumentNavType | null {
  const type = readCatalogNavigationType();
  documentNavTypeAvailable = false;
  return type;
}

function isTraverseSignal(
  wasPop: boolean,
  navType: string | null | undefined,
): boolean {
  return wasPop || navType === "reload" || navType === "back_forward";
}

function sameOwnedSlot(
  storedIdx: number | null,
  storedLength: number | null,
  cursor: CatalogHistoryCursor,
): boolean {
  if (sameHistoryEntry(storedIdx, cursor.idx)) return true;
  return (
    storedIdx == null &&
    cursor.idx == null &&
    sameHistoryEntry(storedLength, cursor.length)
  );
}

function isRecognizedLiveEntry(
  storedId: string | null,
  currentId: string | null,
  storedIdx: number | null,
  storedLength: number | null,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  navType: string | null | undefined,
  suspended: boolean,
): boolean {
  if (!sameOwnedSlot(storedIdx, storedLength, cursor)) return false;
  if (!suspended) return true;
  if (sameEntryIdentity(storedId, currentId)) return true;
  return isTraverseSignal(wasPop, navType);
}

function isRecognizedBoundSlot(
  storedId: string | null,
  currentId: string | null,
  storedIdx: number | null,
  storedLength: number | null,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  navType: string | null | undefined,
): boolean {
  if (!sameOwnedSlot(storedIdx, storedLength, cursor)) return false;
  if (sameEntryIdentity(storedId, currentId)) return true;
  if (!storedId && !currentId) return true;
  return isTraverseSignal(wasPop, navType);
}

function isBoundPdpEntry(
  ownership: CatalogNavigationOwnership,
  entryId: string | null,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  navType: string | null | undefined,
): boolean {
  return isRecognizedLiveEntry(
    ownership.pdpEntryId,
    entryId,
    ownership.pdpIdx,
    ownership.pdpLength,
    cursor,
    wasPop,
    navType,
    ownership.suspended,
  );
}

function isImmediatePdpSuccessor(
  ownership: CatalogNavigationOwnership,
  cursor: CatalogHistoryCursor,
): boolean {
  if (sameHistoryEntry(ownership.pdpIdx, cursor.idx == null ? null : cursor.idx - 1)) {
    return true;
  }
  return sameHistoryEntry(
    ownership.pdpLength,
    cursor.length == null ? null : cursor.length - 1,
  );
}

function sameChainIdentity(left: string | null, right: string | null): boolean {
  return Boolean(left) && Boolean(right) && left === right;
}

export function createCatalogNavigationChainId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `nav-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function isCalculatorReturnEntry(
  ownership: CatalogNavigationOwnership,
  entryId: string | null,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  navType: string | null | undefined,
): boolean {
  if (ownership.phase !== "returned-pdp-bound") return false;
  return isRecognizedLiveEntry(
    ownership.calcReturnEntryId,
    entryId,
    ownership.calcReturnIdx,
    ownership.calcReturnLength,
    cursor,
    wasPop,
    navType,
    ownership.suspended,
  );
}

function isLiveOwnedEntry(
  ownership: CatalogNavigationOwnership,
  entryId: string | null,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  navType: string | null | undefined,
): boolean {
  if (ownership.suspended) return false;
  return (
    isBoundPdpEntry(ownership, entryId, cursor, wasPop, navType) ||
    isCalculatorReturnEntry(ownership, entryId, cursor, wasPop, navType)
  );
}

/**
 * SPA remount can run before popstate. Keep a suspended same-slot record so
 * the later traverse bind can prove Forward; do not treat this as live ownership.
 */
export function shouldPreserveSuspendedCatalogOwnership(
  ownership: CatalogNavigationOwnership | null,
  currentHref: string,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  navType: string | null | undefined,
): boolean {
  if (!ownership?.bound || !ownership.suspended || !ownership.chainId) {
    return false;
  }
  if (isTraverseSignal(wasPop, navType)) return false;
  if (!currentMatchesOwnedPdp(currentHref, ownership)) return false;
  return (
    sameOwnedSlot(ownership.pdpIdx, ownership.pdpLength, cursor) ||
    sameOwnedSlot(
      ownership.calcReturnIdx,
      ownership.calcReturnLength,
      cursor,
    )
  );
}

export function createCatalogNavigationTransitionTicket(
  categoryHref: string,
  productHref: string,
  cursor: CatalogHistoryCursor,
): CatalogTransitionTicket | null {
  const plpHref = canonicalizeCatalogCategoryHref(categoryHref);
  const pdpHref = canonicalizeCurrentProductHref(productHref);
  if (!plpHref || !pdpHref) return null;
  return {
    plpHref,
    pdpHref,
    plpIdx: cursor.idx,
    plpLength: cursor.length,
  };
}

function transitionTicketMatchesSuccessor(
  ticket: CatalogTransitionTicket | null,
  ownership: CatalogNavigationOwnership,
  currentHref: string,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  navType: string | null | undefined,
): boolean {
  if (!ticket || wasPop || navType === "reload" || navType === "back_forward") {
    return false;
  }
  if (ticket.plpHref !== ownership.plpHref || ticket.pdpHref !== ownership.pdpHref) {
    return false;
  }
  if (!currentMatchesOwnedPdp(currentHref, ownership)) return false;
  if (
    ticket.plpIdx !== ownership.plpIdx ||
    ticket.plpLength !== ownership.plpLength
  ) {
    return false;
  }
  return isImmediatePlpSuccessor(ownership, cursor);
}

/** Bind pending PLP→PDP ownership to this history entry, or reject a later direct entry. */
export function bindCatalogNavigationOwnershipRecord(
  ownership: CatalogNavigationOwnership | null,
  currentHref: string,
  cursor: CatalogHistoryCursor,
  wasPop: boolean,
  entryId: string | null,
  navType: string | null = null,
  ticket: CatalogTransitionTicket | null = null,
): CatalogNavigationOwnership | null {
  if (
    !ownership?.chainId ||
    !currentMatchesOwnedPdp(currentHref, ownership)
  ) {
    return null;
  }
  if (!ownership.bound) {
    if (
      transitionTicketMatchesSuccessor(
        ticket,
        ownership,
        currentHref,
        cursor,
        wasPop,
        navType,
      )
    ) {
      return {
        ...ownership,
        bound: true,
        phase: "pdp-bound",
        pdpIdx: cursor.idx,
        pdpLength: cursor.length,
        pdpEntryId: readStoredEntryId(entryId),
        suspended: false,
      };
    }
    return isSameEntryAsPlp(ownership, cursor) ? ownership : null;
  }
  const currentEntryId = readStoredEntryId(entryId);
  if (
    ownership.suspended &&
    !isTraverseSignal(wasPop, navType) &&
    !sameEntryIdentity(ownership.pdpEntryId, currentEntryId) &&
    !sameEntryIdentity(ownership.calcReturnEntryId, currentEntryId)
  ) {
    return null;
  }
  const nav = readCatalogNavFromHref(currentHref);
  if (
    ownership.phase === "continuation-issued" &&
    !ownership.continuationConsumed &&
    sameChainIdentity(nav, ownership.continuationId)
  ) {
    return {
      ...ownership,
      phase: "returned-pdp-bound",
      continuationConsumed: true,
      calcReturnIdx: cursor.idx,
      calcReturnLength: cursor.length,
      calcReturnEntryId: currentEntryId,
      suspended: false,
    };
  }
  if (isCalculatorReturnEntry(ownership, entryId, cursor, wasPop, navType)) {
    return {
      ...ownership,
      calcReturnEntryId: currentEntryId ?? ownership.calcReturnEntryId,
      calcReturnIdx: cursor.idx,
      calcReturnLength: cursor.length,
      suspended: false,
    };
  }
  if (isBoundPdpEntry(ownership, entryId, cursor, wasPop, navType)) {
    return {
      ...ownership,
      pdpEntryId: currentEntryId ?? ownership.pdpEntryId,
      pdpIdx: cursor.idx,
      pdpLength: cursor.length,
      suspended: false,
    };
  }
  return null;
}

export function withCatalogNavigationCalculatorActivation(
  ownership: CatalogNavigationOwnership | null,
  entryId: string | null,
  cursor: CatalogHistoryCursor = { idx: null, length: null },
  wasPop = false,
  navType: string | null = null,
): CatalogNavigationOwnership | null {
  if (
    ownership?.phase !== "pdp-bound" ||
    !ownership.bound ||
    !ownership.chainId ||
    ownership.suspended ||
    !isBoundPdpEntry(ownership, entryId, cursor, wasPop, navType)
  ) {
    return null;
  }
  return {
    ...ownership,
    phase: "calc-activated",
    activationId: createCatalogNavigationChainId(),
    activationConsumed: false,
  };
}

export function bindCatalogCalculatorEntryRecord(
  ownership: CatalogNavigationOwnership | null,
  nav: string | string[] | null | undefined,
  currentHref: string,
  cursor: CatalogHistoryCursor,
  entryId: string | null,
  wasPop = false,
  navType: string | null = null,
): CatalogNavigationOwnership | null {
  if (!ownership?.chainId) return null;
  const href = canonicalizeCalculatorHref(currentHref);
  const token = readCatalogNavParam(nav);
  const currentEntryId = readStoredEntryId(entryId);
  if (
    ownership.phase === "calc-entry-bound" ||
    ownership.phase === "continuation-issued"
  ) {
    if (
      href &&
      href === ownership.calcEntryHref &&
      sameChainIdentity(token, ownership.activationId) &&
      isRecognizedBoundSlot(
        ownership.calcEntryId,
        currentEntryId,
        ownership.calcEntryIdx,
        ownership.calcEntryLength,
        cursor,
        wasPop,
        navType,
      )
    ) {
      return {
        ...ownership,
        calcEntryId: currentEntryId ?? ownership.calcEntryId,
      };
    }
    return null;
  }
  if (ownership.phase !== "calc-activated" || ownership.activationConsumed) {
    return null;
  }
  if (
    !href ||
    !sameChainIdentity(token, ownership.activationId) ||
    !isImmediatePdpSuccessor(ownership, cursor)
  ) {
    return null;
  }
  return {
    ...ownership,
    phase: "calc-entry-bound",
    activationConsumed: true,
    calcEntryHref: href,
    calcEntryId: currentEntryId,
    calcEntryIdx: cursor.idx,
    calcEntryLength: cursor.length,
  };
}

export function issueCatalogNavigationContinuationRecord(
  ownership: CatalogNavigationOwnership | null,
  currentHref: string,
  entryId: string | null,
  cursor: CatalogHistoryCursor = { idx: null, length: null },
  wasPop = false,
  navType: string | null = null,
): CatalogNavigationOwnership | null {
  if (ownership?.phase !== "calc-entry-bound") return null;
  const href = canonicalizeCalculatorHref(currentHref);
  if (
    !href ||
    href !== ownership.calcEntryHref ||
    !isRecognizedBoundSlot(
      ownership.calcEntryId,
      entryId,
      ownership.calcEntryIdx,
      ownership.calcEntryLength,
      cursor,
      wasPop,
      navType,
    )
  ) {
    return null;
  }
  return {
    ...ownership,
    phase: "continuation-issued",
    continuationId: createCatalogNavigationChainId(),
  };
}

export function decideCatalogReturnNavigation(input: {
  currentHref: string;
  ownership: CatalogNavigationOwnership | null;
  historyIdx: number | null;
  historyLength: number | null;
  entryId: string | null;
  wasPop?: boolean;
  navType?: string | null;
}): CatalogReturnDecision {
  const ownership = input.ownership;
  if (!ownership?.bound || !ownership.chainId) return "replace";
  if (!currentMatchesOwnedPdp(input.currentHref, ownership)) return "replace";
  const cursor = { idx: input.historyIdx, length: input.historyLength };
  if (
    !isLiveOwnedEntry(
      ownership,
      input.entryId,
      cursor,
      input.wasPop === true,
      input.navType ?? null,
    )
  ) {
    return "replace";
  }
  if (
    typeof ownership.plpIdx === "number" &&
    typeof input.historyIdx === "number"
  ) {
    return ownedHistoryDecision(ownership.plpIdx - input.historyIdx);
  }
  if (
    typeof ownership.plpLength === "number" &&
    typeof input.historyLength === "number"
  ) {
    return ownedHistoryDecision(ownership.plpLength - input.historyLength);
  }
  return "replace";
}

export function readCatalogHistoryCursor(): {
  idx: number | null;
  length: number | null;
} {
  if (typeof window === "undefined") return { idx: null, length: null };
  const state = window.history.state as { idx?: unknown } | null;
  const idx =
    state && typeof state.idx === "number" && Number.isFinite(state.idx)
      ? state.idx
      : null;
  const length = Number.isFinite(window.history.length)
    ? window.history.length
    : null;
  return { idx, length };
}

function writeCatalogNavigationOwnership(
  ownership: CatalogNavigationOwnership,
): void {
  try {
    window.sessionStorage.setItem(
      OWNERSHIP_STORAGE_KEY,
      JSON.stringify(ownership),
    );
  } catch {
    /* private mode / quota */
  }
}

export function consumeCatalogNavigationOwnership(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(OWNERSHIP_STORAGE_KEY);
    window.sessionStorage.removeItem(TICKET_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function writeCatalogNavigationTransitionTicket(
  ticket: CatalogTransitionTicket,
): void {
  try {
    window.sessionStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(ticket));
  } catch {
    /* private mode / quota */
  }
}

function readCatalogNavigationTransitionTicket(): CatalogTransitionTicket | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(TICKET_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CatalogTransitionTicket>;
    const ticket = createCatalogNavigationTransitionTicket(
      parsed.plpHref ?? "",
      parsed.pdpHref ?? "",
      { idx: finiteInt(parsed.plpIdx), length: finiteInt(parsed.plpLength) },
    );
    if (
      !ticket ||
      ticket.plpIdx !== finiteInt(parsed.plpIdx) ||
      ticket.plpLength !== finiteInt(parsed.plpLength)
    ) {
      window.sessionStorage.removeItem(TICKET_STORAGE_KEY);
      return null;
    }
    return ticket;
  } catch {
    try {
      window.sessionStorage.removeItem(TICKET_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return null;
  }
}

function consumeCatalogNavigationTransitionTicket(): CatalogTransitionTicket | null {
  const ticket = readCatalogNavigationTransitionTicket();
  try {
    window.sessionStorage.removeItem(TICKET_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return ticket;
}

export function rememberCatalogNavigationOwnership(
  categoryHref: string,
  productHref: string,
): void {
  if (typeof window === "undefined") return;
  const plpHref = canonicalizeCatalogCategoryHref(categoryHref);
  const pdpHref = canonicalizeCurrentProductHref(productHref);
  if (!plpHref || !pdpHref) return;
  const cursor = readCatalogHistoryCursor();
  const ticket = createCatalogNavigationTransitionTicket(
    plpHref,
    pdpHref,
    cursor,
  );
  if (!ticket) return;
  writeCatalogNavigationTransitionTicket(ticket);
  writeCatalogNavigationOwnership({
    plpHref,
    pdpHref,
    plpIdx: cursor.idx,
    plpLength: cursor.length,
    pdpIdx: null,
    pdpLength: null,
    pdpEntryId: null,
    bound: false,
    phase: "created",
    chainId: createCatalogNavigationChainId(),
    activationId: null,
    activationConsumed: false,
    continuationId: null,
    continuationConsumed: false,
    calcEntryHref: null,
    calcEntryId: null,
    calcEntryIdx: null,
    calcEntryLength: null,
    calcReturnIdx: null,
    calcReturnLength: null,
    calcReturnEntryId: null,
    suspended: false,
  });
}

type CatalogAdoptTicket = {
  chainId: string;
  href: string;
  idx: number | null;
  length: number | null;
};

function writeAdoptTicket(ownership: CatalogNavigationOwnership): void {
  try {
    const ticket: CatalogAdoptTicket = {
      chainId: ownership.chainId,
      href: ownership.pdpHref,
      idx: ownership.calcReturnIdx,
      length: ownership.calcReturnLength,
    };
    window.sessionStorage.setItem(ADOPT_STORAGE_KEY, JSON.stringify(ticket));
  } catch {
    /* ignore */
  }
}

function clearAdoptTicket(): void {
  try {
    window.sessionStorage.removeItem(ADOPT_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function consumeMatchingAdoptTicket(
  ownership: CatalogNavigationOwnership,
  cursor: CatalogHistoryCursor,
): boolean {
  try {
    const raw = window.sessionStorage.getItem(ADOPT_STORAGE_KEY);
    if (!raw) return false;
    const ticket = JSON.parse(raw) as Partial<CatalogAdoptTicket>;
    window.sessionStorage.removeItem(ADOPT_STORAGE_KEY);
    return (
      ticket.chainId === ownership.chainId &&
      ticket.href === ownership.pdpHref &&
      ticket.idx === cursor.idx &&
      ticket.length === cursor.length
    );
  } catch {
    clearAdoptTicket();
    return false;
  }
}

function adoptReturnedPdpEntry(
  ownership: CatalogNavigationOwnership,
  currentHref: string,
  cursor: CatalogHistoryCursor,
  entryId: string | null,
): CatalogNavigationOwnership | null {
  if (ownership.phase !== "returned-pdp-bound" || !ownership.continuationConsumed) {
    return null;
  }
  if (!currentMatchesOwnedPdp(currentHref, ownership)) return null;
  if (!consumeMatchingAdoptTicket(ownership, cursor)) return null;
  return {
    ...ownership,
    calcReturnEntryId: readStoredEntryId(entryId) ?? ownership.calcReturnEntryId,
    calcReturnIdx: cursor.idx,
    calcReturnLength: cursor.length,
    suspended: false,
  };
}

export function bindCatalogNavigationOwnership(currentHref: string): void {
  if (typeof window === "undefined") return;
  const current = readCatalogNavigationOwnership();
  const cursor = readCatalogHistoryCursor();
  const entryId = readCatalogNavigationEntryId();
  const wasPop = consumeCatalogNavigationWasPop();
  const navType = consumeCatalogNavigationDocumentType();
  const ticket = current?.bound ? null : readCatalogNavigationTransitionTicket();
  let next = bindCatalogNavigationOwnershipRecord(
    current,
    currentHref,
    cursor,
    wasPop,
    entryId,
    navType,
    ticket,
  );
  if (!next && current) {
    next = adoptReturnedPdpEntry(current, currentHref, cursor, entryId);
  }
  if (next) {
    writeCatalogNavigationOwnership(next);
    if (next.bound) consumeCatalogNavigationTransitionTicket();
    if (next.phase === "returned-pdp-bound" && next.continuationConsumed) {
      writeAdoptTicket(next);
    }
  } else if (
    shouldPreserveSuspendedCatalogOwnership(
      current,
      currentHref,
      cursor,
      wasPop,
      navType,
    )
  ) {
    /* Keep the suspended record until popstate/pageshow can prove the slot. */
  } else {
    clearAdoptTicket();
    consumeCatalogNavigationOwnership();
  }
}

export function markCatalogNavigationCalculatorActivation(): string | null {
  if (typeof window === "undefined") return null;
  const next = withCatalogNavigationCalculatorActivation(
    readCatalogNavigationOwnership(),
    readCatalogNavigationEntryId(),
    readCatalogHistoryCursor(),
    false,
    readCatalogNavigationType(),
  );
  if (!next) return null;
  writeCatalogNavigationOwnership(next);
  return next.activationId;
}

export function bindCatalogCalculatorEntry(
  nav: string | string[] | null | undefined,
): void {
  if (typeof window === "undefined") return;
  const next = bindCatalogCalculatorEntryRecord(
    readCatalogNavigationOwnership(),
    nav,
    `${window.location.pathname}${window.location.search}`,
    readCatalogHistoryCursor(),
    readCatalogNavigationEntryId(),
    consumeCatalogNavigationWasPop(),
    consumeCatalogNavigationDocumentType(),
  );
  if (next) writeCatalogNavigationOwnership(next);
  else consumeCatalogNavigationOwnership();
}

export function issueCatalogNavigationContinuation(): string | null {
  if (typeof window === "undefined") return null;
  const next = issueCatalogNavigationContinuationRecord(
    readCatalogNavigationOwnership(),
    `${window.location.pathname}${window.location.search}`,
    readCatalogNavigationEntryId(),
    readCatalogHistoryCursor(),
    false,
    readCatalogNavigationType(),
  );
  if (!next) {
    consumeCatalogNavigationOwnership();
    return null;
  }
  writeCatalogNavigationOwnership(next);
  return next.continuationId;
}

export function suspendCatalogNavigationOwnership(): void {
  if (typeof window === "undefined") return;
  const ownership = readCatalogNavigationOwnership();
  if (!ownership?.bound) return;
  writeCatalogNavigationOwnership({ ...ownership, suspended: true });
}

/** Suspend only when this tab is back on the owned PLP entry. */
export function suspendCatalogNavigationOwnershipIfCurrentPlp(): boolean {
  if (typeof window === "undefined") return false;
  const ownership = readCatalogNavigationOwnership();
  if (!ownership?.bound) return false;
  const current = canonicalizeCatalogCategoryHref(
    `${window.location.pathname}${window.location.search}`,
  );
  if (current !== ownership.plpHref) return false;
  writeCatalogNavigationOwnership({ ...ownership, suspended: true });
  return true;
}

export function discardMismatchedCatalogNavigationOwnership(
  currentCategoryHref: string,
): void {
  if (typeof window === "undefined") return;
  const ownership = readCatalogNavigationOwnership();
  if (!ownership) return;
  const current = canonicalizeCatalogCategoryHref(currentCategoryHref);
  if (current !== ownership.plpHref) consumeCatalogNavigationOwnership();
}

export function readCatalogNavigationOwnership(): CatalogNavigationOwnership | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(OWNERSHIP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CatalogNavigationOwnership>;
    const plpHref = canonicalizeCatalogCategoryHref(parsed?.plpHref);
    const pdpHref = canonicalizeCurrentProductHref(parsed?.pdpHref);
    const chainId =
      typeof parsed?.chainId === "string" && parsed.chainId.length > 0
        ? parsed.chainId
        : null;
    if (!plpHref || !pdpHref || !chainId) {
      window.sessionStorage.removeItem(OWNERSHIP_STORAGE_KEY);
      return null;
    }
    const phase =
      typeof parsed.phase === "string" && PHASES.has(parsed.phase as CatalogNavigationPhase)
        ? (parsed.phase as CatalogNavigationPhase)
        : null;
    if (!phase) {
      window.sessionStorage.removeItem(OWNERSHIP_STORAGE_KEY);
      return null;
    }
    const activationId = readCatalogNavParam(parsed.activationId);
    const continuationId = readCatalogNavParam(parsed.continuationId);
    return {
      plpHref,
      pdpHref,
      plpIdx: finiteInt(parsed.plpIdx),
      plpLength: finiteInt(parsed.plpLength),
      pdpIdx: finiteInt(parsed.pdpIdx),
      pdpLength: finiteInt(parsed.pdpLength),
      pdpEntryId: readStoredEntryId(parsed.pdpEntryId),
      bound: parsed.bound === true,
      phase,
      chainId,
      activationId,
      activationConsumed: parsed.activationConsumed === true,
      continuationId,
      continuationConsumed: parsed.continuationConsumed === true,
      calcEntryHref: canonicalizeCalculatorHref(parsed.calcEntryHref),
      calcEntryId: readStoredEntryId(parsed.calcEntryId),
      calcEntryIdx: finiteInt(parsed.calcEntryIdx),
      calcEntryLength: finiteInt(parsed.calcEntryLength),
      calcReturnIdx: finiteInt(parsed.calcReturnIdx),
      calcReturnLength: finiteInt(parsed.calcReturnLength),
      calcReturnEntryId: readStoredEntryId(parsed.calcReturnEntryId),
      suspended: parsed.suspended === true,
    };
  } catch {
    consumeCatalogNavigationOwnership();
    return null;
  }
}

export type ScrollSnapshot = { href: string; y: number };

export function parseCatalogPlpScrollSnapshot(
  raw: string | null,
  currentHref: string,
): number | null {
  const href = canonicalizeCatalogCategoryHref(currentHref);
  if (!raw || !href) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ScrollSnapshot>;
    return parsed?.href === href &&
      typeof parsed.y === "number" &&
      Number.isFinite(parsed.y) &&
      parsed.y >= 0
      ? parsed.y
      : null;
  } catch {
    return null;
  }
}

let lastNavigationWasPop = false;

function markCatalogNavigationTraverse(): void {
  lastNavigationWasPop = true;
}

function rebindOwnedProductAfterTraverse(): void {
  if (typeof window === "undefined") return;
  const currentHref = `${window.location.pathname}${window.location.search}`;
  if (!canonicalizeCurrentProductHref(currentHref)) {
    consumeCatalogNavigationWasPop();
    return;
  }
  bindCatalogNavigationOwnership(currentHref);
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    markCatalogNavigationTraverse();
    queueMicrotask(rebindOwnedProductAfterTraverse);
  });
  window.addEventListener("pageshow", (event) => {
    if (!event.persisted) return;
    markCatalogNavigationTraverse();
    queueMicrotask(rebindOwnedProductAfterTraverse);
  });
  const navigation = (
    window as Window & {
      navigation?: {
        addEventListener?: (
          type: string,
          listener: (event: Event & { navigationType?: string }) => void,
        ) => void;
      };
    }
  ).navigation;
  if (typeof navigation?.addEventListener === "function") {
    navigation.addEventListener("navigate", (event) => {
      if (event.navigationType === "traverse") {
        markCatalogNavigationTraverse();
      }
    });
  }
  window.addEventListener("pagehide", () => {
    try {
      window.sessionStorage.removeItem(ADOPT_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  });
}

export function consumeCatalogNavigationWasPop(): boolean {
  const value = lastNavigationWasPop;
  lastNavigationWasPop = false;
  return value;
}

/**
 * Decide the snapshot to store. `preserveExisting` keeps an already captured
 * matching snapshot so a later scroll lock cannot replace it with the locked
 * page position; `0` remains a valid captured value.
 */
export function resolveCatalogPlpScrollToStore(
  storedRaw: string | null,
  categoryHref: string,
  currentY: number,
  preserveExisting: boolean,
): ScrollSnapshot | null {
  const href = canonicalizeCatalogCategoryHref(categoryHref);
  if (!href) return null;
  if (preserveExisting) {
    const captured = parseCatalogPlpScrollSnapshot(storedRaw, href);
    if (captured != null) return { href, y: captured };
  }
  if (!Number.isFinite(currentY) || currentY < 0) return null;
  return { href, y: currentY };
}

function writeCatalogPlpScroll(
  categoryHref: string,
  preserveExisting: boolean,
): void {
  if (typeof window === "undefined") return;
  try {
    const snapshot = resolveCatalogPlpScrollToStore(
      window.sessionStorage.getItem(SCROLL_STORAGE_KEY),
      categoryHref,
      window.scrollY,
      preserveExisting,
    );
    if (!snapshot) return;
    window.sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* private mode / quota */
  }
}

export function rememberCatalogPlpScroll(categoryHref: string): void {
  writeCatalogPlpScroll(categoryHref, false);
}

/**
 * Full-PDP navigation from an open Quick Detail: reuse the snapshot captured
 * at the open action boundary instead of the scroll-locked page position.
 */
export function preserveCatalogPlpScroll(categoryHref: string): void {
  writeCatalogPlpScroll(categoryHref, true);
}

/**
 * Abandoned Quick Detail: drop the stored snapshot only when it belongs to
 * this exact canonical PLP href. Unrelated, missing, or unreadable values stay.
 */
export function storedCatalogPlpScrollMatchesHref(
  storedRaw: string | null,
  categoryHref: string,
): boolean {
  const href = canonicalizeCatalogCategoryHref(categoryHref);
  if (!href || storedRaw == null || storedRaw === "") return false;
  try {
    const parsed = JSON.parse(storedRaw) as Partial<ScrollSnapshot>;
    return typeof parsed?.href === "string" && parsed.href === href;
  } catch {
    return false;
  }
}

export function discardMatchingCatalogPlpScroll(categoryHref: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!storedCatalogPlpScrollMatchesHref(raw, categoryHref)) return;
    window.sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch {
    /* private mode / quota */
  }
}

export function consumeCatalogPlpScroll(currentHref: string): number | null {
  if (typeof window === "undefined") return null;
  if (!canonicalizeCatalogCategoryHref(currentHref)) return null;
  try {
    const raw = window.sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    return parseCatalogPlpScrollSnapshot(raw, currentHref);
  } catch {
    return null;
  }
}

export function discardMismatchedCatalogPlpScroll(currentHref: string): void {
  if (typeof window === "undefined") return;
  const href = canonicalizeCatalogCategoryHref(currentHref);
  try {
    const raw = window.sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as ScrollSnapshot;
    if (!parsed || parsed.href !== href) {
      window.sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    }
  } catch {
    try {
      window.sessionStorage.removeItem(SCROLL_STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}
