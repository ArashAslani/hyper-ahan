# `src/shared/ui/`

**Governing docs:** `docs/architecture/frontend-architecture.md`, `docs/architecture/shared-components-map.md`

## Purpose

Domain-neutral UI primitives, reusable feedback/layout components, and accessibility-protective building blocks. Must not know about cart rules, order statuses, authentication state, product DTOs, backend endpoints, or Persian steel business rules.

## Current components

```text
Button.tsx        Input.tsx         Card.tsx          Modal.tsx
BottomSheet.tsx   Toast.tsx         Skeleton.tsx       EmptyState.tsx
Fab.tsx           SearchBar.tsx     PriceBadge.tsx
ProductCard.tsx   CartSummaryBar.tsx  OrderTimeline.tsx (+ Stepper)
```

## Verified boundary compliance

None of the files above import `@/features/*` or `@/services/*`. All imports were checked; only `@/lib/*`, `@/types`, and sibling `shared/ui` files are used.

## Structural ambiguity identified (not resolved in this sprint)

Per `docs/architecture/frontend-architecture.md` ("Examples that do not belong in `shared/ui`") and `docs/architecture/shared-components-map.md` ("Commerce Compositions" / "Checkout / Order Compositions" tables), two components here encode domain-specific rules and are documented as feature-owned, not shared primitives:

- **`ProductCard.tsx`** — encodes product unit labels, stock, and discount display. Documented owner: Catalog.
- **`OrderTimeline.tsx`** — encodes HyperAhan's exact order-status set (`Submitted`, `InReview`, `Confirmed`, `Completed`, `Cancelled`). Documented owner: Orders.

`CartSummaryBar.tsx` is borderline (generic props, but hardcodes the "تومان" currency label and default checkout CTA copy) and `PriceBadge.tsx` is acceptable as-is (fully prop-driven, no hardcoded domain logic).

**No files were moved.** Per the constitution, moving/renaming files requires explicit user approval. This is flagged here so a future task can decide: relocate `ProductCard`/`OrderTimeline` to `features/catalog` and `features/orders` respectively, or formally promote them to shared with the domain knowledge stripped out.

## Allowed imports

- `@/lib/*` when domain-neutral
- sibling `shared/ui/*` components
- React, framework-neutral types

## Forbidden imports

- `@/features/*`, `@/services/*`, `@/mocks/*`
