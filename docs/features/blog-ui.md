# Blog UI

**Type:** UI only, mock-data-backed. No backend integration, no `fetch`, no authentication, no admin.

## Implemented Pages

| Route | File | Notes |
|---|---|---|
| `/blog` | `src/app/(content)/blog/page.tsx` | Listing page. Reads `?page=` and `?q=` search params. Shows featured post (page 1, no search only), latest-articles grid, category sidebar, search, pagination. `loading.tsx` and `error.tsx` included. |
| `/blog/[slug]` | `src/app/(content)/blog/[slug]/page.tsx` | Post detail. 404s via `not-found.tsx` when slug doesn't match. Shows breadcrumb, header (author/date/reading time), share buttons, table of contents, sectioned content, tags, author box, related posts. `loading.tsx` included. |
| `/blog/category/[slug]` | `src/app/(content)/blog/category/[slug]/page.tsx` | Category listing. 404s via `not-found.tsx` when category slug doesn't match. Same list/sidebar/pagination pattern as `/blog`, scoped to one category. `loading.tsx` included. |

All three pages export `generateMetadata` (title/description, plus OpenGraph on the post page).

## Implemented Reusable Components

All in `src/features/content/blog/`:

| Component | Purpose |
|---|---|
| `BlogPostCard` | Post card used in listing grids, category grids, and related-posts grids. |
| `FeaturedPostCard` | Larger hero-style card for the featured post section. |
| `BlogCategorySidebar` | Category list with active-state highlighting; links to `/blog` and `/blog/category/[slug]`. |
| `BlogSearchBar` | Client component wrapping the shared `SearchBar`; navigates to `/blog?q=...` on submit. |
| `BlogPagination` | Link-based (no client JS) pagination control; takes a `buildHref(page)` function so it works on both `/blog` and `/blog/category/[slug]`. |
| `BlogBreadcrumb` | Breadcrumb trail (Home / Blog / Category / Post), built from `routes.ts`. |
| `BlogAuthorBox` | Author avatar, role, and bio, shown at the end of a post. |
| `BlogShareButtons` | Client component: Telegram/WhatsApp share links + copy-link button. |
| `BlogTableOfContents` | Client component: scroll-spy'd list of section headings, sticky on desktop, inline on mobile. |
| `BlogSkeletons` (`BlogPostCardSkeleton`, `FeaturedPostCardSkeleton`, `BlogListSkeleton`, `BlogPostDetailSkeleton`) | Skeleton loading states, used by each route's `loading.tsx`. |
| `BlogListView`, `BlogCategoryView`, `BlogPostView` | Page-level composed views (the only ones a page imports directly; exported from `src/features/content/blog/index.ts` and re-exported from `src/features/content/index.ts`). |

Empty/error states reuse the existing shared `EmptyState`/`ErrorState` (`src/shared/ui/EmptyState.tsx`) rather than duplicating them.

## Mock Data Location

- `src/mocks/blog.ts` — `blogCategoriesMock` (4 categories), `blogPostsMock` (8 posts with full sectioned content), `toBlogPostSummaries()` mapper.
- `src/types/index.ts` — `BlogAuthor`, `BlogCategory`, `BlogContentSection`, `BlogPostSummary`, `BlogPost`, `BlogListResult`.
- `src/services/blogService.ts` — the only consumer of `src/mocks/blog.ts` (mocks stay behind the service boundary, per the existing import-boundary guardrails in `eslint.config.mjs`). Exposes `list()`, `getFeatured()`, `getBySlug()`, `getRelated()`, `getCategories()`, `getCategoryBySlug()`, all returning `Promise`s.
- `src/lib/routes.ts` — added `routes.blog.list`, `routes.blog.detail(slug)`, `routes.blog.category(slug)`.

## API Replacement Points

Everything is isolated behind `blogService`; no component or page touches `src/mocks/blog.ts` directly. To connect a real backend later, only `src/services/blogService.ts` needs to change:

- `list({ page, pageSize, q, categorySlug })` → replace the in-memory filter/sort/paginate with a real paginated list endpoint call; keep the same `BlogListResult` return shape so no page/component changes.
- `getFeatured()` → replace with a "featured" query/flag from the backend.
- `getBySlug(slug)` → replace with a single-post-by-slug endpoint call.
- `getRelated(post, limit)` → replace with a related-posts endpoint (or keep client-side category matching if the backend doesn't provide one).
- `getCategories()` / `getCategoryBySlug(slug)` → replace with a categories endpoint.

No page or component imports `fetch` directly (enforced by the existing ESLint `no-restricted-globals` rule), so the migration is contained entirely to `blogService.ts`, consistent with how `productService`/`articleService` are structured.
