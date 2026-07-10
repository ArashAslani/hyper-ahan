"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { setStorageItem, STORAGE_KEYS } from "@/lib/storage";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function LoginPageView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStorageItem(STORAGE_KEYS.user, { name: "کاربر تست" });
    alert("ورود موفق (mock)");
    router.push(routes.home);
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold">ورود به حساب</h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-6 shadow-md"
      >
        <div className="mb-4">
          <Input
            label="ایمیل یا نام کاربری"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" fullWidth>
          ورود
        </Button>
        <p className="mt-4 text-center text-gray-600">
          حساب ندارید؟{" "}
          <Link href={routes.auth.register} className="text-blue-600">
            ثبت‌نام کنید
          </Link>
        </p>
      </form>
    </div>
  );
}
