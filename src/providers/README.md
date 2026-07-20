# `src/providers/`

**Layer:** Global React context
**Governing docs:** `docs/architecture/folder-structure.md`, `docs/architecture/state-management.md`

## Purpose

App-level context wrappers for state that truly spans multiple routes. Providers are expensive because they create client boundaries — add one only when local composition cannot solve the problem.

## Allowed imports

- `@/lib/*`
- `@/services/*` when global data is required
- `@/types`

## Forbidden imports

- page-specific UI
- feature internals that make all routes depend on one feature

## Current providers

```text
AppProviders.tsx   composition root, wraps children with all app-level providers (used in src/app/layout.tsx)
CartProvider.tsx   anonymous cart state (local storage-backed); see docs/architecture/state-management.md "Shopping Cart State"
```
