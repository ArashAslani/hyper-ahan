# `src/features/cart/`

**Module (per `docs/architecture/module-map.md`):** Cart Module + Checkout Module
**Purpose:** Anonymous cart display and purchase-request submission. Backs `src/app/(shop)/cart` and `src/app/(shop)/checkout`.

## Current files

```text
CartPageView.tsx        cart items, locked price display, checkout entry
CheckoutPageView.tsx     purchase-request submission (mock-backed; real submission is Phase 7)
```

## Allowed imports

- `@/shared/ui/*` (e.g. `CartSummaryBar`), `@/services/*`, `@/providers/*` (`CartProvider`), `@/lib/*`, `@/config/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
- other features' private internals

## Note

Checkout is currently a view inside `cart/` rather than its own `features/checkout/` folder. `docs/architecture/frontend-blueprint.md` lists Checkout as a separate feature boundary; per `docs/architecture/feature-template.md`, splitting it out is only warranted once checkout grows real complexity (e.g. Phase 7 order submission, auth/profile/address gating). No split was performed in this sprint.
