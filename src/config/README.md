# `src/config/`

**Layer:** Static application configuration
**Governing docs:** `docs/architecture/folder-structure.md`

## Purpose

Static, declarative application configuration: site metadata constants and navigation configuration. Config must not perform I/O.

## Allowed imports

- `@/lib/routes`
- simple types

## Forbidden imports

- services
- features
- mutable runtime state

## Current files

```text
site.ts          site identity/metadata constants (name, description)
nav.config.ts     bottom navigation item definitions consumed by features/layout/BottomNav.tsx
```
