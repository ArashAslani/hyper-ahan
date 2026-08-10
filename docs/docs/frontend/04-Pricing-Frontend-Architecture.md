# Pricing Frontend Architecture v1.0

Version: 1.0  
Document: `04-Pricing-Frontend-Architecture.md`  
Status: Storefront pricing UX architecture  
Depends on: `01-Frontend-API-Contracts.md`, `02-Catalog-Frontend-Architecture.md`  
Date: 2026-08-04

> **FREEZE (Shopping Journey M0):** No `productVariantId`, no fake SKU/Variant mapping, and no Ordering cart API calls until platform alignment. Storefront cart is temporary **QuoteCart** (`ha_quote_cart_v1`) keyed by `productId` + `orderUnitId` with a Pricing `FinalPrice` snapshot. Do not invent Catalog variants. See §5.2.

---

## 1. Purpose

Design frontend pricing flows for:

1. **Product page** — unit + quantity → Final Price  
2. **Cart** — display server-owned line prices and total  

**Non-negotiable**

```text
Frontend MUST NOT calculate:
  - VAT
  - Discount
  - Weight
  - Engineering / payable quantity
  - Tier resolution
  - Final price from basePrice × qty locally

Backend owns all money math (Pricing BC).
Calculation Tools own engineering quantity — never merge into Pricing UI.
```

FE only: collect inputs, call APIs, render DTOs.

---

## 2. Backend contracts used

### 2.1 Pricing (PDP quote)

| Method | Route | Role |
|--------|-------|------|
| `GET` | `/api/pricing/products/{productId}/active` | Sellability + active `PriceDto` snapshot |
| `GET` | `/api/pricing/products/{productId}/validate` | Lightweight sellable check |
| `POST` | `/api/pricing/calculate` | Runtime Final Price (not persisted) |

```ts
// POST /api/pricing/calculate
type CalculateFinalPriceDto = {
  productId: string
  orderUnitId: string
  quantity: number
}

type FinalPriceDto = {
  isSellable: boolean
  salesStatus: string
  resolvedBasePrice?: number | null
  payableQuantity?: number | null      // from backend (may use CE) — DISPLAY ONLY
  subtotal?: number | null
  vatApplied: boolean
  vatAmount?: number | null
  finalPrice?: number | null
  appliedTierId?: string | null
  priceId?: string | null
}

type ActivePriceResultDto = {
  isSellable: boolean
  salesStatus: string
  price?: PriceDto | null
}
```

- `calculate`: **no** server ResponseCache  
- `active` / `validate`: server cache **30s**

### 2.2 Cart (Ordering)

| Method | Route | Role |
|--------|-------|------|
| `POST` | `/api/ordering/cart/items` | Add/update item; server locks unit price |
| `GET` | `/api/ordering/cart/{cartId}` | Read cart |

```ts
type AddToCartRequestDto = {
  cartId?: string | null
  sessionToken?: string | null
  productVariantId: string
  quantity: number
}

type CartItemDto = {
  id: string
  productVariantId: string
  quantity: number
  lockedUnitPrice: number    // server-locked
}

type CartResponseDto = {
  cartId: string
  expiresAt: string
  items: CartItemDto[]
  totalEstimate: number      // server-provided aggregate
}
```

FE **displays** `lockedUnitPrice` and `totalEstimate`.  
Do **not** recompute cart total as `sum(qty * price)` for money authority — use `totalEstimate` from response (even if it matches a trivial product; source of truth is API).

---

## 3. Forbidden frontend math

| Forbidden | Why |
|-----------|-----|
| `basePrice * quantity` as Final Price | Tiers / payable quantity / VAT live in Pricing |
| `subtotal * 0.09` VAT | `vatApplied` / `vatAmount` from `FinalPriceDto` |
| Discount % locally | No storefront discount API in scope; never invent |
| Weight → price | Weight is CE/Tools; Pricing consumes engineering quantity server-side |
| Recompute `payableQuantity` | Shown from `FinalPriceDto.payableQuantity` only |
| Cart total from FE sum as authority | Use `CartResponseDto.totalEstimate` |

**Allowed UI helpers (not business calculation)**

- Format money for `fa-IR` display  
- Clamp qty input to Catalog `minimumOrderQuantity` / `maximumOrderQuantity` before calling API  
- Debounce calculate calls  

---

## 4. Product page pricing flow

```text
Product loaded (Catalog ProductDto)
        ↓
Resolve default OrderUnit
  orderUnits.find(u => u.isDefault) ?? orderUnits[0]
        ↓
GET /api/pricing/products/{productId}/active
        ↓
User selects unit + quantity
        ↓
POST /api/pricing/calculate
  { productId, orderUnitId, quantity }
        ↓
Render FinalPriceDto
```

### 4.1 Sequence (mobile-first PDP)

```text
Critical: Catalog product (title, orderUnits, saleMode)
Parallel: GET .../active
Ready: show PricePanel
On unit/qty change (debounce 300ms):
  → POST /calculate
  → update FinalPrice panel
Add to cart (when sellable):
  → Ordering cart API (see §5)
```

### 4.2 PricePanel view model

```ts
type PricePanelVm = {
  productId: string
  orderUnits: OrderUnitDto[]
  selectedOrderUnitId: string
  quantity: number
  active?: ActivePriceResultDto
  quote?: FinalPriceDto
  status: 'idle' | 'loading-active' | 'loading-quote' | 'ready' | 'unsellable' | 'error'
}
```

### 4.3 Rendering rules

| `FinalPriceDto` / active | UI |
|--------------------------|-----|
| `isSellable === false` | Show `salesStatus` / Contact CTA; hide fake price |
| `isSellable === true` | Show `finalPrice` (primary), optional breakdown |
| Breakdown (optional) | `resolvedBasePrice`, `payableQuantity`, `subtotal`, `vatAmount` if `vatApplied` — **labels only, values from DTO** |
| Loading quote | Shimmer on price; keep last good quote dimmed (`keepPreviousData`) |
| Error | Soft error; product page stays up |

### 4.4 Inputs from Catalog (not Pricing)

| Field | Source |
|-------|--------|
| `orderUnitId` options | `ProductDto.orderUnits` |
| qty min/max | `OrderUnitDto.minimumOrderQuantity` / `maximumOrderQuantity` |
| CTA style | `saleMode`, `outOfStockDisplayPolicy` (Catalog Architecture §6) |

### 4.5 What NOT to call on PDP price path

- `POST /api/calculation/execute` — tools only  
- `POST /api/calculation/calculate` — not the storefront Final Price API  
- Admin pricing endpoints  

---

## 5. Cart pricing flow

```text
User Add to Cart
  → POST /api/ordering/cart/items
       { cartId?, sessionToken?, productVariantId, quantity }
  → CartResponseDto
       items[].lockedUnitPrice
       totalEstimate

Cart page
  → GET /api/ordering/cart/{cartId}
  → Render lines + totalEstimate
```

### 5.1 FE responsibilities

| Do | Don't |
|----|-------|
| Persist `cartId` + `sessionToken` (cookie/localStorage) | Invent VAT on cart |
| Show per-line `lockedUnitPrice` × qty as **display hint** only if needed | Replace `totalEstimate` with FE sum as checkout authority |
| Show `expiresAt` countdown | Call Pricing calculate for every cart line unless product later adds a quote API |
| Disable checkout if cart error/expired | Compute weight for shipping price in FE |

### 5.2 Known integration gap (do not silent-fix)

| Topic | Current state |
|-------|----------------|
| Catalog public API | Product + OrderUnit (no Variant controllers) |
| Cart API | Requires `productVariantId` |
| Pricing calculate | Uses `productId` + `orderUnitId` + `quantity` |

**Frontend architecture stance**

1. **PDP quote** always uses Pricing (`productId` + `orderUnitId`).  
2. **Ordering cart add** still requires `productVariantId` — **frozen / not called** from storefront until alignment.  
3. Mapping Product/OrderUnit → `productVariantId` is **not defined** in current Catalog public API — treat as **backend/product alignment gap**. FE must not invent variant IDs.  
4. **Until alignment:** temporary **QuoteCart** (`CartIntentionPort` + `LocalQuoteCartAdapter`) stores Pricing calculate snapshots by `(productId, orderUnitId)`. Qty change invalidates quote (re-quote via Pricing); FE never rescales money. No Ordering cart calls.

Report for platform owners: unify Cart with Product/OrderUnit **or** expose Variant APIs before Ordering-backed cart MVP.

---

## 6. Module structure (suggested)

```text
features/pricing/
  api/
    pricingApi.ts           # active, validate, calculate
  model/
    moneyFormat.ts          # display only
    pricePanelState.ts
  hooks/
    useActivePrice.ts
    useFinalPriceQuote.ts   # debounce unit/qty → calculate
  components/
    PricePanel.tsx
    OrderUnitSelector.tsx
    QuantityStepper.tsx
    FinalPriceBreakdown.tsx # DTO fields only
    UnsellableState.tsx

features/cart/              # Ordering-facing
  api/cartApi.ts
  hooks/useCart.ts
  components/CartLine.tsx
  components/CartTotal.tsx  # renders totalEstimate
```

---

## 7. Hook contracts

### `useFinalPriceQuote({ productId, orderUnitId, quantity, enabled })`

```ts
{
  data?: FinalPriceDto
  status: 'idle' | 'debouncing' | 'loading' | 'success' | 'error'
  error?: string
}
```

- Debounce 250–350ms  
- Abort in-flight calculate on change  
- Skip call if `!productId || !orderUnitId || quantity <= 0`  

### `useActivePrice(productId)`

- Fetch on PDP mount  
- Drive unsellable / contact UI before first calculate  

---

## 8. Loading / error / empty

| Surface | Loading | Error | Empty / unsellable |
|---------|---------|-------|--------------------|
| Active price | Skeleton under CTA | Soft fail → still allow retry calculate | Contact / `salesStatus` |
| Calculate | Price shimmer | Inline message from `errors[0]` | — |
| Cart | List skeleton | Expired → start new session | Empty cart illustration |

---

## 9. Mobile UX

1. Sticky bottom bar: **Final price** + primary CTA.  
2. Unit selector = bottom sheet.  
3. Qty stepper with min/max from OrderUnit.  
4. Breakdown collapsed by default (“جزئیات قیمت”).  
5. Never show tool weight as price.  
6. Cart: large total; line prices secondary.  

---

## 10. Caching

| Key | Strategy |
|-----|----------|
| `['pricing','active', productId]` | ~30s |
| `['pricing','validate', productId]` | ~30s |
| `['pricing','calculate', productId, orderUnitId, qty]` | **no long cache**; short `keepPreviousData` only |
| Cart | NoStore mindset; refetch on focus |

---

## 11. Relationship to other FE docs

| Doc | Boundary |
|-----|----------|
| Catalog FE | Supplies `orderUnits`, sale/OOS policies |
| Calculation Tools FE | Engineering only — no money |
| Search FE | No price ranking |

```text
Catalog (identity) → Pricing (money) → UI
                 ↘ CE (via Pricing server) — invisible to FE
Tools ↛ Pricing UI
```

---

## 12. Acceptance checklist

- [ ] PDP Final Price only from `POST /api/pricing/calculate`  
- [ ] No local VAT / tier / payable-quantity math  
- [ ] `payableQuantity` / `vatAmount` / `finalPrice` rendered from DTO  
- [ ] Qty/unit changes debounced; in-flight aborted  
- [ ] Unsellable state from `isSellable` / `salesStatus`  
- [ ] Cart UI uses `totalEstimate` & `lockedUnitPrice` from Ordering  
- [ ] No FE-invented `productVariantId`  
- [ ] Gap Product↔Variant documented for cart MVP  

---

## 13. References

- Controllers: `PricingController`, `CartController`  
- DTOs: `PricingModule.Application/DTOs/PricingDtos.cs`, `OrderingModule.Application/DTOs/CartDtos.cs`  
- `docs/frontend/01-Frontend-API-Contracts.md` §4  
- `docs/frontend/02-Catalog-Frontend-Architecture.md` § Price path  

---

*End of Pricing Frontend Architecture v1.0*
