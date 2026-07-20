# Next Phase Plan

**Project:** HyperAhan
**Prepared by:** Project planning pass (planning only — nothing in this document has been implemented)
**Source of truth used:** `.ai/constitution/project-constitution.md`, `docs/roadmap/project-roadmap.md`, `docs/architecture/foundation-checklist.md`, `docs/architecture/frontend-blueprint.md`, `docs/architecture/module-map.md`, `docs/architecture/dependency-matrix.md`, plus supporting standards cited inline (`docs/seo/seo-standards.md`, `docs/ui/page-blueprints.md`, `docs/architecture/information-architecture.md`, `docs/architecture/rendering-strategy.md`, `docs/architecture/risk-analysis.md`).

---

## 0. Compliance Note — Read Before Proceeding

Before naming the next phase, the roadmap's own governance rule was checked: *"Each phase must end with a summary... If priorities change, update this roadmap before implementation"* (`project-roadmap.md` → Roadmap Governance), and `docs/architecture/foundation-checklist.md`'s **Implementation Readiness Gate** states: *"No feature implementation should begin until: ...dead legacy UI decision is completed or explicitly deferred... formatting/tooling path is stable... Phase 3 summary is created."*

As of this planning pass:

- `docs/phase3-summary.md` **does not exist**.
- The Prettier/Husky/lint-staged decision is recorded as **pending, not yet decided** in `docs/architecture/foundation-checklist.md`'s Tooling Checklist (proposed as Sprint 3.3 in `docs/sprints/sprint-3.2-summary.md`, not yet executed).
- The legacy-UI quarantine/removal decision is recorded as **pending explicit approval**, same source.

This is a **gap, not a hard blocker**: the user has stated Phase 3 is complete, and the Definition of Done allows tooling/legacy-UI decisions to be satisfied by being *"implemented or explicitly deferred."* I'm treating "Phase 3 has been completed" as that explicit deferral decision for the two open items. However, per the Implementation Readiness Gate's explicit text, **`docs/phase3-summary.md` should exist before Phase 4 implementation begins** — this plan recommends writing it as the first small step of Phase 4 kickoff (see §9), not as a reason to withhold this plan. Flagging this per the instruction to "explain instead of guessing" rather than silently treating Phase 3 as fully closed.

---

## 1. Official Next Phase Name

**Phase 4 — SEO & Catalog Foundation**

Source: `docs/roadmap/project-roadmap.md`, immediately following Phase 3 — Foundation Cleanup & Tooling, with no phase skipped and no phase invented.

---

## 2. Why This Phase Comes Next

- **Roadmap sequencing:** Phase 4 is the literal next entry in `project-roadmap.md` after Phase 3. Phases 5 (API Integration), 6 (Authentication), 7 (Checkout/Orders Maturity), 8 (Admin), 9 (Content/Blog) are explicitly later and are forbidden to pull forward without a roadmap change (constitution → Roadmap Rule).
- **Foundation explicitly points here:** `docs/architecture/foundation-checklist.md`'s own "SEO/Foundation Checklist" section states Phase 3 "must prepare for Phase 4," and its items (confirm placeholder routes, confirm image-optimization risk is tracked, confirm metadata paths are preserved) were verified compliant during Sprint 3.1/3.2.
- **Risk analysis prioritizes it:** `docs/architecture/risk-analysis.md`'s SEO Risks table lists four **High/High** or **High/Medium** risks whose stated mitigation is explicitly "Phase 4 metadata work": *"Product/category pages lack metadata,"* *"Thin placeholder content gets indexed,"* *"Filter/search pages create index bloat,"* *"Client-only content weakens crawlability."* These are the highest-severity **undischarged** risks in the whole document.
- **Module readiness:** `docs/architecture/module-map.md`'s Catalog Module is already implemented (mock-backed `productService`, `catalogNavService`, `ProductListView`, `ProductDetailView`, category routes) but has zero per-route metadata today — it's the module best positioned to receive SEO work without needing new business logic.
- **No unmet dependency:** `docs/architecture/dependency-matrix.md` shows `rendering-strategy.md` (depends on SEO standards + frontend architecture) and `seo/seo-standards.md` (depends on constitution + business principles) are both already-complete Phase 2/2.5 documents — nothing about Phase 4 is waiting on undocumented decisions.

---

## 3. Deliverables

Directly from `project-roadmap.md`'s Phase 4 entry, scoped by `docs/seo/seo-standards.md` and `docs/architecture/rendering-strategy.md`:

1. **Metadata strategy** — a consistent, server-side `generateMetadata` pattern (title, description, canonical, OpenGraph, robots-when-non-default) usable across all indexable routes.
2. **Product/category metadata** — real `generateMetadata` on the homepage, categories list, `product-category/[slug]`, `products` list, and `products/[id]` detail routes, sourced from existing services (not hard-coded).
3. **Canonical strategy** — explicit canonical URLs for every indexable route; explicit non-indexable (`noindex`) declaration for cart/checkout/profile/orders/login/register/search, per `seo-standards.md` → Canonical URLs / Sitemap.
4. **Sitemap/robots strategy** — `src/app/sitemap.ts` and `src/app/robots.ts`, including only stable, real, indexable routes (excludes cart, checkout, profile, orders, auth, and any mock-only placeholder route per `seo-standards.md` → Sitemap).
5. **Category/product content standards** — verify existing mock copy/structure satisfies `seo-standards.md`'s Category SEO / Product SEO rules (category explanation present, product title includes meaningful attributes, price/unit visible and crawlable); adjust only what's needed to comply, no redesign.
6. **Image optimization plan, with implementation gated on approval** — a documented plan to replace raw `<img>` with `next/image` on `ProductCard`, `ProductDetailView`, and the homepage hero (flagged in `docs/audit/frontend-audit.md` and `risk-analysis.md` Performance Risks). The roadmap itself says "if approved" — this plan proposes it but implementation should wait for an explicit go-ahead given it touches already-shipped visual UI.

---

## 4. Files Expected to Change

```text
New:
  src/app/sitemap.ts                              sitemap generation (indexable routes only)
  src/app/robots.ts                                 robots policy
  src/lib/metadata.ts                                shared generateMetadata builder (title/description/canonical/OG/robots)
  docs/phase4-summary.md                             end-of-phase summary (per Roadmap Governance)

Modified (metadata additions — generateMetadata exports):
  src/app/page.tsx                                   homepage metadata
  src/app/categories/page.tsx
  src/app/product-category/[slug]/page.tsx           canonical + category metadata
  src/app/(shop)/products/page.tsx
  src/app/(shop)/products/[id]/page.tsx               product metadata (title/spec/price-aware)
  src/app/(content)/about/page.tsx, (content)/contact/page.tsx   (already indexable per IA; add metadata)

Modified (explicit noindex — per seo-standards.md "Sitemap" exclusions):
  src/app/(shop)/cart/page.tsx
  src/app/(shop)/checkout/page.tsx
  src/app/profile/page.tsx
  src/app/orders/page.tsx, src/app/orders/[id]/page.tsx
  src/app/(auth)/login/page.tsx, src/app/(auth)/register/page.tsx
  src/app/search/page.tsx                            (non-indexable per page-blueprints.md "Search Page" SEO goals)

Modified (foundational config):
  src/config/site.ts                                  add base site URL for absolute canonical/OG URLs
  .env.example                                         document NEXT_PUBLIC_SITE_URL if introduced

Modified (only if image-optimization is explicitly approved):
  src/shared/ui/ProductCard.tsx, src/features/catalog/ProductDetailView.tsx, src/features/home/HeroSlider.tsx
  next.config.ts                                      only if a new image host is needed (none expected — placehold.co already configured)

Documentation updates:
  docs/architecture/risk-analysis.md                  mark SEO risks mitigated once metadata/sitemap ship
  docs/architecture/rendering-strategy.md              record the shared metadata-builder pattern if one is introduced
```

No files under `src/features/{blog,admin,checkout}` (they don't exist and won't be created), no service layer changes beyond consuming already-existing services for metadata data.

---

## 5. Features Intentionally NOT Included

- **Blog/Content SEO** (Phase 9) — `ArticleListView`/`ArticleDetailView` metadata is out of scope; `seo-standards.md` explicitly states "Blog implementation is allowed only in the official content/blog roadmap phase."
- **Admin** (Phase 8) — no admin routes, no admin SEO exclusion work needed since none exist yet.
- **Authentication** (Phase 6) — no real OTP/session logic; login/register pages are touched only to mark them `noindex`, not to change their behavior.
- **API Integration** (Phase 5) — metadata will be generated from existing mock-backed services (`productService`, `catalogNavService`, `homeService`), not real backend data. No `fetch`, no DTO mapping changes.
- **Checkout/Orders Maturity** (Phase 7) — cart/checkout/orders pages are touched only for `noindex`, not for functional changes.
- **Search SEO route** — `page-blueprints.md` states search results are "generally not indexable unless a deliberate SEO route exists"; no such route is being designed now, so search stays `noindex`.
- **New pages/routes/business features** — no new customer-facing surfaces; this phase only adds metadata/SEO plumbing to existing routes.
- **Structured data beyond what's verifiably true** — no `Product`/`Offer` JSON-LD with fabricated ratings/availability; `seo-standards.md` is explicit that structured data must match visible truth exactly. If product/category JSON-LD is added, it will mirror only fields already rendered (name, price, availability signal already shown in UI).

---

## 6. Dependencies

| Dependency | Status |
|---|---|
| `docs/seo/seo-standards.md` | ✅ Exists, Phase 1, no gaps |
| `docs/architecture/rendering-strategy.md` | ✅ Exists, Phase 2.5, defines Server Component metadata rules already |
| `docs/ui/page-blueprints.md` | ✅ Exists, defines per-page SEO goals |
| `docs/architecture/information-architecture.md` | ✅ Exists, defines indexable vs non-indexable routes |
| Existing services (`productService`, `catalogNavService`, `homeService`) | ✅ Already implemented, sufficient to source metadata |
| `src/config/site.ts` base URL | ⚠️ **Gap** — no site URL constant exists yet; needed for absolute canonical/OG URLs. Small addition, not a blocker. |
| Phase 3 closure (`docs/phase3-summary.md`, Prettier/Husky decision, legacy-UI decision) | ⚠️ **Gap noted in §0** — recommend closing alongside Phase 4 kickoff, not before it |
| Image optimization approval | ⚠️ Requires explicit user approval before the `next/image` migration sub-item is implemented |

---

## 7. Acceptance Criteria

Directly from `project-roadmap.md`'s Phase 4 exit criteria, made concrete:

- [ ] Homepage, categories, `product-category/[slug]`, products list, and product detail routes each export `generateMetadata` with title, description, and canonical URL.
- [ ] `src/app/sitemap.ts` exists and includes only homepage, categories, product-category, and product routes (no cart/checkout/profile/orders/auth/search).
- [ ] `src/app/robots.ts` exists and disallows non-indexable paths consistent with the sitemap exclusions.
- [ ] Cart, checkout, profile, orders, login, register, and search routes explicitly declare `robots: { index: false }` (or equivalent) metadata.
- [ ] No JSON-LD or metadata field is added that doesn't match visible, real page content (no fake prices/ratings/availability).
- [ ] `npm run lint` and `npm run typecheck` pass.
- [ ] No Blog, Admin, Authentication, API-integration, or Checkout-maturity code is introduced.
- [ ] `docs/phase4-summary.md` is created; `docs/architecture/risk-analysis.md` SEO Risks are updated to reflect what was mitigated.

---

## 8. Risks

Pulled from `docs/architecture/risk-analysis.md` (existing, unresolved) plus two new risks identified for this phase:

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| Product/category pages lack metadata (existing) | High | High | This phase's core deliverable |
| Thin placeholder content gets indexed (existing) | High | Medium | `noindex` on incomplete/mock-only routes; only index routes with real, complete mock data |
| Filter/search pages create index bloat (existing) | High | Medium | Keep search `noindex`; no canonical filter-variant strategy introduced yet |
| Client-only content weakens crawlability (existing) | High | Medium | Keep metadata generation server-side; don't move indexable page content into client components |
| Raw images cause CLS/bandwidth issues (existing, Performance) | High | High | Addressed only if image-optimization sub-item is approved this phase |
| **New:** Metadata built from mock data may not match real backend data shapes once Phase 5 connects the API | Medium | Medium | Keep the metadata builder (`src/lib/metadata.ts`) decoupled from mock specifics — accept a plain domain object, not the mock shape directly |
| **New:** `next/image` migration could introduce visual/layout regressions if not verified on mobile (the project's primary breakpoint) | Medium | Low | Treat as a separate, explicitly-approved sub-task with its own before/after check on the mobile viewport; do not bundle with metadata changes |

---

## 9. Estimated Implementation Order

1. Write `docs/phase4-summary.md` scaffold and close the Phase 3 gap noted in §0 (confirm/record the Prettier/Husky and legacy-UI decisions as explicitly deferred or resolved).
2. Add a base site URL constant to `src/config/site.ts` (foundation for canonical/OG).
3. Add `src/lib/metadata.ts` — one small, reusable `generateMetadata`-input builder consistent with `seo-standards.md`, so every page follows the same shape instead of five ad-hoc implementations.
4. Implement `generateMetadata` on the homepage (lowest-risk, highest-traffic page).
5. Implement `generateMetadata` on categories + `product-category/[slug]` (category SEO).
6. Implement `generateMetadata` on products list + `products/[id]` (product SEO — highest commercial value).
7. Add explicit `noindex` metadata to cart/checkout/profile/orders/login/register/search.
8. Add `src/app/sitemap.ts` and `src/app/robots.ts`.
9. Verify `about`/`contact` metadata (simple, low-risk).
10. Run `npm run lint` / `npm run typecheck`; update `risk-analysis.md` and write `docs/phase4-summary.md`.
11. **Separately, only if approved:** plan and implement the `next/image` migration as its own reviewable step, verified on mobile.

---

## 10. Recommended Model

**Recommended: Claude Sonnet 5 (thinking).**

Reasoning:

- Phase 4's work is **spec-dense but not architecturally ambiguous** — nearly every deliverable (canonical rules, sitemap exclusions, noindex list, metadata fields) is already precisely written down across `seo-standards.md`, `page-blueprints.md`, and `information-architecture.md`. The task is mostly about *faithfully cross-referencing ~5 documents while touching ~12 files consistently*, not making new architectural judgment calls.
- **Opus**-class models would likely produce equally correct output but at higher cost/latency for a task that doesn't need their extra reasoning depth — better reserved for phases with real architectural ambiguity (e.g., the Phase 2.5 synthesis work, or Phase 5's DTO-mapping design).
- **Codex**-style models are strong at localized code generation but this phase is as much about *doc compliance* (which fields are required, which routes must be excluded, matching visible content exactly) as it is about code — a model with strong long-context document adherence has an edge over one optimized purely for code completion.
- **Grok**-class models are faster/cheaper and could produce a reasonable first draft, but given that incorrect canonical/robots/sitemap output can actively harm SEO (the opposite of this phase's goal), a review pass by a more consistent, spec-adherent model is warranted — Sonnet 5 already demonstrated (across Sprints 3.1/3.2 in this project) reliable multi-document cross-referencing with zero lint/typecheck regressions, which is the exact skill this phase needs most.

If the team wants to parallelize, a reasonable split is: Sonnet 5 for the metadata/sitemap/robots implementation (steps 2–10 above), and a fast/cheap model only for the mechanical `next/image` swap in step 11 (low ambiguity, easy to verify visually) — but a single Sonnet 5 pass end-to-end is the simplest, lowest-risk option.

---

## Compliance Verification

| Check | Result |
|---|---|
| **Constitution** | Compliant. SEO Values ("Indexable pages need useful metadata," "Placeholder/thin content must not be indexed," "Performance regressions are SEO regressions") are the direct subject of this phase. AI Behavior's ban on implementing Blog/Admin/Authentication/backend integration is respected — none are touched. |
| **Roadmap** | Compliant. Phase 4 is the next sequential phase; deliverables and exit criteria are copied verbatim from `project-roadmap.md`, not invented. No Phase 5–10 work is included. |
| **Phase ordering** | Compliant with one caveat (see §0): Phase 3's Implementation Readiness Gate technically requires `docs/phase3-summary.md` to exist first. This plan does not skip a phase — it schedules closing that gap as step 1 of implementation rather than blocking planning on it, per the user's statement that Phase 3 is complete. |
| **Dependency matrix** | Compliant. `docs/architecture/dependency-matrix.md` shows `rendering-strategy.md` and `seo-standards.md` as already-resolved dependencies with no open "must not contradict" conflicts. This plan does not contradict `frontend-blueprint.md`'s SEO Layer or Rendering Strategy sections — it implements exactly what they already specify. |

**No unresolved conflict blocks this plan.** The only open item is the Phase 3 documentation-closure gap noted in §0, which is a process/paperwork gap, not a scope conflict — it doesn't change what Phase 4 is or what it should contain.

**Nothing in this document has been implemented.** This is a planning artifact only.
