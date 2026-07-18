# Information Architecture

**Project:** HyperAhan  
**Phase:** 2 — Business & UX Blueprint  
**Purpose:** Define the full site hierarchy before implementation.

This is a business/UX architecture document. It does not create routes or pages.

---

## IA Principles

- Commercial intent pages must be easy to reach.
- SEO pages must have stable, meaningful hierarchy.
- Mobile navigation must support the shortest path to product, price, cart, and expert contact.
- Blog/content must route users toward products, categories, calculators, and consultation.
- Admin is future operational software and must be separated from the customer storefront.

---

## Top-Level Site Map

```text
/
  categories
  product-category/[slug]
  products
  products/[id-or-slug]
  search
  calculators
  calculators/[slug]
  compare
  cart
  checkout
  login / auth
  profile
  orders
  orders/[id]
  blog
  blog/[slug]
  support
  about
  contact
  admin (future)
```

Current implementation uses some existing route names (`/articles`, `/weight-calc/[slug]`). Future route changes must be approved and centralized in `src/lib/routes.ts`.

---

## Homepage

**Purpose:** Fast entry into price discovery and conversion.

**Primary users:** All personas.

**Primary actions:**

- search product
- open category
- view price list
- call expert
- continue to cart

**SEO role:** Rank for brand, broad steel price terms, and business trust terms.

---

## Categories

**Purpose:** Show major product families.

**Primary categories:**

- Rebar
- Beam
- Sheet
- Profile
- Pipe
- Angle
- Channel
- Wire Rod
- Steel Accessories

**Category page responsibilities:**

- explain category in plain language
- list/filter products
- show current price context
- link related articles/calculators
- provide expert CTA

---

## Products

**Purpose:** Commercial detail and conversion.

**Product hierarchy fields:**

- category
- factory
- brand
- size
- grade/standard
- unit
- loading place
- price
- stock/availability signal when reliable

**Primary actions:**

- add to cart
- call expert
- request price/consultation
- compare in future

---

## Blog

**Purpose:** Acquire qualified SEO traffic and convert readers into buyers.

**Blog is a business tool, not a content dump.**

Content types:

- buying guides
- product education
- calculator/weight explanations
- market/price context
- comparison articles
- FAQ-based articles

Every article must link to at least one commercial path: category, product, calculator, contact, or price request.

---

## Article

**Purpose:** Answer a specific buyer question and route the reader toward action.

**Required IA links:**

- parent blog/category
- related products
- related categories
- related calculator
- consultation CTA
- related articles

Thin articles must not be indexable.

---

## Search

**Purpose:** Fast product discovery for users who know what they need.

Search must support:

- product name
- category
- factory
- brand
- size/dimension
- article queries in future

No-result state must become a lead capture opportunity.

---

## Calculator

**Purpose:** Help users estimate weight/cost and then continue toward purchase.

Calculator pages should map to product families:

- rebar weight
- beam weight
- sheet weight
- profile/pipe calculators in future

Calculator output must link to:

- relevant products
- category price list
- call/WhatsApp expert
- cart/request flow when practical

Calculators must clearly state that estimates are not final commercial invoices.

---

## Comparison

**Purpose:** Help buyers compare shortlisted products.

Future comparison should support:

- price
- unit
- size
- factory
- loading place
- availability
- weight/specs

Comparison should be optional and not required for checkout.

---

## Cart

**Purpose:** Hold selected products and explain price-lock/request flow.

Cart must show:

- items
- quantity
- locked price
- total estimate
- expiration timer when API supports it
- checkout CTA
- continue shopping
- call expert fallback

---

## Checkout

**Purpose:** Convert cart into a submitted purchase request.

Checkout stages:

1. OTP/auth if needed
2. profile completion if needed
3. delivery address
4. agreement confirmation
5. submit request
6. success and next step

Checkout must not imply final payment or binding sale before expert confirmation.

---

## Profile

**Purpose:** Customer identity and continuity.

Profile should include:

- verified phone
- full name
- national ID/company info when required
- delivery addresses
- shortcut to orders

Profile exists to reduce repeated data entry and support checkout.

---

## Support

**Purpose:** Help users who are blocked.

Support should include:

- phone
- WhatsApp or approved messaging
- FAQ
- order support
- buying guidance
- business hours/after-hours request capture

Support should route commercial users back to products/cart where relevant.

---

## About

**Purpose:** Build business trust.

About should communicate:

- who HyperAhan is
- what problem it solves
- how expert-assisted purchase works
- service area/coverage
- trust and contact information

---

## Contact

**Purpose:** Convert users who prefer direct contact.

Contact should include:

- phone
- WhatsApp if approved
- address/business details
- working hours
- request form in future
- map only if it improves trust/performance tradeoff

---

## Admin

**Purpose:** Future operational management.

Admin hierarchy:

```text
admin
  dashboard
  products
  categories
  factories
  brands
  prices
  inventory
  orders
  customers
  content
  uploads
  settings
```

Admin must be separate from customer IA and hidden from public SEO.

---

## SEO Indexing Rules

Indexable candidates:

- homepage
- category pages
- product pages with real data
- high-quality articles
- calculators with useful content
- about/contact/support

Non-indexable:

- cart
- checkout
- profile
- orders
- admin
- low-quality search/filter variants
- incomplete mock pages

---

## IA Implementation Guardrails

Future implementation must:

- centralize route strings in `src/lib/routes.ts`
- avoid hard-coded links
- preserve server-renderable SEO content
- keep admin/blog implementation out of scope until roadmap phase allows it
- document any URL strategy changes before implementation
