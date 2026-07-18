# Grafify Strategy

**Project:** hyper-ahan  
**Phase:** 0  
**Purpose:** How Grafify (or similar architecture-graph tools) should index and visualize this repo for maximum clarity and minimum noise.

---

## 1. Goals for Grafify on This Project

1. Show **feature boundaries** (`catalog`, `cart`, `auth`, `orders`, `home`, `layout`).  
2. Show **dependency direction**: `app` → `features` → `shared`/`services` → `mocks`/`lib`.  
3. Highlight **violations** (feature → mocks, app → mocks, shared → features).  
4. Keep graphs small enough for a solo developer to use in planning.

---

## 2. Folder Indexing Strategy

### Index (primary)

```text
src/app/**
src/features/**
src/shared/**
src/services/**
src/lib/**
src/config/**
src/providers/**
src/types/**
docs/**/*.md
```

### Index lightly / metadata only

```text
package.json
tsconfig.json
next.config.ts
eslint.config.mjs
```

### Exclude from graphs

```text
node_modules/**
.next/**
public/**
src/mocks/**          # show only as leaf nodes from services
*.test.*              # none today
package-lock.json
```

### Quarantine candidates (exclude until deleted)

Legacy unused UI (still on disk):

- `src/features/layout/Mobile*.tsx`
- `NavMenu`, `PriceDropdown`, `WeightCalcDropdown`, `Footer`, `ConsultationModal`
- Unused home blocks not referenced by `HomePageView`

Mark as **orphans** in Grafify if the tool supports unused-export detection.

---

## 3. Architecture Visualization

Recommended views:

### A. Layer cake (default)

```text
app (routes)
  → features/*
    → shared/ui
    → services
      → mocks | api-client
    → lib | config | types
providers (cross-cutting under app/layout)
```

### B. Runtime shell

```text
layout → AppProviders → SiteShell → TopBar/BottomNav + page children
```

### C. Purchase flow

```text
Home/Categories → Products → ProductDetail → Cart → Checkout → Orders
```

Use C for product planning; A for engineering reviews.

---

## 4. Dependency Graph Strategy

**Edges to draw**

- Static imports between TS/TSX modules  
- Route files → feature views  
- Features → services  
- Services → mocks (temporary)  

**Edges to flag as errors**

- `features/**` → `mocks/**`  
- `app/**` → `mocks/**`  
- `shared/**` → `features/**`  
- `services/**` → `features/**` or `shared/ui/**`

**Edges to ignore**

- CSS imports  
- `next/font`  
- Side-effect Swiper CSS (annotate as UI asset)

---

## 5. Feature Graph Strategy

Treat each of these as a **feature node** with internal files collapsed by default:

| Feature | Entry points |
|---------|----------------|
| layout | `SiteShell`, `TopBar`, `BottomNav` |
| home | `HomePageView` |
| catalog | `ProductListView`, `ProductDetailView` |
| cart | `CartPageView`, `CheckoutPageView` |
| auth | `LoginPageView`, `RegisterPageView`, `ProfilePageView` |
| orders | `OrdersListView`, `OrderDetailView` |
| content | About/Contact/Articles |

Expand a feature only when working inside it.

---

## 6. Documentation Graph

Link docs as first-class nodes:

```text
ARCHITECTURE.md → CONVENTIONS.md
ARCHITECTURE.md → mvp-ahanalat.md
ARCHITECTURE.md → frontend-integration.md
frontend-integration.md → services/* (future HTTP)
audit/phase0-summary.md → all audit/*
```

This helps Grafify answer “where is the source of truth?” without scanning code.

---

## 7. Suggested Grafify Config Knobs

If the tool supports config:

| Setting | Value |
|---------|-------|
| Root | `src/` |
| Alias map | `@` → `src` |
| Max node depth default | 2 |
| Orphan detection | On |
| External packages | Collapse (`next`, `react`, `@fortawesome/*`, `swiper`) |
| Docs glob | `docs/**/*.md` |

---

## 8. Success Criteria for Grafify Usage

- A new session can answer “what depends on `productService`?” in one graph.  
- Orphan legacy layout files are visible as disconnected or unused.  
- Layer violations are obvious before code review.  
- Graphs stay readable on a laptop screen without exporting 500+ nodes.
