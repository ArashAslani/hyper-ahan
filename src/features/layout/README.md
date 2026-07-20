# `src/features/layout/`

**Purpose:** Cross-cutting site shell (top bar, bottom navigation, root composition). Not a business module — consumed by `src/app/layout.tsx` for every route.

## Active files (reachable from `src/app/layout.tsx`)

```text
SiteShell.tsx   root shell: renders TopBar + BottomNav around page content
TopBar.tsx       sticky header: logo, phone CTA, search, cart badge
BottomNav.tsx    fixed bottom navigation, reads src/config/nav.config.ts
```

## Legacy files — deprecation candidates (not removed)

The following files are **not imported by `SiteShell`, `TopBar`, `BottomNav`, or any route in `src/app`**. They were identified as dead code in `docs/audit/frontend-audit.md` ("Legacy nav trees: Unused `MobileMenu` / `PriceDropdown` vs active BottomNav") and `docs/audit/phase0-summary.md` (Critical issue #1). Sprint 3.1 verified and recorded the finding; Sprint 3.2 compared each file against `docs/business/customer-journey.md` and `docs/ui/navigation-strategy.md` per `docs/architecture/foundation-checklist.md`'s "Architecture Cleanup Checklist". Removal/quarantine execution still requires explicit user approval — see `docs/sprints/sprint-3.2-summary.md`.

```text
NavMenu.tsx              imports PriceDropdown.tsx and WeightCalcDropdown.tsx internally
PriceDropdown.tsx         only referenced by NavMenu.tsx
WeightCalcDropdown.tsx    only referenced by NavMenu.tsx
MobileHeader.tsx          unreferenced
MobileMenu.tsx            unreferenced
MobileFooter.tsx          unreferenced
Footer.tsx                unreferenced
ConsultationModal.tsx     unreferenced (also uses alert(), noted in frontend-audit.md)
```

### Comparison against Phase 2 journeys/navigation strategy (Sprint 3.2)

`docs/ui/navigation-strategy.md`'s own "Implementation Readiness Notes" says: *"Future implementation should evaluate the current `TopBar` + `BottomNav` against this strategy during Phase 3/4."* This sprint performed that evaluation:

| File | What it implements | Relation to documented strategy |
|---|---|---|
| `NavMenu.tsx` + `PriceDropdown.tsx` + `WeightCalcDropdown.tsx` | Desktop header row: category/price dropdown, articles link, weight-calculator dropdown, about dropdown, phone CTA | Conceptually matches `navigation-strategy.md`'s documented **Desktop Navigation** structure (Logo/Search/Categories/Daily Prices/Calculators/Blog/Support/Phone). The current shell has **no desktop-specific navigation at all** — `SiteShell` renders the same mobile-first `TopBar`/`BottomNav` at every width. This is a real gap, not a wrong idea; the component just predates the current shell and uses the old gray/blue palette instead of design tokens. |
| `MobileHeader.tsx` + `MobileMenu.tsx` | An older hamburger-menu mobile navigation pattern (slide-in category tree, search field, articles/calculator/about links) | **Directly superseded** by the active `TopBar` + `BottomNav` mobile shell — this is the exact "two navigation paradigms" complexity risk called out in `docs/audit/frontend-audit.md` §10. Keeping both is a maintenance liability, not a documented future need. |
| `MobileFooter.tsx` | A second, different 5-icon mobile bottom bar (home/app/phone-FAB/about/cart) | **Directly competes with** the active `BottomNav` for the same UI slot with a different item set (includes an "اپلیکیشن" app-download link not present in any IA/nav doc). Not a documented requirement. |
| `Footer.tsx` | Desktop-style multi-column footer: quick links, product links, trust badges, social links | Trust badges/social proof are legitimate per `docs/business/conversion-strategy.md`, but no page currently renders a footer at all (the mobile shell has none). This is a plausible **future** addition rather than a current duplicate, but it is dead today. |
| `ConsultationModal.tsx` | "Request consultation" form (name/phone/description) | Maps to the documented **Expert CTA / price-request** quick action in `navigation-strategy.md`, but is disconnected from any current CTA and submits via `alert()` (explicitly flagged as a legacy anti-pattern in `docs/audit/frontend-audit.md` §9). |

**Conclusion:** none of these are wrong business ideas — most map to real documented strategy (desktop nav, trust footer, consultation CTA). The problem is that they are an older, disconnected implementation that predates the current mobile-first `SiteShell` and duplicates/competes with it (especially `MobileHeader`/`MobileMenu`/`MobileFooter` vs. `TopBar`/`BottomNav`). This finding, and a recommended disposition per file, is written up in `docs/sprints/sprint-3.2-summary.md` for an explicit user decision.

## Allowed imports

- `@/shared/ui/*`, `@/lib/*`, `@/config/*`, `@/providers/*`, `@/types`

## Forbidden imports

- `@/mocks/*`
