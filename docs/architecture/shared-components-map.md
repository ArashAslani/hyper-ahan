# Shared Components Map

**Project:** HyperAhan  
**Phase:** 2.5 — Architecture Synthesis  
**Purpose:** Define expected reusable components without implementing them.

Shared components must be domain-neutral unless explicitly listed as a reusable composition with a clear owner.

---

## Priority Scale

- **P0:** Required for foundation and repeated conversion paths.
- **P1:** Needed for near-term catalog/cart/checkout work.
- **P2:** Useful after SEO/content/admin expansion.

---

## Shared UI Primitives

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `Button` | Primary/secondary actions | All modules | P0 | High, domain-neutral |
| `Input` | Text/tel/search form input | Checkout, auth, search, admin | P0 | High, domain-neutral |
| `Textarea` | Multi-line input | Contact, checkout, admin | P1 | High, domain-neutral |
| `Select` | Controlled choice | Filters, forms, admin | P1 | High, domain-neutral |
| `Checkbox` | Agreement and filters | Checkout, filters, admin | P1 | High, domain-neutral |
| `RadioGroup` | Mutually exclusive choices | Forms, filters | P2 | Medium |
| `Badge` | Small status/category label | Catalog, orders, admin | P1 | High if semantic variants stay generic |
| `Card` | Generic content container | Public, catalog, content | P0 | High |
| `Divider` | Visual separation | All modules | P2 | High |
| `IconButton` | Accessible icon action | TopBar, tables, filters | P1 | High |

---

## Layout / Navigation Components

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `PageContainer` | Consistent max-width/padding | Public pages | P0 | High |
| `Section` | Semantic page section wrapper | Homepage, category, article | P1 | High |
| `Breadcrumbs` | SEO/orientation trail | Category, product, article, calculator | P1 | High |
| `BottomSheet` | Mobile filters/actions | Catalog, search, forms | P0 | High |
| `Modal` | Focused confirmation/input | Checkout, admin | P1 | High |
| `StickyActionBar` | Mobile conversion actions | Product, cart, checkout | P1 | Medium; must stay generic |
| `Tabs` | Section/category switching | Admin, content, product specs | P2 | Medium |

---

## Feedback Components

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `Toast` | Short action feedback | Cart, checkout, forms | P0 | High |
| `Alert` | Inline warning/info | Checkout, API errors | P1 | High |
| `EmptyState` | No data/no results guidance | Cart, search, orders, admin | P0 | High |
| `Skeleton` | Loading placeholder | Catalog, product, orders | P1 | High |
| `ErrorState` | Recoverable error display | API-backed pages | P1 | High |
| `SuccessState` | Post-submit confirmation | Checkout, support forms | P1 | Medium |

---

## Commerce Compositions

These are reusable compositions but not necessarily `shared/ui` primitives. Keep them feature-owned unless proven domain-neutral enough.

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `ProductCard` | Product summary and action | Catalog, related products, homepage | P0 | High, catalog-owned |
| `ProductPrice` / `PriceBadge` | Price/unit display | Catalog, product, cart | P0 | High, may be shared if domain-neutral enough |
| `ProductSpecList` | Structured specs | Product, comparison | P1 | Medium, catalog-owned |
| `RelatedProducts` | Focused product suggestions | Product, article, cart empty | P1 | Medium |
| `CategoryCard` | Category entry | Homepage, categories | P0 | High, catalog-owned |
| `PriceTable` | Compact price list | Homepage, category | P1 | Medium; must have mobile strategy |
| `AvailabilityBadge` | Honest availability signal | Product, category, admin | P1 | Medium |

---

## Checkout / Order Compositions

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `CartItemCard` | Cart item display | Cart | P0 | Feature-specific |
| `CartSummaryBar` | Sticky cart total/checkout CTA | Cart, product mini-cart in future | P0 | Medium |
| `PriceLockNotice` | Explain lock/expiry | Cart, checkout | P1 | Medium |
| `CheckoutStepper` | Multi-step checkout progress | Checkout | P0 | Medium |
| `AgreementBox` | Expert purchase agreement acceptance | Checkout | P0 | Feature-specific |
| `OrderTimeline` | Order status visualization | Orders, profile | P1 | Medium; order-owned |
| `OrderStatusBadge` | Human status label | Orders, admin | P1 | High if labels centralized |

---

## Content / SEO Components

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `ArticleCard` | Article preview | Homepage, blog, related articles | P2 | Medium |
| `RelatedContentBlock` | Guides/articles links | Category, product, article | P2 | Medium |
| `FAQList` | FAQ display | Category, support, article | P2 | High if schema-ready |
| `TopicClusterNav` | Content cluster navigation | Blog | P2 | Medium |
| `CTAContentBlock` | Article-to-commercial CTA | Article, category | P2 | Medium |

---

## Search / Discovery Components

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `SearchBar` | Product search input | TopBar, homepage, search, catalog | P0 | High |
| `FilterChips` | Quick filters | Catalog, search | P1 | High |
| `FilterSheet` | Mobile filters | Catalog, search | P0 | Medium |
| `NoResultsLead` | Convert failed search to lead/contact | Search, category | P1 | Medium |
| `RecentlyViewedList` | Return to prior products | Product, homepage, empty states | P2 | Medium |

---

## Admin Components (Future)

Admin components must be implemented only in Phase 8.

| Component | Purpose | Consumers | Priority | Reusability |
|-----------|---------|-----------|:--------:|-------------|
| `AdminTable` | Operational data table | Admin modules | P2 | High within admin |
| `AdminFilters` | Search/filter controls | Admin tables | P2 | High within admin |
| `AdminFormSection` | Group admin form fields | Admin CRUD | P2 | Medium |
| `ConfirmActionDialog` | Destructive action confirmation | Admin, maybe checkout | P2 | High |
| `UploadField` | File upload UI | Admin uploads/content | P2 | Medium |

---

## Promotion Rules

Before a component becomes shared:

- It has at least two real consumers.
- It does not import features/services/mocks.
- It has a small typed prop API.
- It protects accessibility by default.
- It uses design tokens.
- It does not encode hidden business rules.

Default: keep feature-local first.
