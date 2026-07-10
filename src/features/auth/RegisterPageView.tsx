"use client";

import { useState } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function RegisterPageView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("رمز عبور و تأیید آن مطابقت ندارند.");
      return;
    }
    alert(`ثبت‌نام با نام: ${name} و ایمیل: ${email} (فقط mock)`);
  };

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold">ثبت‌نام</h1>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-6 shadow-md"
      >
        <div className="mb-4">
          <Input
            label="نام کامل"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="ایمیل"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            label="رمز عبور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <Input
            label="تأیید رمز عبور"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" fullWidth>
          ثبت‌نام
        </Button>
        <p className="mt-4 text-center text-gray-600">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link href={routes.auth.login} className="text-blue-600">
            ورود
          </Link>
        </p>
      </form>
    </div>
  );
}
