# Frontend API Contract Map v1.0

Version: 1.0  
Status: Derived from live WebApi controllers (do not invent)  
Source: `HyperAhan/src/EndPoints/WebApi/Controllers` + Application DTOs  
Date: 2026-08-04

---

## 0. Global conventions

### Envelope

Every endpoint returns HTTP status from `OperationResult.StatusCode` with body:

```ts
type OperationResult<T> = {
  isSuccess: boolean
  result: T | null | undefined  // default(T) on failure
  errors: OperationError[]
  statusCode: number            // mirrors HTTP status
}

type OperationResult = {
  isSuccess: boolean
  errors: OperationError[]
  statusCode: number
}

type OperationError = {
  message: string
  errorCode?: string | null
  type: number | string         // ErrorType enum (numeric unless FE configures string enums)
}
```

Typical `statusCode` values: `200`, `201`, `400`, `401`, `403`, `404`, `409`.

### Auth

| Pattern | Meaning |
|---------|---------|
| `AllowAnonymous` | Public storefront / tools |
| `[Authorize(Roles = "Admin")]` | Bearer JWT with Admin role |
| Optional JWT on tools/my | If `NameIdentifier` / `sub` present → user prefs; else `anonymousId` query |

### JSON

- Property names: **camelCase** (ASP.NET Core default)
- Enums: **numeric** by default (no `JsonStringEnumConverter` in Program.cs) — FE should accept numbers; sending string enum names may work for model binding depending on binder config — prefer numbers or match Swagger

### Shared pagination (Blog)

```ts
type PaginatedData<T> = {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}
```

### FE state conventions (apply to all sections)

| State | Guidance |
|-------|----------|
| **Loading** | Disable submit; show skeleton/spinner scoped to the surface (header suggest ≠ full page) |
| **Error** | Read `errors[0].message` (+ `errorCode` if present); map `404`→empty, `400`→inline validation, `401/403`→re-auth/admin gate, `409`→conflict toast |
| **Caching** | Honor server `ResponseCache` where present; client may SWR/React Query with matching TTL; **never** cache Admin `NoStore` responses |
| **Mobile UX** | Prefer progressive disclosure; keep first paint light; debounce search/suggest; avoid blocking navigation on non-critical pricing/calc |

### Explicit gaps (not invented)

| Requested area | Backend status |
|----------------|----------------|
| **Product variants** | **No** public/admin Variant controllers or DTOs on disk |
| Separate `ProductsController` | Product reads live under `CatalogController` (`/api/catalog/products/...`) |

---

## 1. Catalog APIs

Base: `/api/catalog` (public) · `/api/admin/catalog` (admin)

### 1.1 Categories

#### `GET /api/catalog/categories`

| Field | Contract |
|-------|----------|
| **Purpose** | List all catalog categories (nav / filters) |
| **Request** | none |
| **Response** | `OperationResult<CategoryDto[]>` |
| **DTO** | `{ id, name, parentCategoryId?, specificationTemplateId, isRoot, formulaTypeId? }` |
| **Auth** | AllowAnonymous |
| **Cache (server)** | 120s, `Location=Any` |
| **Loading** | Category tree skeleton in nav/drawer |
| **Error** | Toast + retry; empty tree fallback |
| **Caching (client)** | Soft cache 2–5 min; invalidate after admin category mutations |
| **Mobile UX** | Collapsible tree / bottom-sheet category picker |

#### `GET /api/catalog/categories/{id}`

| Field | Contract |
|-------|----------|
| **Purpose** | Category detail including children |
| **Request** | path `id: guid` |
| **Response** | `OperationResult<CategoryDetailDto>` = CategoryDto + `{ children: CategoryDto[] }` |
| **Auth** | AllowAnonymous |
| **Cache** | 120s |
| **Loading** | Page skeleton |
| **Error** | 404 → “دسته‌بندی یافت نشد” |
| **Mobile UX** | Children as horizontal chips or nested list |

---

### 1.2 Products

#### `GET /api/catalog/products/{id}`

| Field | Contract |
|-------|----------|
| **Purpose** | Product detail (PDP) |
| **Request** | path `id` |
| **Response** | `OperationResult<ProductDto>` |
| **DTO** | `{ id, displayName, categoryId, factoryId, registrationUnit, saleMode, outOfStockDisplayPolicy, orderUnits[], specificationValues[], formulaTypeId? }` |
| **Nested** | `OrderUnitDto`: `{ id, unit, conversionFactor, minimumOrderQuantity, maximumOrderQuantity, isDefault }` · `SpecificationValueDto`: `{ specificationDefinitionId, value }` |
| **Enums** | `saleMode`: FullyOnline=1, SemiCustom=2, FullyCustom=3 · `outOfStockDisplayPolicy`: Hidden=1, TaggedNoAction=2, ContactButton=3 |
| **Auth** | AllowAnonymous |
| **Cache** | 60s |
| **Loading** | PDP skeleton (title, specs, CTA) |
| **Error** | 404 → not-found page |
| **Mobile UX** | Sticky CTA; load pricing separately (see §4) |

#### `GET /api/catalog/products/by-category/{categoryId}`

| Field | Contract |
|-------|----------|
| **Purpose** | Products in a category (PLP) |
| **Request** | path `categoryId` |
| **Response** | `OperationResult<ProductDto[]>` |
| **Cache** | 60s |
| **Loading** | Product card grid skeleton |
| **Mobile UX** | Virtualized list; pull-to-refresh |

#### `GET /api/catalog/products/by-factory/{factoryId}`

| Field | Contract |
|-------|----------|
| **Purpose** | Products by factory |
| **Request** | path `factoryId` |
| **Response** | `OperationResult<ProductDto[]>` |
| **Cache** | 60s |
| **Mobile UX** | Same as PLP |

---

### 1.3 Specifications (templates)

#### `GET /api/catalog/templates`

| Field | Contract |
|-------|----------|
| **Purpose** | List specification templates |
| **Response** | `OperationResult<SpecificationTemplateDto[]>` |
| **DTO** | `{ id, name, definitions: SpecificationDefinitionDto[] }` · definition: `{ id, name, dataType, displayOrder, isRequired, isSearchable }` |
| **dataType** | Text=1, Number=2, Decimal=3, Boolean=4, Date=5, Selection=6 |
| **Cache** | 120s |
| **Mobile UX** | Rarely full-page; use when rendering filter/spec forms |

#### `GET /api/catalog/templates/{id}`

| Field | Contract |
|-------|----------|
| **Purpose** | Single template with definitions |
| **Cache** | 120s |

---

### 1.4 Factories

#### `GET /api/catalog/factories` · `GET /api/catalog/factories/{id}`

| Field | Contract |
|-------|----------|
| **Purpose** | Factory list / detail for filters and branding |
| **Response** | `OperationResult<FactoryDto>` / list |
| **DTO** | `{ id, name, status, isActive }` · `status`: Active=1, Inactive=2 |
| **Cache** | 120s |
| **Mobile UX** | Filter chip list |

---

### 1.5 Variants

**Not available.** No Variant endpoints in current WebApi. Do not call `/api/catalog/variants*`.

---

## 2. Search APIs

Base: `/api/search`

### Content types (hit grouping)

| Name | Value |
|------|------:|
| Product | 1 |
| Category | 2 |
| Article | 3 |
| **CalculationTool** | **4** |

### 2.1 Suggest

#### `GET /api/search/suggest?q=&limit=`

| Field | Contract |
|-------|----------|
| **Purpose** | Autocomplete / typeahead |
| **Request** | query `q: string`, `limit?: number` (default 8) |
| **Response** | `OperationResult<SearchHitDto[]>` |
| **DTO** | `{ documentId, sourceId, contentType, title, targetPath, relevanceScore }` |
| **Auth** | AllowAnonymous |
| **Cache** | 15s, VaryBy: `q`, `limit` |
| **Loading** | Inline spinner under search box; keep previous hits until new arrives |
| **Error** | Empty dropdown + soft error (do not block page) |
| **Caching (client)** | Debounce 200–300ms; short memory cache per `q` |
| **Mobile UX** | Full-screen search sheet; show icon by `contentType` (esp. CalculationTool → calculator) |

**CalculationTool hits:** navigate to `targetPath` (e.g. `/tools/calculators/rebar-weight`) — do **not** call CE from Search.

---

### 2.2 Full search (grouped)

#### `GET /api/search?q=&types=&page=&pageSize=`

| Field | Contract |
|-------|----------|
| **Purpose** | Full search with groups by content type |
| **Request** | `q`, `types?` (comma-separated names e.g. `Product,CalculationTool`), `page=1`, `pageSize=20` |
| **Response** | `OperationResult<GroupedSearchResultDto>` |
| **DTO** | `{ groups: SearchGroupDto[], totalHits, page, pageSize }` · group: `{ contentType, hits: SearchHitDto[], totalCount }` |
| **Auth** | AllowAnonymous |
| **Cache** | 15s, VaryBy: `q,types,page,pageSize` |
| **Loading** | Results page skeleton by group sections |
| **Error** | Empty state + retry |
| **Mobile UX** | Tab or accordion per group (Products / Articles / Tools…); CalculationTool group → tool deep link |

---

### 2.3 Document by id

#### `GET /api/search/documents/{id}`

| Field | Contract |
|-------|----------|
| **Purpose** | Fetch indexed document metadata |
| **Response** | `OperationResult<SearchDocumentDto>` |
| **DTO** | `{ id, sourceId, contentType, title, searchableText, targetPath, status }` · status Available=1, Unavailable=2 |
| **Cache** | 30s |
| **Mobile UX** | Rarely primary UX; prefer hit `targetPath` |

---

## 3. Blog APIs

### 3.1 Posts (public) — `/api/blog/posts`

| Method + route | Purpose | Request | Response | Cache |
|----------------|---------|---------|----------|-------|
| `GET .../by-slug/{slug}` | Article page | path slug | `PostResponseDto` (may **301** + `Location` on canonical) | 60s, Vary `slug` |
| `GET .../latest?count=` | Home latest | `count=10` | `PostResponseDto[]` | 60s |
| `GET .../most-visited?count=` | Popular | `count=10` | list | 60s |
| `GET .../best?count=` | Curated best | `count=10` | list | 120s |
| `GET .../search` | Blog search/list | `PostSearchParams` | `PaginatedData<PostResponseDto>` | 30s, Vary `*` |
| `GET .../by-category/{categoryId}` | By category id | `page`, `pageSize` | paginated | 60s |
| `GET .../by-category-slug/{categorySlug}` | By category slug | `page`, `pageSize` | paginated | 60s |
| `GET .../sitemap` | SEO sitemap data | — | `BlogSitemapItemDto[]` | 300s |

**`PostSearchParams`:** `{ title?, description?, categoryId?, fromDate?, toDate?, onlyPublished (forced true on public), page, pageSize, sortBy }`  
`sortBy`: PublishDateDesc / Asc, VisitDesc / Asc, TitleAsc / Desc.

**`PostResponseDto` (key):**  
`id, title, description, body, slug, userId, ownerName, image?: FileDto, categoryId, categoryTitle, categorySlug, visit, metaTitle?, metaDescription?, metaKeywords?, canonicalSlug?, contentProvenance?, humanReviewed, readabilityScore?, originalityScore?, publishedDate, updatedDate?, isPublished, createdAt`

**`FileDto`:** `{ id, url, thumbnailUrl, width, height, alt }`

| State | Guidance |
|-------|----------|
| Loading | Article skeleton; list cards skeleton |
| Error | 404 article; soft fail carousels |
| Mobile UX | Follow 301 redirects; prefer `thumbnailUrl`; lazy-load `body` |

### 3.2 Categories (public) — `/api/blog/categories`

| Route | Response | Cache |
|-------|----------|-------|
| `GET /api/blog/categories` | Blog `CategoryDto[]` `{ id, title, slug, metaTitle?, metaDescription? }` | 120s |
| `GET .../by-slug/{slug}` | single | 120s |

**Note:** Blog `CategoryDto` ≠ Catalog `CategoryDto`.

---

## 4. Pricing APIs

Base: `/api/pricing`

### `POST /api/pricing/calculate`

| Field | Contract |
|-------|----------|
| **Purpose** | Runtime Final Price (not persisted) |
| **Request** | `{ productId, orderUnitId, quantity }` |
| **Response** | `OperationResult<FinalPriceDto>` |
| **DTO** | `{ isSellable, salesStatus, resolvedBasePrice?, payableQuantity?, subtotal?, vatApplied, vatAmount?, finalPrice?, appliedTierId?, priceId? }` |
| **Auth** | AllowAnonymous |
| **Cache** | **none** (always fresh) |
| **Loading** | Price row shimmer; disable “add to cart” until resolved |
| **Error** | Show Contact/unavailable from `isSellable` / `salesStatus`; surface validation errors |
| **Mobile UX** | Recalculate on qty/unit change (debounce); never show money from CE tools |

### `GET /api/pricing/products/{productId}/active`

| Field | Contract |
|-------|----------|
| **Purpose** | Active sellability + price snapshot |
| **Response** | `ActivePriceResultDto` `{ isSellable, salesStatus, price?: PriceDto }` |
| **Cache** | 30s |
| **Mobile UX** | Badge “قابل فروش / تماس” |

### `GET /api/pricing/products/{productId}/validate`

| Field | Contract |
|-------|----------|
| **Purpose** | Lightweight sellability check |
| **Response** | `{ isSellable, salesStatus, priceId? }` |
| **Cache** | 30s |

---

## 5. Calculation Experience APIs

> Owned by **CalculatorExperience**, not CE Domain. Routes share `/api/calculation` prefix with CE formula endpoints.

### 5.1 Tool catalog & dynamic forms

#### `GET /api/calculation/tools?anonymousId=`

| Field | Contract |
|-------|----------|
| **Purpose** | List published calculators (nav / portal) |
| **Request** | optional `anonymousId`; optional JWT for user merge |
| **Response** | `CalculationToolListItemDto[]` `{ id, title, slug, description, icon, category, displayOrder, isPinned }` |
| **Cache** | 30s, Vary `anonymousId` |
| **Loading** | Tool card grid skeleton |
| **Error** | Empty tools state |
| **Mobile UX** | Pinned first; icon from `icon` key |

#### `GET /api/calculation/tools/{id}` · `GET /api/calculation/tools/by-slug/{slug}`

| Field | Contract |
|-------|----------|
| **Purpose** | Tool page + **UI Input Schema** for dynamic form |
| **Response** | `CalculationToolDetailDto` |
| **DTO** | `{ id, title, slug, description, icon, category, seoTitle?, seoDescription?, displayOrder, formulaTypeId, targetPath, inputs: UiInputDto[] }` |
| **UiInputDto** | `{ key, label, type, unit?, required, options? }` · `type` string e.g. `Number`, `Text`, `Select`, `Boolean` |
| **Cache** | 60s |
| **Loading** | Form skeleton from expected field count |
| **Error** | 404 → tool not found |
| **Mobile UX** | **Must** `inputs.map(renderControl)` — never hard-code rebar fields |

### 5.2 Execute tool

#### `POST /api/calculation/execute`

| Field | Contract |
|-------|----------|
| **Purpose** | Resolve tool → FormulaType → CE → engineering result |
| **Request** | `{ toolId, inputs: Record<string, number>, inputUnits?: Record<string, string \| null> }` |
| **Response** | `ExecuteToolResultDto` `{ quantity, unit?, formulaKey?, formulaTypeId, toolId }` |
| **Auth** | AllowAnonymous |
| **Cache** | none |
| **Loading** | Disable Calculate CTA; result skeleton |
| **Error** | Inline field errors from CE validation / `CEXP_*` codes |
| **Mobile UX** | Result sheet; **no money fields** — never call Pricing from this path |

### 5.3 Preferences (do not affect Search ranking)

| Method + route | Purpose | Request | Response | Cache |
|----------------|---------|---------|----------|-------|
| `GET /api/calculation/tools/my?anonymousId=` | Personalized list | optional JWT / anonymousId | `UserToolPreferenceItemDto[]` `{ id, title, slug, order, isPinned, isHidden }` | NoStore |
| `PUT /api/calculation/tools/my/order?anonymousId=` | Reorder | body `{ items: [{ calculatorId, order }] }` | `OperationResult` | NoStore |
| `POST /api/calculation/tools/my/{id}/pin?anonymousId=` | Pin | — | `OperationResult` | NoStore |
| `POST /api/calculation/tools/my/{id}/hide?anonymousId=` | Hide from personal list | — | `OperationResult` | NoStore |

| State | Guidance |
|-------|----------|
| Loading | Optimistic reorder/pin with rollback on failure |
| Error | Require `anonymousId` or login when server returns 400 owner-required |
| Mobile UX | Drag-and-drop list; hide ≠ delete tool from Search |

### 5.4 Related CE endpoints (engineering / not UX catalog)

| Route | Purpose | Notes for FE |
|-------|---------|--------------|
| `POST /api/calculation/calculate` | Direct FormulaType/Product calculate | Prefer **tools/execute** for public calculators |
| `GET /api/calculation/formula-types` | List FormulaTypes + InputContract | Engineering metadata; **not** tool menu |
| `GET /api/calculation/formula-types/{id}` | One FormulaType | Cache 120s |

`CalculateRequestDto`: `{ productId?, formulaTypeId?, inputs, inputUnits? }`  
`CalculationResultDto`: `{ quantity, unit?, formulaKey?, formulaTypeId }`

---

## 6. Admin APIs

Common: `[Authorize(Roles="Admin")]`, `[ResponseCache(NoStore=true)]` — **client: no cache, always Authorization header**.

### 6.1 Admin Catalog — products

Base: `/api/admin/catalog/products`

| Method + route | Purpose | Body / notes | Response |
|----------------|---------|--------------|----------|
| `POST /` | Register product | `RegisterProductDto` | `ProductDto` |
| `PATCH /{id}/display-name` | Rename | `ChangeDisplayNameDto` (id match) | `ProductDto` |
| `PATCH /{id}/category` | Move category | `ChangeProductCategoryDto` | `ProductDto` |
| `PATCH /{id}/sale-mode` | Sale mode | `ChangeSaleModeDto` | `ProductDto` |
| `PATCH /{id}/out-of-stock-policy` | OOS policy | `ChangeOutOfStockPolicyDto` | `ProductDto` |
| `PATCH /{id}/registration-unit` | Reg. unit | `ChangeRegistrationUnitDto` | `ProductDto` |
| `POST /{id}/order-units` | Add order unit | `AddOrderUnitDto` | `ProductDto` |
| `PUT /{id}/order-units/{orderUnitId}` | Update OU | `ChangeOrderUnitDto` | `ProductDto` |
| `PATCH /{id}/order-units/{orderUnitId}/set-default` | Default OU | — | `ProductDto` |
| `DELETE /{id}/order-units/{orderUnitId}` | Remove OU | — | `ProductDto` |
| `PUT /{id}/specifications/{definitionId}` | Set spec | `SetSpecificationValueDto` | `ProductDto` |
| `DELETE /{id}/specifications/{definitionId}` | Clear spec | — | `ProductDto` |
| `PUT /{id}/formula-type` | Assign CE formula | `AssignProductFormulaTypeDto` | `ProductDto` |
| `DELETE /{id}/formula-type` | Clear formula | — | `ProductDto` |

**Admin UX:** form wizards; invalidate public catalog caches after mutations; loading = full-form busy; errors = field-level from `errors[]`.

### 6.2 Admin Catalog — lookups

Base: `/api/admin/catalog`

**Categories:** `POST /categories`, `PATCH /categories/{id}/rename|parent|template`, `PUT|DELETE /categories/{id}/formula-type`  
**Factories:** `POST /factories`, `PATCH /factories/{id}/rename|activate|deactivate`  
**Templates:** `POST /templates`, rename, add/remove definitions, patch definition display-order / required / searchable / data-type  

(All return corresponding Catalog DTOs — see §1.)

### 6.3 Admin Pricing — `/api/admin/pricing`

| Route | Purpose | Response |
|-------|---------|----------|
| `POST /prices` | Create base price (+ optional tiers) | `PriceDto` |
| `POST /prices/replace` | Replace active | `PriceDto` |
| `POST /prices/{priceId}/tiers` | Add tier | `PriceDto` |
| `DELETE /prices/{priceId}/tiers/{tierId}` | Remove tier | `PriceDto` |
| `POST /prices/{priceId}/obsolete` | Obsolete (+ reason) | `PriceDto` |
| `POST /prices/{priceId}/expire` | Expire | `PriceDto` |
| `GET /products/{productId}/active` | Admin active view | `ActivePriceResultDto` |
| `GET /products/{productId}/history` | History | `PriceHistoryItemDto[]` |
| `GET /products/{productId}/trend?fromUtc&toUtc` | Trend | `PriceTrendPointDto[]` |
| `GET /configuration` | VAT/config | `PricingConfigurationDto` |

`PriceDto`: `{ id, productId, registrationUnit, basePrice, status, activatedAtUtc, validityStartsAtUtc, validityEndsAtUtc, tiers[], obsoleteReason? }`  
`status`: Active=1, Historical=2, Expired=3, Obsolete=4.

### 6.4 Admin Calculation Engine — `/api/admin/calculation/formula-types`

| Route | Purpose | Response |
|-------|---------|----------|
| `GET /` | List formula types | `FormulaTypeDto[]` |
| `GET /{id}` | Detail + InputContract | `FormulaTypeDto` |

No admin CalculationTool CRUD controller exists yet (seed-only publish).

### 6.5 Admin Search — `/api/admin/search`

| Route | Purpose | Body | Response |
|-------|---------|------|----------|
| `POST /documents` | Register/upsert projection | `RegisterSearchDocumentDto` | `SearchDocumentDto` |
| `PUT /documents` | Update | `UpdateSearchDocumentDto` | `SearchDocumentDto` |
| `DELETE /documents` | Remove | `RemoveSearchDocumentDto { contentType, sourceId }` | `OperationResult` |
| `POST /rebuild` | Rebuild from sources | — | `{ upserted, removed }` |

### 6.6 Admin Blog — `/api/admin/blog`

**Posts:** `POST/PUT` (multipart form `CreatePostDto` / `UpdatePostDto`), SEO/slug/publish/unpublish/delete, `GET {id}`, `GET search`  
**Categories:** `POST/PUT/DELETE` Blog category DTOs  

Admin posts set `X-Robots-Tag: noindex` on some GETs.

### 6.7 Other admin modules (exist; out of primary map detail)

Present on disk: Slider admin, File admin, Orders admin — not expanded here. Use Swagger for full shapes if needed.

---

## 7. Recommended FE composition flows

### PDP

```text
GET /api/catalog/products/{id}
GET /api/pricing/products/{id}/active   (or POST /pricing/calculate on qty change)
```

### Global search

```text
GET /api/search/suggest?q=
GET /api/search?q=&types=
→ if contentType === 4 (CalculationTool) → router.push(targetPath)
→ if Product → PDP + pricing
→ if Article → /blog/posts/by-slug/...
```

### Calculator portal

```text
GET /api/calculation/tools
GET /api/calculation/tools/by-slug/{slug}
  → render inputs dynamically
POST /api/calculation/execute
  → show quantity + unit only
Optional: GET/PUT tools/my* for personalization
```

---

## 8. Document control

| Item | Value |
|------|--------|
| Invented APIs | **None** |
| Variants | Explicitly unavailable |
| Source of truth if drift | Live controllers + Swagger `/swagger` |
| Next update | When Admin CalculationTool CRUD or Variants ship |

---

*End of Frontend API Contract Map v1.0*
