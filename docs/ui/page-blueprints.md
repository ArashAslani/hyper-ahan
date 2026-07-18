# Page Blueprints

**Project:** HyperAhan  
**Phase:** 2 — Business & UX Blueprint  
**Purpose:** Define page-level business, UX, SEO, component, CTA, and API expectations.

This is not an implementation document. It defines what future pages must accomplish.

---

## API Module Naming Note

“Required API modules” below means future service-layer ownership, not direct page fetch calls. Pages/components must never call raw `fetch`.

---

## Homepage

**Purpose:** Convert broad visitors into product discovery, price discovery, or expert contact.

**User goals**

- find today's prices
- find category/product
- call expert
- understand purchase process

**Business goals**

- route users to high-intent pages
- build trust quickly
- capture direct and SEO visitors

**SEO goals**

- rank for broad steel price and brand terms
- internally link to core categories

**Sections**

- hero/value proposition
- product search
- major category grid
- daily price snapshot
- expert consultation block
- how purchase works
- trust signals
- calculators/tools preview
- buying guides/articles preview
- support/contact block

**Components required**

- hero/banner
- search entry
- category cards
- compact price table
- CTA cards
- trust badges
- article cards

**CTAs**

- View products and prices
- Search product
- Call expert
- View category
- Read buying guide

**Required API modules**

- `homeService`
- `catalogService`
- `productService`
- `contentService` / `articleService`
- optional `sliderService`

---

## Category Page

**Purpose:** Help users compare products in a steel family and move to product/contact/cart.

**User goals**

- see current category prices
- filter by size/factory/brand
- understand category basics
- choose product or call expert

**Business goals**

- convert commercial SEO traffic
- reduce product-selection friction
- capture expert leads

**SEO goals**

- rank for category price terms
- provide crawlable product/category content
- support internal linking

**Sections**

- category title and short explanation
- price freshness note
- filters/search
- product list/table
- expert CTA
- related calculators
- related buying guides
- FAQ in future
- related categories

**Components required**

- breadcrumb
- category header
- filter sheet/sidebar
- product card/row
- price badge
- empty state with contact CTA
- related content block

**CTAs**

- View product
- Add to cart where appropriate
- Call expert
- Use calculator
- Read guide

**Required API modules**

- `catalogService`
- `productService`
- `contentService`
- future `calculatorService`

---

## Product Page

**Purpose:** Convert product interest into cart, phone consultation, or price request.

**User goals**

- verify specs
- see price/unit
- know factory/loading place
- add to cart or call

**Business goals**

- create purchase intent
- reduce wrong-product risk
- capture expert consultation

**SEO goals**

- rank for product/spec/factory terms
- provide structured product information

**Sections**

- breadcrumb
- product media
- product title/spec summary
- price/unit block
- availability/stock signal
- key specifications
- price-lock/purchase explanation
- sticky CTA bar
- related products
- related guide/calculator
- trust/support block

**Components required**

- product image/media
- price badge
- spec list
- availability badge
- sticky action bar
- related product cards
- consultation CTA

**CTAs**

- Add to cart
- Call expert
- WhatsApp expert if approved
- Request price if unavailable

**Required API modules**

- `productService`
- `catalogService`
- future `cartService`
- future `contentService`

---

## Blog Listing

**Purpose:** Organize educational content that routes users toward buying decisions.

**User goals**

- find buying guides
- understand steel products
- learn price factors
- access calculators or categories

**Business goals**

- convert informational traffic
- support SEO clusters
- build trust

**SEO goals**

- expose article hubs
- support internal linking
- avoid thin archive pages

**Sections**

- blog/category intro
- featured buying guides
- topic clusters
- article list
- category/product links
- consultation CTA

**Components required**

- article card
- topic cluster navigation
- category link block
- CTA card
- pagination if needed

**CTAs**

- Read guide
- View related products
- Call expert

**Required API modules**

- `contentService` / `articleService`
- `catalogService`

---

## Article Page

**Purpose:** Answer a buyer question and route the reader to commercial action.

**User goals**

- understand topic
- choose next step
- compare product/category
- ask expert if uncertain

**Business goals**

- convert informational SEO visits
- build trust
- reduce pre-sales confusion

**SEO goals**

- rank for long-tail informational queries
- support topic clusters and structured data

**Sections**

- article header
- summary/answer block
- content sections
- inline related category/product links
- mid-article expert CTA
- calculator link where relevant
- related products/categories
- related articles
- final conversion CTA

**Components required**

- article header
- content renderer
- related product block
- related article block
- CTA card
- breadcrumb

**CTAs**

- View related products
- Use calculator
- Call expert
- View category prices

**Required API modules**

- `contentService` / `articleService`
- `productService`
- `catalogService`
- future `calculatorService`

---

## Cart Page

**Purpose:** Review selected products and move to checkout.

**User goals**

- confirm items and quantity
- understand locked price
- see total estimate
- proceed to request submission

**Business goals**

- reduce abandonment
- explain expert-assisted purchase
- preserve purchase intent

**SEO goals**

- not indexable

**Sections**

- cart item list
- price-lock/timer explanation
- quantity controls
- total estimate
- checkout CTA
- continue shopping
- expert contact fallback
- empty cart discovery state

**Components required**

- cart item card
- quantity control
- price-lock notice
- cart summary bar
- empty state
- support CTA

**CTAs**

- Proceed to checkout
- Continue shopping
- Call expert

**Required API modules**

- future `cartService`
- `productService`
- future `authService` only at checkout gate

---

## Checkout Page

**Purpose:** Convert cart into a submitted purchase request.

**User goals**

- submit request safely
- understand required information
- know what happens next

**Business goals**

- capture qualified order request
- collect enough data for expert follow-up
- reduce support friction

**SEO goals**

- not indexable

**Sections**

- checkout stepper
- OTP/auth gate
- profile completion
- delivery address
- order summary
- agreement checkbox
- submit request
- success/next-step explanation

**Components required**

- stepper
- form fields
- address selector/form
- order summary
- agreement block
- submit button
- error state

**CTAs**

- Continue
- Verify phone
- Save address
- Submit purchase request
- Call support

**Required API modules**

- future `authService`
- future `profileService`
- future `addressService`
- future `cartService`
- future `orderService`

---

## Search Page

**Purpose:** Help high-intent users find products quickly.

**User goals**

- search exact product/spec
- filter results
- recover from no results

**Business goals**

- convert exact-intent visitors
- capture unavailable product requests
- identify demand signals

**SEO goals**

- search results generally not indexable unless a deliberate SEO route exists

**Sections**

- search input
- result summary
- filters
- product results
- no-result suggestions
- price request/contact CTA
- popular categories/products

**Components required**

- search bar
- filter sheet
- product result card/row
- empty state
- CTA card

**CTAs**

- View product
- Add to cart
- Request price
- Call expert
- Browse categories

**Required API modules**

- `productService`
- `catalogService`
- future `searchService`
- future `leadService` / `supportService`

---

## Cross-Page Requirements

- All commercial pages need clear contact path.
- All indexable pages need metadata strategy.
- All product/category/article links must support internal linking.
- All forms must preserve user input on errors.
- All UI must be mobile-first.
- All data access must go through services.
