# Search Experience Architecture v1.0

Version: 1.0  
Status: Mobile-first storefront Search UX architecture  
Depends on: `01-Frontend-API-Contracts.md`  
Date: 2026-08-04

---

## 1. Purpose

Design a **Google-like** search experience for HyperAhan:

1. User types → debounced Suggest  
2. Dropdown shows hits **grouped** by ContentType  
3. Submit → Search Results Page with backend-grouped results  
4. Support pagination, type filters, empty/error states, ranking **display** only  

**Non-negotiable**

| Rule | Meaning |
|------|---------|
| Ranking is backend-owned | FE **must not** re-sort, boost, or pin by preference |
| Preferences ≠ Search | Calculator pin/hide never changes Search order |
| No invented Search APIs | Only `/api/search/suggest`, `/api/search`, `/api/search/documents/{id}` |
| Navigation via `targetPath` | FE does not reconstruct Catalog/Blog/Tool URLs from guesses when path exists |

---

## 2. Backend contracts (source of truth)

### 2.1 Suggest

```http
GET /api/search/suggest?q={q}&limit={limit}
```

- Default `limit=8`
- Response: `OperationResult<SearchHitDto[]>` (flat list — **not** pre-grouped)
- Server cache: 15s (`q`, `limit`)

### 2.2 Full search

```http
GET /api/search?q={q}&types={types?}&page={page}&pageSize={pageSize}
```

- Defaults: `page=1`, `pageSize=20`
- `types`: optional comma-separated **names** e.g. `Product,Article,CalculationTool`
- Response: `OperationResult<GroupedSearchResultDto>`
- Server cache: 15s

### 2.3 DTOs

```ts
type SearchContentType = 1 | 2 | 3 | 4
// Product=1, Category=2, Article=3, CalculationTool=4

type SearchHitDto = {
  documentId: string
  sourceId: string
  contentType: SearchContentType
  title: string
  targetPath: string
  relevanceScore: number
}

type SearchGroupDto = {
  contentType: SearchContentType
  hits: SearchHitDto[]
  totalCount: number
}

type GroupedSearchResultDto = {
  groups: SearchGroupDto[]
  totalHits: number
  page: number
  pageSize: number
}
```

Enums may arrive as **numbers** — map with a single FE dictionary for labels/icons.

---

## 3. Experience surfaces

| Surface | Route (FE) | Role |
|---------|------------|------|
| Global search entry | Header / home | Opens suggest sheet (mobile) or combobox (desktop) |
| Suggest overlay | ephemeral | Typeahead while typing |
| Search Results Page (SRP) | `/search?q=&types=&page=` | Submitted full search |
| Optional document peek | rare | `GET /api/search/documents/{id}` — prefer `targetPath` |

---

## 4. End-to-end flows

### 4.1 Typing → Suggest (Google-like)

```text
User focuses search
  → open Suggest UI (mobile: full-screen sheet)
User types
  → local state q
  → debounce 250–300ms
  → abort in-flight suggest
  → if q.trim().length < 2: clear suggestions (no API)
  → GET /api/search/suggest?q=&limit=8
  → group flat hits client-side by contentType
  → render sections in fixed display order
User taps hit
  → navigate(targetPath)  // close sheet
User presses Enter / Search
  → navigate(/search?q=...&page=1)  // clear types unless chip active
```

### 4.2 Submit → Search Results Page

```text
Read URL: q, types, page, pageSize
  → GET /api/search?...
  → render groups in fixed display order
  → pagination uses totalHits / page / pageSize
User toggles type filter
  → update URL types + page=1 → refetch
User changes page
  → update URL page → refetch (keep q, types)
```

---

## 5. Client-side grouping (Suggest only)

Backend suggest returns a **flat** ranked list. FE groups for display **without changing order within each group**:

```ts
const DISPLAY_ORDER: SearchContentType[] = [1, 2, 3, 4]
// Products → Categories → Articles → CalculationTools

function groupHitsPreserveOrder(hits: SearchHitDto[]): Map<SearchContentType, SearchHitDto[]> {
  const map = new Map<SearchContentType, SearchHitDto[]>()
  for (const hit of hits) {
    const list = map.get(hit.contentType) ?? []
    list.push(hit) // keep API order (backend ranking)
    map.set(hit.contentType, list)
  }
  return map
}
```

**Forbidden:** `hits.sort((a,b) => b.relevanceScore - a.relevanceScore)` after fetch.  
**Allowed:** partition into groups; within group keep array order from API.

SRP: use `groups` from `GroupedSearchResultDto` as returned; only **reorder group sections** for UI tabs (Products first, etc.), never reorder `hits` inside a group.

---

## 6. UI architecture

### 6.1 ContentType presentation map (labels/icons only)

| contentType | Label (FA) | Icon role | Navigate |
|-------------|------------|-----------|----------|
| 1 Product | محصولات | product | `targetPath` or `/catalog/products/{sourceId}` if path missing |
| 2 Category | دسته‌ها | folder | `targetPath` or `/catalog/categories/{sourceId}` |
| 3 Article | مقالات | article | `targetPath` (blog slug path) |
| 4 CalculationTool | ابزار محاسبه | calculator | `targetPath` (e.g. `/tools/calculators/...`) |

Labels are presentation; taxonomy of results still comes from backend hits.

### 6.2 Suggest UI (mobile-first)

```text
┌─────────────────────────────┐
│ [←]  [ input ..............]│  sticky
│                             │
│ محصولات                     │
│  · میلگرد ۱۴ …              │
│ دسته‌ها                     │
│  · میلگرد                   │
│ مقالات                      │
│  · راهنمای خرید …           │
│ ابزار محاسبه                │
│  · محاسبه وزن میلگرد        │
│                             │
│ [ نمایش همه نتایج ]         │  → SRP
└─────────────────────────────┘
```

| Behavior | Spec |
|----------|------|
| Debounce | 250–300ms |
| Min chars | 2 (configurable); 1 char → no call |
| Limit | 8 (API default) |
| Loading | Small spinner in sheet; keep previous groups until new data |
| Error | Soft empty + “تلاش مجدد”; do not toast-block app |
| Empty (200 + []) | “نتیجه‌ای نیست — جستجوی کامل” CTA → SRP |
| Keyboard | Enter → SRP; Escape/back → close |
| A11y | `role="combobox"` / listbox; aria-activedescendant for keyboard nav |

### 6.3 Search Results Page (SRP)

```text
┌─────────────────────────────┐
│ [q input] [جستجو]           │
│ [همه][محصول][دسته][مقاله][ابزار] │  type filters
│ ~ totalHits نتیجه           │
│                             │
│ === محصولات (n) ===         │
│  ranked rows…               │
│ === مقالات (n) ===          │
│ ...                         │
│ [< prev] page [next >]      │
└─────────────────────────────┘
```

**Desktop:** left filter chips optional; main column groups stacked.  
**Mobile:** horizontal filter chips; groups as accordion **or** sticky tabs that scroll to section.

---

## 7. Filters

Only filter supported by API today: **`types`**.

| UI chip | `types` query value |
|---------|---------------------|
| همه | omit `types` |
| محصولات | `Product` |
| دسته‌ها | `Category` |
| مقالات | `Article` |
| ابزار محاسبه | `CalculationTool` |

Multi-select (optional V1.1 UX): join with commas `Product,CalculationTool` — already supported by backend `ParseTypes`.

**Not available (do not invent):** factory filter, price range, date range on Search API. Those belong to Catalog/Blog list APIs, not Search.

Changing filters → `page=1` always.

---

## 8. Pagination

From `GroupedSearchResultDto`:

```ts
totalPages = Math.max(1, Math.ceil(totalHits / pageSize))
```

| Control | Behavior |
|---------|----------|
| Next/Prev | `page ± 1` in URL |
| pageSize | Default 20; expose 10/20 only if needed; max respect backend clamp (≤100) |
| Scroll | Mobile: restore scroll top on page change |
| Groups | Pagination is **global** across the query (backend page/pageSize), not per-group |

**Note:** `SearchGroupDto.totalCount` is count of hits **in that group in the response**, not a separate per-type pager. FE should not build fake per-group pagination unless backend adds it later.

---

## 9. Ranking display

Backend supplies `relevanceScore`. FE responsibilities:

| Do | Don't |
|----|-------|
| Preserve hit order from API | Re-sort by score/title locally |
| Optionally show subtle score/meter for power users / debug | Show pin/boost from Calculator preferences |
| Use score only for optional visual bar (normalized in group) | Interpret score as price or popularity |

**Suggested visual (optional, discreet):**

- Hide raw numbers in consumer mode  
- Optional thin relevance bar: `width = score / maxScoreInGroup`  
- Never label “رتبه ۱” unless product asks — order already implies ranking  

Debug/admin flag: `?debugScore=1` shows numeric `relevanceScore`.

---

## 10. Empty & error states

| Case | Suggest | SRP |
|------|---------|-----|
| Empty query | Placeholder tips / recent local queries (localStorage only) | Redirect home or show prompt to type |
| No hits (success) | “چیزی پیدا نشد” + “جستجوی کامل” | Illustration + tips (“املا را بررسی کنید”) + link to Catalog / Tools |
| 400 (empty q) | Don’t call / show validation | Inline “عبارت جستجو را وارد کنید” |
| Network / 5xx | Retry link in sheet | Full-page retry |
| Partial related failure | N/A | N/A (single Search call) |

**Recent queries:** FE-only (`localStorage`), max 8, never sent as ranking signal to API.

---

## 11. Loading strategy

| Phase | UX |
|-------|-----|
| Debouncing | No spinner (or subtle pulse on input) |
| Suggest in flight | Spinner top of sheet; keep stale groups (`keepPreviousData`) |
| SRP first load | Group section skeletons (4 blocks) |
| SRP filter/page change | Dim list + top progress; avoid full unmount flash |
| Abort | Cancel prior fetch on new keystroke / navigation |

---

## 12. URL & state sync (SRP)

```text
/search?q=میلگرد&types=Product,CalculationTool&page=2&pageSize=20
```

| Param | Source of truth |
|-------|-----------------|
| `q` | Required for SRP fetch |
| `types` | Filter chips |
| `page` | Pager |
| `pageSize` | Optional |

Suggest overlay does **not** need URL until submit (except optional `?focus=search`).

Use router replace for page changes; push for new `q` submit.

---

## 13. Module structure (suggested)

```text
features/search/
  api/searchApi.ts
  model/
    contentType.ts          # labels, icons, DISPLAY_ORDER
    groupHits.ts            # suggest grouping helper
    searchUrl.ts            # parse/serialize query
  hooks/
    useDebouncedValue.ts
    useSearchSuggest.ts     # debounce + abort + cache
    useSearchResults.ts     # SRP query from URL
  components/
    SearchEntry.tsx         # header trigger
    SuggestSheet.tsx        # mobile full-screen
    SuggestDropdown.tsx     # desktop
    SuggestGroup.tsx
    SearchHitRow.tsx        # title + type icon + optional score
    SearchFilters.tsx       # type chips
    SearchResultsPage.tsx
    SearchGroupSection.tsx
    SearchEmptyState.tsx
    SearchPagination.tsx
    RelevanceBar.tsx        # optional
```

---

## 14. Hook contracts

### `useSearchSuggest(q, { limit = 8, debounceMs = 280 })`

```ts
{
  groups: { contentType, label, hits: SearchHitDto[] }[]  // DISPLAY_ORDER, omit empty
  status: 'idle' | 'debouncing' | 'loading' | 'success' | 'error'
  error?: string
  refetch: () => void
}
```

### `useSearchResults(urlState)`

```ts
{
  data?: GroupedSearchResultDto
  sections: { contentType, label, group: SearchGroupDto }[]  // ordered for UI
  status: 'loading' | 'success' | 'error' | 'empty'
  // empty = success && totalHits === 0
}
```

---

## 15. Navigation matrix

| Hit contentType | Action |
|-----------------|--------|
| Product | `router.push(targetPath)` |
| Category | `router.push(targetPath)` |
| Article | `router.push(targetPath)`; follow Blog 301 if any later |
| CalculationTool | `router.push(targetPath)` — **never** execute calculation from Search |

If `targetPath` empty (shouldn’t happen for Available docs): fallback by type using `sourceId` routes from Catalog Architecture — log warning.

---

## 16. Caching (client)

| Key | TTL hint | Notes |
|-----|----------|-------|
| `['search','suggest', q, limit]` | 15–30s | Align server 15s |
| `['search','full', q, types, page, pageSize]` | 15–30s | Invalidate on new submit |
| Recent queries | local only | Not ranking |

Do not cache failed 400 empty-query responses as empty success.

---

## 17. Mobile UX checklist (critical)

1. Search opens as **full-screen sheet** (not tiny dropdown under keyboard).  
2. Input autofocus; `inputMode="search"`; submit button in keyboard.  
3. Debounce to protect battery/network.  
4. Group headers sticky inside sheet while scrolling hits.  
5. Hit row ≥ 44px; trailing type icon.  
6. SRP filters = horizontal scroll chips.  
7. Empty state uses large tap targets for Catalog / Tools.  
8. Ranking order trusted — no “مرتب‌سازی: مرتبط‌ترین” client sort control that reorders hits.  
9. Safe-area insets for notched devices.  
10. Back from SRP returns to previous app screen, not broken suggest state.

---

## 18. Accessibility

- Announce result count: `aria-live="polite"` when suggest/SRP updates  
- Groups: `role="group"` + labelled heading  
- Hits: links (`<a href={targetPath}>`) for open-in-new-tab  
- Filters: `aria-pressed` on chips  

---

## 19. Explicit non-goals

- Client-side FTS / fuzzy ranking  
- Applying user calculator preferences to Search  
- Facets beyond `types`  
- Infinite scroll unless product later changes API (V1 = page buttons)  
- Calling CE/Pricing from Search rows  
- Admin rebuild UI in storefront  

---

## 20. Acceptance checklist

- [ ] Suggest is debounced and abortable  
- [ ] Suggest UI groups Products / Categories / Articles / CalculationTools  
- [ ] Within each group, order matches API  
- [ ] SRP uses `GroupedSearchResultDto` without re-sorting hits  
- [ ] `types` filter syncs to URL and resets page  
- [ ] Pagination uses `totalHits`, `page`, `pageSize`  
- [ ] Empty and error states implemented for Suggest + SRP  
- [ ] Optional ranking display does not change order  
- [ ] Mobile sheet UX verified on small viewport  

---

## 21. References

- `docs/frontend/01-Frontend-API-Contracts.md` § Search  
- `docs/frontend/02-Catalog-Frontend-Architecture.md` (navigation targets)  
- Controllers: `SearchController`  
- DTOs: `SearchModule.Application/DTOs/SearchDtos.cs`  

---

*End of Search Experience Architecture v1.0*
