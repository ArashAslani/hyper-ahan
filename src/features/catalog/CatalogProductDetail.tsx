"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CatalogReturnLink } from "@/features/catalog/CatalogReturnLink";
import {
  appendCatalogNavParam,
  bindCatalogNavigationOwnership,
  buildCleanedProductHref,
  markCatalogNavigationCalculatorActivation,
} from "@/lib/catalogNavigationContext";
import { routes } from "@/lib/routes";
import { SALE_MODE_LABELS } from "@/lib/catalogLabels";
import {
  readEngineeringPrefill,
  type EngineeringPrefill,
} from "@/lib/engineeringPrefill";
import { pricingService } from "@/services/pricingService";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { AddToCartSheet } from "@/features/catalog/AddToCartSheet";
import type {
  ActivePrice,
  CatalogProduct,
  FinalPrice,
  SpecTemplate,
} from "@/types/catalog";

type CatalogProductDetailProps = {
  product: CatalogProduct;
  factoryName?: string;
  categoryName?: string;
  template: SpecTemplate | null;
  /** Resolved tool or tools-list href when product has formulaTypeId. */
  calculatorHref?: string | null;
  /** Query handoff from calculator (`applyQty` / `applyUnit` / `openAtc`). */
  engineeringHandoff?: {
    applyQty?: string | null;
    applyUnit?: string | null;
    openAtc?: boolean;
  } | null;
};

function formatMoney(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("fa-IR").format(value);
}

/** FullyOnline + units + active sellable → open ATC sheet; else Call Expert. */
function canOpenAddToCart(
  product: CatalogProduct,
  active: ActivePrice | null,
): boolean {
  return (
    product.saleMode === 1 &&
    product.orderUnits.length > 0 &&
    active?.isSellable === true
  );
}

function prefillFromHandoff(
  productId: string,
  handoff: CatalogProductDetailProps["engineeringHandoff"],
): EngineeringPrefill | null {
  if (!handoff?.applyQty) return null;
  const quantity = Number(handoff.applyQty);
  if (!Number.isFinite(quantity)) return null;
  return {
    productId,
    quantity,
    unit: handoff.applyUnit ?? null,
    createdAt: Date.now(),
  };
}

export function CatalogProductDetail({
  product,
  factoryName,
  categoryName,
  template,
  calculatorHref,
  engineeringHandoff,
}: CatalogProductDetailProps) {
  const router = useRouter();
  const defaultUnit =
    product.orderUnits.find((u) => u.isDefault) ?? product.orderUnits[0] ?? null;

  const [orderUnitId, setOrderUnitId] = useState(defaultUnit?.id ?? "");
  const [quantity, setQuantity] = useState(
    defaultUnit?.minimumOrderQuantity ?? 1,
  );
  const [active, setActive] = useState<ActivePrice | null>(null);
  const [quote, setQuote] = useState<FinalPrice | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [engineering, setEngineering] = useState<EngineeringPrefill | null>(
    null,
  );
  const [pending, startTransition] = useTransition();
  const pendingOpenAtc = useRef(Boolean(engineeringHandoff?.openAtc));
  const cleanedQuery = useRef(false);

  const openAddSheet = canOpenAddToCart(product, active);

  const specRows = useMemo(() => {
    if (!template) {
      return product.specificationValues.map((sv) => ({
        label: sv.specificationDefinitionId,
        value: sv.value,
      }));
    }
    const defMap = new Map(template.definitions.map((d) => [d.id, d.name]));
    return product.specificationValues.map((sv) => ({
      label: defMap.get(sv.specificationDefinitionId) ?? sv.specificationDefinitionId,
      value: sv.value,
    }));
  }, [product.specificationValues, template]);

  // Engineering handoff from calculator (query + sessionStorage).
  useEffect(() => {
    const fromQuery = prefillFromHandoff(product.id, engineeringHandoff);
    const fromSession = readEngineeringPrefill(product.id);
    setEngineering(fromQuery ?? fromSession);

    if (
      engineeringHandoff?.openAtc ||
      engineeringHandoff?.applyQty != null
    ) {
      pendingOpenAtc.current = true;
    }

    if (
      !cleanedQuery.current &&
      (engineeringHandoff?.applyQty != null ||
        engineeringHandoff?.applyUnit != null ||
        engineeringHandoff?.openAtc)
    ) {
      cleanedQuery.current = true;
      const liveHref = `${window.location.pathname}${window.location.search}`;
      bindCatalogNavigationOwnership(liveHref);
      router.replace(
        buildCleanedProductHref(
          product.id,
          new URLSearchParams(window.location.search),
        ),
        { scroll: false },
      );
    }
  }, [product.id, engineeringHandoff, router]);

  // Open ATC once sellable (active price may load after handoff).
  useEffect(() => {
    if (pendingOpenAtc.current && openAddSheet) {
      pendingOpenAtc.current = false;
      setSheetOpen(true);
    }
  }, [openAddSheet]);

  useEffect(() => {
    let cancelled = false;
    pricingService
      .getActive(product.id)
      .then((result) => {
        if (!cancelled) setActive(result);
      })
      .catch(() => {
        if (!cancelled) setActive(null);
      });
    return () => {
      cancelled = true;
    };
  }, [product.id]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (!orderUnitId || quantity <= 0) {
        setQuote(null);
        setPriceError(null);
        return;
      }
      startTransition(async () => {
        setPriceError(null);
        try {
          const result = await pricingService.calculate({
            productId: product.id,
            orderUnitId,
            quantity,
          });
          setQuote(result);
        } catch (e) {
          setQuote(null);
          setPriceError(e instanceof Error ? e.message : "خطا در محاسبه قیمت");
        }
      });
    }, 300);
    return () => window.clearTimeout(handle);
  }, [product.id, orderUnitId, quantity]);

  const selectedUnit = product.orderUnits.find((u) => u.id === orderUnitId);
  // Live total from Pricing calculate only — never active.price as final.
  const displayPrice = formatMoney(quote?.finalPrice);

  const handleUnitChange = (nextId: string) => {
    setOrderUnitId(nextId);
    const unit = product.orderUnits.find((u) => u.id === nextId);
    if (unit) {
      setQuantity(unit.minimumOrderQuantity);
    }
    setQuote(null);
  };

  return (
    <div className="pb-28">
      <div className="space-y-4 px-4 py-4">
        <CatalogReturnLink className="text-sm text-accent">
          ← بازگشت به کاتالوگ
        </CatalogReturnLink>

        <div>
          <h1 className="text-xl font-bold text-text">{product.displayName}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
            {categoryName ? (
              <span className="rounded-full bg-bg px-2 py-1">{categoryName}</span>
            ) : null}
            {factoryName ? (
              <span className="rounded-full bg-bg px-2 py-1">{factoryName}</span>
            ) : null}
            <span className="rounded-full bg-accent/10 px-2 py-1 text-accent">
              {SALE_MODE_LABELS[product.saleMode] ?? "—"}
            </span>
          </div>
        </div>

        {calculatorHref ? (
          <Link
            href={calculatorHref}
            onClick={(event) => {
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                event.button !== 0
              ) {
                return;
              }
              event.preventDefault();
              const nav = markCatalogNavigationCalculatorActivation();
              router.push(
                nav ? appendCatalogNavParam(calculatorHref, nav) : calculatorHref,
              );
            }}
            className="flex min-h-[var(--touch-min)] items-center justify-between rounded-[var(--radius-lg)] bg-surface px-4 py-3 text-sm shadow-[var(--shadow-soft)]"
          >
            <span className="font-medium text-text">محاسبه مقدار مورد نیاز</span>
            <span className="text-accent">محاسبه‌گر ←</span>
          </Link>
        ) : null}

        {engineering ? (
          <div className="rounded-[var(--radius-md)] bg-accent/10 px-3 py-2 text-sm text-text">
            <span className="text-text-muted">نتیجه مهندسی: </span>
            {engineering.quantity.toLocaleString("fa-IR")}
            {engineering.unit ? ` ${engineering.unit}` : ""}
            <span className="mr-1 text-xs text-text-muted">
              (قیمت نیست — در افزودن به سبد واحد سفارش را انتخاب کنید)
            </span>
          </div>
        ) : null}

        <section className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
          <h2 className="mb-3 text-sm font-bold text-text">مشخصات</h2>
          {specRows.length === 0 ? (
            <p className="text-sm text-text-muted">مشخصاتی ثبت نشده است.</p>
          ) : (
            <dl className="space-y-2 text-sm">
              {specRows.map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <dt className="text-text-muted">{row.label}</dt>
                  <dd className="font-medium text-text">{row.value}</dd>
                </div>
              ))}
              {product.registrationUnit.label.trim() ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-text-muted">واحد ثبت</dt>
                  <dd className="font-medium text-text">
                    {product.registrationUnit.label.trim()}
                  </dd>
                </div>
              ) : null}
            </dl>
          )}
        </section>

        <section className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
          <h2 className="mb-3 text-sm font-bold text-text">قیمت</h2>
          {active && !active.isSellable ? (
            <EmptyState
              title="در حال حاضر قابل فروش نیست"
              description="برای استعلام با پشتیبانی تماس بگیرید."
              icon="📞"
            />
          ) : (
            <div className="space-y-3">
              {product.orderUnits.length > 0 ? (
                <label className="block text-sm">
                  <span className="mb-1 block text-text-muted">واحد سفارش</span>
                  <select
                    value={orderUnitId}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-text"
                  >
                    {product.orderUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.unit}
                        {u.isDefault ? " (پیش‌فرض)" : ""}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="block text-sm">
                <span className="mb-1 block text-text-muted">مقدار</span>
                <input
                  type="number"
                  min={selectedUnit?.minimumOrderQuantity ?? 1}
                  max={selectedUnit?.maximumOrderQuantity ?? undefined}
                  step={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="min-h-[var(--touch-min)] w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-text"
                />
              </label>

              <div className="rounded-[var(--radius-md)] bg-bg px-3 py-3">
                {pending ? (
                  <p className="text-sm text-text-muted">در حال محاسبه قیمت…</p>
                ) : priceError ? (
                  <p className="text-sm text-danger">{priceError}</p>
                ) : displayPrice ? (
                  <div>
                    <p className="text-xs text-text-muted">قیمت نهایی</p>
                    <p className="text-xl font-bold text-text">
                      {displayPrice}
                      <span className="mr-1 text-sm font-normal text-text-muted">
                        ریال
                      </span>
                    </p>
                    {quote?.vatApplied && quote.vatAmount != null ? (
                      <p className="mt-1 text-xs text-text-muted">
                        مالیات: {formatMoney(quote.vatAmount)} ریال
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-text-muted">
                    قیمت پس از انتخاب واحد و مقدار نمایش داده می‌شود.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <div className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-20 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-xl gap-2">
            {openAddSheet ? (
              <>
                <a href={routes.phone.call} className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    تماس
                  </Button>
                </a>
                <Button
                  type="button"
                  variant="accent"
                  className="flex-[1.4]"
                  onClick={() => setSheetOpen(true)}
                >
                  افزودن به سبد
                </Button>
              </>
            ) : (
              <a href={routes.phone.call} className="flex-1">
                <Button type="button" variant="accent" className="w-full">
                  تماس با کارشناس
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      <AddToCartSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        product={product}
        engineeringPrefill={engineering}
      />
    </div>
  );
}
