import assert from "node:assert/strict";
import test from "node:test";
import {
  mapCatalogPlpResponse,
  orderCatalogPlpControlFacets,
} from "./catalogPlpMapping.ts";
import {
  buildCatalogPlpHref,
  CATALOG_PLP_DEFAULT_SORT,
  CATALOG_PLP_PAGE_SIZE,
  decodeCatalogPlpUrl,
  encodeCatalogPlpUrl,
  resetCatalogPlpPage,
  toCatalogPlpQuery,
} from "./catalogPlpQuery.ts";

const factoryA = "00000000-0000-0000-0000-000000000f01";
const factoryB = "00000000-0000-0000-0000-000000000f02";
const selectionDefinition = "00000000-0000-0000-0000-000000000d01";
const optionA = "00000000-0000-0000-0000-000000000001";
const optionB = "00000000-0000-0000-0000-000000000002";
const numericDefinition = "00000000-0000-0000-0000-000000000d02";
const booleanDefinition = "00000000-0000-0000-0000-000000000d03";

test("PLP URL state round-trips valid repeated opaque values", () => {
  const state = {
    page: 3,
    sort: "newest",
    factoryIds: [factoryA, factoryB],
    selectionFilters: [
      {
        definitionId: selectionDefinition,
        optionIds: [optionA, optionB],
      },
    ],
    numericRangeFilters: [
      { definitionId: numericDefinition, minimum: -1.5, maximum: 20 },
    ],
    booleanFilters: [{ definitionId: booleanDefinition, value: false }],
  };

  assert.deepEqual(
    decodeCatalogPlpUrl(encodeCatalogPlpUrl(state)),
    state,
  );
});

test("decoder omits malformed technical values instead of guessing", () => {
  const params = new URLSearchParams();
  params.append("page", "2");
  params.append("page", "3");
  params.append("sort", "newest");
  params.append("sort", "name-asc");
  params.append("factory", "not-an-id");
  params.append("selection", `${selectionDefinition}:bad-option`);
  params.append("range", `${numericDefinition}:NaN:10`);
  params.append("range", `${numericDefinition}:20:10`);
  params.append("boolean", `${booleanDefinition}:yes`);

  assert.deepEqual(decodeCatalogPlpUrl(params), {
    page: 1,
    sort: CATALOG_PLP_DEFAULT_SORT,
    factoryIds: [],
    selectionFilters: [],
    numericRangeFilters: [],
    booleanFilters: [],
  });
});

test("decoder groups repeated Selection options and removes duplicates", () => {
  const params = new URLSearchParams();
  params.append("selection", `${selectionDefinition}:${optionA}`);
  params.append("selection", `${selectionDefinition}:${optionB}`);
  params.append("selection", `${selectionDefinition}:${optionA}`);

  assert.deepEqual(decodeCatalogPlpUrl(params).selectionFilters, [
    {
      definitionId: selectionDefinition,
      optionIds: [optionA, optionB],
    },
  ]);
});

test("duplicate range or Boolean definitions are omitted as conflicts", () => {
  const params = new URLSearchParams();
  params.append("range", `${numericDefinition}:1:10`);
  params.append("range", `${numericDefinition}:2:9`);
  params.append("boolean", `${booleanDefinition}:true`);
  params.append("boolean", `${booleanDefinition}:false`);

  const state = decodeCatalogPlpUrl(params);
  assert.deepEqual(state.numericRangeFilters, []);
  assert.deepEqual(state.booleanFilters, []);
});

test("filter and sort transitions can reset page without changing values", () => {
  const state = {
    page: 8,
    sort: "newest",
    factoryIds: [factoryA],
    selectionFilters: [],
    numericRangeFilters: [],
    booleanFilters: [],
  };
  assert.deepEqual(resetCatalogPlpPage(state), { ...state, page: 1 });
  assert.equal(
    buildCatalogPlpHref("/catalog/categories/category", {
      ...state,
      page: 1,
    }),
    `/catalog/categories/category?sort=newest&factory=${factoryA}`,
  );
});

test("API request uses exact contract and omits empty optional arrays", () => {
  assert.deepEqual(
    toCatalogPlpQuery("category-id", {
      page: 1,
      sort: CATALOG_PLP_DEFAULT_SORT,
      factoryIds: [],
      selectionFilters: [],
      numericRangeFilters: [],
      booleanFilters: [],
    }),
    {
      categoryId: "category-id",
      page: 1,
      pageSize: CATALOG_PLP_PAGE_SIZE,
      sort: CATALOG_PLP_DEFAULT_SORT,
    },
  );
});

test("API response mapping preserves Backend labels, values, and ordering", () => {
  const result = mapCatalogPlpResponse(
    {
      metadata: {
        categoryId: "category-id",
        isLeafCategory: true,
        factoryFacet: {
          order: 4,
          options: [
            { factoryId: factoryB, label: "کارخانه ب" },
            { factoryId: factoryA, label: "کارخانه الف" },
          ],
        },
        specificationFacets: [
          {
            definitionId: selectionDefinition,
            label: "استاندارد ویژه",
            dataType: 6,
            order: 8,
            selection: {
              options: [
                { optionId: optionB, label: "گزینه دوم", displayOrder: 20 },
                { optionId: optionA, label: "گزینه اول", displayOrder: 10 },
              ],
            },
          },
          {
            definitionId: numericDefinition,
            label: "ضخامت",
            dataType: 3,
            order: 9,
            numeric: {
              minimum: 0.5,
              maximum: 20,
              step: 0.5,
              unitCode: "mm",
              unitLabel: "میلی‌متر",
            },
          },
        ],
        sortOptions: [
          {
            key: "newest",
            label: "جدیدترین",
            isDefault: false,
            isAvailable: true,
          },
          {
            key: "name-asc",
            label: "نام (صعودی)",
            isDefault: true,
            isAvailable: true,
          },
        ],
      },
      products: {
        items: [{ id: "raw-product" }],
        page: 2,
        pageSize: 20,
        totalCount: 21,
        totalPages: 2,
        hasPreviousPage: true,
        hasNextPage: false,
      },
    },
    (product) => ({ id: product.id, mapped: true }),
  );

  assert.deepEqual(result.metadata.factoryFacet?.options, [
    { factoryId: factoryB, label: "کارخانه ب" },
    { factoryId: factoryA, label: "کارخانه الف" },
  ]);
  assert.deepEqual(
    result.metadata.specificationFacets[0].selection?.options.map(
      ({ optionId, label }) => ({ optionId, label }),
    ),
    [
      { optionId: optionB, label: "گزینه دوم" },
      { optionId: optionA, label: "گزینه اول" },
    ],
  );
  assert.equal(
    result.metadata.specificationFacets[1].numeric?.unitLabel,
    "میلی‌متر",
  );
  assert.deepEqual(
    result.metadata.sortOptions.map(({ key, label }) => ({ key, label })),
    [
      { key: "newest", label: "جدیدترین" },
      { key: "name-asc", label: "نام (صعودی)" },
    ],
  );
  assert.deepEqual(result.products.items, [
    { id: "raw-product", mapped: true },
  ]);
  assert.equal(result.products.page, 2);
  assert.equal(result.products.totalCount, 21);
});

test("control facets follow Backend order and keep equal-order Backend sequence", () => {
  const selection = {
    definitionId: selectionDefinition,
    label: "استاندارد ویژه",
    dataType: 6 as const,
    order: 2,
    numeric: null,
    selection: { options: [] },
    booleanCapability: null,
  };
  const numeric = {
    definitionId: numericDefinition,
    label: "ضخامت",
    dataType: 3 as const,
    order: 8,
    numeric: {
      minimum: 0,
      maximum: 1,
      step: null,
      unitCode: null,
      unitLabel: null,
    },
    selection: null,
    booleanCapability: null,
  };

  assert.deepEqual(
    orderCatalogPlpControlFacets({
      factoryFacet: { order: 5, options: [] },
      specificationFacets: [selection, numeric],
    }).map((section) =>
      section.kind === "factory" ? "factory" : section.facet.definitionId,
    ),
    [selectionDefinition, "factory", numericDefinition],
  );

  assert.deepEqual(
    orderCatalogPlpControlFacets({
      factoryFacet: { order: 2, options: [] },
      specificationFacets: [selection, numeric],
    }).map((section) =>
      section.kind === "factory" ? "factory" : section.facet.definitionId,
    ),
    ["factory", selectionDefinition, numericDefinition],
  );

  const equalNumeric = { ...numeric, order: 2 };
  assert.deepEqual(
    orderCatalogPlpControlFacets({
      factoryFacet: { order: 2, options: [] },
      specificationFacets: [equalNumeric, selection],
    }).map((section) =>
      section.kind === "factory" ? "factory" : section.facet.definitionId,
    ),
    ["factory", numericDefinition, selectionDefinition],
  );
});
