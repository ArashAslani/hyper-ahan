"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/shared/ui/Button";

export function CartPageView() {
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
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          سبد خرید خالی است
        </h1>
        <p className="mb-6 text-gray-600">محصولی به سبد خرید اضافه نکرده‌اید.</p>
        <Link
          href={routes.products.list}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        سبد خرید
      </h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-4 rounded-xl bg-white p-4 shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-sm text-gray-600">سایز: {item.size}</p>
                <p className="font-bold text-blue-600">{item.price} تومان</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-full bg-gray-200 hover:bg-gray-300"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700"
                aria-label="حذف"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl bg-white p-6 shadow-md lg:w-80">
          <h2 className="mb-4 text-xl font-bold">خلاصه سفارش</h2>
          <div className="flex justify-between border-b py-2">
            <span>تعداد اقلام:</span>
            <span>{getTotalItems()} عدد</span>
          </div>
          <div className="flex justify-between border-b py-2 text-lg font-bold">
            <span>جمع کل:</span>
            <span>{formatPrice(getTotalPrice())} تومان</span>
          </div>
          <div className="mt-6 space-y-3">
            <Link
              href={routes.checkout}
              className="block w-full rounded-lg bg-blue-600 py-3 text-center text-white transition hover:bg-blue-700"
            >
              تسویه حساب
            </Link>
            <Button variant="danger" fullWidth onClick={clearCart}>
              خالی کردن سبد خرید
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
