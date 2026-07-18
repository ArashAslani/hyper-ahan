# Module Map

**Project:** HyperAhan  
**Phase:** 2.5 — Architecture Synthesis  
**Purpose:** Define module responsibilities, dependencies, public APIs, and future growth.

This document defines ownership. It does not approve implementation before the roadmap phase allows it.

---

## Public Module

**Responsibilities**

- homepage
- about/contact/support surfaces
- public trust messaging
- homepage entry into search/categories/products

**Dependencies**

- Catalog
- Search
- Support
- Content in future
- Shared UI

**Public APIs**

- Public page views exported to routes
- Static config for public navigation
- Public service calls through `homeService`/future content services

**Future growth**

- after-hours lead capture
- trust/social proof blocks
- analytics for homepage conversion

---

## Blog / Content Module

**Responsibilities**

- blog listing
- article pages
- buying guides
- topic clusters
- article-to-product/category/calculator linking

**Dependencies**

- Catalog
- Product
- Calculator
- Support
- SEO layer

**Public APIs**

- content/article service functions
- article summary/detail types
- content metadata generators in routes

**Future growth**

- editorial workflow
- structured Article JSON-LD
- author/update policy
- content admin

**Roadmap gate:** Phase 9 implementation only.

---

## Catalog Module

**Responsibilities**

- categories
- product lists
- product details
- product filters
- category SEO content
- related products

**Dependencies**

- Product service
- Category/factory/brand data
- Cart for add-to-cart action
- Content/calculators for related guidance

**Public APIs**

- `productService`
- future `catalogService`
- product/category view models
- category/product route helpers

**Future growth**

- SEO category pages
- product schema
- related product engine
- factory/brand pages if approved

---

## Cart Module

**Responsibilities**

- anonymous cart
- cart items and quantities
- locked price display
- total estimate
- cart expiration explanation
- checkout entry

**Dependencies**

- Product
- Storage/session helpers
- Future cart API
- Shared UI

**Public APIs**

- cart provider/hook while local
- future `cartService`
- cart item domain types

**Future growth**

- API-backed cart
- expiration timer
- cart recovery
- cart-to-support fallback

---

## Checkout Module

**Responsibilities**

- submit purchase request
- auth/profile/address gates
- order summary
- agreement acceptance
- success/next-step messaging

**Dependencies**

- Cart
- Authentication
- Profile/address
- Orders
- API services

**Public APIs**

- future `orderService.submitOrder`
- future `addressService`
- future checkout view models

**Future growth**

- duplicate submission prevention
- improved validation
- post-submit tracking

---

## Search Module

**Responsibilities**

- product search
- high-intent query handling
- filters
- no-result lead capture
- future article search

**Dependencies**

- Catalog
- Product service
- Support/lead capture
- Content in future

**Public APIs**

- future `searchService`
- search query/filter types
- search route helpers

**Future growth**

- fuzzy search
- recent searches
- search analytics
- SEO-safe search route policy

---

## Authentication Module

**Responsibilities**

- OTP request/verify
- token/session state
- profile-completion gate
- customer continuity

**Dependencies**

- API client
- Storage/session helpers
- Checkout
- Profile/orders

**Public APIs**

- future `authService`
- auth/session helpers
- user/session domain types

**Future growth**

- token refresh strategy if backend supports it
- protected route handling
- account recovery/support

**Roadmap gate:** Phase 6 implementation only.

---

## Admin Module

**Responsibilities**

- operational dashboard
- products/categories/prices management
- order review/status/shipping
- content operations in future
- permissions-aware UI

**Dependencies**

- Admin API services
- Products/categories/orders/content modules
- Admin layout

**Public APIs**

- future admin route group
- future admin services
- admin table/form view models

**Future growth**

- role-based permissions
- audit logs
- uploads
- dashboard metrics

**Roadmap gate:** Phase 8 implementation only.

---

## Shared Module

**Responsibilities**

- domain-neutral UI primitives
- reusable feedback components
- accessibility defaults
- layout primitives

**Dependencies**

- React/Next primitives
- design tokens
- domain-neutral lib utilities only

**Public APIs**

- named component exports
- typed props
- stable variants

**Future growth**

- documented component inventory
- Storybook or visual docs only if approved
- accessibility hardening

---

## Core Module

**Responsibilities**

- routes
- storage
- formatters
- api-client
- site/nav config
- shared domain types

**Dependencies**

- platform APIs
- no feature dependencies

**Public APIs**

- `routes`
- storage helpers
- format utilities
- `api-client`
- site/nav config

**Future growth**

- label maps for order statuses and units
- architecture lint rules
- feature-public APIs if needed

---

## Module Boundary Rules

- Modules interact through services, route helpers, shared types, and public feature exports.
- UI modules do not import mocks.
- Shared module does not import business modules.
- Admin does not leak into public navigation.
- Blog/content does not implement before its roadmap phase.
- Authentication and API integration do not implement before their roadmap phases.
