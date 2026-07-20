# Sprint 3.2 Summary — Import Guardrails, Label Centralization & Legacy UI Comparison

**Project:** HyperAhan
**Scope:** Phase 3 — Foundation Cleanup & Tooling (remaining items from `docs/architecture/foundation-checklist.md`)
**Type:** Guardrails, safe behavior-preserving refactor, CI, documentation. No packages installed, no files moved/deleted/renamed, no business features implemented.

Sprint 3.2 was originally proposed as new infrastructure (HTTP client, shared API models, `AuthenticationService`/`BlogService`/`MediaService` contracts, environment config). That scope was rejected before any files were created: it pulled Phase 5 (API Integration), Phase 6 (Authentication), and Phase 9 (Content & Blog) work forward into Phase 3, directly contradicting `docs/architecture/state-management.md` ("Authentication must not be implemented during documentation, cleanup, SEO, or API foundation phases unless roadmap changes") and `docs/architecture/foundation-checklist.md`'s Phase 3 Scope. The user chose to instead complete the **actual outstanding Phase 3 checklist items**, which this sprint executes.

Per the user's instruction, sprint scopes are no longer invented manually — this and all future sprints map directly to `docs/architecture/foundation-checklist.md` and `docs/architecture/risk-analysis.md`'s "Highest Priority Mitigations for Phase 3."

---

## Infrastructure Added

### 1. Import-boundary ESLint guardrails (`eslint.config.mjs`)

Addresses foundation-checklist.md's "Import Guardrail Checklist" and risk-analysis.md priority #3. No new packages — uses ESLint's built-in `no-restricted-imports` / `no-restricted-globals`, already available via the existing `eslint` dependency.

| Rule | Enforces |
|---|---|
| `@/mocks/*` blocked outside `src/services/**` | `docs/architecture/folder-structure.md` → `src/mocks/`: "Only services may consume mocks." |
| raw `fetch` global blocked everywhere except `src/lib/api-client.ts` | Constitution Architecture Values: "UI never calls raw `fetch`." |
| `src/shared/**` blocked from importing `@/features/*` / `@/services/*` | `docs/architecture/frontend-architecture.md` → Shared Layer forbidden imports. |
| `src/services/**` blocked from importing `@/features/*` / `@/shared/ui/*` | `docs/architecture/folder-structure.md` → `src/services/` forbidden imports. |
| `src/lib/**` blocked from importing `@/features/*` | `docs/architecture/folder-structure.md` → `src/lib/` forbidden imports. |

All rules were verified against the existing codebase with zero violations before being added — they codify behavior that was already true, so no existing file needed a change.

### 2. Centralized domain labels (`src/lib/labels.ts`)

Addresses risk-analysis.md priority #4 ("Centralize domain labels for units/order statuses") and the Maintenance Risk "Duplicated labels/status maps." `module-map.md`'s Core Module already listed this as documented "Future growth": *"label maps for order statuses and units."*

- Found byte-identical `unitLabels` maps duplicated in `src/shared/ui/ProductCard.tsx` and `src/features/catalog/ProductDetailView.tsx`.
- Found byte-identical `statusLabel` maps duplicated in `src/features/orders/OrderDetailView.tsx`, `src/features/orders/OrdersListView.tsx`, and `src/features/auth/ProfilePageView.tsx`.
- Extracted both into `src/lib/labels.ts` (`productUnitLabels`, `orderStatusLabels`) and updated all 5 call sites to import from it. **Purely mechanical — output/behavior is byte-for-byte identical**, verified by `npm run typecheck` and `npm run lint` passing before and after.
- `src/shared/ui/OrderTimeline.tsx`'s shorter stepper captions were intentionally left untouched — they are a distinct, shorter caption set for the timeline UI, not a duplicate of `statusLabel`, and `OrderTimeline` is already flagged as a separate structural-ambiguity item (Sprint 3.1).

### 3. CI quality gate (`.github/workflows/ci.yml`)

Addresses foundation-checklist.md's "CI quality gate proposal or implementation when approved." Runs `npm ci`, `npm run lint`, `npm run typecheck` on push to `master`/`main` and on every pull request. No new dependencies — reuses the existing `lint`/`typecheck` scripts.

---

## Architecture Validation

- Ran `npm run typecheck` and `npm run lint` before and after every change — all clean (exit 0).
- Verified no circular dependencies were introduced: `labels.ts` only imports types from `@/types` (type-only import, erased at compile time).
- Verified no feature imports another feature's internals: the label refactor only added imports from `@/lib/labels`, a layer all features are already allowed to import.
- Verified the new ESLint rules don't fire on any existing file (confirms current codebase already complies with the dependency directions in `docs/architecture/frontend-blueprint.md`).

---

## Legacy UI — Phase 2 Journey Comparison (no removal performed)

Per foundation-checklist.md's "Compare legacy modules against Phase 2 journeys before deletion/quarantine," each dead file in `src/features/layout/` (identified in Sprint 3.1) was compared against `docs/business/customer-journey.md` and `docs/ui/navigation-strategy.md`. Full detail is now in `src/features/layout/README.md`; summary:

| File(s) | Recommendation |
|---|---|
| `NavMenu.tsx`, `PriceDropdown.tsx`, `WeightCalcDropdown.tsx` | **Quarantine, not delete.** Conceptually matches the documented Desktop Navigation strategy that the current shell doesn't implement at all yet. Worth revisiting when desktop layout is prioritized. |
| `MobileHeader.tsx`, `MobileMenu.tsx` | **Safe to remove.** Fully superseded by the active `TopBar` + `BottomNav`; keeping both is the "two navigation paradigms" risk already flagged in `docs/audit/frontend-audit.md`. |
| `MobileFooter.tsx` | **Safe to remove.** Competes with the active `BottomNav` for the same UI slot with an undocumented item ("اپلیکیشن"). |
| `Footer.tsx` | **Quarantine, not delete.** No footer exists today; this is a plausible future addition (trust badges align with `docs/business/conversion-strategy.md`) rather than a duplicate. |
| `ConsultationModal.tsx` | **Quarantine and fix before reuse.** Maps to the documented Expert CTA / price-request quick action, but uses `alert()` — a flagged anti-pattern — so it shouldn't be wired back in as-is. |

**No files were moved, deleted, or quarantined in this sprint.** This comparison is input for an explicit user decision, proposed as Sprint 3.3 below.

---

## Deferred Decisions (require explicit user approval — not executed)

1. **Prettier / Husky / lint-staged.** foundation-checklist.md requires these to be installed "only with approval." Not installed this sprint.
2. **Legacy UI disposition.** The comparison above is complete, but "quarantine vs delete" execution requires explicit approval per foundation-checklist.md's Architecture Cleanup Checklist.
3. **`shared/ui` domain-specific components** (`ProductCard`, `OrderTimeline`, flagged in Sprint 3.1) — still unresolved, no change this sprint.

---

## Files Changed

```text
Modified:
  eslint.config.mjs                                  (import-boundary guardrails)
  src/lib/README.md                                   (documents labels.ts)
  src/features/layout/README.md                       (adds journey-comparison table)
  docs/architecture/risk-analysis.md                   (marks resolved/updated risks)
  docs/architecture/foundation-checklist.md            (checks off completed items)
  src/shared/ui/ProductCard.tsx                        (uses src/lib/labels.ts)
  src/features/catalog/ProductDetailView.tsx           (uses src/lib/labels.ts)
  src/features/orders/OrderDetailView.tsx              (uses src/lib/labels.ts)
  src/features/orders/OrdersListView.tsx               (uses src/lib/labels.ts)
  src/features/auth/ProfilePageView.tsx                (uses src/lib/labels.ts)

Created:
  src/lib/labels.ts
  .github/workflows/ci.yml
  docs/sprints/sprint-3.2-summary.md
```

---

## Future Usage

- New features/components that need order-status or product-unit labels should import from `src/lib/labels.ts` rather than redefining them.
- The ESLint rules will now catch any future violation of the mocks/fetch/shared/services/lib boundaries automatically, in CI and locally.
- The legacy-UI comparison table gives whoever approves the cleanup a ready-made per-file decision instead of an all-or-nothing call.

## Validation

- `npm run typecheck` — exit 0 (before and after all changes).
- `npm run lint` — exit 0 (before and after all changes), including with the new guardrail rules active.

---

## Recommended Sprint 3.3 Plan (proposal only — not implemented)

Based entirely on `docs/architecture/foundation-checklist.md`'s "Definition of Done for Phase 3" and "Implementation Readiness Gate," plus the two decisions deferred above.

### Objectives

Close out Phase 3 by resolving the two remaining explicit-approval decisions and formally recording Phase 3 as complete, so Phase 4 (SEO & Catalog Foundation) can begin without foundational ambiguity.

### Scope

1. **Tooling decision:** install and configure Prettier (+ `eslint-config-prettier` to avoid rule conflicts) and, if approved, Husky + lint-staged for pre-commit formatting/lint. Requires explicit package-install approval per the constitution's Dependency Rules.
2. **Legacy UI execution:** act on the Sprint 3.2 comparison table — quarantine `NavMenu`/`PriceDropdown`/`WeightCalcDropdown`/`Footer`/`ConsultationModal` (e.g. into a clearly-named non-imported location or a documented "not wired up yet" state) and remove `MobileHeader`/`MobileMenu`/`MobileFooter` outright, per whichever disposition the user approves. Requires explicit file move/delete approval per the constitution's AI Behavior rules.
3. **Close Phase 3:** write `docs/phase3-summary.md` (health scores, what changed across Sprints 3.1–3.3, remaining risks) once 1 and 2 are resolved or explicitly deferred.

### Deliverables

- Prettier config + scripts (or an explicit documented decision to defer formatting tooling).
- Husky/lint-staged setup (or an explicit documented decision to defer it).
- Legacy layout files moved/removed per approved disposition, with `src/features/layout/README.md` updated to drop the "deprecation candidates" section once resolved.
- `docs/phase3-summary.md`.
- `docs/architecture/foundation-checklist.md` and `docs/architecture/risk-analysis.md` updated to reflect Phase 3 closure.

### Files expected to change

```text
package.json, package-lock.json      (if Prettier/Husky approved)
.prettierrc*, .lintstagedrc*, .husky/  (if approved)
src/features/layout/*.tsx             (moved or deleted, per approval)
src/features/layout/README.md
docs/architecture/foundation-checklist.md
docs/architecture/risk-analysis.md
docs/phase3-summary.md                (new)
```

### Roadmap compliance confirmation

This proposal does not violate the roadmap: every deliverable above is explicitly listed as Phase 3 scope in `docs/roadmap/project-roadmap.md` ("Prettier strategy and installation if approved," "decision and execution for dead legacy UI quarantine/removal," "Husky/lint-staged if approved") and in `docs/architecture/foundation-checklist.md`'s Definition of Done ("active UI structure is unambiguous," "tooling decisions are implemented or explicitly deferred"). No Phase 4+ work (SEO metadata, API client activation, Authentication, Blog, Admin) is included. **Sprint 3.3 is proposed only — no part of it has been implemented.**
