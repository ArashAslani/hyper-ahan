# HyperAhan Admin Panel — Project Snapshot

> Compact implementation context for AI-assisted admin development. Last updated: 2026-07-20.

---

## 1. Admin Routes

| Route | Page | Auth |
|-------|------|------|
| `/admin/login` | Admin login form | Public |
| `/admin` | Dashboard placeholder | Protected |

**Defined in `lib/routes.ts` only:**
- `routes.admin.login` → `/admin/login`
- `routes.admin.dashboard` → `/admin`

**Not implemented (no routes/pages):**
- `/admin/blog`, `/admin/blog/posts`, `/admin/blog/categories`
- `/admin/products`, `/admin/sliders`, `/admin/media`
- `/admin/orders`, `/admin/users`, `/admin/settings`, `/admin/reports`

---

## 2. Admin Layout

| Piece | File | Status |
|-------|------|--------|
| **Root layout** | `app/admin/layout.tsx` | Wraps all admin routes with `AdminAuthProvider`; sets `robots: noindex` |
| **Dashboard layout** | `app/admin/(dashboard)/layout.tsx` | `ProtectedRoute` + `AdminShell` |
| **Shell** | `features/admin/layout/AdminShell.tsx` | Sidebar + header + main content area |
| **Sidebar** | `features/admin/layout/AdminSidebar.tsx` | Desktop fixed + mobile drawer; nav links + logout |
| **Header** | `features/admin/layout/AdminHeader.tsx` | Mobile menu toggle, title, user dropdown + logout |
| **Breadcrumb** | — | **Missing** |
| **Providers** | `AdminAuthProvider` in root admin layout | Auth state only; no admin-specific toast/query providers |
| **Route guard** | `ProtectedRoute` | Client redirect to `/admin/login` when unauthenticated; spinner while loading |

**Storefront isolation:** `SiteShell` skips TopBar/BottomNav on `/admin/*`.

---

## 3. Authentication

| Concern | Implementation | Status |
|---------|----------------|--------|
| **Login** | `AdminLoginView` — RHF + Zod; username/password; password toggle; loading/error states | **Done** |
| **API** | `authService.adminLogin` → `POST /api/auth/admin/login` | **Done** |
| **Logout** | Clears localStorage + resets context; available in sidebar and header | **Done** |
| **Session restore** | On mount: read token from localStorage, check JWT expiry via `isJwtExpired` | **Done** |
| **JWT storage** | `localStorage` keys: `ha_admin_token`, `ha_admin_id` (separate from customer tokens) | **Done** |
| **Protected routes** | `ProtectedRoute` wraps dashboard layout; client-side redirect | **Partial** |
| **Post-login redirect** | Supports `?returnUrl=` if path starts with `/admin` | **Done** |
| **Token refresh** | — | **Missing** |
| **401 handling on API calls** | — | **Missing** |
| **Server-side auth guard** | — | **Missing** (client-only) |
| **Role/permission checks** | — | **Missing** |

**Auth flow:**
1. Unauthenticated user hits `/admin` → spinner → redirect `/admin/login`
2. Login success → store JWT + adminId → redirect `/admin` (or returnUrl)
3. Refresh → restore session if token valid and not expired
4. Expired token on restore → cleared, treated as logged out

---

## 4. Admin Navigation

Sidebar `navItems` in `AdminSidebar.tsx`:

| Menu item | Route | Status |
|-----------|-------|--------|
| داشبورد (Dashboard) | `/admin` | **Implemented** |
| Blog / Posts | — | **Missing** |
| Blog Categories | — | **Missing** |
| Products | — | **Missing** |
| Sliders | — | **Missing** |
| Media / Files | — | **Missing** |
| Orders | — | **Missing** |
| Users | — | **Missing** |
| Settings | — | **Missing** |
| Reports | — | **Missing** |

**Logout** — sidebar footer + header dropdown: **Implemented**

**Dashboard quick actions** (not in sidebar, display only):

| Action | Status |
|--------|--------|
| افزودن مقاله جدید | **Placeholder** (no link) |
| بررسی سفارش‌ها | **Placeholder** (no link) |
| مدیریت محصولات | **Placeholder** (no link) |

---

## 5. Dashboard

**File:** `features/admin/AdminDashboardView.tsx`

| Widget | Status |
|--------|--------|
| Welcome card | **Implemented** (static copy) |
| Quick actions (3 cards) | **Placeholder** — labels only, marked "به‌زودی", not clickable |
| Stats grid (4 cards) | **Placeholder** — icons + labels, value shows "—" |
| Recent activity | **Placeholder** — empty state message |

**Stats placeholders:** سفارش‌های امروز, کاربران فعال, محصولات فعال, رشد فروش

---

## 6. Existing CRUD Screens

| Module | Status | Notes |
|--------|--------|-------|
| **Auth (login)** | **Done** | Real backend; no admin user management |
| **Dashboard** | **Partial** | Shell only; no real data |
| **Blog Posts** | **Todo** | Public blog exists; no admin CRUD |
| **Blog Categories** | **Todo** | — |
| **Products** | **Todo** | Storefront catalog is mock |
| **Sliders** | **Todo** | Public slider API exists; no admin UI |
| **Media / Files** | **Todo** | `FileDto` contract exists; no admin media library |
| **Orders** | **Todo** | Storefront orders are mock |
| **Users** | **Todo** | — |
| **Settings** | **Todo** | — |
| **Reports** | **Todo** | — |

**Admin services beyond auth:** none (`authService` only has `adminLogin`).

---

## 7. Shared Admin Components

**No dedicated admin component library exists.**

Reused from storefront `shared/ui`:

| Component | Used in admin for |
|-----------|-------------------|
| `Card` | Dashboard widgets |
| `Button` | Login submit |

**Admin-specific layout components:**

| Component | Purpose |
|-----------|---------|
| `AdminShell` | Page chrome wrapper |
| `AdminSidebar` | Navigation + logout |
| `AdminHeader` | Top bar + user menu |
| `AdminLoginView` | Login page |
| `AdminDashboardView` | Dashboard content |
| `ProtectedRoute` | Auth gate |
| `AdminAuthProvider` | Auth context |

**Not built yet:**
- `AdminTable`, `AdminForm`, `AdminCard`, `PageHeader`, `Toolbar`
- `ConfirmDialog`, `AdminEmptyState`, `AdminPagination`
- `AdminBreadcrumb`, `AdminModal`, `FileUpload`, `RichTextEditor`
- `StatusBadge`, `AdminSearchBar`, `AdminFilters`

---

## 8. Current Technical Debt

- Only 2 admin routes exist; no CRUD module pages at all
- Route protection is client-only — no middleware or server-side auth check
- No admin API services except `authService.adminLogin`
- JWT not attached to future admin API calls (no bearer header helper wired in admin layer)
- No token refresh or automatic logout on 401 from admin endpoints
- Dashboard quick actions and stats are non-functional placeholders
- Sidebar has single nav item; no module navigation structure
- No admin breadcrumb or page title pattern for nested CRUD screens
- `adminId` shown in header menu; no username/display name from backend
- Reuses storefront `Card`/`Button` — no admin-specific form/table primitives yet

---

## 9. Next Logical Features

Based on current codebase + existing public backend integrations:

1. **Blog admin CRUD** — posts list/create/edit, publish/unpublish, SEO patch, slug change (backend documented at `api/admin/blog/*`)
2. **Blog categories admin** — CRUD for blog categories
3. **Slider admin** — manage slider groups/slides (public `sliderService` already consumes backend)
4. **Wire JWT bearer** into admin API calls via `api-client` + `useAdminAuth().accessToken`
5. **Expand sidebar navigation** — add links as each module ships
6. **Dashboard real stats** — orders/products/users counts once admin APIs exist
7. **Products admin** — catalog CRUD + `FileDto` image upload
8. **Media library** — `api/admin/files` upload/preview (File module documented)
9. **Server-side route protection** — Next.js middleware for `/admin/*` (except login)
10. **Shared admin primitives** — `AdminTable`, `AdminForm`, `PageHeader`, `ConfirmDialog` before scaling CRUD screens

---

## Quick Reference

```
src/app/admin/
  layout.tsx              AdminAuthProvider + noindex
  login/page.tsx          Public login
  (dashboard)/
    layout.tsx            ProtectedRoute + AdminShell
    page.tsx              Dashboard

src/features/admin/
  AdminLoginView.tsx
  AdminDashboardView.tsx
  auth/AdminAuthProvider.tsx
  auth/ProtectedRoute.tsx
  layout/AdminShell.tsx
  layout/AdminSidebar.tsx
  layout/AdminHeader.tsx

src/services/authService.ts   adminLogin only
```

**Backend dev URL:** `http://localhost:5062`  
**Admin login endpoint:** `POST /api/auth/admin/login`  
**Token storage:** `localStorage` — `ha_admin_token`, `ha_admin_id`
