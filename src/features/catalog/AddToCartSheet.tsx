"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { routes } from "@/lib/routes";
import { toEnglishDigits } from "@/lib/format";
import {
  formatEngineeringAuditRef,
  readEngineeringPrefill,
  unitsMatch,
  type EngineeringPrefill,
} from "@/lib/engineeringPrefill";
import { useCart } from "@/providers/CartProvider";
import { pricingService } from "@/services/pricingService";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";
import type { CatalogOrderUnit, CatalogProduct, FinalPrice } from "@/types/catalog";
import {
  CART_QUOTE_TTL_MS,
  type QuoteCartItem,
} from "@/types/quoteCart";

/** Mid-sheet live-quote freshness window (UX canvas: 60–120s). */
const SHEET_QUOTE_STALE_MS = 120 * 1000;
const DEBOUNCE_MS = 300;
/** Until OrderUnitDto exposes step/increment. */
const QTY_STEP = 1;

type AddToCartSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  product: CatalogProduct;
  /** Engineering result from calculator (display / optional qty prefill). */
  engineeringPrefill?: EngineeringPrefill | null;
};

function formatMoney(value: number | null | undefined): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return new Intl.NumberFormat("fa-IR").format(value);
}

function formatFaNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

function parseQuantityInput(raw: string): number | null {
  const trimmed = toEnglishDigits(raw).trim().replace(/,/g, "");
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function isOnStep(qty: number, min: number, step: number): boolean {
  const k = (qty - min) / step;
  return Math.abs(k - Math.round(k)) < 1e-9;
}

function quantityError(
  qty: number | null,
  unit: CatalogOrderUnit | null,
): string | null {
  if (!unit) return "واحد سفارش را انتخاب کنید";
  if (qty == null) return "مقدار را وارد کنید";
  const min = unit.minimumOrderQuantity;
  const max = unit.maximumOrderQuantity;
  if (qty < min) return `حداقل سفارش ${formatFaNumber(min)} است`;
  if (max != null && qty > max) return `حداکثر سفارش ${formatFaNumber(max)} است`;
  if (!isOnStep(qty, min, QTY_STEP)) {
    return `مقدار باید مضرب ${formatFaNumber(QTY_STEP)} از حداقل باشد`;
  }
  return null;
}

function defaultUnit(product: CatalogProduct): CatalogOrderUnit | null {
  return (
    product.orderUnits.find((u) => u.isDefault) ?? product.orderUnits[0] ?? null
  );
}

function resolveEngineering(
  productId: string,
  prop: EngineeringPrefill | null | undefined,
): EngineeringPrefill | null {
  return prop ?? readEngineeringPrefill(productId);
}

/** Prefill order qty only when engineering unit matches selected order unit. */
function initialOrderQty(
  unit: CatalogOrderUnit | null,
  eng: EngineeringPrefill | null,
): string {
  if (!unit) return "";
  if (eng && unitsMatch(eng.unit, unit.unit)) {
    return String(eng.quantity);
  }
  return String(unit.minimumOrderQuantity);
}

export function AddToCartSheet({
  isOpen,
  onClose,
  product,
  engineeringPrefill,
}: AddToCartSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={product.displayName}>
      {isOpen ? (
        <AddToCartSheetBody
          product={product}
          onClose={onClose}
          engineeringPrefill={engineeringPrefill}
        />
      ) : null}
    </BottomSheet>
  );
}

type BodyProps = {
  product: CatalogProduct;
  onClose: () => void;
  engineeringPrefill?: EngineeringPrefill | null;
};

function AddToCartSheetBody({
  product,
  onClose,
  engineeringPrefill,
}: BodyProps) {
  const { addOrUpdate } = useCart();
  const { showToast } = useToast();
  const initial = defaultUnit(product);
  const eng = resolveEngineering(product.id, engineeringPrefill);

  const [orderUnitId, setOrderUnitId] = useState(initial?.id ?? "");
  const [qtyRaw, setQtyRaw] = useState(() => initialOrderQty(initial, eng));
  const [quote, setQuote] = useState<FinalPrice | null>(null);
  const [quotedAtMs, setQuotedAtMs] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [refreshNonce, setRefreshNonce] = useState(0);
  const skipDebounceRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const requestSeq = useRef(0);

  const selectedUnit =
    product.orderUnits.find((u) => u.id === orderUnitId) ?? null;
  const unitMatched = Boolean(
    eng && selectedUnit && unitsMatch(eng.unit, selectedUnit.unit),
  );
  const quantity = parseQuantityInput(qtyRaw);
  const validationError = quantityError(quantity, selectedUnit);
  const qtyValid = validationError == null && quantity != null;

  // When qty becomes invalid, hide stale quote without a separate fetch cycle.
  const displayQuote = qtyValid ? quote : null;
  const sheetExpired =
    quotedAtMs != null &&
    displayQuote != null &&
    nowMs - quotedAtMs > SHEET_QUOTE_STALE_MS;
  const unsellable = displayQuote != null && displayQuote.isSellable === false;

  useEffect(() => {
    if (quotedAtMs == null) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 5000);
    return () => window.clearInterval(id);
  }, [quotedAtMs]);

  useEffect(() => {
    if (!qtyValid || !orderUnitId || quantity == null) {
      abortRef.current?.abort();
      abortRef.current = null;
      return;
    }

    const delay = skipDebounceRef.current ? 0 : DEBOUNCE_MS;
    skipDebounceRef.current = false;

    const handle = window.setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      const seq = ++requestSeq.current;

      setPending(true);
      setPriceError(null);
      setQuote(null);
      setQuotedAtMs(null);

      pricingService
        .calculate(
          {
            productId: product.id,
            orderUnitId,
            quantity,
          },
          { signal: controller.signal },
        )
        .then((result) => {
          if (seq !== requestSeq.current) return;
          setQuote(result);
          setQuotedAtMs(Date.now());
          setPending(false);
        })
        .catch((e: unknown) => {
          if (controller.signal.aborted) return;
          if (seq !== requestSeq.current) return;
          setQuote(null);
          setQuotedAtMs(null);
          setPending(false);
          setPriceError(
            e instanceof Error ? e.message : "خطا در محاسبه قیمت",
          );
        });
    }, delay);

    return () => {
      window.clearTimeout(handle);
      abortRef.current?.abort();
    };
  }, [product.id, orderUnitId, quantity, qtyValid, refreshNonce]);

  const canAdd =
    qtyValid &&
    !pending &&
    !sheetExpired &&
    displayQuote != null &&
    displayQuote.isSellable === true &&
    displayQuote.finalPrice != null;

  const liveTotal = formatMoney(displayQuote?.finalPrice);

  const selectUnit = (unit: CatalogOrderUnit) => {
    if (unit.id === orderUnitId) return;
    abortRef.current?.abort();
    setOrderUnitId(unit.id);
    // Unit change: always MOQ + clear quote (no FE rescale / no re-apply eng).
    setQtyRaw(String(unit.minimumOrderQuantity));
    setQuote(null);
    setQuotedAtMs(null);
    setPriceError(null);
    setPending(false);
  };

  const stepBy = (delta: number) => {
    if (!selectedUnit) return;
    const min = selectedUnit.minimumOrderQuantity;
    const max = selectedUnit.maximumOrderQuantity;
    const base = quantity ?? min;
    let next = base + delta * QTY_STEP;
    if (next < min) next = min;
    if (max != null && next > max) next = max;
    setQtyRaw(String(next));
  };

  const refreshQuote = () => {
    skipDebounceRef.current = true;
    setNowMs(Date.now());
    setRefreshNonce((n) => n + 1);
  };

  const handleAdd = () => {
    if (!canAdd || !selectedUnit || quantity == null || !displayQuote) return;

    const quotedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + CART_QUOTE_TTL_MS).toISOString();

    const item: QuoteCartItem = {
      productId: product.id,
      displayName: product.displayName,
      orderUnitId: selectedUnit.id,
      orderUnitLabel: selectedUnit.unit,
      quantity,
      quote: displayQuote,
      quotedAt,
      expiresAt,
      // Prefer engineering audit when present; else Pricing priceId correlation.
      calculationRef: eng
        ? formatEngineeringAuditRef(eng)
        : (displayQuote.priceId ?? null),
    };

    addOrUpdate(item);
    showToast(`«${product.displayName}» به سبد اضافه شد`, "success");
    onClose();
  };

  const showQtySplit =
    eng != null &&
    displayQuote?.payableQuantity != null &&
    quantity != null &&
    (displayQuote.payableQuantity !== quantity || !unitMatched);

  const metaChips = useMemo(() => {
    if (!selectedUnit) return null;
    const registrationLabel = product.registrationUnit.label.trim();
    const maxLabel =
      selectedUnit.maximumOrderQuantity == null
        ? "بدون سقف"
        : `حداکثر ${formatFaNumber(selectedUnit.maximumOrderQuantity)}`;
    return (
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
        <span className="rounded-full bg-bg px-2 py-1">
          هر ۱ {selectedUnit.unit} ={" "}
          {formatFaNumber(selectedUnit.conversionFactor)}
          {registrationLabel ? ` ${registrationLabel}` : ""}
        </span>
        <span className="rounded-full bg-bg px-2 py-1">
          حداقل {formatFaNumber(selectedUnit.minimumOrderQuantity)}
        </span>
        <span className="rounded-full bg-bg px-2 py-1">{maxLabel}</span>
        <span className="rounded-full bg-bg px-2 py-1">
          گام {formatFaNumber(QTY_STEP)}
        </span>
      </div>
    );
  }, [selectedUnit, product.registrationUnit]);

  if (product.orderUnits.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-text-muted">واحد سفارشی تعریف نشده</p>
        <a href={routes.phone.call}>
          <Button type="button" variant="accent" fullWidth>
            تماس با کارشناس
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {eng ? (
        <div className="rounded-[var(--radius-md)] bg-accent/10 px-3 py-2 text-sm">
          <p className="text-xs text-text-muted">نتیجه مهندسی (فقط راهنما)</p>
          <p className="font-medium text-text">
            {formatFaNumber(eng.quantity)}
            {eng.unit ? ` ${eng.unit}` : ""}
          </p>
          {eng && selectedUnit && !unitsMatch(eng.unit, selectedUnit.unit) ? (
            <p className="mt-1 text-xs text-text-muted">
              واحد مهندسی با «{selectedUnit.unit}» یکی نیست — مقدار سفارش از حداقل
              شروع شده است (تبدیل خودکار انجام نمی‌شود).
            </p>
          ) : null}
        </div>
      ) : null}

      <div role="radiogroup" aria-label="واحد سفارش" className="space-y-2">
        {product.orderUnits.map((unit) => {
          const selected = unit.id === orderUnitId;
          const registrationLabel = product.registrationUnit.label.trim();
          return (
            <button
              key={unit.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => selectUnit(unit)}
              className={`flex min-h-14 w-full flex-col items-start rounded-[var(--radius-md)] border px-3 py-3 text-right transition ${
                selected
                  ? "border-accent bg-accent/5"
                  : "border-border bg-bg"
              }`}
            >
              <span className="text-[15px] font-bold text-text">
                {unit.unit}
                {unit.isDefault ? (
                  <span className="mr-2 text-xs font-normal text-text-muted">
                    (پیش‌فرض)
                  </span>
                ) : null}
              </span>
              <span className="mt-1 text-xs text-text-muted">
                هر ۱ {unit.unit} = {formatFaNumber(unit.conversionFactor)}
                {registrationLabel ? ` ${registrationLabel}` : ""}
              </span>
            </button>
          );
        })}
      </div>

      {metaChips}

      <div>
        <span className="mb-1 block text-sm text-text-muted">مقدار سفارش</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="کاهش"
            onClick={() => stepBy(-1)}
            disabled={
              !selectedUnit ||
              (quantity != null &&
                quantity <= selectedUnit.minimumOrderQuantity)
            }
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg text-lg font-bold text-text disabled:opacity-40"
          >
            −
          </button>
          <input
            type="text"
            inputMode="decimal"
            value={qtyRaw}
            onChange={(e) => setQtyRaw(e.target.value)}
            onBlur={() => {
              if (!selectedUnit) return;
              const q = parseQuantityInput(qtyRaw);
              if (q == null) return;
              let next = q;
              if (next < selectedUnit.minimumOrderQuantity) {
                next = selectedUnit.minimumOrderQuantity;
              }
              if (
                selectedUnit.maximumOrderQuantity != null &&
                next > selectedUnit.maximumOrderQuantity
              ) {
                next = selectedUnit.maximumOrderQuantity;
              }
              if (
                !isOnStep(next, selectedUnit.minimumOrderQuantity, QTY_STEP)
              ) {
                const min = selectedUnit.minimumOrderQuantity;
                const k = Math.round((next - min) / QTY_STEP);
                next = min + Math.max(0, k) * QTY_STEP;
                if (
                  selectedUnit.maximumOrderQuantity != null &&
                  next > selectedUnit.maximumOrderQuantity
                ) {
                  next = selectedUnit.maximumOrderQuantity;
                }
              }
              setQtyRaw(String(next));
            }}
            aria-invalid={validationError != null}
            aria-describedby={
              validationError ? "atc-qty-error" : undefined
            }
            className="h-12 min-h-[48px] w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-center text-lg font-bold text-text"
          />
          <button
            type="button"
            aria-label="افزایش"
            onClick={() => stepBy(1)}
            disabled={
              !selectedUnit ||
              (selectedUnit.maximumOrderQuantity != null &&
                quantity != null &&
                quantity >= selectedUnit.maximumOrderQuantity)
            }
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-border bg-bg text-lg font-bold text-text disabled:opacity-40"
          >
            +
          </button>
        </div>
        {validationError ? (
          <p
            id="atc-qty-error"
            className="mt-1 text-xs text-danger"
            role="alert"
          >
            {validationError}
          </p>
        ) : null}
      </div>

      {sheetExpired && displayQuote ? (
        <div className="rounded-[var(--radius-md)] border border-highlight/40 bg-highlight/10 px-3 py-3">
          <p className="text-sm text-text">قیمت منقضی شده</p>
          <Button
            type="button"
            variant="outline"
            className="mt-2 w-full"
            onClick={refreshQuote}
          >
            بروزرسانی قیمت
          </Button>
        </div>
      ) : null}

      <div
        className="rounded-[var(--radius-md)] bg-bg px-3 py-3"
        aria-live="polite"
      >
        {pending ? (
          <p className="text-sm text-text-muted">در حال محاسبه قیمت…</p>
        ) : priceError ? (
          <div className="space-y-2">
            <p className="text-sm text-danger">{priceError}</p>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={refreshQuote}
            >
              تلاش مجدد
            </Button>
          </div>
        ) : unsellable ? (
          <p className="text-sm text-text-muted">
            در حال حاضر قابل فروش نیست. با کارشناس تماس بگیرید.
          </p>
        ) : liveTotal && !sheetExpired ? (
          <div>
            <p className="text-xs text-text-muted">قیمت نهایی</p>
            <p className="text-[22px] font-bold text-text">
              {liveTotal}
              <span className="mr-1 text-sm font-normal text-text-muted">
                ریال
              </span>
            </p>
            {displayQuote?.vatApplied && displayQuote.vatAmount != null ? (
              <p className="mt-1 text-xs text-text-muted">
                مالیات: {formatMoney(displayQuote.vatAmount)} ریال
              </p>
            ) : null}
            {showQtySplit && eng && quantity != null ? (
              <div className="mt-2 space-y-0.5 text-xs text-text-muted">
                <p>
                  مهندسی: {formatFaNumber(eng.quantity)}
                  {eng.unit ? ` ${eng.unit}` : ""}
                </p>
                <p>
                  سفارش: {formatFaNumber(quantity)}
                  {selectedUnit ? ` ${selectedUnit.unit}` : ""}
                </p>
                {displayQuote.payableQuantity != null ? (
                  <p>
                    قابل پرداخت:{" "}
                    {formatFaNumber(displayQuote.payableQuantity)}
                  </p>
                ) : null}
              </div>
            ) : displayQuote?.payableQuantity != null &&
              quantity != null &&
              displayQuote.payableQuantity !== quantity ? (
              <p className="mt-1 text-xs text-text-muted">
                مقدار قابل پرداخت:{" "}
                {formatFaNumber(displayQuote.payableQuantity)}
              </p>
            ) : null}
            {displayQuote?.appliedTierId ? (
              <p className="mt-1 text-xs text-text-muted">قیمت پلکانی</p>
            ) : null}
          </div>
        ) : sheetExpired && liveTotal ? (
          <div>
            <p className="text-xs text-text-muted">قیمت نهایی</p>
            <p className="text-[22px] font-bold text-text line-through opacity-50">
              {liveTotal}
              <span className="mr-1 text-sm font-normal text-text-muted">
                ریال
              </span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            قیمت پس از انتخاب واحد و مقدار معتبر نمایش داده می‌شود.
          </p>
        )}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-surface pt-3">
        {unsellable ? (
          <a href={routes.phone.call}>
            <Button type="button" variant="accent" fullWidth>
              تماس با کارشناس
            </Button>
          </a>
        ) : sheetExpired ? (
          <Button
            type="button"
            variant="accent"
            fullWidth
            onClick={refreshQuote}
          >
            بروزرسانی قیمت
          </Button>
        ) : (
          <Button
            type="button"
            variant="accent"
            fullWidth
            disabled={!canAdd}
            onClick={handleAdd}
          >
            {pending ? "افزودن…" : "افزودن به سبد"}
          </Button>
        )}
      </div>
    </div>
  );
}
