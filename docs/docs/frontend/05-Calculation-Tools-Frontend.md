# Dynamic Calculation Tool Renderer — Frontend Architecture v1.0

Version: 1.0  
Document: `05-Calculation-Tools-Frontend.md`  
Status: Storefront calculator UX architecture  
Depends on: `01-Frontend-API-Contracts.md`, Calculator Experience Contract v1.1  
Date: 2026-08-04

---

## 1. Purpose

Design a **schema-driven** Calculation Tools UI where:

1. Frontend lists tools from the API  
2. Frontend builds forms from **UI Input Schema**  
3. Frontend submits values to execute  
4. Frontend renders an **engineering result** only  

**Absolute rule**

```text
Frontend NEVER knows formulas.
Frontend NEVER computes weight/quantity locally.
Frontend NEVER calls Pricing for tool results.
Frontend NEVER hard-codes Diameter/Length fields per tool.
```

Adding a new calculator later = backend FormulaType + CalculationTool only → **no FE deploy** for new fields.

---

## 2. Ownership reminder

| Layer | Owns |
|-------|------|
| Calculation Engine | FormulaType, InputContract, execution math |
| Calculator Experience | Tool metadata, UI schema, execute orchestration |
| Search | Discovery projection (`CalculationTool`) |
| **Frontend** | Render list, dynamic form, call execute, show result |

`formulaTypeId` on the detail DTO is opaque — FE may ignore it for rendering (optional analytics only).

---

## 3. API flow (existing contracts only)

```text
GET  /api/calculation/tools
        ↓
User selects tool (id or slug)
        ↓
GET  /api/calculation/tools/{id}
  or GET /api/calculation/tools/by-slug/{slug}
        ↓
Dynamic form from `inputs[]`
        ↓
POST /api/calculation/execute
        ↓
Render ExecuteToolResultDto
```

Optional personalization (does **not** affect Search ranking):

- `GET/PUT /api/calculation/tools/my*`
- `POST .../pin` · `POST .../hide`

Do **not** use `POST /api/calculation/calculate` for public tool UX (that is FormulaType/Product path). Prefer **`/execute`**.

---

## 4. DTOs the renderer consumes

### 4.1 Tool list

```ts
type CalculationToolListItemDto = {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  category: string
  displayOrder: number
  isPinned?: boolean
}
```

### 4.2 Tool detail + UI schema (“validation rules” for FE)

```ts
type CalculationToolDetailDto = {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  category: string
  seoTitle?: string | null
  seoDescription?: string | null
  displayOrder: number
  formulaTypeId: string          // opaque — do not interpret
  targetPath: string
  inputs: UiInputDto[]           // SOURCE OF FORM
}

type UiInputDto = {
  key: string                    // payload key for execute.inputs
  label: string                  // visible label
  type: string                   // "Number" | "Text" | "Select" | "Boolean" (V1)
  unit?: string | null           // display only (e.g. mm, meter)
  required: boolean              // client + server required
  options?: string[] | null      // Select only
}
```

**Mapping prompt language → contract**

| Prompt phrase | Actual field |
|---------------|--------------|
| input schema | `inputs: UiInputDto[]` |
| validation rules | `required`, `type`, `options` (+ server errors on execute) |
| title / description | `title`, `description` (+ SEO fields for `<head>`) |

There is **no** separate `validationRules` JSON beyond these fields in the current API.

### 4.3 Execute

```ts
// Request
{
  toolId: string
  inputs: Record<string, number>           // keys = UiInputDto.key
  inputUnits?: Record<string, string | null>
}

// Response — engineering only
type ExecuteToolResultDto = {
  quantity: number
  unit?: string | null
  formulaKey?: string | null               // optional display; not a formula to run
  formulaTypeId: string
  toolId: string
}
```

**No money fields.** Do not show IRR/Toman from this response.

---

## 5. Routes (FE)

| Route | Screen |
|-------|--------|
| `/tools` or `/tools/calculators` | Tool list / portal |
| `/tools/calculators/[slug]` | Dynamic tool page (preferred; matches `targetPath`) |
| `/tools/calculators/id/[id]` | Fallback by guid |

Search hits with `contentType === CalculationTool` navigate via `targetPath`.

---

## 6. Screen: Tool list

```text
GET /api/calculation/tools?anonymousId=
```

| Concern | Spec |
|---------|------|
| Render | Cards: `icon`, `title`, `description`, `category`; pinned first (`isPinned`) |
| Order | Trust API order (prefs merge already applied server-side when owner present) |
| Loading | Card grid skeleton |
| Error / empty | Retry / “ابزاری موجود نیست” |
| Mobile | 1-column cards; large tap target → slug route |
| Forbidden | `if (slug === 'rebar-weight') ...` special cases |

---

## 7. Screen: Dynamic Tool Renderer (core)

### 7.1 Load

```text
GET /api/calculation/tools/by-slug/{slug}
  → detail
  → document title = seoTitle ?? title
  → meta = seoDescription ?? description
```

### 7.2 Form generation algorithm

```ts
function renderForm(inputs: UiInputDto[]) {
  return inputs.map(field => {
    switch (normalizeType(field.type)) {
      case 'number':  return <NumberField ... />
      case 'text':    return <TextField ... />
      case 'select':  return <SelectField options={field.options ?? []} ... />
      case 'boolean': return <CheckboxOrSwitch ... />
      default:        return <TextField ... /> // safe fallback, still no formula
    }
  })
}
```

**Every control binds to `values[field.key]`.**

| UiInputDto | Control behavior |
|------------|------------------|
| `label` | Visible label (e.g. قطر) |
| `unit` | Affix / hint (mm, meter) — display only |
| `required` | HTML `required` + client validation before submit |
| `options` | Select options only |
| `key` | Name of execute payload entry |

### 7.3 Client validation (UI only — not engineering)

Allowed **before** `POST /execute`:

1. Required fields non-empty  
2. `Number` → finite number (parse Persian/Arabic digits if product supports)  
3. `Select` → value ∈ `options`  
4. `Boolean` → boolean  

**Forbidden client validation**

- Weight coefficients (`d² × L × 0.006165`, …)  
- Unit conversion math that belongs to CE  
- Cross-field engineering constraints inventing CE rules  

Server remains final authority (CE InputContract + Experience publish rules).

### 7.4 Build execute payload

```ts
function toExecuteBody(toolId: string, inputs: UiInputDto[], values: Record<string, unknown>) {
  const numericInputs: Record<string, number> = {}
  const inputUnits: Record<string, string | null> = {}

  for (const field of inputs) {
    const raw = values[field.key]
    if (raw === undefined || raw === '' || raw === null) {
      if (field.required) throw new ClientValidationError(field.key, 'required')
      continue
    }
    if (normalizeType(field.type) === 'number' || isNumericField(field)) {
      numericInputs[field.key] = Number(raw)
    } else if (normalizeType(field.type) === 'boolean') {
      // Current execute DTO is IReadOnlyDictionary<string, decimal>.
      // Booleans/text: only send if backend accepts numeric encoding,
      // or omit until API extends — see §12 Gaps.
      numericInputs[field.key] = raw ? 1 : 0
    } else {
      // Text/Select: V1 execute API expects decimal dictionary.
      // Prefer Number() when option is numeric; otherwise block submit with clear error
      // until API supports non-decimal inputs.
      const n = Number(raw)
      if (Number.isFinite(n)) numericInputs[field.key] = n
      else throw new ClientValidationError(field.key, 'numeric_required_for_v1_execute')
    }
    if (field.unit) inputUnits[field.key] = field.unit
  }

  return { toolId, inputs: numericInputs, inputUnits }
}
```

**V1 API reality:** `ExecuteToolRequestDto.Inputs` is `Dictionary<string, decimal>`. Seeded rebar tool uses Number fields (`Diameter`, `Length`, `Quantity`) — primary path. Document gap for rich Text/Select in §12.

### 7.5 Execute

```http
POST /api/calculation/execute
Content-Type: application/json

{
  "toolId": "...",
  "inputs": { "Diameter": 14, "Length": 12, "Quantity": 10 },
  "inputUnits": { "Diameter": "mm", "Length": "meter" }
}
```

| State | UX |
|-------|-----|
| Loading | Disable submit; button spinner; keep form values |
| Success | Show result panel / bottom sheet |
| Error | Map `errors[].message` (+ `errorCode` e.g. `CEXP_TOOL_NOT_PUBLISHED`); highlight fields if message implies key |

---

## 8. Result rendering

```ts
// Show
quantity + (unit ?? '')

// Optional secondary (not formulas to run)
formulaKey   // e.g. "round-bar-weight" — label only
```

| Do | Don't |
|----|-------|
| Format number for locale (fa-IR) | Recompute quantity |
| Show unit from response | Call `/api/pricing/*` |
| Offer “محاسبه مجدد” (clears result, keeps inputs) | Show FinalPrice / VAT |
| Link to Catalog Search for product name (optional) | Embed CE InputContract UI |

Mobile: result in **bottom sheet** with large quantity typography.

---

## 9. Example: schema → form (rebar seed)

Backend `inputs` (illustrative of seed):

| key | label | type | unit | required |
|-----|-------|------|------|----------|
| Diameter | قطر | Number | mm | true |
| Length | طول | Number | meter | true |
| Quantity | تعداد | Number | — | false |

FE produces **three controls** via `map` — not a `RebarForm.tsx`.

Execute body keys **must** match schema keys (`Diameter`, not `diameter`) unless backend normalizes (current CE contract uses those names).

---

## 10. Component architecture

```text
features/calculation-tools/
  api/
    toolsApi.ts                 # list, bySlug, byId, execute, prefs
  model/
    uiInputType.ts              # normalizeType()
    formValues.ts               # toExecuteBody + client validate
  hooks/
    useToolsList.ts
    useToolDetail.ts            # by slug/id
    useToolExecute.ts
    useToolPreferences.ts       # optional
  components/
    ToolCard.tsx
    ToolListScreen.tsx
    ToolDetailScreen.tsx
    DynamicToolForm.tsx         # inputs.map
    fields/
      NumberField.tsx
      TextField.tsx
      SelectField.tsx
      BooleanField.tsx
      FieldShell.tsx            # label + unit + error
    ExecuteButton.tsx
    CalculationResultPanel.tsx
  forbidden/
    # no RebarWeightForm.tsx
    # no weightFormula.ts
```

### `DynamicToolForm` contract

```ts
type Props = {
  inputs: UiInputDto[]
  values: Record<string, unknown>
  errors: Record<string, string>
  disabled?: boolean
  onChange: (key: string, value: unknown) => void
}
```

---

## 11. State machine (tool page)

```text
idle → loadingDetail → ready
         ↓ errorDetail

ready → validating (client) → executing → success
                 ↓ invalid        ↓ errorExecute
               ready              ready (keep values)
```

Clear `result` when any input changes (optional UX) to avoid stale quantity.

---

## 12. Gaps & honest constraints

| Topic | Current backend | FE stance |
|-------|-----------------|-----------|
| Execute inputs type | `decimal` dictionary only | Number-first tools; Text/Select only if coercible to number |
| Engineering validation messages | Via `OperationResult.errors` | Display as-is; no local CE clone |
| Admin tool CRUD API | Not exposed publicly | List = published seed/tools only |
| Unit conversion | CE / caller responsibility | Send `inputUnits` from schema `unit`; do not convert mm↔m in FE |
| Preferences | Separate endpoints | Optional; never feed Search |

---

## 13. Mobile UX

1. List: one column; pinned tools first.  
2. Detail: title + short description above fold; form fields full-width.  
3. `inputMode="decimal"` for Number fields.  
4. Sticky bottom **محاسبه** button.  
5. Result sheet with large `quantity` + `unit`.  
6. No formula explanation that embeds coefficients (copy can be CMS/description from API only).  
7. Safe-area for sticky CTA.

---

## 14. Caching

| Query | TTL |
|-------|-----|
| tools list | ~30s (server 30s) |
| tool detail | ~60s |
| execute | **never cache** |

Invalidate list after preference pin/hide/order if personalized list used.

---

## 15. Accessibility & SEO

- Each field: `<label htmlFor={key}>`  
- Errors: `aria-invalid` + `aria-describedby`  
- Result: `aria-live="polite"` on quantity update  
- SEO: `seoTitle` / `seoDescription` from detail DTO  
- Do not index execute responses  

---

## 16. Anti-patterns (reject in review)

```ts
// FORBIDDEN
if (tool.slug === 'rebar-weight') {
  return <input name="diameter" />
}

function localWeight(d, L, n) {
  return d * d * L * n * 0.006165
}

await pricingApi.calculate(...)  // on tool result
```

```ts
// REQUIRED
detail.inputs.map(field => <FieldRenderer key={field.key} field={field} />)
await toolsApi.execute({ toolId, inputs, inputUnits })
```

---

## 17. Acceptance checklist

- [ ] Tool list rendered only from `GET /api/calculation/tools`  
- [ ] Form fields created solely from `inputs[]`  
- [ ] No tool-specific form components for steel calculators  
- [ ] Execute uses `POST /api/calculation/execute`  
- [ ] Result shows `quantity` + `unit` only (no money)  
- [ ] Client validation limited to required/type/options  
- [ ] New backend tool appears without FE code change  
- [ ] Mobile sticky execute + result sheet  

---

## 18. References

- `docs/frontend/01-Frontend-API-Contracts.md` §5  
- `docs/frontend/03-Search-Experience-Architecture.md` (CalculationTool navigation)  
- `Modules/CalculatorExperience/Docs/Calculation Tool Contract v1.1.md`  
- Controllers: `CalculationToolsController`  

---

*End of Dynamic Calculation Tool Renderer — Frontend Architecture v1.0*
