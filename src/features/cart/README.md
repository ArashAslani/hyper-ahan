# `src/features/cart/`

**Module (per `docs/architecture/module-map.md`):** Cart Module + Checkout Module  
**Purpose:** Temporary **QuoteCart** storefront cart and checkout views. Backs `src/app/(shop)/cart` and `src/app/(shop)/checkout`.

## Current files

```text
CartIntentionPort.ts        port: load / addOrUpdate / remove / updateQuantity / clear / getApproximateTotal
LocalQuoteCartAdapter.ts    localStorage adapter (`ha_quote_cart_v1`); clears legacy cart keys
CartPageView.tsx            QuoteCart lines, stale/expired quote UX, checkout entry
CheckoutPageView.tsx        purchase-request submission (mock-backed; real Ordering submit after alignment)
```

## Model

- Line key: `(productId, orderUnitId)` — **no `productVariantId`**
- Money: Pricing `FinalPrice` snapshot only; qty change marks quote stale (re-quote required)
- See `docs/docs/frontend/04-Pricing-Frontend-Architecture.md` §5.2

## Allowed imports

- `@/shared/ui/*` (e.g. `CartSummaryBar`), `@/services/*`, `@/providers/*` (`CartProvider`), `@/lib/*`, `@/config/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
- other features' private internals
- inventing Catalog variants / Ordering cart calls before platform alignment

## Note

Checkout is currently a view inside `cart/` rather than its own `features/checkout/` folder. Splitting is deferred until real order submission complexity lands.
