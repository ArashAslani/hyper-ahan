# `src/lib/`

**Layer:** Cross-cutting utilities
**Governing docs:** `docs/architecture/folder-structure.md`, `docs/architecture/frontend-blueprint.md`

## Purpose

Small, pure, cross-cutting utilities: routes, storage helpers, formatting helpers, and the API client wrapper.

## Allowed imports

- stable platform APIs
- primitive shared types

## Forbidden imports

- `@/features/*`
- `@/services/*` unless a utility is explicitly service-owned and better moved
- JSX

## Current files

```text
routes.ts        centralized route strings — UI must use routes.* instead of hard-coded paths
storage.ts        typed ha_* localStorage key helpers
format.ts         price/number formatting helpers
labels.ts          centralized product-unit and order-status label maps (added Sprint 3.2;
                    replaces 5 duplicated inline label maps — see docs/architecture/risk-analysis.md)
api-client.ts      API client stub for future backend integration (Phase 5); already exposes
                    OperationResult/OperationError/ApiError/unwrapOperationResult per
                    docs/architecture/frontend-blueprint.md's API Layer
```

Only `labels.ts` and `format.ts` import from `@/types` (type-only). The rest have zero imports and are fully pure.

If a file here grows business-specific, move the rule to a feature, service, or domain module through a documented change.
