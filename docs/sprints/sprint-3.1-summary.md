# Sprint 3.1 Summary — Project Structure Validation

**Project:** HyperAhan
**Scope:** Part of Phase 3 — Foundation Cleanup & Tooling
**Type:** Documentation and additive barrel exports only. No architecture changes, no file moves/renames, no feature work, no package installs.

Sprint 3.1 was re-scoped mid-flight: the original prompt proposed a new parallel folder skeleton (`core/`, `shared/components|hooks|services|utils|types|constants`, `features/blog|admin|catalog|common`, `styles/`, `assets/`). That skeleton directly conflicted with `docs/architecture/frontend-blueprint.md`, `docs/architecture/folder-structure.md`, and the already-implemented codebase, and was rejected before any files were created. The user chose to instead **validate and document the existing, already-complete architecture** — the work recorded below.

---

## Task 1 — Verify every documented layer exists

Compared the actual `src/` tree against `docs/architecture/folder-structure.md` and `docs/architecture/frontend-blueprint.md` ("Overall Architecture" diagram).

| Documented layer | Exists? |
|---|:---:|
| `src/app/` | ✅ |
| `src/features/` | ✅ |
| `src/shared/` (`shared/ui/`) | ✅ |
| `src/services/` | ✅ |
| `src/lib/` | ✅ |
| `src/config/` | ✅ |
| `src/providers/` | ✅ |
| `src/types/` | ✅ |
| `src/mocks/` | ✅ |

**Result: no missing layers.** No new folders were created.

---

## Files Created

### Layer-level `README.md` (10)

```text
src/app/README.md
src/features/README.md
src/shared/README.md
src/shared/ui/README.md
src/services/README.md
src/lib/README.md
src/config/README.md
src/providers/README.md
src/types/README.md
src/mocks/README.md
```

### Feature-level `README.md` (7)

```text
src/features/layout/README.md
src/features/home/README.md
src/features/catalog/README.md
src/features/cart/README.md
src/features/orders/README.md
src/features/auth/README.md
src/features/content/README.md
```

Each documents purpose, the `module-map.md` module it belongs to, current files, allowed/forbidden imports, and any roadmap-gate caveats.

### Barrel exports (`index.ts`) — 8 new files, purely additive

```text
src/shared/ui/index.ts     re-exports all 14 current shared/ui primitives
src/features/home/index.ts      -> HomePageView
src/features/catalog/index.ts   -> ProductListView, ProductDetailView
src/features/cart/index.ts       -> CartPageView, CheckoutPageView
src/features/orders/index.ts     -> OrdersListView, OrderDetailView
src/features/auth/index.ts       -> LoginPageView, RegisterPageView, ProfilePageView
src/features/content/index.ts    -> ArticleListView, ArticleDetailView, AboutPageView, ContactPageView
src/features/layout/index.ts     -> SiteShell only
```

**No existing `src/app/**/page.tsx` imports were changed.** These barrels establish the documented public boundary (`docs/architecture/feature-template.md` → `index.ts` "Public feature boundary") without touching working code. `src/features/layout/index.ts` intentionally exports only `SiteShell` — the one file actually reachable from `src/app/layout.tsx` — which also reinforces the legacy-file finding below.

No barrels were added to `src/services`, `src/lib`, `src/config`, `src/types`, `src/providers`, or `src/mocks`: each is either a single file already, or existing direct imports (e.g. `@/lib/routes`, `@/services/productService`) are the documented pattern and a barrel would blur "smallest useful surface" (`docs/architecture/frontend-architecture.md` → Module Boundaries).

---

## Task — Verify dependency directions and import boundaries

Checked against `docs/architecture/frontend-blueprint.md` → "Allowed Dependency Direction" / "Forbidden":

| Check | Result |
|---|---|
| `@/mocks/*` imported only from `src/services/*` | ✅ Verified — zero mock imports found outside `src/services/` |
| No raw `fetch(` in the codebase | ✅ Verified — zero matches anywhere in `src/` |
| `src/shared/ui/*` imports no `@/features/*` or `@/services/*` | ✅ Verified across all 14 files |
| `src/services/*` imports no JSX, no `@/features/*`, no `@/shared/*` | ✅ Verified across all 5 service files |
| `src/lib/*` has zero internal imports (pure utilities) | ✅ Verified |
| No relative (`../`) imports crossing folder boundaries | ✅ Verified — the codebase consistently uses the `@/*` alias |

**Result: no import-boundary violations found.** No ESLint rule changes were made in this sprint (adding an enforced `no-restricted-imports` guardrail remains an open Phase 3 recommendation, see below).

---

## Structural ambiguity identified (documented, not resolved)

`src/shared/ui/ProductCard.tsx` and `src/shared/ui/OrderTimeline.tsx` encode domain-specific rules (product unit labels/stock/discount; HyperAhan's exact order-status set) that `docs/architecture/frontend-architecture.md` and `docs/architecture/shared-components-map.md` explicitly document as feature-owned (Catalog and Orders respectively), not shared primitives. `CartSummaryBar.tsx` is borderline (hardcoded "تومان" label and default checkout copy).

**No files were moved.** This is flagged in `src/shared/ui/README.md` as a decision for a future task — relocate to `features/catalog`/`features/orders`, or formally strip the domain logic and keep them shared. Moving files requires explicit user approval per the constitution's AI Behavior rules.

---

## Legacy folders identified for future deprecation (not removed)

`src/features/layout/` contains 8 files unreachable from the active shell (`SiteShell` → `TopBar` + `BottomNav`, wired in `src/app/layout.tsx`):

```text
NavMenu.tsx, PriceDropdown.tsx, WeightCalcDropdown.tsx,
MobileHeader.tsx, MobileMenu.tsx, MobileFooter.tsx,
Footer.tsx, ConsultationModal.tsx
```

This confirms the finding already recorded in `docs/audit/frontend-audit.md` and `docs/audit/phase0-summary.md` (Critical issue #1: "Dead legacy UI"). No deletion or quarantine was performed — that decision belongs to the "Architecture Cleanup Checklist" in `docs/architecture/foundation-checklist.md`, which requires explicit user approval before removing or quarantining.

Two smaller observations (informational only, no action taken):

- `src/app/search/page.tsx` implements search inline rather than through a `src/features/search/` view. This is valid per `docs/architecture/feature-template.md` ("not every folder must exist on day one"); a dedicated feature folder is only warranted once search grows real complexity.
- Checkout lives inside `src/features/cart/CheckoutPageView.tsx` rather than a separate `src/features/checkout/`. Same reasoning applies — splitting it out is a Phase 7 decision, not a Phase 3 one.

---

## Architecture Decisions

1. The existing `src/` tree already fully implements the documented layer set; **no new folders were created**.
2. Feature and shared-layer boundaries were **verified compliant** (no mock leakage, no raw `fetch`, no cross-boundary relative imports).
3. Barrel `index.ts` files were added as the documented "public feature boundary" without changing any existing import — zero behavioral risk.
4. Two shared-UI components (`ProductCard`, `OrderTimeline`) are documented as misplaced relative to `shared-components-map.md`; relocation is deferred pending explicit approval.
5. The `features/layout` legacy cluster is confirmed dead and is a deprecation candidate; removal/quarantine is deferred pending explicit approval per the foundation checklist.

---

## Potential Future Usage

- The new `index.ts` barrels let future route files import `@/features/home` instead of `@/features/home/HomePageView`; adoption is optional and can happen incrementally.
- The `src/shared/ui/README.md` ambiguity note gives the next cleanup task a ready-made decision to make (relocate vs. formally promote).
- The `features/layout/README.md` legacy list gives the "dead legacy UI quarantine/removal" checklist item in `docs/architecture/foundation-checklist.md` a concrete, pre-verified file list to act on.
- Per-feature READMEs give future agents module ownership and roadmap-gate context (auth/content) without re-reading the full module map each time.

---

## Validation

- `npm run typecheck` — exit 0.
- `npm run lint` — exit 0.

## Not Done (intentionally, out of scope)

- No files moved, renamed, or deleted.
- No new folders created.
- No packages installed.
- No Blog, Admin, Catalog, or Authentication features implemented.
- No ESLint import-boundary rule added (recommended follow-up, not executed here).
- No existing `page.tsx` import rewired to use the new barrels.
