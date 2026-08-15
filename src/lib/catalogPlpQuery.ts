import type {
  CatalogPlpBooleanFilter,
  CatalogPlpNumericRangeFilter,
  CatalogPlpQuery,
  CatalogPlpSelectionFilter,
} from "../types/catalog.ts";

export const CATALOG_PLP_PAGE_SIZE = 20;
export const CATALOG_PLP_DEFAULT_SORT = "name-asc";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SORT_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/i;

export type CatalogPlpUrlState = Omit<
  CatalogPlpQuery,
  "categoryId" | "pageSize"
>;

export type CatalogPlpSearchParams = Record<
  string,
  string | string[] | undefined
>;

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function validOpaqueId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function singleValue(
  params: URLSearchParams,
  key: string,
): string | undefined {
  const values = params.getAll(key);
  return values.length === 1 ? values[0] : undefined;
}

function parsePage(params: URLSearchParams): number {
  const raw = singleValue(params, "page");
  if (!raw || !/^[1-9]\d*$/.test(raw)) return 1;
  const page = Number(raw);
  return Number.isSafeInteger(page) ? page : 1;
}

function parseSort(params: URLSearchParams): string {
  const raw = singleValue(params, "sort");
  return raw && SORT_PATTERN.test(raw) ? raw : CATALOG_PLP_DEFAULT_SORT;
}

function parseFactories(params: URLSearchParams): string[] {
  return unique(
    params
      .getAll("factory")
      .map((value) => value.trim())
      .filter(validOpaqueId),
  );
}

function parseSelectionFilters(
  params: URLSearchParams,
): CatalogPlpSelectionFilter[] {
  const grouped = new Map<string, string[]>();
  for (const value of params.getAll("selection")) {
    const [definitionId, optionId, ...extra] = value.split(":");
    if (
      extra.length > 0 ||
      !validOpaqueId(definitionId) ||
      !validOpaqueId(optionId)
    ) {
      continue;
    }
    grouped.set(definitionId, [
      ...(grouped.get(definitionId) ?? []),
      optionId,
    ]);
  }
  return [...grouped].map(([definitionId, optionIds]) => ({
    definitionId,
    optionIds: unique(optionIds),
  }));
}

function parseNumericRangeFilters(
  params: URLSearchParams,
): CatalogPlpNumericRangeFilter[] {
  const parsed = new Map<string, CatalogPlpNumericRangeFilter>();
  const invalidDefinitions = new Set<string>();
  for (const value of params.getAll("range")) {
    const [definitionId, minimumRaw, maximumRaw, ...extra] = value.split(":");
    if (extra.length > 0 || !validOpaqueId(definitionId)) continue;
    if (parsed.has(definitionId)) {
      parsed.delete(definitionId);
      invalidDefinitions.add(definitionId);
      continue;
    }
    if (invalidDefinitions.has(definitionId)) continue;
    const minimum = Number(minimumRaw);
    const maximum = Number(maximumRaw);
    if (
      minimumRaw === "" ||
      maximumRaw === "" ||
      !Number.isFinite(minimum) ||
      !Number.isFinite(maximum) ||
      maximum < minimum
    ) {
      continue;
    }
    parsed.set(definitionId, { definitionId, minimum, maximum });
  }
  return [...parsed.values()];
}

function parseBooleanFilters(
  params: URLSearchParams,
): CatalogPlpBooleanFilter[] {
  const parsed = new Map<string, CatalogPlpBooleanFilter>();
  const invalidDefinitions = new Set<string>();
  for (const raw of params.getAll("boolean")) {
    const [definitionId, value, ...extra] = raw.split(":");
    if (
      extra.length > 0 ||
      !validOpaqueId(definitionId) ||
      (value !== "true" && value !== "false")
    ) {
      continue;
    }
    if (parsed.has(definitionId)) {
      parsed.delete(definitionId);
      invalidDefinitions.add(definitionId);
      continue;
    }
    if (invalidDefinitions.has(definitionId)) continue;
    parsed.set(definitionId, {
      definitionId,
      value: value === "true",
    });
  }
  return [...parsed.values()];
}

export function toUrlSearchParams(
  input: CatalogPlpSearchParams,
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, raw] of Object.entries(input)) {
    if (Array.isArray(raw)) {
      for (const value of raw) params.append(key, value);
    } else if (typeof raw === "string") {
      params.append(key, raw);
    }
  }
  return params;
}

export function decodeCatalogPlpUrl(
  params: URLSearchParams,
): CatalogPlpUrlState {
  return {
    page: parsePage(params),
    sort: parseSort(params),
    factoryIds: parseFactories(params),
    selectionFilters: parseSelectionFilters(params),
    numericRangeFilters: parseNumericRangeFilters(params),
    booleanFilters: parseBooleanFilters(params),
  };
}

export function encodeCatalogPlpUrl(
  state: CatalogPlpUrlState,
): URLSearchParams {
  const params = new URLSearchParams();
  if (state.page > 1) params.set("page", String(state.page));
  if (state.sort !== CATALOG_PLP_DEFAULT_SORT) {
    params.set("sort", state.sort);
  }
  for (const factoryId of unique(state.factoryIds ?? [])) {
    if (validOpaqueId(factoryId)) params.append("factory", factoryId);
  }
  for (const filter of state.selectionFilters ?? []) {
    if (!validOpaqueId(filter.definitionId)) continue;
    for (const optionId of unique(filter.optionIds)) {
      if (validOpaqueId(optionId)) {
        params.append(
          "selection",
          `${filter.definitionId}:${optionId}`,
        );
      }
    }
  }
  for (const filter of state.numericRangeFilters ?? []) {
    if (
      validOpaqueId(filter.definitionId) &&
      Number.isFinite(filter.minimum) &&
      Number.isFinite(filter.maximum) &&
      filter.maximum >= filter.minimum
    ) {
      params.append(
        "range",
        `${filter.definitionId}:${filter.minimum}:${filter.maximum}`,
      );
    }
  }
  for (const filter of state.booleanFilters ?? []) {
    if (validOpaqueId(filter.definitionId)) {
      params.append(
        "boolean",
        `${filter.definitionId}:${String(filter.value)}`,
      );
    }
  }
  return params;
}

export function buildCatalogPlpHref(
  pathname: string,
  state: CatalogPlpUrlState,
): string {
  const query = encodeCatalogPlpUrl(state).toString();
  return query ? `${pathname}?${query}` : pathname;
}

/**
 * Continuous browsing owns only filter/sort URL state. Page accumulation is
 * client-side, so the customer-facing href never carries `page`.
 */
export function buildCatalogPlpContinuousHref(
  pathname: string,
  state: CatalogPlpUrlState,
): string {
  return buildCatalogPlpHref(pathname, resetCatalogPlpPage(state));
}

export function toCatalogPlpQuery(
  categoryId: string,
  state: CatalogPlpUrlState,
): CatalogPlpQuery {
  return {
    categoryId,
    page: state.page,
    pageSize: CATALOG_PLP_PAGE_SIZE,
    sort: state.sort,
    ...(state.factoryIds?.length
      ? { factoryIds: state.factoryIds }
      : {}),
    ...(state.selectionFilters?.length
      ? { selectionFilters: state.selectionFilters }
      : {}),
    ...(state.numericRangeFilters?.length
      ? { numericRangeFilters: state.numericRangeFilters }
      : {}),
    ...(state.booleanFilters?.length
      ? { booleanFilters: state.booleanFilters }
      : {}),
  };
}

export function resetCatalogPlpPage(
  state: CatalogPlpUrlState,
): CatalogPlpUrlState {
  return { ...state, page: 1 };
}
