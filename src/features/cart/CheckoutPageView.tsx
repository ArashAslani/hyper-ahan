"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { formatPrice, parsePrice } from "@/lib/format";
import { useCart } from "@/providers/CartProvider";
import { useToast } from "@/shared/ui/Toast";
import { Input, Textarea } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { Stepper } from "@/shared/ui/OrderTimeline";
import { EmptyState } from "@/shared/ui/EmptyState";

export function CheckoutPageView() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [agreement, setAgreement] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    nationalId: "",
    address: "",
    city: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="سبد خالی است"
        description="برای تسویه ابتدا محصول اضافه کنید."
        actionLabel="محصولات"
        onAction={() => router.push(routes.products.list)}
      />
    );
  }

  const submit = () => {
    if (!agreement) {
      showToast("پذیرش توافق‌نامه الزامی است", "error");
      return;
    }
    showToast("سفارش ثبت شد؛ کارشناس با شما تماس می‌گیرد.", "success");
    clearCart();
    router.push(routes.orders.list);
  };

  return (
    <div className="px-4 py-4 pb-8">
      <h1 className="mb-4 text-xl font-bold text-text">تسویه حساب</h1>
      <Stepper
        steps={["اطلاعات", "آدرس", "تأیید"]}
        current={step}
      />

      {step === 0 ? (
        <div className="space-y-3">
          <Input
            label="نام و نام خانوادگی"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <Input
            label="موبایل"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Input
            label="کد ملی"
            name="nationalId"
            value={formData.nationalId}
            onChange={handleChange}
            required
          />
          <Button fullWidth onClick={() => setStep(1)}>
            ادامه
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-3">
          <Input
            label="شهر"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
          <Textarea
            label="آدرس تخلیه"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            required
          />
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={() => setStep(0)}>
              قبلی
            </Button>
            <Button fullWidth onClick={() => setStep(2)}>
              ادامه
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
            <h2 className="mb-2 font-bold text-text">خلاصه سفارش</h2>
            <ul className="mb-3 space-y-2 text-sm">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    {formatPrice(
                      (item.lockedPrice ?? parsePrice(item.price)) *
                        item.quantity,
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-lg font-bold text-accent">
              جمع: {formatPrice(getTotalPrice())} تومان
            </p>
          </div>

          <label className="flex min-h-[var(--touch-min)] items-start gap-3 rounded-[var(--radius-md)] bg-surface p-3 text-sm">
            <input
              type="checkbox"
              checked={agreement}
              onChange={(e) => setAgreement(e.target.checked)}
              className="mt-1 h-5 w-5 accent-[var(--color-accent)]"
            />
            <span className="text-text-muted">
              توافق‌نامه خرید کارشناسی (نسخه v1) را می‌پذیرم. قیمت تا ۳۰ دقیقه
              قفل است و تسویه نهایی پس از هماهنگی کارشناس انجام می‌شود.
            </span>
          </label>

          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={() => setStep(1)}>
              قبلی
            </Button>
            <Button fullWidth onClick={submit}>
              ثبت سفارش
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
