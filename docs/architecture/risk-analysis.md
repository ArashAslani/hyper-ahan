# Architecture Risk Analysis

**Project:** HyperAhan  
**Phase:** 2.5 — Architecture Synthesis  
**Purpose:** Consolidate technical, business, SEO, performance, scalability, and maintenance risks.

---

## Risk Scale

- **Impact:** Low / Medium / High / Critical
- **Probability:** Low / Medium / High

---

## Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Direct mock imports leak into UI | High | Medium | Enforce services-only data access; add import guardrails in Phase 3 |
| Direct `fetch` appears in pages/components | High | Medium | Keep API calls in services; review against API guidelines |
| Backend DTOs leak into UI props | High | Medium | Service-owned mappers; DTO naming convention |
| Cart local state conflicts with future API cart | High | Medium | Define migration via `cartService`; preserve `sessionToken`/`cartId` rules |
| Auth token handling leaks into components | High | Medium | Auth/session helpers only in Phase 6 |
| Route strings spread across UI | Medium | Medium | Use `src/lib/routes.ts`; add review checklist |
| Dead legacy UI receives future edits | High | High | Phase 3 cleanup/quarantine before feature work |
| No test coverage for cart/checkout | High | High | Start targeted tests once tooling phase begins |

---

## Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Users expect full online checkout/payment | High | Medium | Explain expert-assisted purchase on product/cart/checkout |
| Too many CTAs reduce decision clarity | Medium | Medium | Follow CTA hierarchy and page blueprints |
| Phone/WhatsApp leads are not operationally tracked | High | Medium | Keep structured purchase request as primary; add lead tracking only when process exists |
| Blog traffic does not convert | Medium | High | Require article-to-product/category/calculator/contact links |
| Non-technical users abandon dense tables | High | Medium | Mobile cards, progressive details, expert CTA |
| Unreliable stock/availability damages trust | High | Medium | Use honest availability states; avoid fake stock |

---

## SEO Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Product/category pages lack metadata | High | High | Phase 4 metadata work; use rendering strategy |
| Thin placeholder content gets indexed | High | Medium | Noindex incomplete routes; content governance |
| Filter/search pages create index bloat | High | Medium | Canonical/noindex strategy before implementation |
| Blog becomes generic content dump | Medium | Medium | Follow content strategy and topic clusters |
| Client-only content weakens crawlability | High | Medium | Server-first rendering for SEO pages |
| JSON-LD does not match visible truth | High | Low | Validate structured data; never fake prices/ratings |

---

## Performance Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Excess client components increase JS | Medium | Medium | Small client islands; server-first defaults |
| Raw images cause CLS/bandwidth issues | High | High | Future `next/image` migration; dimensions/sizes |
| Carousel/swiper weight hurts homepage | Medium | Medium | Evaluate lighter alternatives in Phase 3/10 |
| Global providers wrap static pages | Medium | Medium | Keep minimal; revisit after API/auth decisions |
| Dense tables perform poorly on mobile | Medium | Medium | Mobile card/list strategy; paginate data |

---

## Scalability Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Feature folders grow without public boundaries | Medium | Medium | Use `index.ts` as deliberate public API when needed |
| Services duplicate endpoint logic | High | Medium | Centralize resource services; feature services wrap only when justified |
| Admin and storefront concerns mix | High | Medium | Separate admin module/layout/navigation |
| Content taxonomy grows without IA | Medium | Medium | Follow topic clusters and content governance |
| Analytics added without business questions | Low | Medium | Track conversion metrics only |

---

## Maintenance Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Documentation drift | High | Medium | Dependency matrix; update docs with architecture decisions |
| Phase scope creep | High | Medium | Roadmap gate and constitution |
| Missing formatter/hooks creates noisy diffs | Medium | High | Phase 3 tooling |
| Duplicated labels/status maps | Medium | High | Centralize labels before API/auth/order maturity |
| Mixed Persian/English docs confuse agents | Medium | Medium | English standards are canonical; historical Persian docs are context |
| Unapproved packages increase debt | Medium | Medium | Dependency approval rule |

---

## Highest Priority Mitigations for Phase 3

1. Quarantine/remove dead legacy UI after confirming against Phase 2 journeys.
2. Add formatting/tooling guardrails with approval.
3. Add architecture import guardrails for mocks/services boundaries.
4. Centralize domain labels for units/order statuses.
5. Prepare SEO metadata/image strategy for Phase 4.

---

## Risk Review Rule

Every phase summary must update this risk analysis if:

- a risk is resolved
- probability changes
- a new architecture risk appears
- a roadmap decision changes implementation order
