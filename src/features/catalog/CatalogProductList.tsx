"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CatalogPlpControls } from "@/features/catalog/CatalogPlpControls";
import { CatalogProductCard } from "@/features/catalog/CatalogProductCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Button } from "@/shared/ui/Button";
import {
  buildCatalogProductHref,
  rememberCatalogNavigationOwnership,
  rememberCatalogPlpScroll,
} from "@/lib/catalogNavigationContext";
import {
  appendCatalogPlpPageItems,
  canObserveCatalogPlpNextPage,
  canShowCatalogPlpLoadMoreControl,
  canShowCatalogPlpRetryControl,
  consumeCatalogPlpLoadedThrough,
  discardMismatchedCatalogPlpLoadedThrough,
  nextCatalogPlpPage,
  rememberCatalogPlpLoadedThrough,
  type CatalogPlpContinuousLoadStatus,
} from "@/lib/catalogPlpContinuous";
import {
  toCatalogPlpQuery,
  type CatalogPlpUrlState,
} from "@/lib/catalogPlpQuery";
import { catalogService } from "@/services/catalogService";
import type {
  CatalogFactory,
  CatalogPlpMetadata,
  CatalogPlpProductPage,
  CatalogProduct,
} from "@/types/catalog";

type CatalogProductListProps = {
  title: string;
  result?: {
    metadata: CatalogPlpMetadata;
    products: CatalogPlpProductPage;
  };
  /** Legacy factory page input; category PLP uses `result`. */
  products?: CatalogProduct[];
  factories: CatalogFactory[];
  urlState?: CatalogPlpUrlState;
  pathname?: string;
  categoryHref?: string;
  emptyDescription?: string;
};

function categoryIdFromPathname(pathname: string): string | null {
  const match = pathname.match(
    /\/catalog\/categories\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i,
  );
  return match?.[1] ?? null;
}

function buildFactoryMap(
  factories: CatalogFactory[],
  metadata: CatalogPlpMetadata | null | undefined,
): Map<string, string> {
  const map = new Map<string, string>();
  for (const f of factories) map.set(f.id, f.name);
  for (const option of metadata?.factoryFacet?.options ?? []) {
    map.set(option.factoryId, option.label);
  }
  return map;
}

type ContinuousProps = {
  title: string;
  result: {
    metadata: CatalogPlpMetadata;
    products: CatalogPlpProductPage;
  };
  factories: CatalogFactory[];
  urlState: CatalogPlpUrlState;
  pathname: string;
  categoryHref: string;
  emptyDescription: string;
};

function CatalogContinuousProductList({
  title,
  result,
  factories,
  urlState,
  pathname,
  categoryHref,
  emptyDescription,
}: ContinuousProps) {
  const [items, setItems] = useState(() => result.products.items);
  const [metadata, setMetadata] = useState(() => result.metadata);
  const [throughPage, setThroughPage] = useState(() => result.products.page);
  const [hasNextPage, setHasNextPage] = useState(
    () => result.products.hasNextPage,
  );
  const [totalCount, setTotalCount] = useState(
    () => result.products.totalCount,
  );
  const [status, setStatus] =
    useState<CatalogPlpContinuousLoadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [targetThroughPage] = useState<number | null>(() => {
    discardMismatchedCatalogPlpLoadedThrough(categoryHref);
    const restored = consumeCatalogPlpLoadedThrough(categoryHref);
    return restored != null && restored > result.products.page
      ? restored
      : null;
  });

  const loadingRef = useRef(false);
  const itemsRef = useRef(result.products.items);
  const generationRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      generationRef.current += 1;
    };
  }, []);

  const captureNavigationContext = useCallback(() => {
    rememberCatalogPlpScroll(categoryHref);
    rememberCatalogPlpLoadedThrough(categoryHref, throughPage);
  }, [categoryHref, throughPage]);

  const loadNextPage = useCallback(async () => {
    const categoryId = categoryIdFromPathname(pathname);
    if (!categoryId) return;
    const generation = generationRef.current;
    if (!hasNextPage || loadingRef.current) return;
    const expectedPage = nextCatalogPlpPage(throughPage);
    loadingRef.current = true;
    setStatus("loading");
    setErrorMessage(null);
    try {
      const pageResult = await catalogService.queryCategoryPlp(
        toCatalogPlpQuery(categoryId, { ...urlState, page: expectedPage }),
      );
      if (generation !== generationRef.current) return;
      const appended = appendCatalogPlpPageItems(
        itemsRef.current,
        pageResult.products.items,
        expectedPage,
        pageResult.products.page,
      );
      if (!appended) {
        setStatus("error");
        setErrorMessage("پاسخ صفحه با درخواست هم‌خوان نیست.");
        return;
      }
      itemsRef.current = appended;
      setItems(appended);
      setMetadata(pageResult.metadata);
      setThroughPage(pageResult.products.page);
      setHasNextPage(pageResult.products.hasNextPage);
      setTotalCount(pageResult.products.totalCount);
      setStatus("idle");
    } catch (error) {
      if (generation !== generationRef.current) return;
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "بارگذاری صفحه بعد ناموفق بود.",
      );
    } finally {
      if (generation === generationRef.current) {
        loadingRef.current = false;
      }
    }
  }, [pathname, urlState, throughPage, hasNextPage]);

  const needsRestorePages =
    targetThroughPage != null &&
    throughPage < targetThroughPage &&
    hasNextPage &&
    status === "idle";

  useEffect(() => {
    if (!needsRestorePages) return;
    const timer = window.setTimeout(() => {
      void loadNextPage();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [needsRestorePages, loadNextPage, throughPage]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (
      !node ||
      !canObserveCatalogPlpNextPage({
        hasNextPage,
        status,
        needsRestorePages,
      })
    ) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadNextPage();
        }
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, loadNextPage, needsRestorePages, items.length, status]);

  const factoryMap = useMemo(
    () => buildFactoryMap(factories, metadata),
    [factories, metadata],
  );

  const productPageForControls: CatalogPlpProductPage = {
    items,
    page: throughPage,
    pageSize: result.products.pageSize,
    totalCount,
    totalPages: result.products.totalPages,
    hasPreviousPage: false,
    hasNextPage,
  };

  return (
    <div className="px-4 py-4">
      <h1 tabIndex={-1} className="mb-3 text-xl font-bold text-text">
        {title}
      </h1>

      <CatalogPlpControls
        metadata={metadata}
        productPage={productPageForControls}
        urlState={urlState}
        pathname={pathname}
        loadedCount={items.length}
        loadingMore={status === "loading"}
      />

      {items.length === 0 ? (
        <EmptyState
          title="محصولی یافت نشد"
          description={emptyDescription}
          icon="📦"
        />
      ) : (
        <div className="mt-1 divide-y divide-border/70 sm:grid sm:grid-cols-2 sm:gap-3 sm:divide-y-0">
          {items.map((product) => {
            const productHref = buildCatalogProductHref(
              product.id,
              categoryHref,
            );
            return (
              <div key={product.id} className="py-2 sm:py-0">
                <CatalogProductCard
                  product={product}
                  factoryName={factoryMap.get(product.factoryId)}
                  productHref={productHref}
                  onNavigateToProduct={() => {
                    captureNavigationContext();
                    rememberCatalogNavigationOwnership(
                      categoryHref,
                      productHref,
                    );
                  }}
                  onNavigateToProductFromQuickDetail={() => {
                    rememberCatalogPlpScroll(categoryHref);
                    rememberCatalogPlpLoadedThrough(categoryHref, throughPage);
                    rememberCatalogNavigationOwnership(
                      categoryHref,
                      productHref,
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {items.length > 0 ? (
        <div className="mt-4 space-y-3">
          <div ref={sentinelRef} aria-hidden="true" className="h-1" />
          {status === "loading" ? (
            <p className="text-center text-sm text-text-muted" aria-live="polite">
              در حال بارگذاری محصولات بیشتر...
            </p>
          ) : null}
          {canShowCatalogPlpRetryControl(status) ? (
            <div
              className="rounded-[var(--radius-md)] border border-border bg-surface px-3 py-3 text-center"
              role="alert"
            >
              <p className="text-sm text-text-muted">
                {errorMessage ?? "بارگذاری صفحه بعد ناموفق بود."}
              </p>
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={() => void loadNextPage()}
              >
                تلاش مجدد
              </Button>
            </div>
          ) : null}
          {canShowCatalogPlpLoadMoreControl({ hasNextPage, status }) ? (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => void loadNextPage()}
              >
                نمایش محصولات بیشتر
              </Button>
            </div>
          ) : null}
          {!hasNextPage ? (
            <p className="text-center text-xs text-text-muted">
              پایان فهرست · {totalCount.toLocaleString("fa-IR")} محصول
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function CatalogProductList({
  title,
  result,
  products,
  factories,
  urlState,
  pathname,
  categoryHref,
  emptyDescription = "محصولی در این فهرست نیست.",
}: CatalogProductListProps) {
  const continuous = Boolean(result && urlState && pathname && categoryHref);

  if (continuous && result && urlState && pathname && categoryHref) {
    const queryKey = `${pathname}?${JSON.stringify({
      sort: urlState.sort,
      factoryIds: urlState.factoryIds ?? [],
      selectionFilters: urlState.selectionFilters ?? [],
      numericRangeFilters: urlState.numericRangeFilters ?? [],
      booleanFilters: urlState.booleanFilters ?? [],
    })}`;
    return (
      <CatalogContinuousProductList
        key={queryKey}
        title={title}
        result={result}
        factories={factories}
        urlState={urlState}
        pathname={pathname}
        categoryHref={categoryHref}
        emptyDescription={emptyDescription}
      />
    );
  }

  const items = products ?? [];
  const factoryMap = buildFactoryMap(factories, result?.metadata);

  return (
    <div className="px-4 py-4">
      <h1 tabIndex={-1} className="mb-3 text-xl font-bold text-text">
        {title}
      </h1>
      {items.length === 0 ? (
        <EmptyState
          title="محصولی یافت نشد"
          description={emptyDescription}
          icon="📦"
        />
      ) : (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((product) => (
            <CatalogProductCard
              key={product.id}
              product={product}
              factoryName={factoryMap.get(product.factoryId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
