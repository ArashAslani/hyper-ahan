# Phase 3 Foundation Checklist

**Project:** HyperAhan  
**Phase:** 2.5 output for Phase 3  
**Purpose:** Define everything required before implementation begins.

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

- [ ] Identify active shell components (`TopBar`, `BottomNav`, `SiteShell`).
- [ ] Identify legacy/dead layout/home modules.
- [ ] Compare legacy modules against Phase 2 journeys before deletion/quarantine.
- [ ] Decide quarantine vs delete through explicit user approval.
- [ ] Ensure cleanup does not alter user-facing behavior unless approved.
- [ ] Preserve route centralization in `src/lib/routes.ts`.
- [ ] Preserve service-only mock access.
- [ ] Document any removed/quarantined surface.

---

## Tooling Checklist

- [ ] Confirm Node/npm baseline.
- [ ] Confirm `npm run lint` passes before and after changes.
- [ ] Confirm `npm run typecheck` passes before and after changes.
- [ ] Decide Prettier config.
- [ ] Install Prettier only with approval.
- [ ] Add format scripts only with approval.
- [ ] Add Husky/lint-staged only with approval.
- [ ] Avoid large formatting churn mixed with cleanup unless approved.

---

## Import Guardrail Checklist

- [ ] Prevent `@/mocks/*` imports outside `src/services`.
- [ ] Prevent raw `fetch` in pages/components where practical.
- [ ] Keep `shared/ui` independent of services/features.
- [ ] Keep services free of JSX.
- [ ] Document any ESLint rule additions.

---

## Documentation Checklist

- [ ] Update `docs/phase3-summary.md` at end of Phase 3.
- [ ] Update `docs/architecture/risk-analysis.md` if risks change.
- [ ] Update `docs/architecture/module-map.md` if ownership changes.
- [ ] Update `docs/architecture/shared-components-map.md` if shared component decisions change.
- [ ] Update roadmap only if phase scope changes with user approval.

---

## SEO/Foundation Checklist

Phase 3 should not implement SEO pages, but must prepare for Phase 4:

- [ ] Confirm which current routes are low-priority/placeholder.
- [ ] Confirm no placeholder content is made more prominent.
- [ ] Confirm image optimization risk remains tracked.
- [ ] Confirm route changes are not made without SEO URL decision.
- [ ] Confirm any cleanup preserves future category/product/article metadata paths.

---

## State/Foundation Checklist

- [ ] Confirm cart state ownership remains clear.
- [ ] Do not introduce auth state.
- [ ] Do not introduce API cache libraries.
- [ ] Do not move local UI state into global providers without reason.
- [ ] Track future cart API migration risk.

---

## Definition of Done for Phase 3

Phase 3 is done only if:

- active UI structure is unambiguous
- tooling decisions are implemented or explicitly deferred
- lint/typecheck pass
- no feature work was mixed in
- documentation reflects all cleanup/tooling decisions
- Phase 4 can begin without resolving foundational ambiguity

---

## Implementation Readiness Gate

No feature implementation should begin until:

- this checklist is reviewed
- dead legacy UI decision is completed or explicitly deferred
- service/mock import boundaries are understood
- formatting/tooling path is stable
- Phase 3 summary is created
