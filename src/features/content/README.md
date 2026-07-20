# `src/features/content/`

**Module (per `docs/architecture/module-map.md`):** Blog/Content Module (articles) + Public Module (about/contact)
**Purpose:** Article listing/detail and static support pages. Backs `src/app/(content)/articles`, `src/app/(content)/articles/[id]`, `src/app/(content)/about`, and `src/app/(content)/contact`.

## Current files

```text
ArticleListView.tsx
ArticleDetailView.tsx
AboutPageView.tsx
ContactPageView.tsx
```

## Roadmap note

`docs/roadmap/project-roadmap.md` gates the Blog/Content module (editorial workflow, structured `Article` JSON-LD, topic clusters, internal linking per `docs/seo/content-strategy.md`) to **Phase 9 — Content & Blog SEO**. `ArticleListView`/`ArticleDetailView` pre-date the current roadmap and are mock-backed placeholder routes, already flagged as low-priority in `docs/audit/frontend-audit.md` ("Articles / weight-calc routes remain but are low-priority / placeholder"). Do not expand editorial features here until Phase 9 is active. `About`/`Contact` are ordinary Public-module support pages and are not roadmap-gated.

## Allowed imports

- `@/shared/ui/*`, `@/services/*` (`articleService`), `@/lib/*`, `@/config/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
- other features' private internals
