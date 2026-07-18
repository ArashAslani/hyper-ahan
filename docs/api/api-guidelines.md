# API Guidelines

**Status:** Permanent Phase 1 standard  
**Purpose:** Define frontend API boundaries for future backend integration.

Backend connection is not allowed until the official API integration phase. This document defines how integration must happen when that roadmap phase is approved.

---

## Service Layer

All data access must go through services.

Rules:

- Never call `fetch` directly inside pages, components, hooks, or providers unless the file is explicitly part of the service/API layer.
- Services own endpoint paths, request options, response mapping, and error normalization.
- UI consumes domain types, not raw DTOs.
- Mocks remain behind services until replaced.

Approved flow:

```text
UI/page -> service -> api-client -> backend -> mapper -> domain type -> UI/page
```

Forbidden flow:

```text
UI/page -> fetch -> backend DTO -> render
```

---

## API Naming

Service names should reflect business resources.

Examples:

- `productService`
- `categoryService`
- `cartService`
- `orderService`
- `profileService`

Function names should describe business intent:

- `getProducts`
- `getProductById`
- `submitOrder`
- `getOrderById`
- `updateCartItem`

Avoid transport-oriented names in UI-facing services:

- `fetchData`
- `postThing`
- `callApi`

---

## Request Flow

Every request should have:

- a service function
- typed input
- normalized output
- clear error behavior
- documented caching intent

Do not scatter endpoint strings across files.

When API integration begins, endpoint constants or service-local route builders should be owned by services.

---

## Caching

Caching must match business truth.

Guidelines:

- Product/category SEO content can often be cached.
- Prices may need short-lived or no-cache behavior depending on backend guarantees.
- Cart, checkout, profile, and orders must be user/session-aware.
- Admin mutations must invalidate related reads.

Do not add client caching libraries without documented need and approval.

---

## Retry

Retry only when safe.

Safe candidates:

- idempotent reads
- transient network failures

Do not blindly retry:

- order submission
- payment-related requests
- profile updates
- destructive admin actions

Retries must not create duplicate business actions.

---

## Error Handling

Services must normalize errors.

Error categories:

- network unavailable
- unauthorized
- forbidden
- not found
- validation error
- conflict
- server error
- unknown error

UI should receive user-safe error information and optional field errors.

Do not expose raw stack traces or backend internals.

---

## DTO Mapping

Backend DTOs must be mapped before UI consumption.

Rules:

- DTO names must include `Dto`.
- Domain/view types must not be forced to match backend naming.
- Mapping must handle missing/nullable fields deliberately.
- Mapping belongs in services or service-owned mappers.

Example boundary:

```text
ProductDto -> mapProductDto -> Product
```

---

## Authentication-Aware Requests

Future authentication must keep tokens out of UI components.

Rules:

- Token storage/access belongs in approved auth/storage helpers.
- API client attaches credentials according to the chosen auth strategy.
- Components must not manually build Authorization headers.
- Unauthorized errors must flow through a consistent handler.

Real authentication must not be implemented until the official authentication phase.

---

## Environment Variables

Rules:

- Public browser-visible variables must use `NEXT_PUBLIC_*`.
- Server-only variables must not use `NEXT_PUBLIC_*`.
- `.env.example` must document required variables.
- `.env.local` remains uncommitted.

Default local development may use Next.js rewrites when approved.

---

## Mock Replacement Strategy

Mock replacement must be incremental.

Steps:

1. Keep service public API stable.
2. Add API call inside service.
3. Map DTO to existing domain type.
4. Preserve UI behavior.
5. Update docs if contracts change.
6. Remove mock usage only after the service is fully migrated.

Never replace mocks by importing API details into UI.

---

## API Review Checklist

Before merging API work:

- No direct fetch in pages/components.
- Services own endpoints.
- DTOs are mapped.
- errors are normalized.
- caching is documented.
- auth/session behavior is clear.
- environment variables are documented.
- lint/typecheck pass.
