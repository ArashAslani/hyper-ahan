"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/providers/CartProvider";
import { EmptyState } from "@/shared/ui/EmptyState";
import { CartSummaryBar } from "@/shared/ui/CartSummaryBar";
import { Button } from "@/shared/ui/Button";

export function CartPageView() {
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
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

  return (
    <div className="px-4 py-4 pb-36">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-text">سبد خرید</h1>
        <Button variant="ghost" className="text-danger" onClick={clearCart}>
          خالی کردن
        </Button>
      </div>

      <ul className="space-y-3">
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 rounded-[var(--radius-lg)] bg-surface p-3 shadow-[var(--shadow-soft)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 rounded-[var(--radius-sm)] object-cover"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-bold text-text">{item.name}</h3>
              <p className="text-xs text-text-muted">{item.factoryName}</p>
              <p className="mt-1 font-bold text-accent">{item.price} تومان</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-bg text-lg"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="کاهش"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-bg text-lg"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="افزایش"
                >
                  +
                </button>
                <button
                  type="button"
                  className="mr-auto text-sm text-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  حذف
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-center text-sm text-text-muted">
        جمع موقت: {formatPrice(getTotalPrice())} تومان
      </p>
      <Link
        href={routes.products.list}
        className="mt-2 block text-center text-sm text-accent"
      >
        ادامه خرید
      </Link>

      <CartSummaryBar
        totalItems={getTotalItems()}
        totalPrice={getTotalPrice()}
      />
    </div>
  );
}
