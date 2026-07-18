# Feature Template

**Status:** Permanent Phase 1 standard  
**Purpose:** Define the official structure for future feature folders.

Every new feature must start from this template unless a documented architecture decision approves a smaller or different structure.

---

## Standard Structure

```text
src/features/<feature-name>/
  components/
  hooks/
  services/
  types/
  schemas/
  validation/
  constants/
  utils/
  index.ts
```

Not every folder must exist on day one. Create a folder only when it contains real code. The structure defines allowed homes, not required empty directories.

---

## Naming

Feature folder names use kebab-case or existing project naming when already established.

Examples:

```text
src/features/catalog/
src/features/cart/
src/features/checkout/
src/features/orders/
src/features/admin-products/
```

Component files use `PascalCase.tsx`.

Hook files use `useThing.ts`.

Utility files use `camelCase.ts`.

---

## `components/`

**Purpose:** Feature-specific UI components.

Use for:

- page sections
- feature-specific cards
- feature-specific form fields
- feature-specific dialogs

Rules:

- May import `shared/ui`.
- May import feature hooks/constants/utils.
- Must not import mocks.
- Must not call `fetch`.
- Must not contain backend DTO mapping.

Promote to `shared/ui` only when the component becomes domain-neutral and has at least two real uses.

---

## `hooks/`

**Purpose:** Feature-specific React hooks.

Use for:

- local interaction state
- feature form behavior
- derived UI state
- browser-only feature behavior

Rules:

- Hook names must start with `use`.
- Hooks must not hide architectural boundaries.
- Hooks may call services only when the hook is intentionally a client-side data hook.
- Prefer server-side service calls for SEO-sensitive content.

Do not create hooks just to move three lines out of a component.

---

## `services/`

**Purpose:** Feature-local orchestration that is not global enough for `src/services`.

Use sparingly.

Allowed examples:

- admin-only table query adapters
- feature-specific client orchestration
- mapping between feature form state and a global service call

Rules:

- Global backend resource access usually belongs in `src/services`.
- Feature services may wrap global services but must not duplicate endpoint logic.
- No JSX.

If more than one feature needs it, move it to `src/services`.

---

## `types/`

**Purpose:** Feature-local TypeScript types.

Use for:

- component prop models reused inside the feature
- feature-specific view models
- feature-specific state types

Rules:

- Keep shared domain types in `src/types` only when used across feature boundaries.
- Backend DTO names must include `Dto` if they exist.
- View types should not mirror backend responses blindly.

---

## `schemas/`

**Purpose:** Runtime schema definitions when a validation library exists.

Current roadmap rule:

- Do not install a schema library only to satisfy this folder.
- If a schema library is approved later, schemas live here.
- Keep schema names close to their form or API purpose.

Examples:

```text
checkoutAddressSchema.ts
adminProductSchema.ts
```

---

## `validation/`

**Purpose:** Validation rules that do not require a schema library.

Use for:

- pure validation functions
- field-level constraints
- business validation messages

Rules:

- Validation functions must be pure.
- User-facing messages must be consistent and localizable later.
- Do not duplicate backend validation; mirror only what improves UX.

---

## `constants/`

**Purpose:** Feature-specific constants.

Use for:

- tabs
- local status labels
- form limits
- table column IDs
- sort keys

Rules:

- Do not place shared site config here.
- If a constant appears in multiple features, move it to a documented shared owner.
- Avoid magic strings in views.

---

## `utils/`

**Purpose:** Feature-specific pure helpers.

Use for:

- mapping feature state to view state
- sorting/filtering helpers
- small formatting helpers only meaningful to the feature

Rules:

- Utilities must be pure unless the file name clearly states side effects.
- General utilities belong in `src/lib`.
- Do not use `utils` as a place for hidden business services.

---

## `index.ts`

**Purpose:** Public feature boundary.

Use it to export only what other layers are allowed to consume.

Rules:

- Export feature views intended for routes.
- Export public types only when necessary.
- Do not export every internal component by default.
- Avoid circular imports through `index.ts`.

Example:

```ts
export { ProductListView } from "./ProductListView";
export type { ProductListViewProps } from "./types/productList";
```

---

## Minimal Feature Example

For a small feature:

```text
src/features/search/
  SearchPageView.tsx
  components/
    SearchSuggestions.tsx
  hooks/
    useSearchInput.ts
  index.ts
```

This is valid. Empty template folders are not required.

---

## Feature Creation Checklist

Before creating a new feature:

- Confirm it belongs in the roadmap phase.
- Confirm it is not Blog, Admin, Auth, or backend work unless the phase explicitly allows it.
- Read `frontend-architecture.md`.
- Read `folder-structure.md`.
- Define the public route in `routes.ts` if needed.
- Define service ownership.
- Decide what must be server-rendered for SEO.
- Keep the first implementation narrow.

After creating a feature:

- Run lint and typecheck.
- Update documentation if a new rule or exception was introduced.
- Add tests when the project test strategy exists.
