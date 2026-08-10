# Catalog Frontend Architecture v1.0

Version: 1.0  
Status: Architecture guidance for storefront Catalog UI  
Depends on: `01-Frontend-API-Contracts.md`  
Date: 2026-08-04

---

## 1. Purpose

Define a **mobile-first** Catalog frontend that displays:

- Categories (tree from backend)
- Product listings
- Product detail
- Specifications (template-driven)
- Current price (Pricing BC)
- Related calculators / articles / products (composed from existing APIs)

**Non-negotiable**

- Do **not** hard-code steel categories (میلگرد، تیرآهن، …).
- Backend owns catalog structure (`GET /api/catalog/categories*`).
- Do **not** invent Catalog/Related endpoints — only compose contracts that already exist.
- Variants: **out of scope** (no backend API).

---

## 2. Principles

| ID | Principle |
|----|-----------|
| P-01 | Mobile-first layout; progressive enhancement for desktop |
| P-02 | Data-driven UI — render names, trees, specs from DTOs |
| P-03 | Split ownership on PDP: Catalog = identity/specs; Pricing = money; Search/Blog/Tools = related rails |
| P-04 | Non-blocking secondary data — price/related never block first paint of title |
| P-05 | Respect `saleMode` and `outOfStockDisplayPolicy` from ProductDto |
| P-06 | Spec labels come from SpecificationTemplate definitions, not FE dictionaries |

---

## 3. Information architecture & routes

Suggested Next.js/App Router-style routes (FE-owned paths; data from APIs):

| Route | Screen | Primary data |
|-------|--------|----------------|
| `/catalog` | Category listing (roots + browse) | `GET /api/catalog/categories` |
| `/catalog/categories/[id]` | Category detail + children + PLP | `GET /api/catalog/categories/{id}` + `GET .../products/by-category/{id}` |
| `/catalog/products/[id]` | Product detail (PDP) | product + template + pricing + related composition |
| `/catalog/factories/[id]` | Optional factory PLP | `GET .../factories/{id}` + `.../products/by-factory/{id}` |

Deep links from Search hits use `targetPath` when provided; Catalog FE may also accept `/catalog/products/{id}`.

---

## 4. Screen architecture

### 4.1 Category listing (`/catalog`)

**Goal:** Let user browse the category tree without any FE-owned taxonomy.

```text
Load: GET /api/catalog/categories
Build tree: parentCategoryId + isRoot
Render: roots → expandable children (mobile: bottom-sheet / accordion)
```

| Concern | Spec |
|---------|------|
| Loading | Tree skeleton (3–5 rows) |
| Error | Retry + empty “دسته‌ای یافت نشد” |
| Empty | Show Search CTA |
| Cache | Client 2–5 min (server 120s) |
| Mobile | Full-width list; tap root → detail; long tree → sticky search within page |

**Forbidden:** `const CATEGORIES = ['میلگرد', ...]`

---

### 4.2 Category detail (`/catalog/categories/[id]`)

```text
Parallel:
  A) GET /api/catalog/categories/{id}     → name, children, templateId, formulaTypeId?
  B) GET /api/catalog/products/by-category/{id}
Optional:
  C) GET /api/catalog/templates/{specificationTemplateId}  → for filter labels later
```

**Layout (mobile-first)**

1. Header: `category.name`
2. Children chips → navigate to child category id
3. Product list: cards from `ProductDto[]` (`displayName`, factory later via factory map)
4. Optional factory filter: client filter after `GET /api/catalog/factories` join on `factoryId`

| State | Behavior |
|-------|----------|
| Loading | Header + card grid skeleton |
| 404 category | Not-found |
| Products empty | “محصولی در این دسته نیست” |
| Mobile | Virtualize list; pull-to-refresh refetches A+B |

---

### 4.3 Product listing (PLP)

Same product card component used under category and factory.

**Card fields (from `ProductDto` only)**

- Title: `displayName`
- Meta: resolve `factoryId` → factory name (from cached factories list)
- Badge: map `saleMode` / OOS policy (see §6)
- CTA: navigate to PDP

**Do not** show Final Price on every card unless product count is small — prefer `GET /api/pricing/products/{id}/validate` or `/active` for visible cards (lazy / viewport). Default V1: price on PDP only to protect mobile bandwidth.

---

### 4.4 Product detail (PDP) — required sections

Mobile scroll order (single column):

```text
1. Product information          ← Catalog
2. Specifications               ← Catalog + Template
3. Current price / CTA          ← Pricing
4. Related calculators          ← composed
5. Related articles             ← composed
6. Related products             ← composed
```

Desktop: 1–3 in main column; 4–6 as rails below or side — same data hooks.

---

## 5. PDP data orchestration

### 5.1 Critical path (block shell)

```text
GET /api/catalog/products/{id}
  → product
GET /api/catalog/templates/{product → category.specificationTemplateId}
  → need category first if templateId not on product:
     GET /api/catalog/categories/{product.categoryId}
     then GET /api/catalog/templates/{specificationTemplateId}
```

**Minimum first paint:** `displayName`, `registrationUnit`, sale/OOS badges — do not wait for related rails.

### 5.2 Price path (parallel, non-blocking)

```text
GET /api/pricing/products/{productId}/active
  → isSellable, salesStatus, price?

On user qty / orderUnit change:
POST /api/pricing/calculate
  { productId, orderUnitId, quantity }
  → FinalPriceDto
```

Default order unit: `orderUnits.find(u => u.isDefault) ?? orderUnits[0]`.  
Clamp qty to `minimumOrderQuantity` / `maximumOrderQuantity`.

### 5.3 Specifications rendering (dynamic)

```text
definitions = template.definitions sorted by displayOrder
valuesByDefId = Map(product.specificationValues)

for each definition:
  label = definition.name
  value = valuesByDefId.get(definition.id)?.value
  render by definition.dataType (Text/Number/Decimal/Boolean/Date/Selection)
  if missing && definition.isRequired → show "—" or “نامشخص”
```

**Never** hard-code spec keys (diameter, grade, …).

### 5.4 Related content composition (no dedicated Related API)

Backend does **not** expose `GET /products/{id}/related-*`. Compose from existing contracts:

| Rail | Strategy (V1 — use only existing APIs) | Fallback |
|------|----------------------------------------|----------|
| **Related products** | `GET /api/catalog/products/by-category/{product.categoryId}` exclude current `id`; take N | Hide section if &lt; 1 |
| **Related articles** | `GET /api/blog/posts/search?title={encodeURIComponent(product.displayName)}&pageSize=6` **or** `GET /api/search?q={displayName}&types=Article` | Hide if empty |
| **Related calculators** | Prefer `GET /api/search?q={token}&types=CalculationTool` where `token` is first meaningful word(s) of `displayName` **or** list `GET /api/calculation/tools` and filter client-side by title/category overlap with product name | If `product.formulaTypeId` set, prefer tools where `formulaTypeId` matches (`tools` detail/list includes `formulaTypeId` only on **detail** — list items do not; use Search CalculationTool hits or fetch tools then optional detail) |

**Recommended V1 calculators approach (honest & API-real):**

```text
1) GET /api/calculation/tools
2) Optionally GET /api/search?q={displayName}&types=CalculationTool
3) Merge unique by id/sourceId; cap 3–6
4) Navigate via tool slug → /tools/calculators/{slug} or hit.targetPath
```

Do **not** call Pricing or CE calculate from related rails.

Related sections load **after** critical path (`useEffect` / deferred query / `Suspense` boundaries). Failure of related → hide section, never fail PDP.

---

## 6. Sale mode & out-of-stock UX

From `ProductDto` (+ price `isSellable`):

| `saleMode` | FE behavior |
|------------|-------------|
| FullyOnline (1) | Show qty + order unit + Final Price CTA when sellable |
| SemiCustom (2) | Show price if sellable; CTA may be “درخواست / تماس” per business copy |
| FullyCustom (3) | Emphasize contact; still show specs |

| `outOfStockDisplayPolicy` | FE behavior |
|---------------------------|-------------|
| Hidden (1) | Prefer not listing in PLP when known unavailable (if only discovered via pricing, hide price CTA) |
| TaggedNoAction (2) | Show “ناموجود” badge; disable purchase |
| ContactButton (3) | Show contact CTA instead of buy |

Price `ActivePriceResultDto.isSellable === false` → follow `salesStatus` messaging; never invent prices.

---

## 7. Module / folder structure (suggested)

```text
features/catalog/
  api/
    catalogApi.ts          # thin fetch wrappers → OperationResult
    pricingApi.ts
    relatedApi.ts          # search/blog/tools composers
  model/
    categoryTree.ts        # buildTree(categories)
    specViewModel.ts       # join template + values
    saleMode.ts            # enum maps for badges
  hooks/
    useCategoryTree.ts
    useCategoryPage.ts
    useProductPage.ts      # orchestrates critical + deferred
    useProductPrice.ts
    useRelatedRails.ts
  components/
    CategoryTree.tsx
    CategoryChildrenChips.tsx
    ProductCard.tsx
    ProductHeader.tsx
    SpecificationTable.tsx   # dynamic rows
    PricePanel.tsx           # units + qty + FinalPriceDto
    RelatedCalculatorsRail.tsx
    RelatedArticlesRail.tsx
    RelatedProductsRail.tsx
  screens/
    CatalogHomeScreen.tsx
    CategoryDetailScreen.tsx
    ProductDetailScreen.tsx
```

---

## 8. State & caching strategy

| Query key | Source | Stale / align |
|-----------|--------|----------------|
| `['catalog','categories']` | categories list | ~2–5 min |
| `['catalog','category', id]` | category detail | ~2 min |
| `['catalog','products','category', id]` | PLP | ~1 min |
| `['catalog','product', id]` | PDP | ~1 min |
| `['catalog','template', id]` | specs labels | ~5 min |
| `['catalog','factories']` | join names | ~5 min |
| `['pricing','active', productId]` | active price | ~30s |
| `['pricing','calc', productId, unitId, qty]` | calculate | no persist / short |
| `['related', productId, 'products'\|'articles'\|'tools']` | composers | 1–2 min; isolate errors |

Use React Query / SWR (or equivalent). Related queries: `retry: 0` or 1; `throwOnError: false`.

---

## 9. Loading / error / empty matrix

| Surface | Loading | Error | Empty |
|---------|---------|-------|-------|
| Category tree | Skeleton list | Retry banner | Empty + Search |
| PLP | Card grid skeleton | Retry | Empty category copy |
| PDP header | Title skeleton | Full-page 404 | — |
| Specs | Table skeleton | Hide table + toast | “مشخصاتی ثبت نشده” |
| Price | Shimmer on CTA | Soft error; keep product visible | Contact / unavailable |
| Related rails | Small horizontal skeleton | Hide rail | Hide rail |

---

## 10. Mobile UX specifics

1. **First viewport (PDP):** brand/title, key badges, primary price CTA — not related rails.
2. **Sticky bottom bar:** price summary + primary action when sellable.
3. **Order unit:** bottom sheet selector, not dense dropdown.
4. **Specs:** definition list (label/value), not wide HTML table on small screens.
5. **Related:** horizontal snap carousels; max ~6 items; tap → navigate.
6. **Category browse:** avoid multi-column mega-menu; use drill-down.
7. **Touch:** 44px targets; debounce qty steppers before `POST /pricing/calculate`.

---

## 11. Component contracts (view models)

### SpecRowViewModel

```ts
{ definitionId: string; label: string; value: string | null; dataType: number; displayOrder: number }
```

Built only from Template + Product values.

### PricePanelViewModel

```ts
{
  orderUnits: OrderUnitDto[]
  selectedOrderUnitId: string
  quantity: number
  active?: ActivePriceResultDto
  quote?: FinalPriceDto
  status: 'idle' | 'loading' | 'ready' | 'error'
}
```

### RelatedItemViewModel (unified rail card)

```ts
{ kind: 'product' | 'article' | 'calculator'; id: string; title: string; href: string; subtitle?: string }
```

| kind | href source |
|------|-------------|
| product | `/catalog/products/{id}` |
| article | `/blog/...` from slug or Search `targetPath` |
| calculator | Search `targetPath` or `/tools/calculators/{slug}` |

---

## 12. Sequence diagrams

### Category page

```text
UI → categories/{id}
UI → products/by-category/{id}
UI → (optional) factories
UI ← render children + cards
```

### PDP

```text
UI → product/{id} ─────────────────────────────┐
UI → category/{categoryId} → template/{id}     ├─ critical
UI ← paint header + specs                      ┘
UI → pricing/.../active  ─ parallel
UI → related composers   ─ deferred
User changes qty → POST pricing/calculate
```

---

## 13. Accessibility & SEO

- Category/Product pages: use `displayName` / `category.name` in document title.
- Specs: `<dl>` / list semantics on mobile.
- Price updates: `aria-live="polite"` on Final Price.
- Do not index admin. Public catalog is AllowAnonymous.

---

## 14. Explicit non-goals (V1 Catalog FE)

- Hard-coded category taxonomy
- Variant selectors (no API)
- Client-side formula execution
- Calling Admin Catalog APIs from storefront
- Assuming Related Products API exists
- Showing money from Calculation Experience execute

---

## 15. Acceptance checklist

- [ ] Categories render solely from `/api/catalog/categories`
- [ ] Adding a new backend category appears without FE deploy
- [ ] Specs render from template definitions + product values
- [ ] Price uses Pricing APIs only
- [ ] Related calculators/articles/products degrade gracefully
- [ ] Mobile first viewport has no related-rail clutter
- [ ] No steel category names in source constants

---

## 16. References

- `docs/frontend/01-Frontend-API-Contracts.md`
- Controllers: `CatalogController`, `PricingController`, `SearchController`, `PostsController`, `CalculationToolsController`

---

*End of Catalog Frontend Architecture v1.0*
