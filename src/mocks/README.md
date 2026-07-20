# `src/mocks/`

**Layer:** Temporary development data
**Governing docs:** `docs/architecture/folder-structure.md`, `docs/architecture/state-management.md`

## Purpose

Temporary sample data used until real API endpoints are connected (**Phase 5 — API Integration Foundation**). Only `src/services/*` may import from here.

## Allowed imports

- plain types if needed

## Forbidden imports

- `@/app/*`
- `@/features/*`
- `@/shared/*`
- `@/services/*` unless a mock factory explicitly needs a type-only import

## Current files (verified: no consumer outside `src/services`)

```text
products.ts       weightCalc.ts
home.ts           categories.ts
```

A repo-wide check found zero imports of `@/mocks/*` outside `src/services/`. This boundary is currently respected everywhere.
