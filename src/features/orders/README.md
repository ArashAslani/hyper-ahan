# `src/features/orders/`

**Module (per `docs/architecture/module-map.md`):** Checkout Module (order tracking scope)
**Purpose:** Order list and order detail/status views. Backs `src/app/orders` and `src/app/orders/[id]`.

## Current files

```text
OrdersListView.tsx
OrderDetailView.tsx
```

## Allowed imports

- `@/shared/ui/*` (e.g. `OrderTimeline`), `@/services/*`, `@/lib/*`, `@/config/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
- other features' private internals

## Note

`docs/architecture/shared-components-map.md` documents `OrderTimeline` as order-owned. It currently lives in `src/shared/ui/` — see `src/shared/ui/README.md` for the flagged ambiguity. Real order data/status transitions are gated to **Phase 7 — Checkout & Orders Maturity**.
