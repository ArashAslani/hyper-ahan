# Dynamic UI Rendering System v1.0

Version: 1.0  
Document: `08-Dynamic-UI-Rendering-System.md`  
Status: Cross-cutting frontend system design  
Depends on: `01`–`06` frontend architecture docs + live Application DTOs  
Date: 2026-08-04

---

## 1. Purpose

Introduce the frontend to **every backend-driven UI surface** in HyperAhan and define one rendering system so that:

- Structure comes from APIs (not hard-coded steel taxonomy / forms)
- New definitions (specs, tool inputs, search groups) appear without FE deploy when schema-compatible
- Validation stays UI-level; **business rules stay on the backend**

This file is the index + contract for dynamic UI. Feature docs (`02`, `03`, `05`, `06`) remain screen-specific.

---

## 2. Principles

| ID | Rule |
|----|------|
| D-01 | **Schema in, pixels out** — renderers consume normalized field descriptors |
| D-02 | **No domain math in renderers** — no VAT, weight formulas, Search re-rank |
| D-03 | **Own BC owns schema** — Catalog templates ≠ Tool UI schema ≠ CE InputContract |
| D-04 | **Fallback never invents business data** — unknown type → safe control + log |
| D-05 | **Server is final authority** — client validate for UX only |

---

## 3. Inventory — backend-driven UI

| # | UI surface | Backend source | Schema shape (actual) | Storefront | Admin |
|---|------------|----------------|----------------------|------------|-------|
| 1 | **Product attributes (specs)** | Template definitions + product values | `SpecificationDefinitionDto` + `SpecificationValueDto` | PDP / filters | Product edit |
| 2 | **Categories** | Category tree | `CategoryDto` / `CategoryDetailDto` | Nav, PLP | Category CRUD |
| 3 | **Calculation forms** | Tool detail `inputs[]` | `UiInputDto[]` | Tool page | Tool admin *(API gap)* |
| 4 | **Search result groups** | Suggest hits / `GroupedSearchResultDto` | `contentType` + `SearchHitDto` | Suggest + SRP | — |
| 5 | **Content blocks** | Blog posts / SEO fields / tool SEO | `PostResponseDto`, tool SEO, sitemap | Article, meta | Blog editor |
| 6 | **Admin forms** | Admin DTOs + dynamic defs | Specs, tiers, Search doc, FormulaType contract (RO) | — | All admin modules |
| 7 | **Order units (semi-dynamic)** | `ProductDto.orderUnits` | `OrderUnitDto[]` | Price panel | Product edit |
| 8 | **Formula InputContract (RO)** | CE FormulaType | `InputContractEntryDto[]` | — | Formula Types browser |
| 9 | **Price tiers (repeatable)** | Pricing DTOs | `PriceTierDto` / input rows | Optional breakdown | Pricing editor |

**Not dynamic / not available**

- Product Variants UI — no public/admin Variant API  
- CMS page builder blocks — no generic “content block” schema API (Blog body is a single rich field)  
- Search facets beyond `types`  

---

## 4. Canonical FE schema format

Backends expose **different** DTOs. FE normalizes to one internal descriptor for renderers:

```ts
/** HyperAhan Dynamic Field Descriptor (FE-normalized) */
type DynFieldType =
  | 'text'
  | 'number'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'select'
  | 'textarea'      // admin/content
  | 'file'          // blog image
  | 'readonly'      // display-only rows
  | 'unknown'

type DynField = {
  id: string                    // stable key for React + payload
  name: string                  // payload key (spec def id, UiInput.key, etc.)
  label: string
  type: DynFieldType
  required: boolean
  unit?: string | null
  options?: string[] | null
  displayOrder: number
  helpText?: string | null
  readOnly?: boolean
  meta?: Record<string, unknown> // source tag, dataType raw, searchable, …
}

type DynSchema = {
  schemaId: string              // templateId | toolId | 'search-groups' | …
  source:
    | 'catalog.spec'
    | 'catalog.category'
    | 'catalog.orderUnit'
    | 'calc.uiInput'
    | 'calc.inputContract'
    | 'search.group'
    | 'blog.post'
    | 'pricing.tier'
    | 'search.document'
    | 'admin.generic'
  fields: DynField[]
}
```

### 4.1 Adapters (source → DynSchema)

#### A) Product attributes

```ts
// SpecificationDefinitionDto
// dataType: Text=1, Number=2, Decimal=3, Boolean=4, Date=5, Selection=6

function fromSpecDefinitions(defs: SpecificationDefinitionDto[]): DynSchema {
  return {
    schemaId: templateId,
    source: 'catalog.spec',
    fields: defs
      .slice()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(d => ({
        id: d.id,
        name: d.id,                    // PUT .../specifications/{definitionId}
        label: d.name,
        type: mapSpecDataType(d.dataType),
        required: d.isRequired,
        displayOrder: d.displayOrder,
        meta: { isSearchable: d.isSearchable, rawDataType: d.dataType }
      }))
  }
}

// Values: SpecificationValueDto { specificationDefinitionId, value: string }
```

#### B) Categories

Not a field schema — **tree schema**:

```ts
type DynTreeNode = {
  id: string
  label: string                 // category.name
  parentId?: string | null
  isRoot: boolean
  children?: DynTreeNode[]
  meta?: { specificationTemplateId, formulaTypeId? }
}
// Built from GET /api/catalog/categories (+ detail.children)
```

Renderer: `CategoryTreeRenderer` / chips — labels always from API.

#### C) Calculation forms

```ts
// UiInputDto: key, label, type ("Number"|"Text"|"Select"|"Boolean"), unit?, required, options?

function fromToolInputs(toolId: string, inputs: UiInputDto[]): DynSchema {
  return {
    schemaId: toolId,
    source: 'calc.uiInput',
    fields: inputs.map((f, i) => ({
      id: f.key,
      name: f.key,                 // execute.inputs[key]
      label: f.label,
      type: mapUiInputType(f.type),
      required: f.required,
      unit: f.unit,
      options: f.options,
      displayOrder: i
    }))
  }
}
```

#### D) Search result groups

```ts
type DynSearchGroup = {
  contentType: 1 | 2 | 3 | 4    // Product, Category, Article, CalculationTool
  label: string                 // FE i18n map by contentType ONLY (presentation)
  hits: SearchHitDto[]          // order preserved from API
  totalCount: number
}
```

- Suggest: group flat hits client-side; **do not re-sort within group**  
- SRP: use `GroupedSearchResultDto.groups`  

#### E) Content blocks

| Block | Source | Dynamic? |
|-------|--------|----------|
| Article body | `PostResponseDto.body` | Single rich block — not a field array |
| Article meta | metaTitle, metaDescription, metaKeywords | Form fields from DTO keys |
| Tool SEO | seoTitle, seoDescription | Same |
| Sitemap cards | `BlogSitemapItemDto` | List renderer |
| Home post rails | latest / most-visited / best | List from API |

There is **no** generic page-composer JSON. “Content blocks” = compose known DTO regions, not a block CMS.

#### F) Admin forms

| Form | Dynamic driver |
|------|----------------|
| Product specs | Spec DynSchema |
| Template definition editor | Repeatable definition rows → admin DTOs |
| Price tiers | Repeatable tier rows |
| Search manual document | Static fields from `RegisterSearchDocumentDto` + enum contentType |
| FormulaType contract | Read-only table from `InputContractEntryDto` |
| Tool admin (future) | UiInputDto editor (list of DynFields) |

---

## 5. Renderer components

```text
shared/dynamic-ui/
  adapters/
    fromSpecDefinitions.ts
    fromToolInputs.ts
    fromCategories.ts
    fromSearchGroups.ts
    fromInputContract.ts
  components/
    DynForm.tsx                 # schema + values + onChange + errors
    DynField.tsx                # switch(type)
    fields/
      DynText.tsx
      DynNumber.tsx
      DynDecimal.tsx
      DynBoolean.tsx
      DynDate.tsx
      DynSelect.tsx
      DynTextarea.tsx
      DynFile.tsx
      DynReadonly.tsx
      DynUnknown.tsx            # fallback
    DynCategoryTree.tsx
    DynSearchGroupList.tsx
    DynHitRow.tsx
    DynRepeatableList.tsx       # tiers / schema builders
  validation/
    validateDynForm.ts          # client UX rules only
  types.ts
```

### 5.1 `DynForm` API

```ts
type DynFormProps = {
  schema: DynSchema
  values: Record<string, unknown>
  errors?: Record<string, string>
  disabled?: boolean
  mode?: 'edit' | 'view'
  onChange: (name: string, value: unknown) => void
  onSubmit?: () => void
}
```

### 5.2 Type → component map

| DynFieldType | Component | Notes |
|--------------|-----------|--------|
| text | DynText | Spec Text, tool Text |
| number / decimal | DynNumber | `inputMode="decimal"` |
| boolean | DynBoolean | switch/checkbox |
| date | DynDate | ISO string to API as agreed |
| select | DynSelect | `options` required; else fallback |
| textarea | DynTextarea | Blog body / SEO long |
| file | DynFile | Blog multipart |
| readonly | DynReadonly | InputContract, locked prices |
| unknown | DynUnknown | See §7 |

### 5.3 Non-form renderers

| Component | Input | Output |
|-----------|-------|--------|
| DynCategoryTree | `DynTreeNode[]` | Nav / admin tree |
| DynSearchGroupList | `DynSearchGroup[]` | Suggest / SRP sections |
| DynHitRow | `SearchHitDto` | Title + type icon → `targetPath` |
| SpecViewTable | DynSchema + values | PDP view mode |
| CalculationResultPanel | `ExecuteToolResultDto` | quantity + unit only |

---

## 6. Validation strategy

### 6.1 Layers

```text
1) Client (DynForm)     → required / type / options / min-max UI hints
2) Transport            → DTO shape for API
3) Server (BC Domain)   → real invariants — FINAL
```

### 6.2 Client rules (allowed)

| Rule | Applies |
|------|---------|
| `required` → non-empty | Specs, tool inputs, admin fields |
| number/decimal → finite number | Tools execute, order qty |
| select → value ∈ options | Tool Select, admin enums presented as select |
| file present on create | Blog create image |
| qty within OrderUnit min/max | Price panel — clamp before Pricing API |

### 6.3 Client rules (forbidden)

| Forbidden | Belongs to |
|-----------|------------|
| VAT / Final Price math | Pricing |
| Weight / engineering formulas | CE |
| Search hit re-ordering by score “improvement” | Search |
| Spec cross-field steel rules | Catalog Domain |
| Slug uniqueness checks beyond UX regex | Blog/Experience server |

### 6.4 Server errors → UI

```ts
OperationResult.errors[] →
  map errorCode / message to field when possible
  else form-level alert
```

Examples: `CEXP_TOOL_NOT_PUBLISHED`, Catalog domain messages, Pricing unsellable via `isSellable` (not always `errors`).

### 6.5 Tools execute note

V1 `POST /api/calculation/execute` accepts `Dictionary<string, decimal>`. DynForm must coerce Number fields; non-numeric Text/Select → client error or omit until API evolves (`05-Calculation-Tools-Frontend.md` §12).

---

## 7. Fallback behavior

| Situation | Fallback |
|-----------|----------|
| Unknown `SpecificationDataType` / `UiInputDto.type` | `DynUnknown`: show label + text input in admin; in storefront show value as text / hide edit |
| Missing spec value | Show “—” / “نامشخص”; if required in admin, block submit |
| Empty `options` on select | Render as text + console/warn |
| Empty category list | Empty state + Search CTA |
| Empty search groups | Omit section; if all empty → EmptyState component |
| Missing `targetPath` on hit | Fallback route by contentType + sourceId (Catalog/Blog docs); log warning |
| Tool schema empty | Block execute; show “فرم در دسترس نیست” |
| Partial related rails fail | Hide rail (Catalog FE) — do not fail page |
| FormulaType missing for picker | Empty select + link to Formula Types admin |
| Calculation Tool Admin API missing | Gap banner — no fake CRUD |
| API 404 schema parent (template) | Specs section hidden + error toast |

**Never fallback to hard-coded میلگرد / diameter fields.**

---

## 8. Mapping tables (quick reference)

### Spec dataType → DynFieldType

| SpecificationDataType | Value | DynFieldType |
|----------------------|------:|--------------|
| Text | 1 | text |
| Number | 2 | number |
| Decimal | 3 | decimal |
| Boolean | 4 | boolean |
| Date | 5 | date |
| Selection | 6 | select *(options not on definition DTO today — treat as text unless admin extends)* |

**Gap:** `SpecificationDefinitionDto` has no `options[]`. Selection type renders as text until backend adds options.

### UiInput type string → DynFieldType

| API `type` (string) | DynFieldType |
|---------------------|--------------|
| Number / number | number |
| Text / text | text |
| Select / select | select |
| Boolean / boolean | boolean |
| other | unknown |

### Search contentType → group label (i18n only)

| Value | Name | Label (FA) |
|------:|------|------------|
| 1 | Product | محصولات |
| 2 | Category | دسته‌ها |
| 3 | Article | مقالات |
| 4 | CalculationTool | ابزار محاسبه |

---

## 9. End-to-end examples

### 9.1 PDP specs

```text
GET product → categoryId
GET category → specificationTemplateId
GET template → definitions
adapter → DynSchema
values from product.specificationValues
DynForm mode=view (storefront) / edit (admin)
```

### 9.2 Tool calculator

```text
GET tools/by-slug → inputs
adapter → DynSchema
DynForm edit → validateDynForm → POST execute
Result panel (not DynForm)
```

### 9.3 Search suggest

```text
GET suggest → SearchHitDto[]
groupHitsPreserveOrder → DynSearchGroup[]
DynSearchGroupList → navigate targetPath
```

### 9.4 Admin price tiers

```text
DynRepeatableList of { threshold, thresholdUnit, basePrice }
submit → CreateBasePriceDto.tiers / AddPriceTierDto
```

---

## 10. Testing checklist

- [ ] New Catalog template definition appears on product admin/PDP without FE code change (same dataType)  
- [ ] New tool input field appears from API schema without tool-specific component  
- [ ] Unknown type uses DynUnknown, no crash  
- [ ] Search group order of hits unchanged by FE  
- [ ] Client validation does not implement VAT/weight  
- [ ] Selection spec without options degrades safely  
- [ ] Category names only from API  

---

## 11. Relationship to other docs

| Doc | Role |
|-----|------|
| `01-Frontend-API-Contracts` | Raw HTTP/DTO contracts |
| `02-Catalog-Frontend` | Category/PDP composition |
| `03-Search-Experience` | Suggest/SRP grouping rules |
| `04-Pricing-Frontend` | What must **not** be dynamic math |
| `05-Calculation-Tools-Frontend` | Tool form + execute |
| `06-Admin-Frontend` | Admin module ownership + gaps |
| **`08` (this)** | Unified dynamic rendering system |

---

## 12. Out of scope

- Visual page builder / drag-drop CMS blocks  
- Client-side formula DSL  
- Inventing Spec selection options or Tool admin CRUD  
- Elasticsearch-specific UI  

---

*End of Dynamic UI Rendering System v1.0*
