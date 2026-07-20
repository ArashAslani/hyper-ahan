# `src/features/`

**Layer:** Business-facing UI and feature logic
**Governing docs:** `docs/architecture/folder-structure.md`, `docs/architecture/feature-template.md`, `docs/architecture/module-map.md`

## Purpose

Owns business-facing UI and orchestration for one capability per folder. A feature owns business-facing UI for one capability; shared behavior is extracted only when reuse is real and the boundary is clear.

## Allowed imports

- own feature files
- `@/shared/ui/*`
- `@/services/*`
- `@/lib/*`
- `@/config/*`
- `@/types`

## Forbidden imports

- `@/mocks/*`
- another feature's private files unless explicitly exported through its `index.ts`
- Next.js route internals from `src/app`

## Current feature folders

| Folder | Module (per `module-map.md`) | See |
|--------|-------------------------------|-----|
| `layout/` | Shared shell (cross-cutting, not a business module) | `layout/README.md` |
| `home/` | Public Module | `home/README.md` |
| `catalog/` | Catalog Module | `catalog/README.md` |
| `cart/` | Cart + Checkout Modules | `cart/README.md` |
| `orders/` | Checkout Module (orders sub-scope) | `orders/README.md` |
| `auth/` | Authentication Module | `auth/README.md` |
| `content/` | Blog/Content Module + Public support pages | `content/README.md` |

Every feature must follow `docs/architecture/feature-template.md` unless a documented decision approves a smaller structure. New features must first confirm the active roadmap phase in `docs/roadmap/project-roadmap.md`.
