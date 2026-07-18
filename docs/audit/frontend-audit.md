# Frontend Architecture Audit

**Project:** hyper-ahan  
**Phase:** 0 — Engineering Environment & Project Audit  
**Date:** 2026-07-18  
**Scope:** Read-only analysis of current Next.js frontend (no feature work)

---

## 1. Executive Snapshot

The codebase is a **Next.js 16 App Router + TypeScript** mobile-first storefront for a steel marketplace. Architecture intentionally separates `app` / `features` / `shared` / `services` / `mocks` / `lib`. UI currently consumes **mock data** behind services. Design tokens and a compact shell (TopBar + BottomNav) are in place.

Overall posture: **good foundation for a solo developer**, with clear conventions — but **dead legacy UI**, **weak SEO metadata**, and **missing code-quality tooling** will create debt if left unaddressed before Phase 1+.

---

## 2. Current Strengths

| Area | Observation |
|------|-------------|
| Layering | Clear separation: routes thin, features own UI, services own data contracts |
| Conventions | `docs/CONVENTIONS.md` + Cursor rules reduce ad-hoc decisions |
| Path aliases | `@/*` → `./src/*` consistent |
| TypeScript | `strict: true` enabled |
| Design system start | Shared UI primitives (`Button`, `ProductCard`, `BottomSheet`, etc.) |
| Design tokens | CSS variables in `globals.css` mapped into Tailwind v4 `@theme` |
| Mobile shell | Single `SiteShell` with TopBar + BottomNav; `max-w-xl` app-like layout |
| Route registry | Central `src/lib/routes.ts` — avoids scattered path strings |
| Storage API | Typed `ha_*` keys in `src/lib/storage.ts` ready for API phase |
| API readiness | `api-client` stub + `next.config` rewrite to `localhost:5062` |
| Dependency surface | Small runtime dependency set (Next, React, FontAwesome, Swiper) |
| Docs | MVP, integration, architecture docs already present |

---

## 3. Current Weaknesses

| Area | Observation |
|------|-------------|
| Dead code | Legacy layout/home modules unused by active shell (see §5) |
| SEO | Only root `metadata`; no `generateMetadata`, sitemap, or robots route |
| Images | `<img>` + placehold.co; `next/image` unused despite remotePatterns |
| Tooling gaps | No Prettier, Husky, lint-staged, `.env.example`, engines/nvmrc |
| Lint script | `"lint": "eslint"` without explicit paths/targets |
| Client boundary | Several large client islands; providers wrap entire tree |
| Status labels | Order status labels duplicated across profile/orders views |
| Articles / weight-calc | Routes remain but are low-priority / placeholder |
| Persian+English docs mix | Conventions Persian; Phase 0 audits English — dual language overhead |
| npm env warning | Host shows `Unknown env config "devdir"` (environment noise) |

---

## 4. Potential Future Problems

1. **Mock leakage into UI** if new pages import mocks directly (convention exists; needs enforcement via lint/review).
2. **Service contract drift** vs `frontend-integration.md` DTOs when API is wired.
3. **Cart dual-model** (local `ha_cartItems` vs future `cartId`/`sessionToken`) if not migrated carefully.
4. **Dead legacy files** confusing agents and humans → wrong edits.
5. **SEO debt** when content/catalog must rank (SSR metadata missing per product).
6. **FontAwesome bundle size** if icons grow without tree-shaking discipline.
7. **Global provider cost** (Cart + Toast on every page including static content).

---

## 5. Code Duplication Risks

| Risk | Location / pattern |
|------|---------------------|
| Order status label maps | `ProfilePageView`, `OrdersListView`, `OrderDetailView` |
| Unit label maps | `ProductCard`, `ProductDetailView` |
| Placeholder category filtering | Ad-hoc keyword map in `product-category/[slug]/page.tsx` |
| Contact / consultation forms | Separate form UIs with similar fields |
| Legacy nav trees | Unused `MobileMenu` / `PriceDropdown` vs active BottomNav |
| Price parsing helpers | Mostly centralized in `format.ts` (good) — keep it that way |

---

## 6. Scalability Risks

- Feature folders are healthy (`auth`, `cart`, `catalog`, `orders`, …) but **layout still contains ~11 files**, many unused.
- No feature-level public API (`index.ts` barrels) — imports are deep paths (acceptable for now; barrels can help later).
- No test suite — regressions will scale with contributors/features.
- Mock services return `Promise.resolve` — fine for MVP; need loading/error contracts before real network latency.

---

## 7. Performance Risks

| Risk | Detail |
|------|--------|
| Unoptimized images | Raw `<img>`, no sizing/priority/lazy strategy via `next/image` |
| Swiper on home | Client JS for hero; acceptable but keep autoplay/modules minimal |
| FontAwesome React | Icon components are fine if imports stay per-icon |
| Client providers everywhere | Forces client boundary under root for cart badge |
| Dead code in bundle? | Unused modules may still be typechecked; usually tree-shaken if unimported — verify periodically |
| Slow FS warning | Observed Next “Slow filesystem” on `D:` — local env issue |

---

## 8. SEO Risks

| Risk | Severity |
|------|----------|
| No per-route metadata for products/articles | High for growth |
| No `sitemap.ts` / `robots.ts` | Medium |
| `lang="fa"` + RTL good | Strength |
| Placeholder images / thin content | Medium for ranking |
| Client-heavy product list filters | Low (content still SSR-capable if data fetched on server) |

---

## 9. Maintainability Risks

- Solo-friendly architecture **if conventions are followed**.
- Dead legacy UI is the largest maintainability tax today.
- Mixed documentation language increases cognitive load for AI agents.
- `alert()` still used in `ConsultationModal` (legacy path).

---

## 10. Complexity Risks

Current complexity is **moderate-low** for an e-commerce MVP. Risks of unnecessary complexity:

- Keeping two navigation paradigms (legacy desktop dropdowns + new bottom nav)
- Premature admin/blog scaffolding before API cart/auth
- Over-abstracting services before real HTTP shapes are proven

---

## 11. Dependency Risks

See `dependency-audit.md`. Summary: surface is small and appropriate; main risks are FontAwesome/Swiper necessity reviews and absence of formatting/git-hook toolchain (not runtime deps).

---

## 12. Architecture Decision Record (Observed)

| Decision | Status |
|----------|--------|
| App Router + `src/` | Adopted |
| Feature-oriented folders | Adopted |
| Services over direct mock imports in UI | Adopted |
| Mobile-first shell (`max-w-xl`) | Adopted |
| Mock-first data | Temporary by design |
| No admin/blog in current scope | Correct for MVP |

---

## 13. Verdict

Architecture is **directionally correct** for long-term solo development. Phase 0 should document gaps and apply only zero-risk hygiene. Phase 1+ should prioritize: remove or quarantine dead code, SEO metadata, API client activation, and code-quality toolchain — **without** expanding product scope prematurely.
