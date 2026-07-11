# قراردادهای توسعه — HyperAhan (Next.js)

این سند قوانین اجباری پروژه است. قبل از هر PR و هنگام کار با ایجنت AI به آن پایبند باشید.

## معماری لایه‌ها

| لایه | مسیر | مجاز است | ممنوع |
|------|------|----------|--------|
| App | `src/app/` | routing، layout، metadata، فراخوانی service | منطق دامنه، fetch خام، mock مستقیم |
| Features | `src/features/*` | UI و hooks دامنه | import از `mocks/*`، رشته مسیر خام |
| Shared UI | `src/shared/ui` | کامپوننت‌های عمومی بدون دامنه | منطق سبد/auth/سفارش |
| Services | `src/services/*` | قرارداد داده (mock یا API) | JSX |
| Mocks | `src/mocks/*` | داده نمونه | import از UI/features |
| Lib | `src/lib/*` | routes، storage، format، api-client | UI |

**قانون طلایی:** صفحه و کامپوننت UI هرگز `fetch` یا شکل پاسخ API را نمی‌شناسد؛ فقط از `services` و تایپ‌های دامنه استفاده می‌کند.

## مسیرها

- همهٔ مسیرها فقط از `src/lib/routes.ts`
- مثال: `routes.products.detail(id)` — نه `href="/products/1"`

## Storage

- کلیدها فقط از `src/lib/storage.ts`
- نام‌ها با پیشوند `ha_` (هم‌تراز با `frontend-integration.md`)

## داده

- UI → `productService.getById` و مشابه
- تعویض mock به API فقط داخل `services/*` انجام می‌شود

## Client / Server

- `'use client'` فقط برای state، event، browser API
- صفحات لیست/جزئیات ترجیحاً Server Component + داده از service

## نام‌گذاری

- کامپوننت: `PascalCase.tsx`
- util/service: `camelCase.ts`
- export نام‌دار برای shared/features؛ default فقط برای `page.tsx` / `layout.tsx`

## ناوبری

- Bottom Nav و لینک‌های فوتر از `src/config/nav.config.ts`
- Shell: `TopBar` (۵۶px) + `BottomNav` — نه هدر دو‌ردیفه قدیمی

## استایل و Design Tokens

- توکن‌ها در `src/app/globals.css` (`--color-primary`, `--color-accent`, …)
- فونت: Vazirmatn (۴۰۰/۵۰۰/۷۰۰)
- کلاس‌های رنگ: `bg-primary`, `text-accent`, `bg-surface`, `text-text-muted` — از `blue-*` استفاده نکنید
- کامپوننت‌های UI در `src/shared/ui` (Button, ProductCard, BottomSheet, …)
- touch target حداقل ۴۴px؛ mobile-first با `max-w-xl` centered
- بدون `console.log` دیباگ در کد اصلی

## چک‌لیست قبل از PR

- [ ] مسیر از `routes` است؟
- [ ] داده از `services` است؟
- [ ] mock مستقیم در UI نیست؟
- [ ] `'use client'` فقط در صورت نیاز؟
- [ ] کلید storage از `storage` است؟
- [ ] رنگ‌ها از توکن‌هاست (نه blue خام)؟
