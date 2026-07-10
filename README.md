# هایپر آهن — فرانت‌اند (Next.js)

فروشگاه آنلاین آهن‌آلات — مهاجرت‌شده از Vite/React به **Next.js App Router + TypeScript**.

## اجرا

```bash
npm install
npm run dev
```

باز کردن: [http://localhost:3000](http://localhost:3000)

## ساختار

```
src/
  app/           # مسیرها و layout
  features/      # واحدهای کسب‌وکار (layout, home, catalog, cart, auth, content)
  shared/ui/     # کامپوننت‌های عمومی
  services/      # قرارداد داده (فعلاً mock)
  mocks/         # داده نمونه
  lib/           # routes, storage, format, api-client
  config/        # site + nav
  providers/     # Cart و ...
  types/         # تایپ‌های دامنه
```

قوانین توسعه: [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md)

## فاز بعد

اتصال به API طبق [`docs/frontend-integration.md`](docs/frontend-integration.md) — فقط لایه `services/*` عوض می‌شود.
