import assert from "node:assert/strict";
import test from "node:test";
import {
  appendCatalogPlpPageItems,
  canObserveCatalogPlpNextPage,
  canShowCatalogPlpLoadMoreControl,
  canShowCatalogPlpRetryControl,
  canStartCatalogPlpPageRequest,
  consumeCatalogPlpLoadedThrough,
  nextCatalogPlpPage,
  parseCatalogPlpLoadedRange,
  rememberCatalogPlpLoadedThrough,
} from "./catalogPlpContinuous.ts";
import {
  buildCatalogPlpContinuousHref,
  resetCatalogPlpPage,
} from "./catalogPlpQuery.ts";
import type { CatalogProduct } from "../types/catalog.ts";

const RANGE_KEY = "ha_catalog_plp_loaded_range_v1";
const categoryPath =
  "/catalog/categories/00000000-0000-0000-a001-000000000043";

function product(id: string): CatalogProduct {
  return { id } as CatalogProduct;
}

type StorageMode = "normal" | "throw-get" | "throw-remove";

function installSessionStorage(mode: StorageMode = "normal"): {
  map: Map<string, string>;
  restore: () => void;
} {
  const map = new Map<string, string>();
  const previousWindow = (globalThis as { window?: unknown }).window;
  const storage = {
    getItem(key: string): string | null {
      if (mode === "throw-get") throw new Error("getItem blocked");
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string): void {
      map.set(key, String(value));
    },
    removeItem(key: string): void {
      if (mode === "throw-remove") throw new Error("removeItem blocked");
      map.delete(key);
    },
    clear(): void {
      map.clear();
    },
    key(): string | null {
      return null;
    },
    get length() {
      return map.size;
    },
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: { sessionStorage: storage },
  });
  return {
    map,
    restore() {
      if (previousWindow === undefined) {
        Reflect.deleteProperty(globalThis, "window");
      } else {
        Object.defineProperty(globalThis, "window", {
          configurable: true,
          writable: true,
          value: previousWindow,
        });
      }
    },
  };
}

test("continuous href never encodes page", () => {
  const href = buildCatalogPlpContinuousHref(categoryPath, {
    page: 4,
    sort: "newest",
    factoryIds: [],
    selectionFilters: [],
    numericRangeFilters: [],
    booleanFilters: [],
  });
  assert.equal(href, `${categoryPath}?sort=newest`);
  assert.deepEqual(
    resetCatalogPlpPage({
      page: 4,
      sort: "newest",
      factoryIds: [],
      selectionFilters: [],
      numericRangeFilters: [],
      booleanFilters: [],
    }).page,
    1,
  );
});

test("append keeps Backend order, skips duplicates, rejects page mismatch", () => {
  const first = [product("a"), product("b")];
  const next = [product("b"), product("c")];
  assert.deepEqual(
    appendCatalogPlpPageItems(first, next, 2, 2)?.map((p) => p.id),
    ["a", "b", "c"],
  );
  assert.equal(appendCatalogPlpPageItems(first, next, 2, 3), null);
  assert.equal(appendCatalogPlpPageItems(first, next, 1, 1), null);
});

test("request guard allows only one in-flight next page", () => {
  assert.equal(
    canStartCatalogPlpPageRequest({
      hasNextPage: true,
      loading: false,
      queryGeneration: 3,
      requestGeneration: 3,
    }),
    true,
  );
  assert.equal(
    canStartCatalogPlpPageRequest({
      hasNextPage: true,
      loading: true,
      queryGeneration: 3,
      requestGeneration: 3,
    }),
    false,
  );
  assert.equal(
    canStartCatalogPlpPageRequest({
      hasNextPage: false,
      loading: false,
      queryGeneration: 3,
      requestGeneration: 3,
    }),
    false,
  );
  assert.equal(
    canStartCatalogPlpPageRequest({
      hasNextPage: true,
      loading: false,
      queryGeneration: 4,
      requestGeneration: 3,
    }),
    false,
  );
});

test("auto-observe arms only while idle with more pages and no restore", () => {
  assert.equal(
    canObserveCatalogPlpNextPage({
      hasNextPage: true,
      status: "idle",
      needsRestorePages: false,
    }),
    true,
  );
  assert.equal(
    canObserveCatalogPlpNextPage({
      hasNextPage: true,
      status: "loading",
      needsRestorePages: false,
    }),
    false,
  );
  assert.equal(
    canObserveCatalogPlpNextPage({
      hasNextPage: true,
      status: "error",
      needsRestorePages: false,
    }),
    false,
  );
  assert.equal(
    canObserveCatalogPlpNextPage({
      hasNextPage: false,
      status: "idle",
      needsRestorePages: false,
    }),
    false,
  );
  assert.equal(
    canObserveCatalogPlpNextPage({
      hasNextPage: true,
      status: "idle",
      needsRestorePages: true,
    }),
    false,
  );
});

test("error shows retry alone; load-more stays idle-only", () => {
  assert.equal(canShowCatalogPlpRetryControl("error"), true);
  assert.equal(canShowCatalogPlpRetryControl("idle"), false);
  assert.equal(canShowCatalogPlpRetryControl("loading"), false);
  assert.equal(
    canShowCatalogPlpLoadMoreControl({ hasNextPage: true, status: "idle" }),
    true,
  );
  assert.equal(
    canShowCatalogPlpLoadMoreControl({ hasNextPage: true, status: "error" }),
    false,
  );
  assert.equal(
    canShowCatalogPlpLoadMoreControl({ hasNextPage: true, status: "loading" }),
    false,
  );
  assert.equal(
    canShowCatalogPlpLoadMoreControl({ hasNextPage: false, status: "idle" }),
    false,
  );
});

test("next page advances from the loaded through-page", () => {
  assert.equal(nextCatalogPlpPage(1), 2);
  assert.equal(nextCatalogPlpPage(2), 3);
  assert.equal(nextCatalogPlpPage(0), 1);
});

test("loaded-range parse accepts matching throughPage and rejects stale", () => {
  const href = `${categoryPath}?sort=newest`;
  assert.equal(
    parseCatalogPlpLoadedRange(
      JSON.stringify({ href, throughPage: 3 }),
      href,
    ),
    3,
  );
  assert.equal(
    parseCatalogPlpLoadedRange(
      JSON.stringify({ href: categoryPath, throughPage: 3 }),
      href,
    ),
    null,
  );
  assert.equal(parseCatalogPlpLoadedRange("not-json", href), null);
  assert.equal(
    parseCatalogPlpLoadedRange(
      JSON.stringify({ href, throughPage: 0 }),
      href,
    ),
    null,
  );
});

test("consumeCatalogPlpLoadedThrough returns once then removes the key", () => {
  const href = `${categoryPath}?sort=newest`;
  const { map, restore } = installSessionStorage();
  try {
    rememberCatalogPlpLoadedThrough(href, 2);
    assert.equal(consumeCatalogPlpLoadedThrough(href), 2);
    assert.equal(map.has(RANGE_KEY), false);
    assert.equal(consumeCatalogPlpLoadedThrough(href), null);

    map.set(
      RANGE_KEY,
      JSON.stringify({
        href: `${categoryPath}?sort=name-asc`,
        throughPage: 3,
      }),
    );
    assert.equal(consumeCatalogPlpLoadedThrough(href), null);
    assert.equal(map.has(RANGE_KEY), false);
  } finally {
    restore();
  }
});

test("consumeCatalogPlpLoadedThrough survives throwing getItem and removeItem", () => {
  const href = `${categoryPath}?sort=newest`;
  {
    const { restore } = installSessionStorage("throw-get");
    try {
      assert.equal(consumeCatalogPlpLoadedThrough(href), null);
    } finally {
      restore();
    }
  }
  {
    const { map, restore } = installSessionStorage("throw-remove");
    try {
      map.set(RANGE_KEY, JSON.stringify({ href, throughPage: 2 }));
      assert.equal(consumeCatalogPlpLoadedThrough(href), null);
      assert.equal(map.has(RANGE_KEY), true);
    } finally {
      restore();
    }
  }
});

test("rememberCatalogPlpLoadedThrough records exact href and throughPage", () => {
  const href = `${categoryPath}?sort=newest`;
  const { map, restore } = installSessionStorage();
  try {
    rememberCatalogPlpLoadedThrough(href, 1);
    assert.deepEqual(JSON.parse(map.get(RANGE_KEY)!), {
      href,
      throughPage: 1,
    });
    rememberCatalogPlpLoadedThrough(href, 2);
    assert.deepEqual(JSON.parse(map.get(RANGE_KEY)!), {
      href,
      throughPage: 2,
    });
  } finally {
    restore();
  }
});

test("rememberCatalogPlpLoadedThrough ignores invalid inputs and storage throws", () => {
  const href = `${categoryPath}?sort=newest`;
  const { map, restore } = installSessionStorage();
  try {
    rememberCatalogPlpLoadedThrough("", 2);
    rememberCatalogPlpLoadedThrough(href, 0);
    rememberCatalogPlpLoadedThrough(href, 1.5);
    assert.equal(map.has(RANGE_KEY), false);
  } finally {
    restore();
  }

  const previousWindow = (globalThis as { window?: unknown }).window;
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    writable: true,
    value: {
      sessionStorage: {
        setItem() {
          throw new Error("quota");
        },
        getItem() {
          return null;
        },
        removeItem() {},
      },
    },
  });
  try {
    assert.doesNotThrow(() => rememberCatalogPlpLoadedThrough(href, 2));
  } finally {
    if (previousWindow === undefined) {
      Reflect.deleteProperty(globalThis, "window");
    } else {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        writable: true,
        value: previousWindow,
      });
    }
  }
});
