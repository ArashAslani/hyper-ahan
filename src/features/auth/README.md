# `src/features/auth/`

**Module (per `docs/architecture/module-map.md`):** Authentication Module
**Purpose:** Login, registration, and profile views. Backs `src/app/(auth)/login`, `src/app/(auth)/register`, and `src/app/profile`.

## Current files

```text
LoginPageView.tsx
RegisterPageView.tsx
ProfilePageView.tsx
```

## Roadmap note

`docs/roadmap/project-roadmap.md` gates real authentication to **Phase 6 — Authentication & Customer Continuity**, and the constitution states AI agents must not implement Authentication ahead of that phase. These views pre-date the current roadmap/constitution and are mock-backed MVP scaffolding (no real OTP/token/session handling), consistent with the known risk already recorded in `docs/audit/phase0-summary.md`. Do not expand this feature (real OTP, tokens, protected routes) until Phase 6 is active.

## Allowed imports

- `@/shared/ui/*`, `@/services/*` (`profileService`), `@/lib/*`, `@/config/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
- other features' private internals
