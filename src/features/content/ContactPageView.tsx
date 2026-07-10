"use client";

import { useState } from "react";
import { Input, Textarea } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function ContactPageView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
    alert(
      `پیام شما با موفقیت دریافت شد (mock)\nنام: ${formData.name}\nایمیل: ${formData.email}\nموضوع: ${formData.subject}\nپیام: ${formData.message}`,
    );
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        تماس با ما
      </h1>
      <div className="rounded-xl bg-white p-6 shadow-md md:p-8">
        <p className="mb-6 text-center text-gray-600">
          برای ارسال سوال، انتقاد یا پیشنهاد خود، فرم زیر را پر کنید. کارشناسان
          ما در اسرع وقت با شما تماس می‌گیرند.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="نام و نام خانوادگی *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="ایمیل *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="موضوع *"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
          <Textarea
            label="پیام شما *"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            required
          />
          <Button type="submit" fullWidth className="py-3 text-lg font-semibold">
            ارسال پیام
          </Button>
        </form>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-gray-600">
          <p>آدرس: تهران، خیابان ولیعصر، پلاک ۱۲۳، طبقه ۵</p>
          <p>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸ | ایمیل: info@ironmarket.com</p>
          <p>ساعات پاسخگویی: شنبه تا پنجشنبه ۹ صبح تا ۵ عصر</p>
        </div>
      </div>
    </div>
  );
}
