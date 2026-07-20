# `src/features/catalog/`

**Module (per `docs/architecture/module-map.md`):** Catalog Module
**Purpose:** Product lists, product details, and category browsing. Backs `src/app/(shop)/products`, `src/app/product-category/[slug]`, and `src/app/categories`.

## Current files

```text
ProductListView.tsx
ProductDetailView.tsx
```

## Allowed imports

- `@/shared/ui/*` (e.g. `ProductCard`, `PriceBadge`), `@/services/*` (`productService`, `catalogNavService`), `@/lib/*`, `@/config/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
- other features' private internals

## Note

`docs/architecture/shared-components-map.md` documents `ProductCard` as catalog-owned. It currently lives in `src/shared/ui/` — see `src/shared/ui/README.md` for the flagged ambiguity.
