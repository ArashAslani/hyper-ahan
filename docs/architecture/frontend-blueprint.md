# Frontend Blueprint

**Project:** HyperAhan  
**Phase:** 2.5 — Architecture Synthesis  
**Status:** Master frontend architecture document  
**Purpose:** Unify business, UX, SEO, API, admin, development, and architecture standards into one implementation-ready blueprint.

This document is the primary architecture reference after the constitution and roadmap.

---

## Architecture Objective

HyperAhan is an SEO-first, mobile-first steel e-commerce platform optimized for one business objective:

> Increase conversion from visitor to customer.

The frontend architecture must support:

- fast price/product discovery
- expert-assisted purchase requests
- SEO acquisition
- mobile conversion
- service-layer API integration
- future admin/content/auth modules
- solo-developer maintainability

---

## Overall Architecture

The frontend uses a layered Next.js App Router architecture:

```text
src/app/        routing, layouts, metadata, server/client composition
src/features/   business-facing feature UI and orchestration
src/shared/     reusable domain-neutral UI primitives
src/services/   data access boundary and DTO mapping
src/lib/        cross-cutting utilities: routes, storage, format, api-client
src/config/     static app configuration
src/providers/  app-level context providers
src/types/      shared domain/view types
src/mocks/      temporary data consumed only by services
```

Pages compose. Features orchestrate. Services fetch/map. Shared UI renders.

---

## Layer Responsibilities

### App Layer

Owns:

- route segments
- layouts
- metadata generation
- server/client boundaries
- route-level loading/error/not-found states

Rules:

- May call services.
- May compose feature views.
- Must not import mocks.
- Must not contain large business workflows.
- Must keep SEO pages server-renderable where possible.

### Feature Layer

Owns:

- feature views
- feature-specific components
- feature hooks
- feature constants/types/validation/utils

Rules:

- May import shared UI, services, lib, config, and types.
- Must not import mocks.
- Must not depend on another feature’s private internals.
- Must keep domain rules feature-owned unless reused.

### Shared Layer

Owns:

- domain-neutral UI primitives
- reusable feedback/layout components
- accessibility-protective building blocks

Rules:

- Must not import services or features.
- Must not know product/cart/order/auth semantics.
- Receives ready-to-render props.

### Services Layer

Owns:

- data access
- request construction
- API endpoint ownership
- DTO mapping
- error normalization
- mock/API switching
- cache/revalidation policy entry points

Rules:

- UI never calls raw `fetch`.
- UI consumes domain/view types, not backend DTOs.
- Only services consume mocks.

---

## Data Flow

Current development flow:

```text
Route -> service -> mock -> domain type -> feature view -> shared UI
```

Future API flow:

```text
Route -> service -> api-client -> backend DTO -> mapper -> domain type -> feature view -> shared UI
```

Cart/checkout/auth future flow:

```text
Anonymous user -> product -> cart/sessionToken -> checkout
checkout -> OTP -> profile -> address -> agreement -> orderService.submitOrder
```

Order state flow:

```text
Submitted -> InReview -> Confirmed -> Completed
Cancelled can branch from active states.
```

---

## Feature Boundaries

Official high-level feature families:

- Public/Home
- Catalog
- Search
- Cart
- Checkout
- Orders
- Authentication/Profile
- Blog/Content
- Calculators
- Support
- Admin

Feature rule:

> A feature owns business-facing UI for one capability. Shared behavior is extracted only when reuse is real and the boundary is clear.

---

## Shared Layer Boundary

Shared components are allowed when they are:

- domain-neutral
- reusable in multiple places
- accessible by default
- independent of services/features/mocks
- stable enough to become a contract

Examples:

- Button
- Input
- Modal
- BottomSheet
- Toast
- Skeleton
- EmptyState
- Badge
- Card shell

Feature-specific compositions such as product cards, cart item rows, order timelines, and checkout summaries may use shared primitives but should remain feature-owned unless deliberately promoted.

---

## Business Layer

Business intent is defined by Phase 2 documents:

- customer personas
- customer journeys
- conversion strategy
- product discovery strategy
- homepage strategy
- module roadmap

Business architecture rule:

> Every implemented page must support a documented journey or conversion goal.

Implementation must not add product surfaces only because they are technically easy.

---

## Presentation Layer

Presentation is governed by:

- `docs/ui/design-system.md`
- `docs/ui/component-guidelines.md`
- `docs/ui/navigation-strategy.md`
- `docs/ui/page-blueprints.md`

Presentation rules:

- mobile-first
- top bar + bottom navigation for customer shell unless a documented decision changes it
- clear CTA hierarchy
- no hover-only critical paths
- sticky CTAs only when they support active conversion
- tables need a mobile strategy before shipping

---

## API Layer

API integration is not allowed until its roadmap phase.

When approved:

- endpoint strings live in services
- `api-client` handles transport concerns
- services map DTOs to domain/view types
- services normalize `OperationResult` errors
- UI receives user-safe states
- auth/session headers are attached outside UI components

Backend DTOs must never leak into page/component props unless deliberately named and mapped.

---

## SEO Layer

SEO is a first-class architecture layer.

Rules:

- Indexable pages need metadata.
- Product/category/article content must be server-renderable where possible.
- Canonical strategy must be explicit.
- Filter/search variants must avoid index bloat.
- JSON-LD must match visible truth.
- Placeholder/thin content must not be indexed.
- Performance regressions are SEO regressions.

SEO-owned page families:

- homepage
- categories
- product pages
- high-quality articles in the future content phase
- calculators when useful and complete
- about/contact/support

Non-indexable:

- cart
- checkout
- profile
- orders
- admin
- low-quality search/filter variants

---

## Admin Layer

Admin is future-only until Phase 8.

Admin must:

- be separate from customer storefront navigation
- avoid public SEO indexing
- use operational layout, tables, forms, filters, and permissions
- treat backend permissions as authority
- use services for data access
- support product/category/price/order/content operations only when approved

Admin must not reuse customer bottom navigation.

---

## Module Interaction

Primary interaction graph:

```text
Public/Home -> Catalog -> Product -> Cart -> Checkout -> Orders
Blog/Content -> Catalog/Product/Calculator/Support
Search -> Catalog/Product/Support
Calculator -> Product/Category/Support
Auth/Profile -> Checkout/Orders
Admin -> Products/Categories/Prices/Orders/Content
```

Dependency direction is not the same as business journey direction. Code dependencies still flow through architecture layers.

---

## Folder Ownership

Ownership summary:

- `src/app`: route composition and metadata
- `src/features`: business UI ownership
- `src/shared/ui`: reusable primitives
- `src/services`: data access and mapping
- `src/lib`: platform utilities
- `src/config`: static configuration
- `src/providers`: global context only when necessary
- `src/types`: shared domain/view types
- `src/mocks`: temporary service-only data

No root-level catch-all `components`, `helpers`, or `common` folders.

---

## Allowed Dependency Direction

Allowed:

```text
app -> features
app -> services
features -> services
features -> shared
features -> lib/config/types
services -> api-client
services -> mocks
providers -> lib/services/types
```

Forbidden:

```text
shared -> features
shared -> services
services -> features
services -> JSX
mocks -> app/features/shared
lib -> features
UI -> raw fetch
UI -> mocks
```

---

## Future Scalability

The architecture scales by preserving boundaries, not by adding early abstractions.

Future growth paths:

- API integration through services
- auth through approved auth/session helpers
- SEO/catalog expansion through server-rendered pages
- content/blog through Phase 9 editorial/content module
- admin through isolated admin feature/layout
- analytics through documented conversion events
- tests/CI/tooling through Phase 3 foundation work

---

## Implementation Rule

Before implementation begins, future work must:

1. identify the roadmap phase
2. read this blueprint and the dependency matrix
3. map the task to a documented journey/page/module
4. confirm service/API ownership
5. confirm SEO/indexing impact
6. keep changes narrow
7. update docs if a new architectural decision appears

If a decision is not answered by this blueprint, do not improvise in code. Document the decision first.
