# Dependency Audit

**Project:** hyper-ahan  
**Phase:** 0  
**Lockfile:** npm (`package-lock.json`)  
**Runtime Node observed:** v22.18.0 / npm 11.6.1

---

## Runtime Dependencies

### `next` — 16.2.10

| Question | Answer |
|----------|--------|
| Why installed? | App framework (App Router, RSC, tooling) |
| Still needed? | Yes — core |
| Better alternative? | No for this product direction |
| Can be removed? | No |
| Outdated? | Pin is recent (16.x); keep aligned with `eslint-config-next` |
| Architecture conflict? | None |

### `react` / `react-dom` — 19.2.4

| Question | Answer |
|----------|--------|
| Why installed? | UI runtime required by Next |
| Still needed? | Yes |
| Better alternative? | No |
| Can be removed? | No |
| Outdated? | Current major; keep versions in sync with Next peer expectations |
| Architecture conflict? | None |

### `@fortawesome/fontawesome-svg-core` / `free-solid-svg-icons` / `react-fontawesome`

| Question | Answer |
|----------|--------|
| Why installed? | Icons in TopBar, BottomNav, search, sheets |
| Still needed? | Yes for current UI, unless replaced with inline SVG set |
| Better alternative? | Curated SVG sprite / `lucide-react` (smaller mental model) — optional later |
| Can be removed? | Not without icon rewrite |
| Outdated? | v7 line is current enough |
| Architecture conflict? | Slight bundle weight; acceptable if imports stay per-icon |

### `swiper` — ^12.1.3

| Question | Answer |
|----------|--------|
| Why installed? | Home hero carousel |
| Still needed? | Yes while hero slider remains |
| Better alternative? | CSS scroll-snap for one simple banner (fewer deps) |
| Can be removed? | Only after hero redesign without carousel |
| Outdated? | v12 is modern |
| Architecture conflict? | Forces client component on home; keep isolated |

---

## Dev Dependencies

### `typescript` — ^5

Required. Keep. Align with Next recommended range.

### `eslint` + `eslint-config-next` — 16.2.10

Required for lint. Config uses flat config (`eslint.config.mjs`) with core-web-vitals + typescript presets. Good baseline.

### `tailwindcss` + `@tailwindcss/postcss` — ^4

Required for styling. v4 via PostCSS plugin is correct for current setup.

### `@types/node` / `@types/react` / `@types/react-dom`

Required for TS. `@types/node` major ^20 while Node runtime is 22 — usually fine; can bump types to 22 later for accuracy.

---

## Missing (Not Installed) — Recommended for Later Phases

| Package / tool | Purpose | Install now? |
|----------------|---------|--------------|
| Prettier (+ eslint-config-prettier) | Formatting consistency | Propose in Phase 0 docs; install in quality phase with consent |
| husky + lint-staged | Pre-commit gates | After Prettier/ESLint scripts stabilized |
| `@next/bundle-analyzer` | Bundle insight | Optional when optimizing |
| Testing (`vitest` / Playwright) | Regression safety | After API wiring starts |

**Phase 0 rule:** do not install these without explicit approval.

---

## Dependency Health Summary

| Metric | Assessment |
|--------|------------|
| Count of runtime deps | Low (healthy) |
| Duplicate UI frameworks | None |
| Heavy analytics / state libs | None (Context only) |
| Security surface | Small; run `npm audit` periodically |
| Conflict with layered architecture | None |

---

## Recommendations (Dependencies Only)

1. **Keep** Next/React/Tailwind/TS/ESLint as-is.  
2. **Defer** Swiper removal until UX decides single hero image is enough.  
3. **Defer** FontAwesome replacement until a deliberate icon system pass.  
4. **Add** Prettier/Husky in a dedicated tooling PR (not feature work).  
5. **Pin engines** in `package.json` + `.nvmrc` for Node 22 (config-only, safe).  
6. Run `npm outdated` / `npm audit` before each release milestone.
