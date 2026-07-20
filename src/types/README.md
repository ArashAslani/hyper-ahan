# `src/types/`

**Layer:** Shared domain type definitions
**Governing docs:** `docs/architecture/folder-structure.md`

## Purpose

Stable domain entities, reusable enums/unions, and DTO-independent view types that are genuinely reused across feature boundaries.

## Allowed content

- stable domain entities (`Product`, `OrderStatus`, `Article`, ...)
- reusable enums/unions
- DTO-independent view types

## Forbidden content

- component props local to one component
- backend DTOs unless clearly named and isolated
- runtime validation logic

## Current file

```text
index.ts   single shared-types module consumed across features and services
```

Prefer feature-local types until a type is reused across boundaries (`docs/architecture/feature-template.md`).
