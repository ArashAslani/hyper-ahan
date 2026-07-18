# Coding Standards

**Status:** Permanent Phase 1 standard  
**Purpose:** Define how code must be written when implementation phases begin.

These standards optimize for maintainability, readability, SEO, mobile performance, and solo-developer velocity over short-term cleverness.

---

## Naming

Use names that describe business intent.

Rules:

- Components: `PascalCase`
- Hooks: `useCamelCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE` only for true constants; otherwise `camelCase`
- Types/interfaces: `PascalCase`
- Files with components: `PascalCase.tsx`
- Files with utilities/services: `camelCase.ts`
- Route folders: lowercase, SEO-readable, and stable

Good:

```ts
getProductById
formatPrice
OrderStatusBadge
```

Avoid:

```ts
handleData
Comp
doStuff
newUtil
```

---

## Functions

Functions must be small, named, and predictable.

Rules:

- Prefer pure functions for transformation and formatting.
- Avoid hidden I/O inside helpers.
- Use early returns when they make logic clearer.
- Keep parameters explicit; avoid vague option bags unless there are several optional controls.
- Do not mix validation, network calls, and UI state in one function.

If a function needs a long comment to explain what it does, rename or split it.

---

## Components

Components must have one primary responsibility.

Rules:

- Prefer Server Components by default.
- Add `'use client'` only at the smallest interactive boundary.
- Keep feature-specific components inside their feature.
- Keep shared components domain-neutral.
- Do not call `fetch` directly inside components.
- Do not import mocks inside components.
- Do not hard-code route strings when `routes.ts` has a helper.

Component props should be typed close to the component unless reused across files.

---

## Hooks

Hooks are for React behavior, not for hiding architecture violations.

Rules:

- Hook names must start with `use`.
- Hooks must be deterministic from their inputs unless intentionally reading browser APIs.
- Hooks that use browser APIs must live in client components.
- Do not create hooks only to avoid passing props.
- Do not put backend DTO mapping in hooks.

Prefer simple props and composition over unnecessary custom hooks.

---

## Files

Files should stay focused.

Rules:

- One major component per file.
- Keep helper functions near their only caller.
- Move helpers only after reuse or complexity justifies it.
- Avoid generic filenames like `utils.ts` at high-level folders.
- Do not create empty folders to match a template.

File names should make search results useful for humans and AI agents.

---

## Imports

Rules:

- Use `@/*` for cross-folder imports under `src`.
- Use relative imports for same-folder files.
- Never import `@/mocks/*` outside services.
- Never import feature internals from another feature unless exported as public API.
- Avoid circular imports.
- Keep imports readable and grouped by source.

Suggested order:

1. React / Next.js
2. third-party libraries
3. project aliases
4. relative imports
5. type-only imports where helpful

---

## Exports

Rules:

- Prefer named exports.
- Use default exports only where Next.js requires them (`page.tsx`, `layout.tsx`, etc.).
- Use `index.ts` as a public boundary, not an automatic export barrel.
- Do not export internal helpers unless another module has a valid reason to depend on them.

Public exports are long-term contracts. Keep them small.

---

## Typing

TypeScript is mandatory.

Rules:

- Preserve `strict` mode.
- Avoid `any`.
- Use `unknown` for uncertain external data, then narrow or map it.
- Keep DTOs separate from domain/view types.
- Prefer discriminated unions for states with clear variants.
- Do not duplicate the same type under multiple features.

Backend response shape is not the same as UI shape. Map it deliberately.

---

## Comments

Comments explain why, not what.

Use comments for:

- non-obvious business rules
- architecture exceptions
- browser or Next.js quirks
- temporary constraints with a cleanup path

Avoid comments that repeat the code.

Bad:

```ts
// Set count to 1
setCount(1);
```

Good:

```ts
// Preserve the first cart item after hydration to avoid replacing local storage state.
```

---

## Async Code

Rules:

- Route/page data loading must go through services.
- Services own request details and response mapping.
- UI should receive resolved domain-ready data when possible.
- Client-side async state must represent loading, success, empty, and error states.
- Do not swallow errors silently.

Async flows must be easy to trace from route to service.

---

## Error Handling

Rules:

- Normalize backend/API errors in services.
- Show user-safe messages in UI.
- Do not expose raw backend errors to users.
- Avoid `alert()` in production UI.
- Use error boundaries for route-level failure where appropriate.
- Log only useful diagnostic context.

Every user-facing error should answer: what happened, what can the user do next, and whether they need support.

---

## Logging

Rules:

- No debug `console.log` in committed production code.
- Temporary logs must be removed before a task is done.
- Use structured logging only after a logging strategy is approved.
- Never log secrets, tokens, national IDs, phone verification codes, or full user addresses.

---

## Formatting

Until a formatter is installed:

- Follow the surrounding file style.
- Keep line length readable.
- Prefer double quotes if the file already uses them.
- Avoid style-only churn.

Future tooling should introduce Prettier and make formatting automatic.

---

## No Duplication

Duplication is allowed only when abstraction would be premature. Repeated business rules are not allowed.

Extract when:

- the same label map appears in multiple places
- the same validation rule is used by multiple forms
- multiple features need the same service mapping
- route strings or storage keys are repeated

Do not extract when:

- two components only look visually similar but serve different business purposes
- the abstraction needs many feature-specific escape hatches
- there is only one real use case

---

## Quality Gate

Before a code change is ready:

- `npm run lint` passes
- `npm run typecheck` passes
- documentation is updated when standards or behavior change
- no feature imports mocks directly
- no new package is installed without documented approval
- no future roadmap phase is implemented accidentally
