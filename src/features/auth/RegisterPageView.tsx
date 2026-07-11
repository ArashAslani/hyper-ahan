"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/routes";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";

export function RegisterPageView() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("ثبت‌نام mock انجام شد؛ وارد شوید", "success");
    router.push(routes.auth.login);
  };

  return (
    <div className="px-4 py-8">
      <h1 className="mb-6 text-center text-xl font-bold text-text">ثبت‌نام</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="نام کامل"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="موبایل"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Button type="submit" fullWidth>
          ادامه
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-muted">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href={routes.auth.login} className="font-medium text-accent">
          ورود
        </Link>
      </p>
    </div>
  );
}
