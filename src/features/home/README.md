# `src/features/home/`

**Module (per `docs/architecture/module-map.md`):** Public Module
**Purpose:** Homepage composition — hero, category grid, price table, article teasers, team/trust section. Supports the homepage strategy in `docs/business/homepage-strategy.md`.

## Current files

```text
HomePageView.tsx    public entry rendered by src/app/page.tsx
HeroSlider.tsx
CategoryGrid.tsx
PriceTable.tsx
ArticleCards.tsx
TeamSection.tsx
UserJourney.tsx
ExpandableText.tsx
```

## Allowed imports

- `@/shared/ui/*`, `@/services/*` (e.g. `homeService`), `@/lib/*`, `@/config/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
- other features' private internals
