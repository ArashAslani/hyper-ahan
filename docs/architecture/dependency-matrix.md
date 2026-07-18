# Documentation Dependency Matrix

**Project:** HyperAhan  
**Phase:** 2.5 — Architecture Synthesis  
**Purpose:** Show how major project documents depend on each other and how conflicts are resolved.

---

## Control Hierarchy

When documents conflict, use this order:

1. `.ai/constitution/project-constitution.md`
2. `docs/roadmap/project-roadmap.md`
3. `docs/architecture/frontend-blueprint.md`
4. `docs/architecture/frontend-architecture.md`
5. Domain standards: business, UX, SEO, API, admin, development
6. Phase summaries and audits
7. Older historical docs (`docs/ARCHITECTURE.md`, `docs/mvp-ahanalat.md`, `docs/frontend-integration.md`, legacy readme docs)

Historical docs explain context. They do not override the constitution, roadmap, or synthesized architecture.

---

## Dependency Matrix

| Document | Depends On | Provides | Must Not Contradict |
|----------|------------|----------|---------------------|
| `.ai/constitution/project-constitution.md` | User-approved decisions | Highest-level values, constraints, AI behavior | User-approved constitutional updates |
| `docs/roadmap/project-roadmap.md` | Constitution | Official phase order and scope | Constitution |
| `docs/architecture/frontend-blueprint.md` | Constitution, roadmap, all standards | Master frontend architecture | Constitution, roadmap |
| `docs/architecture/frontend-architecture.md` | Constitution | Layering, data flow, dependency direction | Blueprint |
| `docs/architecture/folder-structure.md` | Frontend architecture | Folder ownership/import rules | Blueprint |
| `docs/architecture/feature-template.md` | Frontend architecture, folder structure | Future feature structure | Blueprint, roadmap |
| `docs/architecture/information-architecture.md` | Business, SEO, navigation, roadmap | Site hierarchy | Roadmap, SEO indexing rules |
| `docs/architecture/module-map.md` | Blueprint, module roadmap, API/admin docs | Module responsibilities | Blueprint |
| `docs/architecture/state-management.md` | API, frontend architecture, checkout/cart journeys | State ownership | API guidelines, storage rules |
| `docs/architecture/rendering-strategy.md` | SEO standards, frontend architecture | Server/client rendering rules | SEO standards |
| `docs/architecture/shared-components-map.md` | Design system, component guidelines, page blueprints | Expected reusable components | Component guidelines |
| `docs/architecture/risk-analysis.md` | Phase 0 audit, Phase 2 blueprint | Consolidated risks | Constitution/roadmap |
| `docs/architecture/foundation-checklist.md` | Blueprint, risk analysis, roadmap | Phase 3 readiness checklist | Roadmap |
| `docs/business/business-principles.md` | Constitution, roadmap | Business goals and product decision rule | Roadmap |
| `docs/business/customer-personas.md` | Business principles | Target user models | Business principles |
| `docs/business/customer-journey.md` | Personas, conversion strategy, API docs | End-to-end journeys | API flow and roadmap |
| `docs/business/homepage-strategy.md` | Business principles, personas, navigation | Homepage sections and goals | Page blueprints |
| `docs/business/product-discovery.md` | Personas, IA, SEO | Discovery strategy | SEO standards |
| `docs/business/conversion-strategy.md` | Business principles, competitor analysis | CTA and conversion rules | Design system |
| `docs/business/module-roadmap.md` | Roadmap, business principles | Future module sequencing | Official roadmap |
| `docs/ui/design-system.md` | Constitution, business principles | UI philosophy | Component guidelines |
| `docs/ui/component-guidelines.md` | Design system, frontend architecture | Shared vs feature component rules | Folder structure |
| `docs/ui/navigation-strategy.md` | IA, customer journeys, design system | Navigation model | Route centralization |
| `docs/ui/page-blueprints.md` | IA, conversion, SEO, API guidelines | Page-level requirements | Roadmap, API boundaries |
| `docs/seo/seo-standards.md` | Constitution, business principles | Metadata/indexing/structured data rules | Rendering strategy |
| `docs/seo/content-strategy.md` | SEO standards, business journeys | Blog/category/product content strategy | Roadmap content phase |
| `docs/api/api-guidelines.md` | Frontend architecture, backend integration docs | Service/API boundary | Constitution, roadmap |
| `docs/admin/admin-framework.md` | Roadmap, API guidelines, business principles | Future admin standards | Roadmap |
| `docs/development/coding-standards.md` | Constitution, frontend architecture | Code style and quality rules | Folder structure |
| `docs/development/workflow.md` | Constitution | Required task workflow | Roadmap |
| `docs/development/definition-of-done.md` | Constitution, coding standards | Completion criteria | Workflow |
| `docs/phase1-summary.md` | Phase 1 deliverables | Phase 1 decisions | Roadmap |
| `docs/phase2-summary.md` | Phase 2 deliverables | Phase 2 decisions | Roadmap |
| `docs/audit/phase0-summary.md` | Phase 0 audits | Baseline implementation risks | Current roadmap |

---

## Cross-Document Rules

- Business goals define why a feature exists.
- Information architecture defines where a page belongs.
- Page blueprints define what a page must achieve.
- Frontend architecture defines how implementation is allowed to be structured.
- API guidelines define how data enters the frontend.
- SEO standards define what must be crawlable, indexable, and metadata-ready.
- Design system/component guidelines define reusable UI boundaries.
- Roadmap defines when implementation is allowed.

---

## Conflict Resolution Process

If conflict is found:

1. Identify the controlling document using the hierarchy above.
2. Update lower-priority documents to match it.
3. Add or update a summary if the decision changes project direction.
4. Do not implement code while resolving documentation conflicts.
5. If the constitution itself must change, require explicit user approval.

---

## Phase 2.5 Findings

Resolved conflicts:

- `docs/business/business-principles.md` had an outdated future sequence that placed cleanup/tooling before the Business & UX Blueprint. It now follows the official roadmap.
- `docs/api/api-guidelines.md`, `docs/admin/admin-framework.md`, `docs/seo/seo-standards.md`, and `docs/architecture/feature-template.md` used Phase 1-specific wording for future-only work. They now refer to roadmap-approved phases.

No code or package changes were required.
