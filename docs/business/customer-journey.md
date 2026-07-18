# Customer Journey Blueprint

**Project:** HyperAhan  
**Phase:** 2 — Business & UX Blueprint  
**Objective:** Convert visitors into customers through clear, mobile-first, SEO-driven journeys.

This document defines the business journeys the platform must support before implementation begins.

---

## Conversion Definition

For HyperAhan, conversion can be:

- submitted purchase request
- call to expert
- WhatsApp/contact request
- price inquiry
- cart checkout start
- returning customer order follow-up

Final online payment is not required for a valid MVP conversion. The steel buying model is expert-assisted.

---

## Journey 1 — Google to Blog to Product to Checkout

```text
Google -> Article -> Related Products -> Product -> Cart -> Checkout -> Submitted Order
```

**User intent:** Informational turning commercial.

**Example searches**

- “فرق میلگرد A2 و A3”
- “چگونه وزن میلگرد را محاسبه کنیم”
- “راهنمای خرید تیرآهن”

**User goals**

- learn what to buy
- avoid wrong product
- compare related products
- submit request or call expert

**Business goals**

- convert educational traffic into product discovery
- capture non-technical buyers
- build trust before sales contact

**Required UX**

- article summary above the fold
- clear product/category links inside article
- “Need expert help?” CTA
- related product cards
- related calculator link when relevant
- article-to-cart path when product intent is strong

**Risks**

- article traffic that never converts
- thin AI-like content damaging trust
- too many article CTAs reducing clarity

**Success signals**

- article readers click related category/product
- article readers call/WhatsApp
- article readers add product to cart

---

## Journey 2 — Google to Category to Product to Call Expert

```text
Google -> Category -> Product -> Call Expert
```

**User intent:** High commercial intent.

**Example searches**

- “قیمت میلگرد امروز”
- “قیمت تیرآهن ۱۴”
- “قیمت پروفیل ۴۰ در ۴۰”

**User goals**

- see current price
- filter by size/factory
- confirm product suitability
- talk to sales quickly

**Business goals**

- reduce bounce from commercial SEO pages
- make phone consultation easy
- turn price comparison into lead

**Required UX**

- category title and price promise
- product list/table with price, unit, size, factory
- sticky mobile search/filter
- visible phone CTA
- product detail with price and specs
- “Call expert” and “Add to cart” as paired CTAs

**Risks**

- dense price tables overwhelming mobile users
- users leaving after seeing price without lead capture
- unclear price freshness

**Success signals**

- category-to-product click
- phone CTA tap
- add to cart
- checkout start

---

## Journey 3 — Homepage to Search to Category to Calculator to Product to Checkout

```text
Homepage -> Search -> Category -> Calculator -> Product -> Cart -> Checkout
```

**User intent:** Has a need but may not know exact quantity/cost.

**User goals**

- find product quickly
- estimate weight/cost
- choose appropriate item
- submit purchase request

**Business goals**

- support non-technical and semi-technical buyers
- turn calculator usage into product action
- reduce support burden before expert call

**Required UX**

- prominent homepage search
- category shortcuts
- calculator access from relevant categories/products/articles
- calculator result with related products
- “Send result to expert” future CTA
- cart with price-lock explanation

**Risks**

- calculator becoming a dead end
- users trusting estimate as final commercial price
- extra steps before conversion

**Success signals**

- calculator-to-product clicks
- calculator-to-call clicks
- add-to-cart after calculator

---

## Journey 4 — Direct Homepage to Product Price to Cart

```text
Homepage -> Price Table -> Product -> Cart -> Checkout
```

**User intent:** Repeat or high-confidence buyer.

**User goals**

- quickly find known product
- check price
- add to cart
- submit request

**Business goals**

- speed up repeat purchase
- reduce browsing friction
- support mobile field buyers

**Required UX**

- homepage price shortcuts
- category chips
- recently viewed in future
- fast add-to-cart from list/product
- cart summary bar
- checkout stepper

**Risks**

- price table too long
- wrong item selected due to weak specs
- no explanation of price lock

**Success signals**

- homepage CTA to products
- list add-to-cart
- cart checkout start

---

## Journey 5 — Search User with Exact Product

```text
Search -> Product Results -> Product -> Add to Cart / Call
```

**User intent:** Knows product name, size, or factory.

**Search examples**

- “میلگرد ۱۶ میانه”
- “ورق سیاه ۳ فولاد مبارکه”
- “قوطی ۴۰ در ۴۰ ضخامت ۲”

**Required UX**

- search input in top bar
- typo-tolerant/flexible search in future
- filters by category, size, factory, brand
- no-result state with contact CTA
- recent searches in future

**Business opportunity**

No-result searches should become leads: “Tell us what you need; expert will check availability.”

---

## Journey 6 — Article to Consultation

```text
Google -> Article -> Trust Block -> Call/WhatsApp/Price Request
```

**User intent:** Needs advice before selecting product.

**Required UX**

- article CTA after problem explanation
- expert consultation block
- related FAQ
- “Ask expert before buying” CTA

**Business opportunity**

This journey captures users who are not ready for cart but are valuable leads.

---

## Journey 7 — Cart to OTP to Profile to Address to Agreement

```text
Cart -> Checkout -> OTP -> Profile -> Address -> Agreement -> Submitted Order
```

**User intent:** Ready to submit request.

**Required UX**

- explain login is required only to submit request
- preserve cart during OTP/profile/address
- show price-lock timer
- keep form fields minimal
- make agreement explicit and understandable
- show success message: “Expert will contact you.”

**Backend alignment**

- anonymous cart uses `sessionToken` / `cartId`
- OTP returns `accessToken`
- incomplete profile gates checkout
- address is required
- `agreementAccepted` must be true
- submitted order enters `Submitted`

---

## Journey 8 — Returning Customer to Order Tracking

```text
Direct/Bottom Nav -> Orders -> Order Detail -> Call Support / Reorder
```

**User intent:** Wants clarity after request.

**Required UX**

- order status timeline
- human-readable status labels
- shipping information when available
- support CTA
- future reorder/related products

**Business opportunity**

Clear order tracking reduces support calls and increases repeat trust.

---

## Cross-Journey Rules

- Every journey must expose a next action.
- Mobile users should never need hover interactions.
- Blog/content must link to commercial paths.
- Product pages must support both self-service request and expert call.
- Cart/checkout must explain expert-assisted purchase.
- When a journey cannot continue, offer contact/price request instead of dead ends.

---

## Primary Journey Priority

Implementation priority after this blueprint:

1. Google -> Category -> Product -> Call/Cart
2. Homepage -> Search/Category -> Product -> Cart
3. Cart -> OTP/Profile/Address -> Submitted Order
4. Blog -> Product/Category/Consultation
5. Calculator -> Product/Consultation
6. Returning Customer -> Orders
