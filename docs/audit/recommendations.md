# Engineering Recommendations

**Project:** hyper-ahan  
**Phase:** 0  
**Priorities:** Critical → High → Medium → Low

Each item: Problem · Reason · Suggested solution · Impact · Cost

---

## Critical

### C1 — Dead legacy UI still in `features/layout` (and unused home blocks)

- **Problem:** Many modules are unused by `SiteShell` / `HomePageView` but remain in the tree.  
- **Reason:** Agents and humans edit the wrong navigation era; token waste; merge conflicts.  
- **Suggested solution:** After Phase 0, move to `src/_legacy/` or delete in a dedicated PR with checklist.  
- **Impact:** High maintainability + Cursor savings.  
- **Cost:** Small (0.5–1 day including smoke).

### C2 — No `.env.example` / env naming standard for Next

- **Problem:** API integration docs still reflect older Vite naming patterns.  
- **Reason:** Wrong env vars will break proxy/auth when Phase API starts.  
- **Suggested solution:** Add `.env.example` with `NEXT_PUBLIC_API_BASE_URL=` (empty = use rewrite). Document in ARCHITECTURE.  
- **Impact:** Prevents integration foot-guns.  
- **Cost:** Trivial (Phase 0 safe).

### C3 — Lint script too vague

- **Problem:** `"lint": "eslint"` without path.  
- **Reason:** Inconsistent local/CI behavior.  
- **Suggested solution:** `"lint": "eslint ."` (+ later `"typecheck": "tsc --noEmit"`).  
- **Impact:** Reliable quality gate.  
- **Cost:** Trivial.

---

## High

### H1 — SEO metadata incomplete

- **Problem:** Only root metadata.  
- **Reason:** Product/article pages won’t rank; share previews weak.  
- **Suggested solution:** `generateMetadata` on product/article routes; add `sitemap.ts` / `robots.ts` when content is real.  
- **Impact:** SEO readiness.  
- **Cost:** Medium (1–2 days).

### H2 — Images not using `next/image`

- **Problem:** Raw `<img>` + eslint disables.  
- **Reason:** Missed optimization, CLS, bandwidth on low-end Androids.  
- **Suggested solution:** Migrate ProductCard/Detail/Hero to `next/image` with sizes.  
- **Impact:** Performance on target devices.  
- **Cost:** Medium.

### H3 — Duplicated domain labels (order status, units)

- **Problem:** Maps copied across views.  
- **Reason:** Drift when API statuses localize.  
- **Suggested solution:** `src/lib/labels.ts` or `src/entities/order/labels.ts`.  
- **Impact:** Maintainability.  
- **Cost:** Small.

### H4 — Prettier + Husky absent

- **Problem:** No format/hook toolchain.  
- **Reason:** Noisy diffs; solo-dev discipline breaks under fatigue.  
- **Suggested solution:** Tooling PR: Prettier → eslint-config-prettier → lint-staged → husky.  
- **Impact:** DX + consistency.  
- **Cost:** Small–medium (half day).

### H5 — Open workspace at monorepo parent

- **Problem:** Vite legacy projects sit beside `hyper-ahan`.  
- **Reason:** Agents search wrong trees.  
- **Suggested solution:** Open `hyper-ahan/` as workspace; add `.cursorignore`.  
- **Impact:** Token reduction.  
- **Cost:** Trivial.

---

## Medium

### M1 — Global providers wrap all routes

- **Problem:** Cart/Toast client providers always on.  
- **Reason:** Extra client JS on static pages.  
- **Suggested solution:** Keep for MVP; later split shell providers or conditional cart badge via server cookies when API exists.  
- **Impact:** Mild performance.  
- **Cost:** Medium (defer).

### M2 — Swiper dependency for simple hero

- **Problem:** Heavy carousel for 3 banners.  
- **Reason:** Bundle/complexity.  
- **Suggested solution:** Evaluate CSS scroll-snap single/multi slide.  
- **Impact:** Perf + deps.  
- **Cost:** Small UX change.

### M3 — Architecture lint rules missing

- **Problem:** Conventions are docs-only.  
- **Reason:** Easy to violate under deadline.  
- **Suggested solution:** ESLint `no-restricted-imports` for mocks outside services.  
- **Impact:** Guardrails.  
- **Cost:** Small.

### M4 — No tests

- **Problem:** Zero automated tests.  
- **Reason:** Regressions in cart/checkout will be manual-only.  
- **Suggested solution:** Start with cart reducer/storage unit tests + one Playwright smoke.  
- **Impact:** Confidence before API.  
- **Cost:** Medium.

### M5 — Docs language dualism

- **Problem:** Persian + English sources of truth.  
- **Reason:** Agents load both; humans disagree on canonical.  
- **Suggested solution:** Pick English for engineering audits/ADR; keep product MVP Persian if needed; cross-link.  
- **Impact:** Clarity.  
- **Cost:** Small ongoing.

---

## Low

### L1 — `allowJs: true`

- **Problem:** JS still allowed.  
- **Reason:** Slightly weaker TS boundary.  
- **Suggested solution:** Set `allowJs: false` when no JS files remain.  
- **Impact:** Low.  
- **Cost:** Trivial.

### L2 — FontAwesome vs SVG set

- **Problem:** Extra icon packages.  
- **Reason:** Dependency surface.  
- **Suggested solution:** Revisit after UI stabilizes.  
- **Impact:** Low–medium bundle.  
- **Cost:** Medium rewrite.

### L3 — Articles routes still public

- **Problem:** Out-of-MVP surfaces remain.  
- **Reason:** Scope confusion.  
- **Suggested solution:** Leave until Blog phase; mark “legacy/low priority” in ARCHITECTURE (already noted).  
- **Impact:** Low.  
- **Cost:** None.

### L4 — npm `devdir` warning on host

- **Problem:** Noisy npm output.  
- **Reason:** User-level npm config.  
- **Suggested solution:** Clean user `.npmrc`.  
- **Impact:** DX only.  
- **Cost:** Trivial (outside repo).

---

## Suggested Sequence After Phase 0

1. Apply Phase 0 safe config files (env example, nvmrc, cursorignore, lint/typecheck scripts).  
2. Dead-code quarantine PR.  
3. Tooling PR (Prettier/Husky).  
4. API Phase: activate `api-client` + services (no UI redesign).  
5. SEO + `next/image` pass.  
6. Tests for cart/checkout critical path.
