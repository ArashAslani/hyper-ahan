# Project Roadmap

**Status:** Permanent Phase 1 standard  
**Purpose:** Define official phases, deliverables, and exit criteria.

The roadmap protects the project from scope creep. Do not implement work from a future phase unless the user explicitly changes the active phase.

---

## Phase 0 — Engineering Environment & Project Audit

**Goal:** Understand the project and make safe environment improvements only.

**Deliverables:**

- frontend audit
- dependency audit
- environment audit
- code quality audit
- Cursor optimization audit
- Grafify strategy
- recommendations
- phase summary
- zero-risk documentation/tooling hygiene

**Exit criteria:**

- no features implemented
- all audit docs exist
- lint/typecheck pass after safe fixes
- project gaps are documented

**Status:** Complete.

---

## Phase 1 — Project Constitution

**Goal:** Define permanent engineering standards.

**Deliverables:**

- architecture standards
- folder structure standard
- feature template
- coding standards
- workflow
- definition of done
- UI standards
- SEO standards
- business principles
- admin framework
- API guidelines
- roadmap
- AI constitution, workflows, and prompts
- phase summary

**Exit criteria:**

- no code implemented
- no packages installed
- no architecture changed
- all standards are production-quality English documentation
- future AI agents can work from the documents alone

---

## Phase 2 — Business & UX Blueprint

**Goal:** Define the complete business, UX, SEO, information architecture, and conversion blueprint before implementation foundation work begins.

**Decision:** This phase intentionally precedes frontend foundation cleanup/tooling because HyperAhan is a business-driven SEO-first steel e-commerce platform. The frontend foundation must be shaped around real user journeys, conversion goals, SEO strategy, and business workflows rather than assumptions.

**Deliverables:**

- competitor analysis
- customer personas
- customer journeys
- information architecture
- navigation strategy
- homepage strategy
- product discovery strategy
- conversion strategy
- content strategy
- page blueprints
- future business module map
- phase summary

**Exit criteria:**

- no React code implemented
- no packages installed
- no routes/pages/features implemented
- business goals and conversion paths are documented
- SEO/content strategy is documented
- information architecture is documented
- future implementation can proceed without unresolved business questions

---

## Phase 2.5 — Architecture Synthesis

**Goal:** Transform all constitution, architecture, business, UX, SEO, API, admin, and roadmap documentation into one unified and conflict-free architecture before Phase 3 foundation work begins.

**Deliverables:**

- documentation dependency matrix
- master frontend blueprint
- module map
- shared components map
- state management strategy
- rendering strategy
- risk analysis
- Phase 3 foundation checklist
- phase summary

**Exit criteria:**

- no React code implemented
- no packages installed
- no refactoring performed
- documentation conflicts identified and resolved
- all future implementation can rely on synthesized architecture documents
- Phase 3 can begin without new architectural decisions

---

## Phase 3 — Foundation Cleanup & Tooling

**Goal:** Reduce known Phase 0 debt and prepare implementation foundations using Phase 2 business/UX decisions.

**Deliverables:**

- decision and execution for dead legacy UI quarantine/removal
- Prettier strategy and installation if approved
- Husky/lint-staged if approved
- import boundary rules where practical
- documentation updates for any tooling decisions
- CI quality gate proposal or implementation when approved

**Exit criteria:**

- active UI structure is unambiguous
- formatting strategy is stable
- lint/typecheck gates are reliable
- cleanup aligns with Phase 2 user journeys and information architecture
- no feature work mixed into cleanup

---

## Phase 4 — SEO & Catalog Foundation

**Goal:** Make catalog/category/product surfaces ready for SEO growth and Phase 2 conversion journeys.

**Deliverables:**

- metadata strategy
- product/category metadata
- image optimization plan and implementation if approved
- canonical strategy
- sitemap/robots strategy when real indexable content exists
- category/product content standards

**Exit criteria:**

- indexable pages have metadata
- product/category pages are crawlable
- no placeholder/thin pages are indexed
- SEO standards are reflected in implementation
- Phase 2 content and discovery strategy is respected

---

## Phase 5 — API Integration Foundation

**Goal:** Connect frontend services to backend safely without leaking DTOs into UI.

**Deliverables:**

- API client usage finalized
- environment variables documented
- selected services migrated from mocks to API
- DTO mapping layer
- normalized error handling
- loading/empty/error states reviewed

**Exit criteria:**

- no direct fetch in pages/components
- services remain stable public boundary
- UI consumes domain types
- mock replacement is documented

---

## Phase 6 — Authentication & Customer Continuity

**Goal:** Add real customer identity only after API foundations exist.

**Deliverables:**

- OTP/auth flow
- token/session handling
- protected customer views if required
- profile completion strategy
- cart/session continuity
- auth error handling

**Exit criteria:**

- tokens are not handled inside UI components
- auth state has documented ownership
- cart/profile/order flows remain consistent
- security-sensitive behavior is reviewed

---

## Phase 7 — Checkout & Orders Maturity

**Goal:** Convert purchase intent into reliable operational requests.

**Deliverables:**

- real order submission
- order detail/tracking from API
- checkout validation
- business error states
- order status mapping centralized
- post-submit user guidance

**Exit criteria:**

- duplicate submissions are prevented
- order statuses are consistent
- checkout is mobile-friendly
- order data comes from services/API

---

## Phase 8 — Admin Foundation

**Goal:** Build operational admin only when backend contracts and business needs are clear.

**Deliverables:**

- admin routing strategy
- admin layout
- permission model alignment with backend
- product/category/order CRUD foundations
- table/form/upload standards implemented where approved

**Exit criteria:**

- admin is separated from customer storefront
- permissions are not UI-only
- CRUD is safe and documented
- no customer SEO regressions

---

## Phase 9 — Content & Blog SEO

**Goal:** Add content/blog only when editorial process, conversion paths, and SEO standards are ready.

**Deliverables:**

- content model
- article routes
- metadata and JSON-LD
- internal linking strategy
- editorial quality rules
- sitemap inclusion rules

**Exit criteria:**

- no thin placeholder content is indexed
- articles support business conversion
- content ownership is clear
- SEO standards are followed

---

## Phase 10 — Optimization & Scale

**Goal:** Improve performance, analytics, maintainability, and operational resilience.

**Deliverables:**

- Core Web Vitals review
- bundle and image optimization
- analytics/conversion tracking strategy
- test coverage expansion
- CI/CD maturity
- admin/customer UX refinements
- documentation refresh

**Exit criteria:**

- performance budgets are respected
- analytics answer business questions
- tests protect critical flows
- docs remain current

---

## Roadmap Governance

Rules:

- Each phase must start by reading Phase 1 standards.
- Each phase must end with a summary.
- Future phase work must not be implemented early.
- If priorities change, update this roadmap before implementation.
- Documentation changes are required when implementation creates a new standard.
