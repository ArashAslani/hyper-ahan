# Feature Workflow

Use this workflow for approved feature work only.

---

## Required Reading

Before planning:

- `.ai/constitution/project-constitution.md`
- `docs/roadmap/project-roadmap.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/feature-template.md`
- `docs/development/definition-of-done.md`
- relevant UI/SEO/API documents

---

## Steps

1. Confirm the feature belongs to the active roadmap phase.
2. Inspect existing feature patterns.
3. Identify routes, services, UI components, and docs affected.
4. Create a short implementation plan.
5. Ask for approval if the feature changes architecture, routes, dependencies, SEO, or public behavior.
6. Implement narrowly.
7. Keep data access inside services.
8. Keep shared components domain-neutral.
9. Run lint and typecheck.
10. Update documentation.
11. Report completion, validation, and residual risks.

---

## Forbidden During Feature Work

- implementing a future phase early
- installing packages without approval
- importing mocks into UI
- calling raw `fetch` in pages/components
- moving or deleting files as drive-by cleanup
- mixing unrelated refactors with the feature

---

## Feature Output Requirements

The final response must include:

- what changed
- validation run
- docs updated
- anything intentionally deferred
