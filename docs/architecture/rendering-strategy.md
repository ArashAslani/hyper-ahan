# Rendering Strategy

**Project:** HyperAhan  
**Phase:** 2.5 — Architecture Synthesis  
**Purpose:** Define Next.js rendering rules for SEO, performance, and interactivity.

The default is server-first rendering with small client islands.

---

## Rendering Principles

- SEO-sensitive content must be server-renderable.
- Client Components are used only for interactivity or browser APIs.
- Do not move a whole page to the client for one interactive child.
- Rendering and caching must reflect price/data truth.
- Performance regressions are SEO regressions.

---

## Server Components

Use Server Components for:

- homepage composition where possible
- category pages
- product detail pages
- article pages in future
- calculator content shell in future
- about/contact/support content
- data loading that does not need browser APIs

Server Components may:

- call services
- prepare metadata
- compose feature views
- pass domain-ready data to client islands

Server Components must not:

- import browser-only hooks
- depend on localStorage
- hide critical content behind client-only rendering

---

## Client Components

Use Client Components for:

- search/filter interactivity
- bottom sheets/modals
- cart controls
- checkout forms
- OTP forms
- toast interactions
- admin table interactions in future
- browser storage/session interactions

Rules:

- Add `'use client'` at the smallest boundary.
- Keep client props domain-ready.
- Do not map backend DTOs in client components.
- Do not call raw `fetch`.

---

## Streaming

Streaming can improve perceived speed when server data is split by priority.

Potential uses:

- category page: render header/SEO content first, stream product list if slower
- product page: render main product info first, stream related content
- blog page: render article first, stream related products/articles

Do not use streaming to hide poor data ownership. Services still own data access.

---

## Suspense

Use Suspense when:

- a non-critical section loads independently
- skeleton shape is predictable
- the fallback does not harm SEO or conversion

Avoid Suspense when:

- it hides primary product/category content from crawlers
- it creates layout shift
- it makes checkout actions unclear

---

## Metadata Generation

Metadata must be generated server-side for indexable pages.

Required page families:

- homepage
- category pages
- product pages
- article pages when implemented
- calculator pages when indexable
- about/contact/support

Metadata should include:

- title
- description
- canonical URL
- OpenGraph
- Twitter card where relevant
- robots policy when needed

Product/category/article metadata should come from service data or stable content config.

---

## SEO Rendering

SEO content must be visible in initial HTML when possible.

Rules:

- Category explanations must not be client-only.
- Product name/spec/price/unit should be server-rendered when data source allows.
- Article body must be server-rendered.
- Breadcrumbs should be visible and schema-ready.
- JSON-LD must match visible content.

---

## Caching

Caching must match business truth:

- Static content can cache longer.
- Category/product content may revalidate.
- Prices require short-lived or no-cache strategy until backend guarantees are clear.
- Cart/checkout/profile/orders are session-aware and must not be public cached.
- Admin data must not be public cached.

When unsure, prefer correctness over aggressive caching.

---

## Revalidation

Future revalidation policy:

- Category content: revalidate on content/product changes.
- Product details: revalidate on product/price changes.
- Articles: revalidate on publish/update.
- Sitemap: regenerate when public indexable routes change.

Do not define revalidation intervals without knowing backend update frequency.

---

## Image Optimization

Rules:

- Use optimized images for product/category/article media when implementation reaches that phase.
- Avoid production dependence on placeholder image hosts.
- Provide dimensions/sizes to reduce CLS.
- Use descriptive alt text.
- Mark only true above-the-fold priority images as priority.

Future image migration should address Phase 0 raw `<img>` risk.

---

## Route-Level Rendering Guidance

| Page Family | Rendering Default | Notes |
|-------------|------------------|-------|
| Homepage | Server shell + client islands | Hero/search/carousel may be interactive |
| Category | Server-first | Filters can be client island |
| Product | Server-first | Sticky cart/call actions can be client island |
| Search | Mixed | Query/results can be server or client depending API strategy |
| Cart | Client/session-heavy | Not indexable |
| Checkout | Client/form-heavy | Not indexable |
| Orders/Profile | Auth/session-aware | Not indexable |
| Blog/Article | Server-first | Future Phase 9 |
| Admin | Client/server mixed | Future Phase 8, not indexable |

---

## Rendering Checklist

Before implementing a page:

- Is the page indexable?
- What content must be in initial HTML?
- What can be a client island?
- What cache policy matches business truth?
- What metadata is required?
- Does image loading risk CLS?
- Are loading/empty/error states clear?
