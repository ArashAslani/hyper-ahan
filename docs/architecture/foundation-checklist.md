# Phase 3 Foundation Checklist

**Project:** HyperAhan  
**Phase:** 2.5 output for Phase 3  
**Purpose:** Define everything required before implementation begins.

**Status: Phase 3 officially closed.** See `docs/phase3-summary.md` for the full Phase Closure Report. This checklist is kept as the historical record of what was required and how each item was resolved; it is no longer an open task list.

Phase 3 is Foundation Cleanup & Tooling. It should prepare the codebase for implementation using Phase 2/2.5 architecture as the source of truth.

---

## Required Reading

Before Phase 3 work:

- `.ai/constitution/project-constitution.md`
- `docs/roadmap/project-roadmap.md`
- `docs/architecture/dependency-matrix.md`
- `docs/architecture/frontend-blueprint.md`
- `docs/architecture/module-map.md`
- `docs/architecture/state-management.md`
- `docs/architecture/rendering-strategy.md`
- `docs/architecture/risk-analysis.md`
- `docs/phase2-summary.md`
- `docs/phase2.5-summary.md`

---

## Phase 3 Scope

Allowed with approval:

- dead legacy UI cleanup/quarantine
- Prettier strategy/install
- Husky/lint-staged strategy/install
- import boundary guardrails
- CI quality gate proposal/implementation
- documentation updates for tooling decisions
- safe lint/typecheck cleanup

Forbidden unless roadmap changes:

- Blog implementation
- Admin implementation
- Authentication implementation
- API connection
- new product/customer-facing pages
- feature redesign
- broad refactors unrelated to foundation

---

## Architecture Cleanup Checklist

- [x] Identify active shell components (`TopBar`, `BottomNav`, `SiteShell`). (Sprint 3.1)
- [x] Identify legacy/dead layout/home modules. (Sprint 3.1 — `src/features/layout/README.md`)
- [x] Compare legacy modules against Phase 2 journeys before deletion/quarantine. (Sprint 3.2 — see `docs/sprints/sprint-3.2-summary.md`)
- [x] Decide quarantine vs delete through explicit user approval. **Decided (Phase 3 Closure) — see `docs/phase3-summary.md` §2.3.** Per-file: quarantine (`NavMenu`, `PriceDropdown`, `WeightCalcDropdown`, `Footer`, `ConsultationModal`) vs remove later (`MobileHeader`, `MobileMenu`, `MobileFooter`). **Execution** (moving/deleting files) is still deferred to a future implementation sprint requiring file-change approval.
- [x] Ensure cleanup does not alter user-facing behavior unless approved. (N/A — no cleanup has been executed yet, so no behavior has changed)
- [x] Preserve route centralization in `src/lib/routes.ts`. (verified, no violations)
- [x] Preserve service-only mock access. (verified, no violations; now also enforced by ESLint)
- [x] Document any removed/quarantined surface. **Decision documented in `docs/phase3-summary.md` §2.3; physical quarantine/removal execution remains a separate future task.**

---

## Tooling Checklist

- [x] Confirm Node/npm baseline. (`.nvmrc` = 22, `package.json` `engines.node >=22`, confirmed Phase 0)
- [x] Confirm `npm run lint` passes before and after changes. (verified Sprint 3.1 and 3.2)
- [x] Confirm `npm run typecheck` passes before and after changes. (verified Sprint 3.1 and 3.2)
- [x] Decide Prettier config. **Decided (Phase 3 Closure) — Approved for later. See `docs/phase3-summary.md` §2.2 for rationale.**
- [ ] Install Prettier only with approval. **Direction approved; installation itself deferred to a future tooling sprint (needs explicit package-install approval per the constitution's Dependency Rules).**
- [ ] Add format scripts only with approval. **Deferred alongside Prettier installation, above.**
- [ ] Add Husky/lint-staged only with approval. **Deferred alongside Prettier installation, above.**
- [x] Avoid large formatting churn mixed with cleanup unless approved. (no formatting-only changes made)

---

## Import Guardrail Checklist

- [x] Prevent `@/mocks/*` imports outside `src/services`. (Sprint 3.2 — `eslint.config.mjs`, `no-restricted-imports`)
- [x] Prevent raw `fetch` in pages/components where practical. (Sprint 3.2 — `eslint.config.mjs`, `no-restricted-globals`, exempts `src/lib/api-client.ts`)
- [x] Keep `shared/ui` independent of services/features. (Sprint 3.2 — `eslint.config.mjs` restricts `src/shared/**` from importing `@/features/*`/`@/services/*`)
- [x] Keep services free of JSX. (already true by file extension convention; Sprint 3.2 also restricts `src/services/**` from importing `@/features/*`/`@/shared/ui/*`)
- [x] Document any ESLint rule additions. (see `docs/sprints/sprint-3.2-summary.md`)

---

## Documentation Checklist

- [x] Update `docs/phase3-summary.md` at end of Phase 3. **Created (Phase 3 Closure).**
- [x] Update `docs/architecture/risk-analysis.md` if risks change. (Sprint 3.2)
- [x] Update `docs/architecture/module-map.md` if ownership changes. (N/A — no ownership changes occurred during Phase 3)
- [ ] Update `docs/architecture/shared-components-map.md` if shared component decisions change. **Still open — carried forward as technical debt in `docs/phase3-summary.md` §3, not a Phase 3 blocker.**
- [x] Update roadmap only if phase scope changes with user approval. (No scope change; roadmap updated only to reference `docs/phase3-summary.md`, per Phase 3 Closure.)

---

## SEO/Foundation Checklist

Phase 3 should not implement SEO pages, but must prepare for Phase 4:

- [x] Confirm which current routes are low-priority/placeholder. (Confirmed via `src/features/layout/README.md` legacy-file inventory; no indexable route is affected)
- [x] Confirm no placeholder content is made more prominent. (No cleanup was executed; nothing changed for any user-facing route)
- [x] Confirm image optimization risk remains tracked. (`docs/architecture/risk-analysis.md` → Performance Risks → "Raw images cause CLS/bandwidth issues," carried into `docs/phase3-summary.md` §5 for Phase 4)
- [x] Confirm route changes are not made without SEO URL decision. (No routes were added, renamed, or removed during Phase 3)
- [x] Confirm any cleanup preserves future category/product/article metadata paths. (No cleanup executed yet; the legacy-UI decision in `docs/phase3-summary.md` §2.3 does not touch any catalog/content route)

---

## State/Foundation Checklist

- [x] Confirm cart state ownership remains clear. (Unchanged from `docs/architecture/state-management.md`; no Phase 3 work touched cart state)
- [x] Do not introduce auth state. (Confirmed — no auth code was added; the Sprint 3.2 scope proposing `AuthenticationService` was explicitly rejected)
- [x] Do not introduce API cache libraries. (Confirmed — none added)
- [x] Do not move local UI state into global providers without reason. (Confirmed — no provider changes made)
- [x] Track future cart API migration risk. (Tracked in `docs/architecture/risk-analysis.md`, carried into `docs/phase3-summary.md` §5)

---

## Definition of Done for Phase 3

Phase 3 is done only if:

- [x] active UI structure is unambiguous
- [x] tooling decisions are implemented or explicitly deferred
- [x] lint/typecheck pass
- [x] no feature work was mixed in
- [x] documentation reflects all cleanup/tooling decisions
- [x] Phase 4 can begin without resolving foundational ambiguity

**All conditions met. Phase 3 is done.** See `docs/phase3-summary.md` for the full Phase Closure Report.

---

## Implementation Readiness Gate

No feature implementation should begin until:

- [x] this checklist is reviewed
- [x] dead legacy UI decision is completed or explicitly deferred
- [x] service/mock import boundaries are understood
- [x] formatting/tooling path is stable
- [x] Phase 3 summary is created

**Gate cleared.** Phase 4 — SEO & Catalog Foundation may begin, per `docs/planning/next-phase-plan.md`.
