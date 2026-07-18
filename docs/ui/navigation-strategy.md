# Navigation Strategy

**Project:** HyperAhan  
**Phase:** 2 — Business & UX Blueprint  
**Purpose:** Define navigation behavior before UI implementation.

Navigation must reduce the distance between intent and conversion.

---

## Navigation Principles

- Mobile users must reach product, search, cart, and contact quickly.
- Commercial paths have priority over informational paths.
- Blog/content navigation must lead back to products and consultation.
- Admin navigation is separate and future-only.
- No critical navigation may depend on hover.
- Route strings must be centralized in `src/lib/routes.ts` when implemented.

---

## Desktop Navigation

Desktop navigation should support comparison and exploration.

Recommended structure:

```text
Logo
Search bar
Categories
Daily Prices
Calculators
Blog / Guides
Support
Cart
Profile / Orders
Phone CTA
```

**Primary desktop goals**

- fast product/category search
- visible current prices
- easy expert contact
- clear cart/profile access

**Desktop category behavior**

- Use category menu for major steel families.
- Show only useful second-level items.
- Do not expose extremely deep taxonomy in the header.
- Provide “View all categories” for complexity.

---

## Mobile Navigation

Mobile navigation is the primary navigation model.

Recommended bottom nav:

```text
Home
Categories
Search
Cart
Orders/Profile
```

If limited to five items, prioritize:

1. Home
2. Categories
3. Search or Products
4. Cart
5. Orders/Profile

**Mobile top bar**

- logo/brand
- search affordance
- phone/contact action
- cart indicator when space allows

**Rules**

- Keep touch targets practical.
- Avoid multi-row mobile headers.
- Do not bury phone/contact.
- Search must be easy to open from most pages.

---

## Sticky Navigation

Sticky UI must support active conversion.

Use sticky elements for:

- product detail add-to-cart/call actions
- cart summary checkout action
- mobile filter/search access
- after-hours request action in future

Rules:

- Sticky bars must not hide content.
- Only one sticky conversion zone should dominate at a time.
- Sticky CTA labels must describe the outcome.

---

## Breadcrumbs

Breadcrumbs support SEO and orientation.

Use breadcrumbs on:

- category pages
- product detail pages
- article pages
- calculator detail pages

Example:

```text
Home -> Rebar -> Rebar 16 Isfahan
```

Rules:

- Breadcrumb labels must match page language.
- Breadcrumb URLs must use route helpers.
- Breadcrumbs should be visible where they help users.
- Add `BreadcrumbList` JSON-LD when implemented.

---

## Quick Actions

Quick actions should exist for high-intent users.

Priority quick actions:

- Call expert
- WhatsApp expert (if approved)
- Add to cart
- Submit price request
- Continue checkout
- Track order

Rules:

- Do not show every quick action everywhere.
- Match actions to intent stage.
- Keep phone available on product/category/cart.
- Use after-hours request capture when live calls are unavailable.

---

## Search Placement

Search is a primary discovery mechanism.

Placement:

- visible in desktop header
- one-tap accessible in mobile top bar or bottom nav
- present on homepage
- sticky/searchable within product listing

Search should support:

- product name
- category
- size/dimension
- factory/brand
- future article queries

No-result behavior:

- suggest broader categories
- show contact/price request CTA
- optionally show popular products

---

## Category Navigation

Major categories:

- Rebar
- Beam
- Sheet
- Profile
- Pipe
- Angle
- Channel
- Wire Rod
- Steel Accessories

Category navigation should:

- be visible from homepage
- be available in header/menu
- show product count only when reliable
- link to SEO category pages
- avoid overwhelming users with too many nested options

---

## CTA Placement

CTA hierarchy:

1. Primary commercial CTA: Add to cart / Submit purchase request
2. Expert CTA: Call / WhatsApp / Price request
3. Discovery CTA: View products / Related products
4. Education CTA: Read guide / Use calculator

Page-specific placement:

- Homepage: main product/price CTA above fold.
- Category: sticky filter/search, phone CTA, product cards.
- Product: sticky add-to-cart + call.
- Cart: sticky checkout summary.
- Checkout: step-specific primary action.
- Article: contextual product/category/contact CTAs after useful sections.

---

## Navigation Anti-Patterns

Avoid:

- desktop mega-menu complexity on mobile
- hiding contact behind footer only
- article pages without product/category links
- multiple equal-weight CTAs
- search that only works for exact names
- admin links in public customer navigation
- hover-only category discovery

---

## Implementation Readiness Notes

Future implementation should evaluate the current `TopBar` + `BottomNav` against this strategy during Phase 3/4. Any route or navigation change must be reflected in `src/lib/routes.ts` and `src/config/nav.config.ts`.
