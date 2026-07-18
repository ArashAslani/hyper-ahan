# Future Module Map

**Project:** HyperAhan  
**Phase:** 2 — Business & UX Blueprint  
**Purpose:** Map future business modules before implementation.

This document defines module intent and relationships. It does not approve implementation of future modules.

---

## Module Principles

- Modules must support conversion, trust, SEO, or operations.
- Do not implement future modules before roadmap approval.
- Every module must have clear service ownership before coding.
- Customer-facing modules must be mobile-first.
- Admin modules must be operational and separated from storefront UX.

---

## Products

**Business role:** Core commercial inventory and SEO asset.

**Owns**

- product identity
- category/factory/brand/specs
- price/unit
- availability signal
- related products

**Primary users**

- all customer personas
- admin/product operator in future

**Dependencies**

- Categories
- Factories
- Brands
- Inventory
- Price History

**Conversion role**

- add to cart
- call expert
- request price

---

## Orders

**Business role:** Convert purchase requests into operational workflow.

**Owns**

- submitted request
- status
- items
- totals
- delivery address
- agreement
- shipping info

**Status model**

```text
Submitted -> InReview -> Confirmed -> Completed
Cancelled can branch from active states.
```

**Conversion role**

- validates purchase request success
- builds repeat trust through tracking

---

## Factories

**Business role:** Trust and filtering dimension.

**Owns**

- factory name
- slug
- related products
- future factory SEO pages if approved

**Conversion role**

- helps buyers compare supplier/source
- supports high-intent searches

---

## Brands

**Business role:** Product recognition and filtering dimension.

**Owns**

- brand name
- related products
- brand/category relationships

**Conversion role**

- supports procurement and repeat buying
- improves product confidence

---

## Inventory

**Business role:** Availability and operational truth.

**Owns**

- availability state
- stock level when reliable
- loading place
- reservation/confirmation logic in future

**Conversion role**

- prevents false expectations
- supports “call to confirm” when uncertain

**Risk**

Do not show exact stock unless backend/business process can keep it accurate.

---

## Price History

**Business role:** Trust, comparison, and SEO support.

**Owns**

- historical price points
- chart data
- price update timestamps
- price trend labels

**Conversion role**

- helps buyers decide timing
- increases trust for repeat buyers

**Risk**

Charts can distract or overwhelm non-technical mobile users. Keep optional and contextual.

---

## User Dashboard

**Business role:** Customer continuity.

**Owns**

- profile
- addresses
- orders
- saved/recent items in future
- support shortcuts

**Conversion role**

- reduces repeat purchase friction
- improves post-order trust

---

## Notifications

**Business role:** Keep customers informed.

**Potential events**

- order submitted
- expert review started
- order confirmed
- shipping registered
- order completed/cancelled
- cart expiring in future

**Conversion role**

- reduces uncertainty
- improves retention

**Risk**

Do not add notification channels before business response process is reliable.

---

## Support

**Business role:** Convert uncertainty into assisted purchase.

**Owns**

- phone contact
- WhatsApp/contact channel
- FAQ
- order support
- after-hours request

**Conversion role**

- captures users who cannot self-select
- reduces abandonment

---

## Favorites

**Business role:** Help users return to products.

**Primary users**

- procurement users
- workshop owners
- repeat buyers

**Conversion role**

- supports comparison and repeat purchase

**Priority**

Lower than search, cart, orders, and related products.

---

## Comparison

**Business role:** Help buyers compare shortlisted products.

**Compare dimensions**

- price
- unit
- size
- factory
- brand
- loading place
- availability
- weight/specs

**Conversion role**

- supports technical/procurement buyers
- can reduce phone questions

**Risk**

Must remain optional. Non-technical users should not be forced into comparison workflows.

---

## Recommended Module Sequence

1. Products / Categories
2. Cart / Checkout request
3. Orders / Order tracking
4. Search / Related products
5. Content / Blog conversion paths
6. Calculators
7. Factories / Brands enrichment
8. Inventory / Price history
9. User dashboard enhancements
10. Support/notifications
11. Favorites / comparison
12. Admin operational modules

Actual implementation order must follow the official roadmap.

---

## Module Dependency Map

```text
Products
  -> Categories
  -> Factories
  -> Brands
  -> Inventory
  -> Price History

Cart
  -> Products
  -> Price Lock

Checkout
  -> Cart
  -> Auth
  -> Profile
  -> Address
  -> Agreement

Orders
  -> Checkout
  -> Shipping
  -> Notifications

Content
  -> Categories
  -> Products
  -> Calculators

Admin
  -> Products
  -> Categories
  -> Prices
  -> Orders
  -> Content
```

---

## Module Approval Rule

Before implementing a module:

- confirm roadmap phase
- define business goal
- define conversion role
- define service/API boundary
- define SEO impact
- define UI ownership
- update documentation
