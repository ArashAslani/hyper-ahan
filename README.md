# هایپر آهن — فرانت‌اند (Next.js)

فروشگاه آنلاین آهن‌آلات — **Next.js App Router + TypeScript**، موبایل‌فرست.

## اجرا

```bash
npm install
npm run dev
```

باز کردن: [http://localhost:3000](http://localhost:3000)

ریپو: [github.com/ArashAslani/hyper-ahan](https://github.com/ArashAslani/hyper-ahan)

## ساختار

```
src/
  app/           # مسیرها و layout
  features/      # واحدهای کسب‌وکار
  shared/ui/     # Design System
  services/      # قرارداد داده (فعلاً mock)
  mocks/         # داده نمونه
  lib/           # routes, storage, format, api-client
  config/        # site + nav
  providers/     # Cart, Toast
  types/         # تایپ‌های دامنه
```

## مستندات

| فایل | توضیح |
|------|--------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | معماری، ریپو، سناریوها، قابلیت‌های اپ |
| [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) | قوانین توسعه |
| [`docs/mvp-ahanalat.md`](docs/mvp-ahanalat.md) | محدوده MVP محصول |
| [`docs/frontend-integration.md`](docs/frontend-integration.md) | قرارداد اتصال به بک‌اند |

## فاز بعد

اتصال به API — فقط لایه `services/*` عوض می‌شود.
