# Product Discovery Strategy

**Project:** HyperAhan  
**Phase:** 2 — Business & UX Blueprint  
**Purpose:** Define how users find products before implementation.

Product discovery must support both expert buyers who know exact specs and non-technical buyers who need guidance.

---

## Discovery Principles

- Users should be able to start from search, category, article, calculator, or homepage.
- Product data must be scannable on mobile.
- Discovery should always offer a next commercial action.
- No-result or uncertain states should become consultation opportunities.
- Discovery must support SEO, not only client-side browsing.

---

## Homepage Discovery

Homepage discovery should provide:

- product search
- major category cards
- daily price snapshot
- popular/trending products in future
- calculator shortcuts
- expert CTA

**Best for**

- direct visitors
- returning users
- users with broad intent

**Conversion goal**

Move users from broad interest to product/category detail.

---

## Search Discovery

Search supports high-intent users.

Search should eventually handle:

- product name
- category
- size
- factory
- brand
- grade/standard
- article topics

**No-result strategy**

When no product is found:

- suggest top categories
- offer expert contact
- allow price request in future
- show related articles if informational intent is likely

Search must not be a dead end.

---

## Category Discovery

Categories are the main SEO/commercial structure.

Category pages should include:

- short category explanation
- filters
- product list/table
- related buying guide
- related calculators
- expert CTA
- FAQ in future

Filters should prioritize:

- size/dimension
- factory
- brand
- grade/type
- loading place
- price range when useful

Avoid filter combinations that create index bloat.

---

## Article Discovery

Articles should help users who are not ready to choose a product.

Article discovery paths:

- article -> related category
- article -> related products
- article -> calculator
- article -> expert CTA
- article -> FAQ/support

Article examples:

- “How to choose rebar size”
- “Beam weight and cost guide”
- “Sheet types and use cases”
- “What affects steel price today?”

Every article must have a business bridge.

---

## Related Products

Related products should reduce comparison effort.

Relation types:

- same category
- same factory
- same size/different factory
- same factory/different size
- frequently compared
- article-recommended products

Rules:

- Do not fake personalization.
- Label relation clearly.
- Keep related products focused.

---

## Trending Products

Trending products should be introduced only when data exists.

Potential signals:

- most viewed
- most searched
- most added to cart
- high market interest
- manually promoted business priority

If data is manual, label it as “selected” or “popular categories,” not real-time trending.

---

## Popular Products

Popular products help uncertain buyers start.

Use cases:

- homepage section
- category empty state
- search no-result
- article sidebar/inline block

Rules:

- Keep list short.
- Do not distract from exact search results.
- Prioritize commercial categories.

---

## Recently Viewed

Recently viewed supports comparison and returning users.

Use cases:

- homepage
- product detail
- cart empty state
- search/category sidebar in future

Rules:

- Store locally until user account strategy supports persistence.
- Do not expose private browsing data incorrectly.
- Keep list small and removable if needed.

---

## Calculator-Based Discovery

Calculators should be product discovery tools.

Flow:

```text
Calculator input -> estimate -> related category/products -> expert/contact/cart
```

Rules:

- Make result easy to understand.
- Show “estimate only” disclaimer.
- Connect each calculator to commercial paths.

---

## Comparison-Based Discovery

Future comparison should help technical buyers.

Compare:

- product name
- price
- unit
- size
- factory
- weight
- loading place
- availability signal

Comparison should not be required for simple buyers.

---

## Discovery Prioritization

Implementation priority:

1. Search and category discovery
2. Product detail related products
3. Article-to-category/product links
4. Calculator-to-product links
5. Recently viewed
6. Popular/trending based on real analytics

---

## Discovery Metrics

Track in future:

- search usage
- no-result rate
- category-to-product click rate
- article-to-product click rate
- calculator-to-product click rate
- product-to-cart rate
- product-to-call rate
- cart-to-checkout rate
