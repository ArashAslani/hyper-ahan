# HyperAhan Frontend — Project Snapshot

> Compact implementation context for AI-assisted development. Last updated: 2026-07-20.

---

## 1. Tech Stack

- **Next.js** — 16.2.10 (App Router)
- **React** — 19.2.4
- **TypeScript** — ^5
- **Tailwind CSS** — v4 (`@tailwindcss/postcss`)
- **Typography plugin** — `@tailwindcss/typography` (blog prose)
- **Icons** — Font Awesome 7 (`@fortawesome/react-fontawesome`, solid icons)
- **Forms** — React Hook Form ^7.82
- **Validation** — Zod ^4.4 + `@hookform/resolvers`
- **Carousel** — Swiper ^12
- **HTML sanitization** — `isomorphic-dompurify` (blog body)
- **HTTP** — native `fetch` via `src/lib/api-client.ts` (no axios/react-query)
- **Images** — `next/image` wrapped by `AppImage`
- **State** — React Context (`CartProvider`, `AdminAuthProvider`, `ToastProvider`)
- **Animation** — CSS keyframes only (no Framer Motion)
- **Table library** — none
- **Node** — >=22

---

## 2. Folder Structure

```
src/
  app/
    (auth)/          login, register
    (content)/       about, contact, articles, blog
    (shop)/          products, cart, checkout
    admin/           login, dashboard
    categories/
    orders/
    profile/
    search/
    product-category/
    weight-calc/
  config/            site, nav, sliderGroups
  features/
    admin/           auth, layout, dashboard, login
    auth/            customer login/register/profile views
    cart/            cart, checkout views
    catalog/         product list/detail views
    content/         about, contact, articles, blog
    home/            home page sections
    layout/          SiteShell, TopBar, BottomNav, NavDrawer
    orders/          orders list/detail views
  lib/               api-client, routes, storage, jwt, labels, format, blog*
  mocks/             home, products, categories, weightCalc
  providers/         AppProviders, CartProvider
  services/          API/data layer
  shared/
    ui/              reusable domain-neutral components
  types/             centralized TypeScript types
```

---

## 3. Shared Components

| Component | Description |
|-----------|-------------|
| `AppImage` | Unified image renderer for `FileDto` or string URL; skeleton, fallback, lazy load |
| `Button` | Primary/secondary/outline action button |
| `Input` / `Textarea` | Form text inputs |
| `Card` | Generic surface card wrapper |
| `Modal` | Centered overlay dialog |
| `BottomSheet` | Mobile bottom sheet overlay |
| `Toast` / `ToastProvider` / `useToast` | Toast notifications |
| `Skeleton` / `ProductCardSkeleton` | Loading placeholders |
| `EmptyState` / `ErrorState` / `LoadingState` | Empty/error/loading feedback |
| `Fab` | Floating action button |
| `SearchBar` | Search input with icon |
| `PriceBadge` | Formatted price display |
| `ProductCard` | Product summary card (uses `AppImage`) |
| `CartSummaryBar` | Sticky cart total bar |
| `OrderTimeline` / `Stepper` | Order status stepper |

**Not in shared/ui (feature-local):** Blog cards, pagination, breadcrumbs, category chips, hero sections, admin shell.

---

## 4. Feature Modules

| Module | Status | Notes |
|--------|--------|-------|
| **Blog** | Production Ready | Real backend; `/blog`, `/blog/[slug]`, `/blog/category/[slug]`; SEO, AppImage, skeletons |
| **Slider (Home Hero)** | Production Ready | Real backend via `sliderService`; graceful empty fallback |
| **Home** | Partial | UI complete; slider + latest blog articles from API; categories/prices/products mock |
| **Layout** | Production Ready | SiteShell, TopBar, BottomNav, NavDrawer; admin routes excluded from storefront chrome |
| **Admin Auth** | Partial | Real login API, JWT, protected routes, dashboard placeholder; no blog CRUD yet |
| **Catalog** | Partial | UI complete; `productService` mock; `AppImage` on product cards |
| **Cart** | Partial | Client-side `CartProvider`; mock product data |
| **Checkout** | Partial | UI shell only; no real payment/order API |
| **Orders** | Partial | Mock via `profileService` |
| **Auth (Customer)** | Partial | Login/register UI; no real OTP/JWT flow |
| **Profile** | Partial | Mock user/orders |
| **Content (About/Contact)** | Partial | Static page views |
| **Articles (legacy `/articles`)** | Unused | Old mock article system; superseded by `/blog` |
| **Weight Calculator** | Partial | Placeholder page only |
| **Search** | Partial | Route exists; implementation minimal/mock |

---

## 5. Routing

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/products` | Product list |
| `/products/[id]` | Product detail |
| `/product-category/[slug]` | Category landing |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/login` | Customer login |
| `/register` | Customer register |
| `/profile` | User profile |
| `/orders` | Order list |
| `/orders/[id]` | Order detail |
| `/search` | Search |
| `/categories` | Category browser |
| `/blog` | Blog list/search |
| `/blog/[slug]` | Blog article |
| `/blog/category/[slug]` | Blog category |
| `/articles` | Legacy articles (mock) |
| `/about` | About page |
| `/contact` | Contact page |
| `/weight-calc/[slug]` | Weight calculator placeholder |
| `/admin/login` | Admin login |
| `/admin` | Admin dashboard (protected) |
| `/app` | App download/landing |

---

## 6. Services

| Service | Description |
|---------|-------------|
| `blogService` | Public blog API — list, search, by-slug (200/301/404), categories, latest/most-visited/best, related, adjacent |
| `sliderService` | Public slider groups by slug; degrades to `[]` on error |
| `authService` | Admin login (`POST /api/auth/admin/login`) |
| `homeService` | Home page data — mostly mock (categories, prices, featured products, team, journey) |
| `productService` | Product list/detail — mock |
| `catalogNavService` | Category tree + weight-calc nav items — mock |
| `articleService` | Legacy articles — mock |
| `profileService` | User profile + orders — mock |

**Rule:** DTO → domain mapping happens only inside services (especially `blogService`).

---

## 7. Shared Utilities

| Utility | Path | Purpose |
|---------|------|---------|
| `routes` | `lib/routes.ts` | Centralized route constants and builders |
| `api-client` | `lib/api-client.ts` | `apiFetch`, `apiFetchRaw`, `ApiError`, `unwrapOperationResult` |
| `storage` | `lib/storage.ts` | `localStorage` helpers + `STORAGE_KEYS` |
| `jwt` | `lib/jwt.ts` | Client-side JWT decode/expiry check |
| `labels` | `lib/labels.ts` | Product unit labels, order status labels |
| `format` | `lib/format.ts` | Persian digit conversion, price parse/format |
| `blogContent` | `lib/blogContent.ts` | HTML sanitize, heading extraction, reading time |
| `blogFormat` | `lib/blogFormat.ts` | Blog date format, tag parse, author initials |

**Config:**
- `config/site.ts` — site name, phone, `siteUrl`
- `config/nav.config.ts` — menu nav items
- `config/sliderGroups.ts` — slider group slug map (`homeHero: "home"`)

---

## 8. Global Providers

| Provider | Location | Scope |
|----------|----------|-------|
| `AppProviders` | `providers/AppProviders.tsx` | Root — wraps `CartProvider` + `ToastProvider` |
| `CartProvider` | `providers/CartProvider.tsx` | Client cart state (localStorage) |
| `ToastProvider` | `shared/ui/Toast.tsx` | Toast context |
| `AdminAuthProvider` | `features/admin/auth/AdminAuthProvider.tsx` | Admin layout only — JWT session |
| `SiteShell` | `features/layout/SiteShell.tsx` | Storefront chrome (skipped on `/admin/*`) |

**Not implemented:** React Query, ThemeProvider, customer AuthProvider.

---

## 9. Design System

- **Direction:** RTL (`dir="rtl"`, `lang="fa"`)
- **Font:** Vazirmatn (Google Fonts), weights 400/500/700
- **Colors (CSS vars):**
  - `--color-primary` #1a1a2e
  - `--color-accent` #e67e22
  - `--color-highlight` #f39c12
  - `--color-bg` #f5f5f0
  - `--color-surface` #ffffff
  - `--color-text` #222222
  - `--color-text-muted` #555555
  - `--color-success` #27ae60
  - `--color-danger` #e74c3c
  - `--color-border` #dddddd
- **Spacing:** Tailwind utilities; touch min `--touch-min: 44px`
- **Layout vars:** `--topbar-h: 56px`, `--bottom-nav-h: 64px`
- **Border radius:** `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`
- **Shadows:** `--shadow-soft`, `--shadow-card`
- **Cards:** Rounded lg, surface bg, soft/card shadow, hover lift on interactive cards
- **Buttons:** Accent primary, outline secondary, min touch height, active scale
- **Motion:** `animate-fade-in-up`, sheet-up, cart-bounce, spinner-accent — CSS only
- **Dark mode:** Not implemented
- **Blog prose:** `.blog-prose` with Tailwind typography plugin

---

## 10. Current Backend Integrations

| Module | State | Backend Base |
|--------|-------|--------------|
| **Blog** | Real API | `http://localhost:5062` via `/api` rewrite |
| **Slider** | Real API | Same |
| **Admin Auth** | Real API | `POST /api/auth/admin/login` |
| **File/images (Blog, Slider)** | Real API | `FileDto` with absolute URLs |
| **Home (categories, prices, products)** | Mock | `src/mocks/*` |
| **Catalog/products** | Mock | `src/mocks/products.ts` |
| **Cart/Checkout/Orders** | Mock/local | Client state + mocks |
| **Customer Auth** | Mock | No backend OTP flow |
| **Profile** | Mock | `profileService` |
| **Weight Calculator** | Not implemented | Placeholder page |
| **Catalog nav/categories** | Mock | `catalogNavService` |

**Proxy config (`next.config.ts`):**
- `/api/*` → `http://localhost:5062/api/*`
- `/docs/*` → `http://localhost:5062/docs/*` (legacy path; FileDto uses `/uploads/` absolute URLs)
- Server-side fetch fallback: `API_BASE_URL` or `http://localhost:5062`

---

## 11. Current TODO

Implementation-only (no roadmap/docs):

- Connect **Catalog/products** to real backend + `FileDto` for product images
- Connect **Home** mock sections (categories, daily prices, featured products) to backend
- Implement **customer auth** (OTP login, JWT, protected `/profile`)
- Implement **Cart/Checkout/Orders** against real APIs
- Implement **Weight Calculator** page (currently placeholder)
- **Admin blog CRUD** — posts, categories, SEO, publish, slug change
- Remove or redirect legacy **`/articles`** route (superseded by `/blog`)
- Migrate **`Product.image`** from `string` to `FileDto`
- Replace blog **related products** mock (`homeService.getFeaturedProducts`) with real catalog link
- Add **blog sitemap** route from `GET /api/blog/posts/sitemap`
- Improve **blog adjacent posts** — no dedicated backend endpoint; currently fetches 100-post list

---

## 12. Packages (Runtime)

| Package | Version | Role |
|---------|---------|------|
| `next` | 16.2.10 | Framework |
| `react` / `react-dom` | 19.2.4 | UI |
| `tailwindcss` | ^4 | Styling |
| `@tailwindcss/typography` | ^0.5.20 | Blog prose |
| `@fortawesome/*` | ^7.2 / ^3.3 | Icons |
| `react-hook-form` | ^7.82 | Forms |
| `zod` | ^4.4 | Schema validation |
| `@hookform/resolvers` | ^5.4 | RHF + Zod bridge |
| `swiper` | ^12.1 | Hero carousel |
| `isomorphic-dompurify` | ^3.19 | Blog HTML sanitize |

**Dev (affects workflow):** `eslint` ^9, `eslint-config-next`, `typescript` ^5, `@tailwindcss/postcss` ^4

---

## 13. Project Rules

- **Images:** Use `AppImage` everywhere; consume `FileDto` directly; never concatenate image URLs
- **DTO mapping:** Only in `src/services/*`; components receive mapped domain types
- **HTTP:** No raw `fetch` outside `lib/api-client.ts` (ESLint enforced)
- **Mocks:** Only `src/services/*` may import `@/mocks/*` (ESLint enforced)
- **Boundaries:** `shared/` must not import `features/` or `services/`; `services/` must not import UI
- **Server Components:** Preferred; add `"use client"` only when needed (forms, hooks, browser APIs)
- **Routes:** Use `lib/routes.ts` constants — no hardcoded paths in components
- **Labels:** Centralized in `lib/labels.ts` — no duplicated status/unit strings
- **Blog canonical:** Always `post.slug` — never `canonicalSlug` (that field is for 301 redirect only)
- **Blog slug handling:** 200 render, 301 server redirect, 404 `notFound()` — no client-side redirect for slug changes
- **Blog SEO:** Use `effectiveMetaTitle` / `effectiveMetaDescription` from service-mapped `metaTitle`/`metaDescription`
- **Admin tokens:** Separate storage keys from customer tokens
- **Dynamic pages:** Blog/home use `force-dynamic` or fetch at request time when backend required
- **Mobile-first:** Touch targets >= 44px; storefront max-width container in SiteShell
- **No duplicated UI:** Reuse shared components and existing feature components before creating new ones

---

## 14. Known Technical Debt

- Legacy `/articles` route and `articleService` coexist with production `/blog`
- Most storefront data still mock (`homeService`, `productService`, `profileService`)
- `Product.image` is still `string`, not `FileDto`
- Blog article "related products" uses mock featured products
- Blog prev/next navigation fetches up to 100 posts (no backend adjacent endpoint)
- Legacy layout components (`Footer`, `MobileMenu`, `MobileHeader`) unused alongside new `HomeFooter`/`NavDrawer`
- Customer auth UI exists but no real backend integration
- `/docs/*` rewrite in next.config may be obsolete after FileDto migration to `/uploads/`
- Turbopack dev server can corrupt CSS; workaround: `next dev --webpack`
- `placehold.co` still in `next/image` remotePatterns (legacy fallback)
- Weight calculator is placeholder only

---

## Quick Reference — Key Types

```ts
FileDto = { id, url, thumbnailUrl?, width?, height?, alt? }
BlogPostSummary = { id, slug, title, excerpt, image: FileDto|null, category*, author, publishedAt, ... }
BlogPost = BlogPostSummary + { bodyHtml, headings, metaTitle, metaDescription, canonicalSlug }
PublicSlide = { id, title, description?, image, mobileImage, link, buttonText, ... }
Product = { id, name, price, image: string, unit, stock, ... }  // image not yet FileDto
```

## Quick Reference — Backend Dev URL

- **API:** `http://localhost:5062`
- **Frontend:** `http://localhost:3000`
- **Env:** `NEXT_PUBLIC_SITE_URL`, optional `API_BASE_URL`
