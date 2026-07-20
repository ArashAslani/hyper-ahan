# Phase 3 Summary — Foundation Cleanup & Tooling

**Project:** HyperAhan
**Roadmap phase:** Phase 3 — Foundation Cleanup & Tooling (`docs/roadmap/project-roadmap.md`)
**Sprints covered:** 3.1 (structure validation/documentation), 3.2 (import guardrails, label centralization, CI gate, legacy-UI comparison), Phase 3 Closure (this document)
**Type:** Documentation only. No packages installed, no files moved/deleted/renamed, no UI/components/API changed in the production of this document.

This document is the mandatory Phase 3 summary required by `docs/architecture/foundation-checklist.md`'s Implementation Readiness Gate and `docs/roadmap/project-roadmap.md`'s Roadmap Governance ("Each phase must end with a summary").

---

## 1. Completed Work

### Sprint 3.1 — Structure Validation
- Verified every documented architecture layer (`app`, `features`, `shared`, `services`, `lib`, `config`, `providers`, `types`, `mocks`) already exists and matches `docs/architecture/frontend-blueprint.md`.
- Created `README.md` for every top-level `src/` layer and every feature folder (`layout`, `home`, `catalog`, `cart`, `orders`, `auth`, `content`).
- Added barrel exports (`index.ts`) for `src/shared/ui/` and every feature folder as a deliberate public API surface.
- Verified dependency directions and import boundaries against `docs/architecture/dependency-matrix.md` — no violations found.
- Identified dead legacy files in `src/features/layout/` (`NavMenu`, `PriceDropdown`, `WeightCalcDropdown`, `MobileHeader`, `MobileMenu`, `MobileFooter`, `Footer`, `ConsultationModal`) without removing them.
- Flagged `ProductCard.tsx` and `OrderTimeline.tsx` in `src/shared/ui/` as structural ambiguities (domain-specific logic in a domain-neutral layer).
- No files moved, renamed, or deleted.

### Sprint 3.2 — Guardrails, Label Centralization, CI Gate, Legacy-UI Comparison
- Rejected an over-scoped proposal (HTTP client, Auth/Blog/Media service contracts) that would have pulled Phase 5/6/9 work forward; re-scoped to the actual outstanding Phase 3 checklist items.
- Added ESLint import-boundary guardrails (`eslint.config.mjs`): blocks `@/mocks/*` outside `src/services/**`, blocks raw `fetch` outside `src/lib/api-client.ts`, blocks `src/shared/**` and `src/lib/**` from importing `@/features/*`/`@/services/*`. Verified zero violations before the rules were added — they codify behavior that was already true.
- Centralized duplicated `productUnitLabels`/`orderStatusLabels` maps into `src/lib/labels.ts`, updated 5 call sites. Purely mechanical, behavior-preserving (verified via lint/typecheck before and after).
- Added a CI quality gate (`.github/workflows/ci.yml`) running `npm ci`, `npm run lint`, `npm run typecheck` on push/PR.
- Compared every dead legacy layout file against `docs/business/customer-journey.md` and `docs/ui/navigation-strategy.md`, producing a per-file recommendation table (see §3 below). No execution performed.

### Phase 3 Closure (this document)
- Recorded an explicit decision on Prettier/Husky/lint-staged (§2).
- Recorded the official project decision on legacy UI disposition (§3).
- Marked `docs/architecture/foundation-checklist.md` Phase 3 complete.
- Updated `docs/roadmap/project-roadmap.md` to reference this document.

---

## 2. Architecture & Tooling Decisions

### 2.1 Structural decisions (already executed, Sprints 3.1–3.2)
1. No new folder structure was introduced — the existing structure was validated as final and made self-documenting via READMEs, per the user's explicit re-scoping of Sprint 3.1.
2. Feature/shared public APIs are now `index.ts` barrel exports rather than implicit file-path imports.
3. Import-boundary rules are enforced by ESLint, not just documentation — violations now fail lint/CI automatically.
4. Domain labels (`productUnitLabels`, `orderStatusLabels`) live in `src/lib/labels.ts` as the single source of truth.

### 2.2 Prettier / Husky / lint-staged — **Decision: Approved for later**

**Decision:** Prettier (and, contingent on Prettier, Husky + lint-staged) is **approved in principle**, but installation is **explicitly deferred** to a dedicated future tooling sprint — it is not installed as part of this closure document, per this task's "no packages" rule and the constitution's Dependency Rule ("Do not install packages without approval").

**Why approved (not rejected):**
- `docs/architecture/risk-analysis.md`'s Maintenance Risks table lists "Missing formatter/hooks creates noisy diffs" as **Medium impact / High probability** — a real, recurring cost, and the constitution's technical goal is a codebase that stays maintainable "for years" for a solo developer.
- Prettier/lint-staged are narrowly-scoped, widely-used, low-risk tools that satisfy the constitution's Engineering Values bar for adding structure: *"Add structure only when it protects a boundary or reduces real maintenance cost."* Formatting consistency is exactly that kind of cost, not cosmetic professionalism.
- `docs/architecture/foundation-checklist.md` already scoped this as Phase 3 work ("Prettier strategy/install," "Husky/lint-staged strategy/install") — approving it keeps the decision inside Phase 3's own mandate rather than pushing a new decision into Phase 4.

**Why deferred (not executed now):**
- Installing packages requires explicit approval under the constitution's Dependency Rules, and this closure task's strict rules forbid packages/code changes. Approving the *direction* without executing the *install* satisfies the Definition of Done's "tooling decisions are implemented or **explicitly deferred**" without violating this task's constraints.

**Next step (not part of this document):** a future, explicitly-scoped sprint should add `.prettierrc*`, an `eslint-config-prettier` dependency (to prevent rule conflicts with the existing `eslint.config.mjs` guardrails), format scripts in `package.json`, and — if still desired at that time — Husky + lint-staged for pre-commit formatting.

### 2.3 Legacy UI — **Decision: Differentiated disposition per file (not a single blanket action)**

**Decision:** The official project decision follows the Sprint 3.2 comparison exactly — a single "keep/quarantine/remove" answer would ignore that some legacy files map to real, still-relevant future strategy and others do not. **No files are moved, quarantined, or deleted by this document** — this records the *decision*; execution is a separate, future implementation task requiring file-move/delete approval per the constitution's AI Behavior rules.

| File(s) | Official decision | Why |
|---|---|---|
| `NavMenu.tsx`, `PriceDropdown.tsx`, `WeightCalcDropdown.tsx` | **Quarantine** | Conceptually matches `docs/ui/navigation-strategy.md`'s documented Desktop Navigation, which the current shell doesn't implement at all yet. Real future value — not dead weight, just not wired up. |
| `Footer.tsx` | **Quarantine** | No footer exists today; trust badges/social proof align with `docs/business/conversion-strategy.md`. Plausible future addition, not a duplicate. |
| `ConsultationModal.tsx` | **Quarantine, fix before reuse** | Maps to the documented Expert CTA / price-request quick action, but uses `alert()` — a flagged anti-pattern (`docs/audit/frontend-audit.md`) — so it must not be wired back in unmodified. |
| `MobileHeader.tsx`, `MobileMenu.tsx` | **Remove later** | Fully superseded by the active `TopBar` + `BottomNav`. Keeping both is the documented "two navigation paradigms" risk. No future value identified. |
| `MobileFooter.tsx` | **Remove later** | Competes with the active `BottomNav` for the same UI slot; includes an undocumented "اپلیکیشن" item with no IA/nav-strategy backing. |

"Quarantine" means: physically isolate into a clearly-named, non-imported location (or equivalent marker) so it stops appearing as ambiguous "is this live?" code, without deleting potentially reusable work. "Remove later" means: safe to delete outright in a future execution sprint, since no documented strategy depends on them.

---

## 3. Remaining Deferred Decisions

These are decided in direction (§2) but **not yet executed** — carried forward, not blocking Phase 4:

1. **Prettier/Husky/lint-staged installation** — approved for later; needs its own scoped sprint with explicit package-install approval.
2. **Legacy UI quarantine/removal execution** — decision recorded above; needs its own scoped sprint with explicit file-move/delete approval.
3. **`shared/ui` domain-specific component placement** (`ProductCard.tsx`, `OrderTimeline.tsx`) — flagged since Sprint 3.1, still unresolved. No decision has been made on whether to relocate these into their owning features or formally accept them as shared. This is **not** a Phase 3 blocker (both components work correctly today) but remains open technical debt.
4. **`docs/architecture/shared-components-map.md` update** — depends on resolving item 3; not yet updated.

---

## 4. Known Technical Debt

| Item | Description | Blocking Phase 4? |
|---|---|---|
| Legacy layout files still physically present | Decision made (§2.3), execution pending | No — files are inert (unreferenced), verified by ESLint/typecheck with zero impact |
| No formatter/pre-commit hooks | Decision made (§2.2), execution pending | No — manual lint/typecheck discipline is already enforced by CI |
| `ProductCard`/`OrderTimeline` domain logic in `shared/ui` | Unresolved structural ambiguity | No — both components function correctly; this is a placement concern, not a defect |
| No test coverage for cart/checkout | Tracked in `docs/architecture/risk-analysis.md`, never in Phase 3 scope | No — testing was never a Phase 3 deliverable; remains tracked for a later phase |

---

## 5. Risks Carried Forward

Pulled from `docs/architecture/risk-analysis.md`; only risks still open after Phase 3 are listed (resolved risks are in §6):

| Risk | Impact | Probability | Status entering Phase 4 |
|---|---|---|---|
| Backend DTOs leak into UI props | High | Medium | Unchanged — relevant starting Phase 5, not Phase 4 |
| Cart local state conflicts with future API cart | High | Medium | Unchanged — relevant starting Phase 5 |
| Dead legacy UI receives future edits | High | High | **Reduced** — disposition decided (§2.3); residual risk is only "execution not yet performed," not "unknown/undecided" |
| No test coverage for cart/checkout | High | High | Unchanged — out of Phase 3 scope by design |
| Shared UI holds domain-specific components | Medium | Medium | Unchanged — decision still open (§3 item 3) |
| Missing formatter/hooks creates noisy diffs | Medium | High | **Reduced** — direction decided (§2.2); residual risk is only "execution not yet performed" |
| Product/category pages lack metadata | High | High | Unchanged — this **is** Phase 4's core mandate |
| Thin placeholder content gets indexed | High | Medium | Unchanged — Phase 4 mandate |
| Filter/search pages create index bloat | High | Medium | Unchanged — Phase 4 mandate |
| Client-only content weakens crawlability | High | Medium | Unchanged — Phase 4 mandate |
| Raw images cause CLS/bandwidth issues | High | High | Unchanged — Phase 4's gated image-optimization item |

## 6. Risks Resolved During Phase 3

| Risk | Resolution |
|---|---|
| Direct mock imports leak into UI | ESLint guardrail added (Sprint 3.2), zero violations found |
| Direct `fetch` appears in pages/components | ESLint guardrail added (Sprint 3.2), zero violations found |
| Route strings spread across UI | Verified compliant (Sprint 3.1/3.2), no violations |
| Duplicated labels/status maps | Centralized in `src/lib/labels.ts` (Sprint 3.2) |

---

## 7. Readiness for Phase 4

Cross-checked against `docs/planning/next-phase-plan.md` (Phase 4 — SEO & Catalog Foundation):

- All services Phase 4 needs (`productService`, `catalogNavService`, `homeService`) already exist and are unaffected by Phase 3 work.
- Import boundaries Phase 4 implementation must respect are now enforced by ESLint, not just documentation.
- No open Phase 3 item requires resolution before Phase 4 metadata/sitemap/robots work can begin — the remaining deferred decisions (§3) are independent of SEO/metadata work and do not share files with the Phase 4 file list.
- `src/config/site.ts` still lacks a base site URL — noted as a Phase 4 dependency gap in `docs/planning/next-phase-plan.md` §6, not a Phase 3 gap.

**No foundational ambiguity blocks Phase 4.**

---

## Phase Closure Report

**Definition of Done for Phase 3** (per `docs/architecture/foundation-checklist.md`), verified item by item:

| Requirement | Status |
|---|---|
| Active UI structure is unambiguous | ✅ Met — `SiteShell`/`TopBar`/`BottomNav` are the only active shell components; every legacy file has a recorded disposition (§2.3) |
| Tooling decisions are implemented or explicitly deferred | ✅ Met — Prettier/Husky explicitly approved-for-later with a documented rationale (§2.2); this satisfies "explicitly deferred" |
| Lint/typecheck pass | ✅ Met — verified clean before and after every Sprint 3.1/3.2 change; no code changed in this closure document |
| No feature work was mixed in | ✅ Met — Phase 3 contained zero Blog/Admin/Auth/API/new-page work across both sprints and this closure |
| Documentation reflects all cleanup/tooling decisions | ✅ Met — this document, `src/features/layout/README.md`, `docs/architecture/risk-analysis.md`, and `docs/architecture/foundation-checklist.md` are all current |
| Phase 4 can begin without resolving foundational ambiguity | ✅ Met — see §7 |

**Implementation Readiness Gate**, verified:

| Gate condition | Status |
|---|---|
| Checklist reviewed | ✅ `docs/architecture/foundation-checklist.md` fully reviewed for this closure |
| Dead legacy UI decision completed or explicitly deferred | ✅ Completed as a decision (§2.3); execution explicitly deferred to a future sprint |
| Service/mock import boundaries understood | ✅ Enforced by ESLint since Sprint 3.2 |
| Formatting/tooling path is stable | ✅ Stable as "approved for later" — no longer an open question mark |
| Phase 3 summary is created | ✅ This document |

### Verification

- **Phase 3 is officially closed.**
- **Phase 4 — SEO & Catalog Foundation may now begin**, using `docs/planning/next-phase-plan.md` as its implementation plan, once the user approves that plan for implementation.
- This closure introduced no code, packages, UI, components, or API changes — documentation only, as instructed.
