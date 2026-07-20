# `src/app/`

**Layer:** Next.js App Router
**Governing docs:** `docs/architecture/folder-structure.md`, `docs/architecture/frontend-blueprint.md`, `docs/architecture/frontend-architecture.md`

## Purpose

Owns routes, layouts, route groups, route metadata, and server/client composition. This is the only folder Next.js treats as routing.

## Owns

- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- route groups: `(auth)`, `(shop)`, `(content)`
- route-level metadata generation

## Allowed imports

- `@/features/*`
- `@/services/*`
- `@/lib/*`
- `@/config/*`
- `@/types`
- `@/providers/*`

## Forbidden imports

- `@/mocks/*`
- another route's private implementation
- raw `fetch` outside services

## Current structure

```text
src/app/layout.tsx                          root layout (AppProviders + SiteShell)
src/app/page.tsx                             homepage
src/app/(auth)/login, register/page.tsx
src/app/(shop)/products, products/[id], cart, checkout/page.tsx
src/app/(content)/about, contact, articles, articles/[id]/page.tsx
src/app/categories/page.tsx
src/app/orders/, orders/[id]/page.tsx
src/app/profile/page.tsx
src/app/search/page.tsx
src/app/product-category/[slug]/page.tsx
src/app/weight-calc/[slug]/page.tsx
```

## Example

```tsx
import { ProductDetailView } from "@/features/catalog/ProductDetailView";
import { productService } from "@/services/productService";
```

Pages should orchestrate; they should not become feature modules.
