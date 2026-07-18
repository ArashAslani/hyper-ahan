# Code Quality Audit

**Project:** hyper-ahan  
**Phase:** 0  
**Rule:** Propose missing tooling; implement only if zero-risk and already allowed.

---

## Inventory

| Capability | Exists? | Location / notes |
|------------|---------|------------------|
| ESLint configuration | Yes | `eslint.config.mjs` (Next core-web-vitals + typescript) |
| Prettier configuration | No | — |
| Husky | No | — |
| lint-staged | No | — |
| Strict TypeScript | Yes | `tsconfig.json` → `"strict": true` |
| Import sorting | No | No `simple-import-sort` / eslint-plugin-import sort rules |
| Unused import detection | Partial | TypeScript unused locals not enabled (`noUnusedLocals` absent); ESLint may catch some via Next/TS rules |
| Unit / e2e tests | No | — |
| CI workflow | No | Not present in repo snapshot |
| EditorConfig | No | — |

---

## ESLint — Assessment

**Strengths**

- Modern flat config  
- Matches Next 16 via `eslint-config-next`  
- Ignores `.next`, `out`, `build`

**Gaps**

- Script `"lint": "eslint"` should target project root explicitly (`eslint .`)  
- No Prettier integration → style wars possible  
- No custom rules enforcing architecture (e.g. ban imports from `@/mocks` outside `services`)  
- No unused-import plugin explicitly configured  

**Proposal (do not install in Phase 0 unless approved)**

1. Keep `eslint-config-next` as base.  
2. Add `eslint-config-prettier` after Prettier.  
3. Optional custom rule / ESLint `no-restricted-imports` patterns:
   - Forbid `@/mocks/**` outside `src/services/**`
   - Forbid `react-router` (already absent)

---

## Prettier — Proposal

Recommended files (future PR):

- `.prettierrc` — `{ "semi": true, "singleQuote": false, "trailingComma": "all", "printWidth": 80 }`
- `.prettierignore` — `.next`, `node_modules`, `package-lock.json`, `dist`
- Scripts: `"format": "prettier --write ."`, `"format:check": "prettier --check ."`

**Phase 0:** document only; do not install package.

---

## Husky + lint-staged — Proposal

Future pre-commit:

```json
"lint-staged": {
  "*.{ts,tsx,js,jsx,mjs}": ["eslint --fix", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

Install only after Prettier + stable lint script. Solo developer benefit: prevents accidental mock-import / format noise.

---

## TypeScript Strictness — Proposal

Already `strict: true`. Optional next tightenings (later):

| Option | Benefit | Risk |
|--------|---------|------|
| `noUnusedLocals` | Catch dead code | May fail on intentional WIP |
| `noUnusedParameters` | Cleaner APIs | Same |
| `allowJs: false` | Pure TS | Only if no JS remains |

---

## Import Sorting — Proposal

Prefer `eslint-plugin-simple-import-sort` or Biome later. Avoid multiple competing formatters.

---

## Unused Import Detection — Proposal

Enable via ESLint `@typescript-eslint/no-unused-vars` (often included via Next TS config) + periodic `knip` or `ts-prune` in maintenance windows — not Phase 0.

---

## Observed Code Smells (Quality, Not Features)

1. Dead modules under `features/layout` and unused home sections — confuse reviews.  
2. Duplicated order status label maps.  
3. Occasional `alert()` in legacy consultation modal.  
4. Widespread `eslint-disable` for `<img>` — signals `next/image` migration debt.  
5. No automated test gate on `master`.

---

## Safe Phase 0 Actions

| Action | Safe? |
|--------|-------|
| Document proposals (this file) | Yes |
| Change lint script to `eslint .` | Yes (config cleanup) |
| Add `typecheck` script using `tsc --noEmit` | Yes (uses existing typescript) |
| Install Prettier/Husky | **No** without approval |
| Enable `noUnusedLocals` now | Risky — may break build; defer |

---

## Recommendation Priority for Tooling PR (Post Phase 0)

1. Fix lint script + add `typecheck`  
2. Add Prettier + format once  
3. Add Husky + lint-staged  
4. Add architecture `no-restricted-imports`  
5. Consider CI on push to `master`
