# Admin Frontend Architecture v1.0

Version: 1.0  
Document: `06-Admin-Frontend-Architecture.md`  
Status: Back-office UI architecture  
Depends on: `01-Frontend-API-Contracts.md`  
Date: 2026-08-04

---

## 1. Purpose

Design the HyperAhan **Admin Panel** frontend for:

| Module | Backend owner |
|--------|----------------|
| Catalog Admin | Catalog BC |
| Pricing Admin | Pricing BC |
| Blog Admin | Blog BC |
| Calculation Tool Admin | Calculator Experience (+ CE FormulaTypes read) |
| Search Admin | Search BC |

**Rules**

1. **Follow backend ownership** — each screen calls only its BC admin APIs.  
2. **Do not duplicate business rules** — no FE VAT, formula math, slug uniqueness inventing, tier resolution, Search ranking.  
3. **Dynamic forms where possible** — especially specs (template definitions) and tool UI schema.  
4. **NoStore** — never cache admin GETs; always send Admin JWT.  
5. **Do not invent admin APIs** — gaps are explicit blockers, not FE workarounds.

---

## 2. Cross-cutting admin shell

### 2.1 Auth

```text
Login → Admin JWT (Roles=Admin)
Authorization: Bearer {token}
401/403 → re-login / forbidden page
```

All listed admin routes use `[Authorize(Roles = "Admin")]`.

### 2.2 App structure

```text
/admin
  /catalog
    /products
    /categories
    /factories
    /templates
  /pricing
    /products/[productId]
    /configuration
  /blog
    /posts
    /categories
  /calculation
    /formula-types          # CE read-only V1
    /tools                  # Experience — see gap §6
  /search
    /documents
    /rebuild
```

### 2.3 Shared FE patterns

| Pattern | Spec |
|---------|------|
| API client | Separate `adminApi` with auth interceptor; `cache: 'no-store'` |
| Envelope | Same `OperationResult<T>` as storefront |
| Errors | Surface `errors[].message` + `errorCode`; map 409 Conflict |
| Mutations | Disable submit; optimistic UI only for non-money toggles; rollback on fail |
| Invalidation | After Catalog/Blog/Tool mutations that affect Search, offer **Rebuild** or rely on backend ingest hooks — do not reimplement sync in FE |
| Dynamic form engine | Reuse field renderer by schema/definitions (shared with Tools FE concepts) |

### 2.4 What Admin FE must never do

- Compute Final Price / VAT / tiers  
- Execute or invent formulas  
- Hard-code steel categories or spec keys  
- Rebuild Search ranking client-side  
- Write SEO into CE FormulaType  
- Call storefront-only endpoints as source of truth for writes when admin endpoint exists  

---

## 3. Catalog Admin

**APIs:** `/api/admin/catalog/products`, `/api/admin/catalog/*` lookups  
**Reads (optional):** public `/api/catalog/*` for pickers when convenient (still NoStore in admin session recommended)

### 3.1 Ownership

| Concern | Owner |
|---------|--------|
| Product identity, order units, specs values | Catalog |
| Spec definition shape | Specification Template |
| FormulaTypeId on product/category | Catalog stores opaque Guid; list from CE admin GET |
| Price | Pricing Admin only |

### 3.2 Screens

| Screen | Primary APIs |
|--------|----------------|
| Product create | `POST /api/admin/catalog/products` (`RegisterProductDto`) |
| Product edit (patch actions) | display-name, category, sale-mode, OOS, registration-unit, order-units CRUD, specs put/delete, formula-type put/delete |
| Categories | create, rename, parent, template, formula-type |
| Factories | create, rename, activate/deactivate |
| Templates | create, rename, definitions add/remove, patch display-order / required / searchable / data-type |

### 3.3 Dynamic forms

**Specification values on product**

```text
1) Load category → specificationTemplateId
2) GET /api/catalog/templates/{id}  (or keep template from admin list)
3) For each definition (sorted displayOrder):
     render control by dataType
     value from product.specificationValues
4) Save: PUT .../specifications/{definitionId} per change
   or batch UX that calls PUT per field
```

**Order units** — table driven from `ProductDto.orderUnits`; add/edit via admin DTOs (conversion factor, min/max). FE does not validate conversion business rules beyond required fields; server rejects invalid domain states.

**FormulaType picker** — options from `GET /api/admin/calculation/formula-types` (Id + Name + BuiltInKey). Store only selected Guid on product/category.

### 3.4 Variants

**No admin Variant API on disk.** Do not build Variant admin UI until backend ships.

---

## 4. Pricing Admin

**API base:** `/api/admin/pricing`

### 4.1 Ownership

| Concern | Owner |
|---------|--------|
| Base price, tiers, lifecycle | Pricing |
| Product existence | Catalog (picker only) |
| Engineering quantity inside Final Price | Pricing→CE server-side — invisible to admin FE math |

### 4.2 Screens

| Screen | APIs |
|--------|------|
| Product pricing workspace | `GET .../products/{id}/active`, history, trend |
| Create price | `POST /prices` (`CreateBasePriceDto` + optional tiers) |
| Replace active | `POST /prices/replace` |
| Tier management | `POST .../tiers`, `DELETE .../tiers/{tierId}` |
| Lifecycle | obsolete, expire |
| Configuration (read) | `GET /configuration` — **display** VatEnabled/VatRate; do not recompute VAT in UI |

### 4.3 Dynamic aspects

- Tier editor: repeatable rows `{ threshold, thresholdUnit, basePrice }` → API DTOs  
- Trend chart: plot `PriceTrendPointDto` as-is (x=activatedAtUtc, y=basePrice) — no derived series  

### 4.4 Forbidden

```ts
// FORBIDDEN
final = base * qty * (1 + vatRate)
```

Admin “preview quote” (optional): call **public** `POST /api/pricing/calculate` with Admin token if allowed, or document as storefront-only — do not reimplement Pricing rules in the form.

---

## 5. Blog Admin

**API base:** `/api/admin/blog/posts`, `/api/admin/blog/categories`

### 5.1 Ownership

| Concern | Owner |
|---------|--------|
| Post body, slug, publish, SEO | Blog |
| Images | multipart + File module via Blog APIs |
| Search projection | Backend ingest after publish — FE may trigger Search rebuild if needed |

### 5.2 Screens

| Screen | APIs |
|--------|------|
| Post list / search | `GET /api/admin/blog/posts/search` |
| Create / update | `POST` / `PUT` multipart (`CreatePostDto` / `UpdatePostDto`) |
| SEO / slug | `PATCH .../seo`, `PATCH .../slug` |
| Publish / unpublish / delete | corresponding PATCH/DELETE |
| Categories CRUD | admin blog categories |

### 5.3 Dynamic / forms

- SEO fields: simple form bound to DTOs  
- Body: rich text editor — content only; no Catalog rules  
- Category select: from Blog categories (not Catalog categories)  

Respect `X-Robots-Tag: noindex` on admin GETs — admin app should be `noindex` globally.

---

## 6. Calculation Tool Admin

Split into two backend surfaces:

### 6.1 Formula Types (Calculation Engine) — **available V1**

`GET /api/admin/calculation/formula-types`  
`GET /api/admin/calculation/formula-types/{id}`

| UI | Behavior |
|----|----------|
| List | Name, BuiltInKey, IsDefault |
| Detail | Read-only **InputContract** table: Name, ExpectedUnit, IsMandatory |

**V1:** read-only (no Formula Builder). Do not edit contracts in FE.  
**Do not** put SEO/slug/icon on FormulaType screens.

### 6.2 Calculation Tools (Calculator Experience) — **gap**

| Need | Backend status |
|------|----------------|
| Admin CRUD for CalculationTool (title, slug, schema, formulaTypeId, publish) | **No** `/api/admin/.../tools` controller |
| Public list/detail/execute | Exists under `/api/calculation/tools*` (AllowAnonymous) |

**Admin FE stance**

1. Ship Formula Types browser now.  
2. Tool Admin UI is **blocked** on admin write APIs — do not misuse public execute as admin editor.  
3. When APIs exist, Tool form must be schema-driven:

```text
fields:
  title, slug, description, icon, category, SEO
  formulaTypeId ← picker from Formula Types
  inputs[] ← dynamic UiInputDto editor (key, label, type, unit, required, options)
actions:
  publish / unpublish
→ Search projection via backend hooks (not FE Search register for normal path)
```

4. Preview: optional navigate to storefront tool page or `POST /api/calculation/execute` with test inputs — still no local formula.

---

## 7. Search Admin

**API base:** `/api/admin/search`

### 7.1 Ownership

| Concern | Owner |
|---------|--------|
| Index documents | Search |
| Source truth | Catalog / Blog / Calculator Experience |
| Ranking | Search backend only |

### 7.2 Screens

| Screen | APIs | Notes |
|--------|------|-------|
| Rebuild | `POST /rebuild` | Primary ops action after bulk catalog/blog changes |
| Manual document upsert | `POST/PUT /documents` | Exception path / Tool seed repair — not daily CMS |
| Remove | `DELETE /documents` body `{ contentType, sourceId }` | |

`contentType`: Product=1, Category=2, Article=3, CalculationTool=4 (prefer sending names if binder accepts — match Swagger).

### 7.3 Rules

- Prefer **Rebuild** over hand-editing projections when sources exist.  
- Do not build a “ranking weight” editor — not in API.  
- After Rebuild, show `upserted` / `removed` from `RebuildSearchResultDto`.  
- Manual register form: dynamic `contentType` select + fields from `RegisterSearchDocumentDto` only.

---

## 8. Cross-module admin workflows

### 8.1 New sellable product (happy path)

```text
Catalog: create template defs (if needed)
Catalog: create category → assign template
Catalog: create factory
Catalog: register product + order units + spec values
CE: pick FormulaTypeId (optional) → assign on product
Pricing: create base price (+ tiers)
Search: usually auto via ingest; else Rebuild
```

FE: wizard can **orchestrate screens**; each step still calls the owning API only.

### 8.2 New public calculator (when Tool Admin API exists)

```text
CE: ensure FormulaType exists (read-only today / seed)
Experience Admin: create CalculationTool + UI schema + formulaTypeId + publish
Search: ingest/rebuild CalculationTool
Storefront: dynamic form works without FE change
```

### 8.3 Publish blog article

```text
Blog Admin: create/update → publish
Search: ingest Article (backend); Rebuild if missing
```

---

## 9. Dynamic form system (admin-wide)

Shared `AdminFieldRenderer`:

| Source schema | Used in |
|---------------|---------|
| `SpecificationDefinitionDto` | Catalog product specs |
| `UiInputDto` (future Tool admin) | Calculation Tool editor + preview |
| `InputContractEntryDto` | Formula Type **read-only** display |
| Price tier row model | Pricing tier editor |

```ts
// Pattern — never encode domain invariants beyond required/type
renderFields(definitions, values, onChange)
submit → admin API DTO
on error → show OperationResult.errors
```

---

## 10. Suggested package layout

```text
apps/admin/   (or features/admin/)
  shell/          # layout, nav, auth
  catalog/
  pricing/
  blog/
  calculation/
    formula-types/
    tools/          # stub + gap banner until API
  search/
  shared/
    OperationResultAlert.tsx
    DynamicFields.tsx
    NoStoreQueryProvider.tsx
    FormulaTypePicker.tsx
    ProductPicker.tsx
```

---

## 11. Caching & UX

| Rule | Detail |
|------|--------|
| Server | Admin controllers `ResponseCache(NoStore)` |
| Client | React Query `staleTime: 0`, `gcTime` short; refetch on focus |
| Desktop-first | Admin may be desktop-primary; still usable forms on tablet |
| Confirm destructive | expire/obsolete price, delete post, Search rebuild, delete definition |

---

## 12. Availability matrix (honest)

| Admin module | Write APIs | Read APIs | FE build now? |
|--------------|------------|-----------|---------------|
| Catalog | Yes | Yes (+ public) | **Yes** |
| Pricing | Yes | Yes | **Yes** |
| Blog | Yes | Yes | **Yes** |
| CE Formula Types | No (V1) | Yes | **Yes (read-only)** |
| Calculation Tools | **No admin CRUD** | Public tools GET | **Shell + gap**; full UI after API |
| Search | Yes (docs + rebuild) | via rebuild result | **Yes** (ops-focused) |
| Variants | No | No | **No** |

---

## 13. Acceptance checklist

- [ ] Admin JWT on all mutations  
- [ ] No FE business-rule duplicates (VAT, formulas, ranking)  
- [ ] Catalog specs rendered from template definitions  
- [ ] Pricing edits only via `/api/admin/pricing`  
- [ ] Blog multipart create/update wired  
- [ ] Formula Types read-only browser  
- [ ] Calculation Tool admin blocked/gap-documented until write API  
- [ ] Search Rebuild primary; manual docs secondary  
- [ ] NoStore / no CDN cache for admin data  

---

## 14. References

- `docs/frontend/01-Frontend-API-Contracts.md` §6 Admin  
- Controllers: `AdminProductsController`, `AdminCatalogLookupsController`, `AdminPricingController`, `AdminPostsController`, `AdminCategoriesController`, `AdminFormulaTypesController`, `AdminSearchController`  
- Experience: public `CalculationToolsController` (not admin)  
- Ownership: Calculator Experience Contract v1.1, CE ADR-001  

---

*End of Admin Frontend Architecture v1.0*
