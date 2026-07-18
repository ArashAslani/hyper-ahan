# HyperAhan Project Constitution

**Status:** Highest-priority permanent project document  
**Created:** Phase 1 — Project Constitution  
**Applies to:** Humans, Cursor agents, AI agents, and all future development

This constitution defines how HyperAhan must be built and maintained. When another document conflicts with this file, this file wins unless the user explicitly approves a constitutional update.

---

## Project Identity

HyperAhan is an SEO-first, mobile-first steel e-commerce platform.

Primary business goal:

> Convert visitors into customers.

Technical goal:

> Keep the project maintainable, modular, scalable, fast, reusable, and solo-developer friendly for years.

---

## Project Values

The project values:

- clarity over cleverness
- maintainability over speed
- SEO value over visual noise
- mobile conversion over desktop decoration
- explicit architecture over accidental structure
- reusable standards over repeated prompts
- trustworthy content over filler
- safe iteration over broad rewrites

Every decision must support the long-term health of the project.

---

## Engineering Values

Engineering work must be:

- typed
- documented
- reviewable
- scoped
- reversible where possible
- consistent with existing patterns
- validated with lint and typecheck

Do not add complexity because it feels professional. Add structure only when it protects a boundary or reduces real maintenance cost.

---

## Architecture Values

Architecture rules:

- UI never imports mocks directly.
- UI never calls raw `fetch`.
- Data access goes through services.
- Routes come from `src/lib/routes.ts`.
- Storage keys come from `src/lib/storage.ts`.
- Shared UI stays domain-neutral.
- Feature code stays inside feature ownership.
- Client components are minimized.
- SEO content should be server-renderable.

The official architecture documents are:

- `docs/architecture/frontend-blueprint.md`
- `docs/architecture/dependency-matrix.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/folder-structure.md`
- `docs/architecture/feature-template.md`

---

## UI Values

UI must be:

- mobile-first
- fast to scan
- conversion-oriented
- accessible
- consistent with design tokens
- practical for steel buyers
- clear about price, unit, CTA, and trust

Do not introduce UI patterns that compete with the core customer journey.

---

## SEO Values

SEO is a first-class product requirement.

Rules:

- Indexable pages need useful metadata.
- Content must be crawlable and meaningful.
- Canonical strategy must be explicit.
- Structured data must be accurate.
- Placeholder/thin content must not be indexed.
- Performance regressions are SEO regressions.

Future Blog work must not start until the roadmap phase allows it.

---

## Business Values

Business decisions must support:

- buyer trust
- fast price/product discovery
- easy consultation/contact
- qualified purchase requests
- clear order expectations
- sustainable operations

Do not add a feature unless it helps conversion, trust, SEO, or operational maintainability.

---

## Cursor Behavior

Cursor must be used as an architecture-aware assistant, not a code generator without context.

Rules for Cursor work:

- Open the `hyper-ahan/` workspace, not the broader parent folder, when possible.
- Read this constitution before significant work.
- Prefer targeted file reads over broad noisy searches.
- Avoid editing legacy/dead UI unless the task is specifically cleanup.
- Do not rely on memory when standards documents exist.
- Keep `.cursorignore` focused on reducing irrelevant context.

---

## AI Behavior

AI agents must:

- follow the active roadmap phase
- read relevant docs before implementation
- produce a plan for non-trivial changes
- wait for approval when scope/architecture/dependencies change
- keep changes narrow
- document decisions
- report validation honestly

AI agents must not:

- implement Blog, Admin, Authentication, or backend integration unless the active phase explicitly allows it
- install packages without approval
- move, rename, or delete files without approval
- refactor unrelated code
- import mocks into UI
- call `fetch` inside pages/components
- create placeholder documentation

---

## Documentation Behavior

Documentation is part of the product.

Rules:

- Official standards must be written in English.
- Documentation must be specific to HyperAhan.
- Placeholder sections are forbidden.
- New architecture decisions must update docs.
- Future agents must be able to follow docs without extra explanation.

If documentation and implementation disagree, either fix the implementation or update the documentation through an explicit decision.

---

## Quality Rules

Before work is considered ready:

- `npm run lint` must pass.
- `npm run typecheck` must pass.
- architecture boundaries must be respected.
- documentation must be current.
- no future phase must be implemented accidentally.
- no unrelated files must be changed.

If validation cannot run, report why.

---

## Dependency Rules

Dependencies are long-term obligations.

Rules:

- Do not install packages without approval.
- Prefer the platform and existing dependencies.
- Add a library only when it removes meaningful complexity.
- Document why the package is needed.
- Revisit dependencies during audits.

---

## Roadmap Rule

The roadmap controls scope.

If the active phase is:

- Phase 1: documentation only
- Phase 2: business and UX blueprint
- Phase 2.5: architecture synthesis
- Phase 3: foundation cleanup/tooling
- Phase 4: SEO/catalog foundation
- Phase 5: API integration
- Phase 6: authentication
- Phase 7: checkout/orders maturity
- Phase 8: admin
- Phase 9: content/blog
- Phase 10: optimization/scale

Do not pull future-phase work forward without explicit user approval and roadmap update.

---

## Constitutional Change Rule

This file may change only when:

1. the user explicitly asks to change project standards, or
2. an approved architecture decision requires it.

Any change must preserve the core project goals: maintainable, modular, scalable, SEO-first, mobile-first, fast, reusable, and solo-developer friendly.
