"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { useCart } from "@/providers/CartProvider";
import {
  QUOTE_CART_LINE_STATE_LABEL,
  cartHasPricedCheckoutBlockers,
  formatQuoteValidityLabel,
  getQuoteCartEngineeringRef,
  getQuoteCartLineState,
  parseEngineeringCartRef,
  quoteCartLineKey,
} from "@/types/quoteCart";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";

/** Align with AddToCartSheet — Pricing amounts shown as ریال (fa-IR). */
function formatLineMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${new Intl.NumberFormat("fa-IR").format(value)} ریال`;
}

/**
 * Quote review only — no Ordering backend yet.
 * Does not create orders, clear the cart, or claim success.
 */
export function CheckoutPageView() {
  const { items, getApproximateTotal } = useCart();
  const router = useRouter();
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  if (items.length === 0) {
    return (
      <EmptyState
        title="سبد خالی است"
        description="برای بررسی استعلام ابتدا محصول اضافه کنید."
        actionLabel="محصولات"
        onAction={() => router.push(routes.products.list)}
      />
    );
  }

  const estimate = getApproximateTotal();
  const checkoutBlocked = cartHasPricedCheckoutBlockers(items, nowMs);

  if (checkoutBlocked) {
    return (
      <div className="px-4 py-4 pb-8">
        <h1 className="mb-4 text-xl font-bold text-text">بررسی استعلام</h1>
        <div className="rounded-[var(--radius-lg)] border border-danger/30 bg-danger/5 p-4">
          <p className="font-bold text-danger">
            بررسی با استعلام فعلی ممکن نیست
          </p>
          <p className="mt-2 text-sm text-text-muted">
            یک یا چند قلم سبد منقضی، نامعتبر یا غیرقابل فروش است. به سبد
            برگردید و «استعلام مجدد قیمت» بزنید. ثبت سفارش تا اتصال Ordering
            فعال نیست.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-text">
            {items.map((item) => {
              const state = getQuoteCartLineState(item, nowMs);
              if (state === "quoted") return null;
              return (
                <li key={quoteCartLineKey(item)}>
                  {item.displayName}: {QUOTE_CART_LINE_STATE_LABEL[state]}
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <Button fullWidth onClick={() => router.push(routes.cart)}>
              بازگشت به سبد
            </Button>
            <a href={routes.phone.call} className="block">
              <Button type="button" variant="outline" fullWidth>
                تماس با کارشناس
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-8">
      <h1 className="mb-4 text-xl font-bold text-text">بررسی استعلام</h1>

      <div className="mb-4 rounded-[var(--radius-md)] border border-border bg-bg px-3 py-3">
        <p className="text-sm text-text">
          این صفحه فقط مرور استعلام سبد است. ثبت سفارش / درخواست رسمی تا اتصال
          بک‌اند Ordering فعال نیست.
        </p>
        <p className="mt-1 text-xs text-text-muted">
          اعتبار موقت هر قلم حدود ۳۰ دقیقه است؛ برای قطعی شدن با کارشناس هماهنگ
          کنید.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
        <h2 className="mb-2 font-bold text-text">خلاصه استعلام</h2>
        <ul className="mb-3 space-y-3 text-sm">
          {items.map((item) => {
            const eng = parseEngineeringCartRef(
              getQuoteCartEngineeringRef(item),
            );
            const validity = formatQuoteValidityLabel(item.expiresAt, nowMs);
            return (
              <li
                key={quoteCartLineKey(item)}
                className="border-b border-border/60 pb-2 last:border-0 last:pb-0"
              >
                <div className="flex justify-between gap-2">
                  <span className="font-medium text-text">
                    {item.displayName} × {item.quantity}{" "}
                    <span className="text-text-muted">
                      ({item.orderUnitLabel})
                    </span>
                  </span>
                  <span className="shrink-0 text-accent">
                    {formatLineMoney(item.quote?.finalPrice)}
                  </span>
                </div>
                {validity ? (
                  <p className="mt-0.5 text-xs text-text-muted">{validity}</p>
                ) : null}
                {eng ? (
                  <p className="mt-0.5 text-xs text-accent">
                    از ماشین‌حساب ·{" "}
                    {new Intl.NumberFormat("fa-IR").format(eng.quantity)}
                    {eng.unit ? ` ${eng.unit}` : ""}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="text-lg font-bold text-accent">
          جمع تقریبی: {new Intl.NumberFormat("fa-IR").format(estimate)} ریال
        </p>
        <p className="mt-1 text-xs text-text-muted">
          جمع تقریبی استعلام است؛ مبلغ نهایی پس از هماهنگی کارشناس مشخص می‌شود.
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <a href={routes.phone.call} className="block">
          <Button type="button" variant="accent" fullWidth>
            تماس با کارشناس
          </Button>
        </a>
        <Button
          type="button"
          variant="outline"
          fullWidth
          onClick={() => router.push(routes.cart)}
        >
          بازگشت به سبد
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-text-muted">
        دکمه ثبت سفارش غیرفعال است تا سرویس Ordering آماده شود.
      </p>
    </div>
  );
}
