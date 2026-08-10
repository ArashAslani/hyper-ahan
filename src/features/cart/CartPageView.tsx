"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { useCart } from "@/providers/CartProvider";
import {
  QUOTE_CART_LINE_STATE_LABEL,
  cartHasPricedCheckoutBlockers,
  formatQuoteValidityLabel,
  getQuoteCartEngineeringRef,
  parseEngineeringCartRef,
  quoteCartLineKey,
  quoteCartLineNeedsRequote,
  resolveQuoteCartLineState,
  type QuoteCartItem,
  type QuoteCartLineState,
} from "@/types/quoteCart";
import { EmptyState } from "@/shared/ui/EmptyState";
import { CartSummaryBar } from "@/shared/ui/CartSummaryBar";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";

type PriceDrift = {
  previousFinalPrice: number | null;
  nextFinalPrice: number | null;
};

/** Align with AddToCartSheet — Pricing amounts shown as ریال (fa-IR). */
function formatLineMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

function LineStateBadge({ state }: { state: QuoteCartLineState }) {
  const tone =
    state === "quoted"
      ? "bg-success/10 text-success"
      : state === "expired"
        ? "bg-danger/10 text-danger"
        : state === "stale_qty"
          ? "bg-highlight/20 text-text"
          : state === "error"
            ? "bg-danger/10 text-danger"
            : state === "unsellable"
              ? "bg-danger/10 text-danger"
              : "bg-highlight/15 text-text";

  return (
    <span
      className={`mt-1 inline-block rounded-[var(--radius-sm)] px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      {QUOTE_CART_LINE_STATE_LABEL[state]}
    </span>
  );
}

function EngineeringOriginChip({
  item,
}: {
  item: Pick<QuoteCartItem, "engineeringRef" | "calculationRef">;
}) {
  const ref = getQuoteCartEngineeringRef(item);
  const parsed = parseEngineeringCartRef(ref);
  if (!ref || !parsed) return null;

  const qtyLabel = new Intl.NumberFormat("fa-IR").format(parsed.quantity);
  const detail = parsed.unit
    ? `${qtyLabel} ${parsed.unit}`
    : qtyLabel;

  return (
    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
      از ماشین‌حساب
      <span className="text-text-muted">· {detail}</span>
    </span>
  );
}

export function CartPageView() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    items,
    remove,
    updateQuantity,
    getApproximateTotal,
    getTotalItems,
    clearCart,
    requoteLine,
    requoteAllNeedingRefresh,
  } = useCart();

  const [nowMs, setNowMs] = useState(() => Date.now());
  const [lineErrors, setLineErrors] = useState<Record<string, boolean>>({});
  const [pendingKeys, setPendingKeys] = useState<Record<string, boolean>>({});
  const [bulkPending, setBulkPending] = useState(false);
  const [driftByKey, setDriftByKey] = useState<Record<string, PriceDrift>>({});

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  const lineStates = useMemo(() => {
    const map = new Map<string, QuoteCartLineState>();
    for (const item of items) {
      const key = quoteCartLineKey(item);
      map.set(
        key,
        resolveQuoteCartLineState(item, {
          hasError: Boolean(lineErrors[key]),
          nowMs,
        }),
      );
    }
    return map;
  }, [items, lineErrors, nowMs]);

  const needsRefreshCount = useMemo(() => {
    let count = 0;
    for (const state of lineStates.values()) {
      if (quoteCartLineNeedsRequote(state)) count += 1;
    }
    return count;
  }, [lineStates]);

  const checkoutBlocked = cartHasPricedCheckoutBlockers(items, nowMs);

  const setPending = (key: string, pending: boolean) => {
    setPendingKeys((prev) => {
      if (pending) return { ...prev, [key]: true };
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleRequote = async (item: QuoteCartItem) => {
    const key = quoteCartLineKey(item);
    setPending(key, true);
    try {
      const result = await requoteLine(item.productId, item.orderUnitId);
      setLineErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      setDriftByKey((prev) => ({
        ...prev,
        [key]: {
          previousFinalPrice: result.previousFinalPrice,
          nextFinalPrice: result.nextFinalPrice,
        },
      }));
      if (result.state === "quoted") {
        showToast("استعلام قیمت به‌روز شد", "success");
      } else if (result.state === "unsellable") {
        showToast("این قلم فعلاً قابل فروش نیست", "error");
      } else {
        showToast("استعلام انجام شد؛ وضعیت قلم را بررسی کنید", "error");
      }
    } catch (e: unknown) {
      setLineErrors((prev) => ({ ...prev, [key]: true }));
      showToast(
        e instanceof Error ? e.message : "خطا در استعلام مجدد قیمت",
        "error",
      );
    } finally {
      setPending(key, false);
    }
  };

  const handleRequoteAll = async () => {
    setBulkPending(true);
    try {
      const results = await requoteAllNeedingRefresh();
      setLineErrors({});
      setDriftByKey((prev) => {
        const next = { ...prev };
        for (const result of results) {
          const key = quoteCartLineKey(result);
          next[key] = {
            previousFinalPrice: result.previousFinalPrice,
            nextFinalPrice: result.nextFinalPrice,
          };
        }
        return next;
      });
      showToast(
        results.length > 0
          ? `${results.length} قلم استعلام شد`
          : "قلمی برای به‌روزرسانی نبود",
        "success",
      );
    } catch (e: unknown) {
      showToast(
        e instanceof Error ? e.message : "خطا در به‌روزرسانی قیمت‌ها",
        "error",
      );
    } finally {
      setBulkPending(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        title="سبد خرید خالی است"
        description="محصول مورد نظرتان را اضافه کنید."
        actionLabel="مشاهده محصولات"
        onAction={() => router.push(routes.products.list)}
        icon="🛒"
      />
    );
  }

  const estimate = getApproximateTotal();

  return (
    <div className="px-4 py-4 pb-36">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">سبد خرید</h1>
        <Button variant="ghost" className="text-danger" onClick={clearCart}>
          خالی کردن
        </Button>
      </div>

      <p className="mb-4 text-xs text-text-muted">
        این سبد «استعلام موقت» است (حدود ۳۰ دقیقه اعتبار). سفارش قطعی تا اتصال
        Ordering ثبت نمی‌شود.
      </p>

      {checkoutBlocked ? (
        <div className="mb-4 rounded-[var(--radius-md)] border border-danger/30 bg-danger/5 px-3 py-3">
          <p className="text-sm text-danger">
            برخی اقلام استعلام معتبر ندارند. قبل از بررسی، استعلام مجدد کنید.
          </p>
          {needsRefreshCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="mt-2 w-full"
              disabled={bulkPending}
              onClick={handleRequoteAll}
            >
              {bulkPending ? "در حال به‌روزرسانی…" : "استعلام مجدد همه"}
            </Button>
          ) : null}
        </div>
      ) : null}

      <ul className="space-y-3">
        {items.map((item) => {
          const key = quoteCartLineKey(item);
          const state = lineStates.get(key) ?? "stale_qty";
          const pending = Boolean(pendingKeys[key]);
          const drift = driftByKey[key];
          const showRequote = quoteCartLineNeedsRequote(state);
          const lineTotal = item.quote?.finalPrice;
          const struckPrice =
            state === "stale_qty"
              ? (item.lastKnownFinalPrice ?? null)
              : state !== "quoted" && item.quote?.finalPrice != null
                ? item.quote.finalPrice
                : null;
          const validity =
            state === "quoted"
              ? formatQuoteValidityLabel(item.expiresAt, nowMs)
              : null;

          return (
            <li
              key={key}
              className="flex gap-3 rounded-[var(--radius-lg)] bg-surface p-3 shadow-[var(--shadow-soft)]"
            >
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-bold text-text">
                  {item.displayName}
                </h3>
                <p className="text-xs text-text-muted">{item.orderUnitLabel}</p>
                <div className="flex flex-wrap gap-1">
                  <LineStateBadge state={state} />
                  <EngineeringOriginChip item={item} />
                </div>

                {state === "quoted" && !drift ? (
                  <p className="mt-1 font-bold text-accent">
                    {formatLineMoney(lineTotal)}
                  </p>
                ) : null}

                {validity ? (
                  <p className="mt-0.5 text-xs text-text-muted">{validity}</p>
                ) : null}

                {struckPrice != null ? (
                  <p className="mt-1 text-sm text-text-muted line-through opacity-60">
                    {formatLineMoney(struckPrice)}
                    {state === "stale_qty" ? (
                      <span className="mr-1 no-underline opacity-100">
                        (قبلی)
                      </span>
                    ) : null}
                  </p>
                ) : null}

                {state === "stale_qty" && struckPrice == null ? (
                  <p className="mt-1 text-sm text-text-muted">
                    قیمت قبلی در دسترس نیست — استعلام مجدد لازم است
                  </p>
                ) : null}

                {drift ? (
                  <div className="mt-2 rounded-[var(--radius-md)] bg-bg px-3 py-2">
                    <p className="text-sm font-medium text-text">
                      استعلام جدید اعمال شد
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {formatLineMoney(drift.previousFinalPrice)}
                      <span className="mx-1">→</span>
                      {formatLineMoney(drift.nextFinalPrice)}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-1 h-9 px-2 text-sm"
                      onClick={() =>
                        setDriftByKey((prev) => {
                          const next = { ...prev };
                          delete next[key];
                          return next;
                        })
                      }
                    >
                      متوجه شدم
                    </Button>
                  </div>
                ) : null}

                {showRequote ? (
                  <div className="mt-2 flex flex-col gap-2">
                    {state === "unsellable" ? (
                      <>
                        <a href={routes.phone.call} className="block">
                          <Button type="button" variant="accent" fullWidth>
                            تماس با کارشناس
                          </Button>
                        </a>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={pending || bulkPending}
                          onClick={() => handleRequote(item)}
                        >
                          {pending ? "در حال استعلام…" : "استعلام مجدد قیمت"}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={pending || bulkPending}
                          onClick={() => handleRequote(item)}
                        >
                          {pending ? "در حال استعلام…" : "استعلام مجدد قیمت"}
                        </Button>
                        {(state === "unavailable" || state === "error") && (
                          <a href={routes.phone.call} className="block">
                            <Button type="button" variant="ghost" fullWidth>
                              تماس با کارشناس
                            </Button>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                ) : null}

                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-bg text-lg"
                    onClick={() => {
                      updateQuantity(
                        item.productId,
                        item.orderUnitId,
                        item.quantity - 1,
                      );
                      setDriftByKey((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                      setLineErrors((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                    }}
                    aria-label="کاهش"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-bg text-lg"
                    onClick={() => {
                      updateQuantity(
                        item.productId,
                        item.orderUnitId,
                        item.quantity + 1,
                      );
                      setDriftByKey((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                      setLineErrors((prev) => {
                        const next = { ...prev };
                        delete next[key];
                        return next;
                      });
                    }}
                    aria-label="افزایش"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="mr-auto text-sm text-danger"
                    onClick={() => remove(item.productId, item.orderUnitId)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-center text-sm text-text-muted">
        جمع تقریبی: {new Intl.NumberFormat("fa-IR").format(estimate)} ریال
        {checkoutBlocked ? " (فقط اقلام با استعلام معتبر)" : ""}
      </p>
      <Link
        href={routes.products.list}
        className="mt-2 block text-center text-sm text-accent"
      >
        ادامه خرید
      </Link>

      {!checkoutBlocked ? (
        <CartSummaryBar
          totalItems={getTotalItems()}
          totalPrice={estimate}
          ctaLabel="بررسی استعلام"
        />
      ) : (
        <CartSummaryBar
          totalItems={getTotalItems()}
          totalPrice={estimate}
          ctaLabel="استعلام مجدد لازم است"
          ctaDisabled
        />
      )}
    </div>
  );
}
