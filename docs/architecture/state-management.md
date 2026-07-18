# State Management Strategy

**Project:** HyperAhan  
**Phase:** 2.5 — Architecture Synthesis  
**Purpose:** Define state ownership before implementation phases.

State must be owned by the narrowest layer that can manage it correctly.

---

## State Principles

- Prefer server-rendered data for SEO-sensitive pages.
- Keep global state minimal.
- Do not store backend DTOs in UI state.
- Do not duplicate state across providers, services, and storage.
- Browser storage must use approved helpers.
- State must support mobile conversion without unnecessary client JavaScript.

---

## Global State

Use global state only for data that truly spans routes.

Allowed global state:

- cart summary/items until API-backed cart replaces or supplements it
- toast/notification UI
- authenticated session summary in future
- minimal user context in future

Avoid global state for:

- product lists
- category data
- article content
- page filters that can live in URL/local state
- admin table data

Global providers create client boundaries. Add or expand providers only with clear benefit.

---

## Server State

Server state is data owned by backend/services.

Examples:

- products
- categories
- factories
- brands
- prices
- articles
- profile
- addresses
- orders
- admin tables

Rules:

- Fetch through services only.
- Map DTOs before UI consumption.
- Use server rendering for indexable content.
- Use cache/revalidation based on business truth.

---

## UI State

UI state belongs near the component that uses it.

Examples:

- modal open/closed
- bottom sheet open/closed
- selected tab
- temporary filter selection
- expanded/collapsed content
- toast visibility

Rules:

- Keep local until shared behavior is proven.
- Do not move UI state into global providers for convenience.
- Do not persist UI state unless it improves user journey.

---

## Form State

Form state belongs to the form feature.

Examples:

- checkout profile/address fields
- OTP code
- admin CRUD fields
- support/price request fields

Rules:

- Preserve user input on validation errors.
- Validate close to the form.
- Keep backend field errors mapped into user-safe form errors.
- Do not store sensitive form state longer than needed.

Future schema validation must not introduce packages without approval.

---

## Cache Strategy

Caching follows business truth.

| Data | Default Strategy |
|------|------------------|
| Static site config | Build/static |
| Category SEO content | Cache/revalidate when content changes |
| Product details | Revalidate based on price/data freshness policy |
| Prices | Short-lived or no-cache until backend guarantees are known |
| Cart | Session/user-aware, not public cache |
| Checkout/profile/orders | Auth/session-aware, not public cache |
| Articles | Cache with explicit update policy |
| Admin data | No public cache; invalidate after mutations |

Do not add client cache libraries until a documented need exists.

---

## Session Strategy

Session-related state includes:

- anonymous cart `sessionToken`
- `cartId`
- cart expiration
- future access token
- future user/profile completion state

Rules:

- Storage keys must come from `src/lib/storage.ts`.
- Tokens must not be read or written directly inside UI components.
- Unauthorized errors must flow through approved auth/session helpers.
- Cart must survive OTP/profile/address steps.

---

## Authentication State

Authentication is future Phase 6 work.

When approved:

- `authService` owns OTP send/verify.
- session helpers own token storage/access.
- API client attaches credentials.
- UI receives high-level auth state only.
- protected route behavior is documented before implementation.

Authentication must not be implemented during documentation, cleanup, SEO, or API foundation phases unless roadmap changes.

---

## Shopping Cart State

Cart is conversion-critical.

Current local strategy:

- client provider/context
- local storage with `ha_*` keys
- price lock represented locally/mocked

Future API strategy:

- `cartService` owns cart API calls
- anonymous cart uses `sessionToken` and/or `cartId`
- price lock and expiration come from backend
- checkout consumes service-owned cart state

Rules:

- UI must explain locked price and expiration.
- Submit order must clear/expire cart only after confirmed success.
- Do not retry order submission blindly.

---

## Search State

Search state should be shareable when useful.

Rules:

- Query text may live in URL for search pages.
- Temporary filter UI may be local until applied.
- Category/product list filters should avoid SEO index bloat.
- No-result state should route to contact/price request.
- Recent searches are future-only and should be local/private.

---

## Admin State

Admin state is future Phase 8 work.

Rules:

- Table filters/search/sort/page may live in URL for shareability.
- Form state stays local to admin forms.
- Mutations must invalidate relevant server state.
- Permissions are enforced by backend; frontend only reflects availability.
- Upload progress is local operation state.

---

## State Ownership Checklist

Before adding state:

- Is it server data, UI state, form state, session state, or global state?
- Can it stay local?
- Does it need persistence?
- Does it affect SEO?
- Does it contain sensitive data?
- Does it duplicate a service or backend source of truth?

If unclear, document ownership before implementation.
