"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { setStorageItem, STORAGE_KEYS } from "@/lib/storage";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";

export function LoginPageView() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^09\d{9}$/.test(phone.replace(/\D/g, ""))) {
      showToast("شماره موبایل معتبر وارد کنید (09xxxxxxxxx)", "error");
      return;
    }
    setSent(true);
    showToast("کد تأیید ارسال شد (mock: 12345)", "success");
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 4) {
      showToast("کد تأیید را وارد کنید", "error");
      return;
    }
    setStorageItem(STORAGE_KEYS.user, { name: "کاربر", phone });
    setStorageItem(STORAGE_KEYS.isProfileComplete, false);
    showToast("ورود موفق", "success");
    router.push(routes.profile);
  };

  return (
    <div className="px-4 py-8">
      <h1 className="mb-2 text-center text-xl font-bold text-text">ورود</h1>
      <p className="mb-6 text-center text-sm text-text-muted">
        با شماره موبایل وارد شوید؛ کارشناس بعداً با شما هماهنگ می‌کند.
      </p>

      {!sent ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <Input
            label="شماره موبایل"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" fullWidth>
            دریافت کد تأیید
          </Button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-4">
          <p className="text-center text-sm text-text-muted">کد به {phone}</p>
          <Input
            label="کد تأیید"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <Button type="submit" fullWidth>
            تأیید و ورود
          </Button>
          <Button type="button" variant="ghost" fullWidth onClick={() => setSent(false)}>
            تغییر شماره
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-text-muted">
        حساب ندارید؟{" "}
        <Link href={routes.auth.register} className="font-medium text-accent">
          ثبت‌نام
        </Link>
      </p>
    </div>
  );
}
