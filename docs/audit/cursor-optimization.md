# Cursor Optimization Audit

**Project:** hyper-ahan  
**Phase:** 0  
**Goal:** Reduce token burn, confusion, and repetitive prompting for a solo developer + AI agents.

---

## 1. What Increases Token Usage

| Factor | Why it costs tokens |
|--------|---------------------|
| `node_modules/` / `.next/` if indexed | Huge irrelevant trees |
| `package-lock.json` in context | Noisy diffs |
| Dead legacy layout/home files | Agents “fix” unused code paths |
| Duplicate docs (`Readme.md` vs `README.md`, Persian+English overlap) | Repeated explanations |
| Large prompt dumps (full MVP + integration every time) | Context saturation |
| Entire feature folders when only one file needed | Over-fetching |
| Build artifacts / terminal logs | Low-signal noise |

---

## 2. What Makes Context Confusing

1. **Two navigation eras** coexist (BottomNav active; MobileMenu/NavMenu/PriceDropdown unused).  
2. **Articles + weight-calc routes** look first-class but are MVP-low priority.  
3. **Mock vs API** — agents may wire fetch into pages ignoring `services/*`.  
4. **Mixed language documentation** (Persian conventions, English audits, English integration).  
5. **AGENTS.md / CLAUDE.md** warn about Next version — useful, but agents may over-read Next docs.  
6. Sibling folders outside repo (`HyperAhan/` Vite legacy on disk) if workspace root is `Front/`.

---

## 3. What Cursor Should Ignore

Recommend `.cursorignore` (and ensure `.gitignore` already covers build):

```text
node_modules/
.next/
out/
build/
coverage/
package-lock.json
*.tsbuildinfo
next-env.d.ts
public/icons/
```

Optional ignore for agent focus (keep available via explicit @):

```text
src/features/layout/Mobile*.tsx
src/features/layout/NavMenu.tsx
src/features/layout/PriceDropdown.tsx
src/features/layout/WeightCalcDropdown.tsx
src/features/layout/Footer.tsx
src/features/layout/ConsultationModal.tsx
```

Prefer **quarantine later** (`_legacy/`) over permanent ignore of source — ignore is a temporary token tactic.

---

## 4. What Should Become Documentation

| Topic | Canonical doc | Prompt to eliminate |
|-------|---------------|---------------------|
| Architecture & scenarios | `docs/ARCHITECTURE.md` | “Explain the project” |
| Coding rules | `docs/CONVENTIONS.md` | “How should I structure code?” |
| API contract | `docs/frontend-integration.md` | Pasting Swagger every time |
| MVP scope | `docs/mvp-ahanalat.md` | Re-arguing out-of-scope features |
| Phase 0 findings | `docs/audit/*` | Re-auditing environment |
| Design tokens | `globals.css` + ARCHITECTURE | Re-specifying colors |

**Rule for chats:** `@docs/ARCHITECTURE.md` + `@docs/CONVENTIONS.md` instead of pasting long prompts.

---

## 5. Repetitive Prompts to Eliminate

| Old repetitive ask | Replace with |
|--------------------|--------------|
| “Use DRY / don’t hardcode routes” | Point to CONVENTIONS + routes.ts |
| “Mobile-first steel palette…” | Already in globals + design system |
| “Don’t touch admin/blog” | MVP + Phase roadmap docs |
| “Wire API like this…” | frontend-integration.md |
| “What’s the folder structure?” | ARCHITECTURE.md |

Create a short **Phase kickoff template** (future):

```text
Work only in hyper-ahan/.
Follow docs/CONVENTIONS.md.
Read docs/ARCHITECTURE.md.
Do not implement Admin/Blog unless the phase says so.
Change services for data; not UI for API shapes.
```

---

## 6. Cursor Rules Hygiene

Existing: `.cursor/rules/conventions.mdc` (alwaysApply).

Suggestions:

- Keep rules **short** (already good).  
- Add a second rule file later: `no-mocks-in-ui.mdc` with globs on `src/features/**` and `src/app/**`.  
- Avoid dumping entire audit into alwaysApply rules (load via @docs when needed).

---

## 7. Workspace Advice

Prefer opening **`hyper-ahan/`** as the Cursor workspace root, not `Front/`, to avoid Vite legacy projects (`HyperAhan/`, `hyper-ahan-vite-legacy/`) polluting search and agents.

---

## 8. Expected Token Savings

| Change | Estimated savings |
|--------|-------------------|
| `.cursorignore` for `.next` + `node_modules` | High |
| Quarantine/delete dead layout after approval | Medium–High |
| Workspace = `hyper-ahan` only | High |
| Kickoff template + docs @-refs | Medium |
| Shorter alwaysApply rules | Low–Medium |
