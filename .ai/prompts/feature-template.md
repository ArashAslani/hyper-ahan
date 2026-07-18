# Feature Prompt Template

Use this template when requesting an approved feature.

---

## Prompt

```text
You are working on HyperAhan.

Active phase:
[PHASE NAME / NUMBER]

Task:
[Describe the feature]

Read first:
- .ai/constitution/project-constitution.md
- docs/roadmap/project-roadmap.md
- docs/architecture/frontend-architecture.md
- docs/architecture/feature-template.md
- docs/development/definition-of-done.md
- relevant UI/SEO/API docs

Constraints:
- Follow the active roadmap phase.
- Keep data access in services.
- Do not import mocks into UI.
- Do not call fetch in pages/components.
- Do not install packages without approval.
- Do not refactor unrelated files.
- Update documentation if standards, behavior, routes, API, or SEO change.

Required workflow:
1. Analyze existing patterns.
2. Create a concise plan.
3. Wait for approval if architecture, route, package, SEO, or public behavior changes.
4. Implement narrowly.
5. Run lint and typecheck.
6. Self-review.
7. Report changes and remaining risks.
```

---

## Fill Before Use

- Active phase:
- Feature goal:
- User-facing outcome:
- Routes affected:
- Services affected:
- SEO impact:
- Documentation expected:
