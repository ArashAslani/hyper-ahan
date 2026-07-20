# `src/services/`

**Layer:** Data access boundary
**Governing docs:** `docs/architecture/folder-structure.md`, `docs/api/api-guidelines.md`, `docs/architecture/frontend-blueprint.md`

## Purpose

Data access, request construction, DTO mapping, mock/API switching, error normalization, and caching policy entry points. Services return domain-ready values for the UI. Only services may import `@/mocks/*`.

## Allowed imports

- `@/mocks/*`
- `@/lib/api-client`
- `@/types`
- service-local mappers/utilities

## Forbidden imports

- JSX
- `@/features/*`
- `@/shared/ui/*`
- browser-only UI logic

## Current services (verified compliant)

```text
productService.ts       -> @/mocks/products, @/types
homeService.ts           -> @/mocks/home, @/types
articleService.ts        -> @/mocks/home, @/types
profileService.ts        -> @/mocks/home, @/types
catalogNavService.ts     -> @/mocks/categories, @/mocks/weightCalc, @/types
```

All five files were checked: none import JSX, features, or shared UI. Real API integration (replacing mock calls with `@/lib/api-client`) is gated to **Phase 5 — API Integration Foundation** in `docs/roadmap/project-roadmap.md`.
