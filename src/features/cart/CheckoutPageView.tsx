"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { formatPrice, parsePrice } from "@/lib/format";
import { useCart } from "@/providers/CartProvider";
import { Input, Textarea } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function CheckoutPageView() {
  const { cartItems, getTotalPrice, getTotalItems, clearCart } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert("سبد خرید شما خالی است. لطفاً ابتدا محصولی اضافه کنید.");
      router.push(routes.products.list);
      return;
    }

    alert(`
      سفارش شما با موفقیت ثبت شد (mock)!
      
      اطلاعات ارسال:
      نام: ${formData.fullName}
      تلفن: ${formData.phone}
      آدرس: ${formData.address}
      شهر: ${formData.city}
      کدپستی: ${formData.postalCode}
      
      جمع مبلغ: ${formatPrice(getTotalPrice())} تومان
      تعداد اقلام: ${getTotalItems()}
      
      کارشناس با شما تماس می‌گیرد.
    `);

    clearCart();
    router.push(routes.home);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          سبد خرید خالی است
        </h1>
        <p className="mb-6 text-gray-600">
          برای تسویه حساب ابتدا محصولی به سبد خرید اضافه کنید.
        </p>
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
        تسویه حساب
      </h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-6 text-xl font-bold">اطلاعات ارسال</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="نام و نام خانوادگی *"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <Input
              label="تلفن همراه *"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="شهر *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <Textarea
              label="آدرس کامل *"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              required
            />
            <Input
              label="کد پستی"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
            <Button type="submit" variant="success" fullWidth className="py-3 text-lg font-semibold">
              ثبت سفارش نهایی
            </Button>
          </form>
        </div>

        <div className="h-fit rounded-xl bg-white p-6 shadow-md lg:w-96">
          <h2 className="mb-4 text-xl font-bold">خلاصه سفارش</h2>
          <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border-b pb-2 text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  {formatPrice(
                    (item.lockedPrice ?? parsePrice(item.price)) *
                      item.quantity,
                  )}{" "}
                  تومان
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t py-2 text-lg font-bold">
            <span>جمع کل:</span>
            <span>{formatPrice(getTotalPrice())} تومان</span>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            پس از ثبت سفارش، کارشناسان ما با شما تماس خواهند گرفت.
          </p>
        </div>
      </div>
    </div>
  );
}
