"use client";

import { useState } from "react";
import { Input, Textarea } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useToast } from "@/shared/ui/Toast";

export function ContactPageView() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("پیام شما ثبت شد (mock)", "success");
    setFormData({ name: "", phone: "", message: "" });
  };

  return (
    <div className="px-4 py-6">
      <h1 className="mb-2 text-xl font-bold text-text">تماس با ما</h1>
      <p className="mb-6 text-sm text-text-muted">
        سوال دارید؟ پیام بگذارید یا مستقیم تماس بگیرید.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="نام"
          name="name"
          value={formData.name}
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
        <Textarea
          label="پیام"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          required
        />
        <Button type="submit" fullWidth>
          ارسال
        </Button>
      </form>
    </div>
  );
}
