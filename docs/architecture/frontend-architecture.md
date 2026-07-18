# Frontend Architecture

**Project:** HyperAhan frontend  
**Status:** Permanent Phase 1 standard  
**Applies to:** All future frontend development

This document defines the original official frontend architecture. After Phase 2.5, `docs/architecture/frontend-blueprint.md` is the master architecture document; this file remains the detailed layer standard and has priority over older informal notes. The project is an SEO-first, mobile-first steel e-commerce platform built for long-term solo development.

---

## Architecture Summary

HyperAhan uses a layered Next.js App Router architecture:

```text
src/app/        route segments, layouts, metadata, rendering boundaries
src/features/   business-facing UI and feature orchestration
src/shared/     reusable domain-neutral UI
src/services/   data access boundary, DTO mapping, mock/API swap point
src/mocks/      temporary sample data only
src/lib/        small cross-cutting utilities and platform helpers
src/config/     static application configuration
src/providers/  global React context providers
src/types/      shared domain types
```

The most important rule:

> Pages and UI components must never know whether data comes from mocks or the backend. They consume services and domain types only.

---

## Folder Philosophy

Folders represent responsibility, not convenience.

- `app` owns routing, layouts, metadata, and server/client composition.
- `features` owns product behavior and page-level UI for a business capability.
- `shared` owns reusable building blocks with no business-specific behavior.
- `services` owns data retrieval, request construction, response mapping, and mock/API switching.
- `lib` owns small utilities that are not feature-specific.
- `config` owns static constants used to configure navigation, site identity, and public behavior.

Do not create catch-all folders such as `components`, `helpers`, or `common` at the project root. If code does not have a clear owner, stop and define the owner before adding it.

---

## Feature Architecture

A feature is a business capability such as catalog, cart, checkout, orders, profile, search, or future admin.

Feature folders may contain:

- UI components specific to that feature
- feature hooks
- feature constants
- feature utilities
- feature-local types
- feature validation and schemas
- an optional `index.ts` public API

A feature may import:

- its own files
- `src/shared/ui`
- `src/services`
- `src/lib`
- `src/config`
- `src/types`

A feature must not import:

- another feature's private internals
- `src/mocks`
- raw backend DTOs unless the service layer exposes them intentionally
- route strings written by hand when `routes.ts` has an equivalent

If one feature needs behavior from another feature, extract the shared behavior to `shared`, `lib`, `services`, or a clearly named domain module after documenting the decision.

---

## Shared Layer

The shared layer is for reusable, domain-neutral primitives.

Shared UI components must not know about:

- cart rules
- order statuses
- authentication state
- product DTOs
- backend endpoints
- Persian steel business rules

Examples that belong in `shared/ui`:

- `Button`
- `Input`
- `Modal`
- `BottomSheet`
- `Toast`
- `Skeleton`
- `EmptyState`

Examples that do not belong in `shared/ui`:

- `AddToCartButton`
- `OrderStatusTimeline` if it encodes HyperAhan order statuses
- `ProductPriceCard` if it depends on product-specific fields

When in doubt, keep the component feature-local first. Promote it to shared only after a second real use case exists.

---

## Routing Philosophy

Routes are product contracts. They must be stable, readable, and SEO-friendly.

Rules:

- Route definitions must be centralized in `src/lib/routes.ts`.
- UI must use `routes.*` helpers instead of hard-coded strings.
- App Router route files should stay thin.
- Route segments must reflect user intent, not implementation details.
- SEO pages must be renderable without client-only data dependencies.
- Product/category/article URLs should be stable before they are indexed.

Pages may compose feature views, call services, and define metadata. Pages must not contain large business workflows, storage logic, or raw fetch calls.

---

## Dependency Direction

Allowed direction:

```text
app -> features -> shared
app -> services
features -> services
features -> lib/config/types
services -> mocks
services -> lib/api-client
providers -> lib/services/types
```

Forbidden direction:

```text
shared -> features
shared -> services
services -> features
services -> JSX
mocks -> app/features/shared
lib -> features
```

Dependencies must flow from product composition toward lower-level utilities. Lower layers must not know about upper layers.

---

## Module Boundaries

Each module must expose the smallest useful surface.

- Prefer named exports.
- Default exports are reserved for Next.js `page.tsx`, `layout.tsx`, and framework-required files.
- Avoid deep cross-feature imports.
- Use `index.ts` only as a public boundary, not as a dumping ground.
- Keep implementation details private to their folder.

If a module cannot be explained in one sentence, split it or rename it.

---

## Data Flow

Current data flow:

```text
Route/page -> feature view -> service -> mock data -> mapped domain type -> UI
```

Future API data flow:

```text
Route/page -> feature view -> service -> api-client -> backend DTO -> mapper -> domain type -> UI
```

Rules:

- UI consumes domain types, not backend DTOs.
- Backend response mapping happens in `services` or service-owned mappers.
- Mocks are temporary and must remain behind services.
- Storage keys must come from `src/lib/storage.ts`.
- Cart/session/auth persistence must never be duplicated in views.

---

## Rendering Strategy

The default strategy is server-first rendering with small client islands.

Use Server Components for:

- product/category/article pages
- static content pages
- SEO-sensitive pages
- data loading that does not need browser APIs

Use Client Components only for:

- local state
- event handlers
- browser APIs
- context consumers
- interactive filters, drawers, modals, and forms

`'use client'` is a cost. Add it only at the lowest component boundary that needs it.

---

## Server vs Client Components

Server Component responsibilities:

- fetch through services
- prepare metadata
- compose high-level feature views
- keep SEO content in HTML

Client Component responsibilities:

- handle user interaction
- manage local UI state
- read/write browser-only storage through approved helpers
- provide progressive enhancement

Do not move a full page to the client just because one child needs interaction. Extract the interactive child.

---

## Future Scalability

The architecture must support:

- real backend integration
- SEO catalog pages
- future blog/content surfaces
- customer authentication
- order tracking
- admin CRUD
- analytics and conversion measurement

Scalability does not mean adding abstractions early. Add abstractions only when they protect a real boundary, remove duplication, or codify a pattern already used in at least two places.

---

## Architecture Review Checklist

Before adding or changing code:

- Does the change respect dependency direction?
- Is data accessed only through services?
- Are mocks hidden from UI?
- Is the route centralized?
- Is the client boundary minimal?
- Is the component in the right layer?
- Is SEO content server-renderable?
- Is documentation updated if a standard changes?

If any answer is unclear, stop and document the decision before implementation.
