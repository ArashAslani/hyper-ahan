# SEO Standards

**Status:** Permanent Phase 1 standard  
**Purpose:** Define SEO requirements for HyperAhan as an SEO-first steel e-commerce platform.

SEO is a product requirement, not an afterthought. HyperAhan must be crawlable, fast, trustworthy, and useful for steel buyers searching by product, size, factory, category, and educational intent.

---

## Metadata

Every indexable page must define meaningful metadata.

Required:

- title
- description
- canonical URL
- OpenGraph title/description
- OpenGraph image when available
- robots policy when different from default

Rules:

- Titles must be specific.
- Descriptions must summarize the page value.
- Do not duplicate the same metadata across many pages.
- Product/category/article pages should generate metadata from server-available data.

---

## OpenGraph

OpenGraph exists for trust and share previews.

Rules:

- Use business-specific titles.
- Use clean descriptions.
- Use stable absolute URLs.
- Use relevant images when real images exist.
- Avoid placeholder images for production SEO pages.

---

## Twitter Cards

Twitter/X cards should mirror OpenGraph strategy.

Rules:

- Keep title and description aligned with page metadata.
- Use summary cards unless a larger image is clearly useful.
- Do not create separate messaging that conflicts with the page.

---

## Canonical URLs

Canonical URLs prevent duplicate-content problems.

Rules:

- Every indexable route must have one canonical URL.
- Filter/sort/query URLs must define whether they are indexable.
- Product detail canonical must not change when UI state changes.
- Category canonical must be stable before sitemap inclusion.

If a route can produce many low-value variants, default to non-indexable until an SEO strategy is approved.

---

## Structured Data

Structured data must be accurate. Do not add markup for information not visible or not true.

Potential types:

- `Organization`
- `WebSite`
- `BreadcrumbList`
- `Product`
- `Offer`
- `Article`
- `FAQPage` when real FAQ content exists

Rules:

- JSON-LD must match visible content.
- Prices, availability, and ratings must not be faked.
- Use stable IDs/URLs.
- Validate structured data before release.

---

## JSON-LD

JSON-LD should be generated from server-side data.

Rules:

- Keep JSON-LD small and relevant.
- Do not include private/internal fields.
- Do not duplicate conflicting entities on one page.
- Keep product and organization identifiers consistent.

---

## Sitemap

Sitemap strategy:

- Include stable public pages.
- Include category pages when content is meaningful.
- Include product pages when product data is real and indexable.
- Include articles when content is original and complete.
- Exclude cart, checkout, profile, orders, login, admin, and temporary mock-only routes.

Sitemap must not expose private or low-quality pages.

---

## Breadcrumbs

Breadcrumbs help users and search engines understand hierarchy.

Rules:

- Use breadcrumbs on product, category, and article detail pages when hierarchy exists.
- Breadcrumb labels must match visible navigation language.
- Breadcrumb URLs must use `routes.ts`.
- Add `BreadcrumbList` JSON-LD when breadcrumbs are visible.

---

## Article SEO

Future article pages must be useful, original, and aligned with steel buyer intent.

Rules:

- Articles need unique title, description, publish/update dates, and author/source policy.
- Content must answer real search questions.
- Internal links should guide readers to categories/products/contact.
- Thin placeholder articles must not be indexed.
- Article schema must match visible content.

Blog implementation is allowed only in the official content/blog roadmap phase. These are standards for future content work only.

---

## Category SEO

Category pages are major SEO assets.

Rules:

- Category copy must explain the product group.
- Product listings must be crawlable.
- Filters must not generate uncontrolled index bloat.
- Internal links should connect related categories.
- Category metadata must include the product family and buying intent.

Category pages should balance SEO content with fast price discovery.

---

## Product SEO

Product pages must support purchase intent.

Rules:

- Product title must include meaningful steel attributes where available.
- Price/unit must be visible and crawlable.
- CTA/contact path must be clear.
- Specifications should be structured.
- Product images need descriptive alt text.
- Product schema must be accurate and not fake availability.

---

## Image SEO

Rules:

- Use descriptive alt text.
- Prefer optimized images.
- Avoid production reliance on placeholder image hosts.
- Define dimensions or use framework image optimization to reduce layout shift.
- Use meaningful filenames for real assets.

Decorative images should not distract from product information.

---

## Performance

SEO depends on performance.

Rules:

- Keep critical content server-rendered.
- Avoid unnecessary client JavaScript.
- Use image optimization.
- Keep third-party scripts minimal.
- Avoid layout shift from late-loading UI.
- Do not block content rendering for noncritical data.

---

## Core Web Vitals

Targets:

- LCP: product/category main content should load quickly.
- CLS: sticky bars, images, and dynamic content must reserve space.
- INP: interactive controls must remain responsive on low-end mobile devices.

Performance regressions must be treated as SEO regressions.

---

## Future Blog Standards

When Blog becomes an approved roadmap phase:

- create topic clusters around steel buying questions
- avoid generic AI filler
- link articles to relevant categories/products
- define author/editor responsibility
- keep content freshness visible
- avoid indexing incomplete drafts

Blog must support conversion and trust, not just traffic.
