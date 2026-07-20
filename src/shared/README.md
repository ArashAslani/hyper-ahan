# `src/shared/`

**Layer:** Reusable, domain-neutral code
**Governing docs:** `docs/architecture/folder-structure.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/shared-components-map.md`

## Purpose

Reusable code without business ownership. Shared components must be reusable without understanding steel commerce.

Current primary child: `src/shared/ui/` — see `ui/README.md`.

## Allowed imports

- `@/lib/*` only when domain-neutral
- React
- framework-neutral types

## Forbidden imports

- `@/features/*`
- `@/services/*`
- `@/mocks/*`
- business-specific constants

Do not create catch-all `components`, `helpers`, or `common` folders here or at the project root (`docs/architecture/frontend-blueprint.md`).
