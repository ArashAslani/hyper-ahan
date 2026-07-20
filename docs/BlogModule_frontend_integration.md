# انتگریت فرانت با BlogModule (SEO-first)

> مخاطب: تیم React برای بلاگ عمومی، sitemap، meta/OG/JSON-LD و پنل ادمین محتوا.  
> Base URL توسعه: `http://localhost:5062` · Swagger: `/swagger`  
> قرارداد کلی API: [`frontend-integration.md`](frontend-integration.md) (§۲ اتصال، §۳ `OperationResult`)  
> همهٔ فیلدها **camelCase** هستند.

**اولویت این ماژول = SEO.** خرید/سبد اینجا نیست. کاتالوگ و Auth سند جدا دارند.

Seed ندارد؛ خالی بودن داده در Dev مجاز است — صفحات و مسیرها را از روز اول بسازید.

---

## ۱. اصول SEO (قبل از هر endpoint)

| قانون | جزئیات |
|---|---|
| URL عمومی فقط با **slug** | `/blog/:slug` و `/blog/category/:categorySlug` — **هرگز Guid در URL عمومی** |
| پیش‌نویس برای گوگل نامرئی | `by-slug` فقط published؛ پیش‌نویس → **HTTP 404** |
| تغییر slug = redirect دائمی | slug قدیمی در `canonicalSlug` → API **HTTP 301** + هدر `Location` |
| Meta از فیلدهای effective | `<title>` / description از `effectiveMetaTitle` / `effectiveMetaDescription` |
| تصویر absolute | `{API_ORIGIN}/{imageUrl}` مثلاً `http://localhost:5062/docs/blog/images/x.jpg` |
| sitemap از API | `GET /api/blog/posts/sitemap` → ساخت `sitemap.xml` فرانت |
| ادمین noindex | پاسخ‌های ادمین `X-Robots-Tag: noindex` می‌گیرند؛ صفحهٔ پنل را هم noindex کنید |
| جداسازی مسیر API | عمومی `api/blog/...` · ادمین `api/admin/blog/...` (مثل Catalog) |

### هندل 301 در کلاینت

`fetch` پیش‌فرض 301 را follow می‌کند و ممکن است URL مرورگر عوض نشود. برای route فرانت:

```ts
const res = await fetch(`/api/blog/posts/by-slug/${slug}`, { redirect: 'manual' });
if (res.status === 301 || res.status === 0) {
  // opaque redirect در برخی محیط‌ها؛ ترجیحاً body را وقتی status=301 است بخوانید
}
const body = await res.json();
if (body.statusCode === 301 && body.isSuccess) {
  router.replace(`/blog/${body.result.slug}`); // slug فعلی
  return;
}
```

هدر: `Location: /api/blog/posts/by-slug/{newSlug}` — می‌توانید از آن یا از `result.slug` استفاده کنید.

---

## ۲. مسیرهای پیشنهادی فرانت

| صفحه | Route فرانت | API |
|---|---|---|
| لیست / جستجو | `/blog` · `/blog?q=` | `GET /api/blog/posts/search` |
| جزئیات مقاله | `/blog/:slug` | `GET /api/blog/posts/by-slug/{slug}` |
| لندینگ دسته | `/blog/category/:categorySlug` | `GET .../by-category-slug/{slug}` + `GET .../categories/by-slug/{slug}` |
| آخرین / پربازدید / بهترین | ویجت هوم یا سایدبار | `latest` · `most-visited` · `best` |
| sitemap.xml | route سرور/استاتیک | `GET /api/blog/posts/sitemap` |
| ادمین مقالات | `/admin/blog/posts` | `api/admin/blog/posts` |
| ادمین دسته‌ها | `/admin/blog/categories` | `api/admin/blog/categories` |

منوی دسته‌ها: `GET /api/blog/categories` — **با `/api/catalog/categories` قاطی نکنید.**

---

## ۳. مدل داده (پاسخ عمومی)

```ts
type BlogPost = {
  id: string;
  title: string;
  description: string;       // خلاصه / fallback meta (حداکثر ~۱۶۰)
  body: string;              // محتوای صفحه (HTML یا Markdown — همان‌طور که ادمین ذخیره کرده)
  slug: string;              // URL فعلی
  userId: string;
  ownerName: string;         // نویسنده برای byline / JSON-LD
  imageName: string;
  imageUrl: string;          // نسبی: docs/blog/images/...
  categoryId: string;
  categoryTitle: string;
  categorySlug: string;
  visit: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalSlug?: string | null; // slug قبلی بعد از ChangeSlug (برای 301 سمت API)
  contentProvenance?: string | null; // مثلاً human | ai-assisted
  humanReviewed: boolean;
  readabilityScore?: number | null;
  originalityScore?: number | null;
  publishedDate: string;
  updatedDate?: string | null;
  isPublished: boolean;
  creationDate: string;
  // محاسبه‌شده در DTO (getter → JSON هم serialize می‌شود)
  effectiveMetaTitle: string;
  effectiveMetaDescription: string;
};

type BlogCategory = {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

type BlogSitemapItem = {
  slug: string;
  title: string;
  publishedDate: string;
  updatedDate?: string | null;
  imageUrl: string;
};
```

`effectiveMetaTitle` = `metaTitle` اگر پر باشد وگرنه `title`.  
`effectiveMetaDescription` = `metaDescription` یا `description`.

---

## ۴. عمومی — خواندن (بدون Auth)

همه زیر `ApiControllerBase.ToActionResult` → **HTTP status واقعی** + envelope `OperationResult`.

### ۴.۱ جزئیات مقاله (صفحهٔ اصلی SEO)

```http
GET /api/blog/posts/by-slug/{slug}
```

| وضعیت | معنی | کار فرانت |
|---|---|---|
| **200** | مقاله published | رندر `body` + meta از `effective*` |
| **301** | slug عوض شده | `router.replace(/blog/{result.slug})` و ترجیحاً meta همان پاسخ |
| **404** | نیست / پیش‌نویس | صفحه 404 فرانت؛ **noindex** |

با هر 200 موفق، بک‌اند visit را افزایش می‌دهد.

### ۴.۲ لیست و جستجو

```http
GET /api/blog/posts/search?title=&description=&categoryId=&fromDate=&toDate=&page=1&pageSize=10&sortBy=PublishDateDesc
```

- همیشه **فقط published** (`onlyPublished` سمت سرور force می‌شود).
- `sortBy`: `PublishDateDesc` | `PublishDateAsc` | `VisitDesc` | `VisitAsc` | `TitleAsc` | `TitleDesc`
- پاسخ: `PaginatedData<BlogPost>` داخل `result`
- هدر اختیاری `Link` با `rel="prev"` / `rel="next"`

### ۴.۳ لندینگ دسته (ترجیحی به‌جای Guid)

```http
GET /api/blog/posts/by-category-slug/{categorySlug}?page=1&pageSize=10
GET /api/blog/categories/by-slug/{slug}   # برای title/meta صفحهٔ دسته
```

جایگزین legacy: `GET /api/blog/posts/by-category/{categoryId}` — برای URL عمومی استفاده نکنید.

### ۴.۴ ویجت‌ها و sitemap

| Path | Cache تقریبی | کاربرد |
|---|---|---|
| `GET /api/blog/posts/latest?count=10` | ۶۰s | هوم / سایدبار |
| `GET /api/blog/posts/most-visited?count=10` | ۶۰s | پربازدید |
| `GET /api/blog/posts/best?count=10` | ۱۲۰s | امتیاز ترکیبی بک‌اند |
| `GET /api/blog/posts/sitemap` | ۳۰۰s | تولید sitemap.xml |
| `GET /api/blog/categories` | ۱۲۰s | منوی بلاگ |
| `GET /api/blog/categories/by-slug/{slug}` | ۱۲۰s | meta لندینگ دسته |

---

## ۵. چک‌لیست SEO صفحهٔ مقاله (`/blog/:slug`)

### Head
- [ ] `<title>{effectiveMetaTitle}</title>`
- [ ] `<meta name="description" content={effectiveMetaDescription} />`
- [ ] اگر `metaKeywords` → `<meta name="keywords" ...>` (اختیاری)
- [ ] Canonical فرانت: `https://yoursite.com/blog/{slug}` (slug **فعلی** بعد از 301)
- [ ] `og:title` / `og:description` / `og:image` (absolute image) / `og:type=article`
- [ ] `article:published_time` ← `publishedDate` · `article:modified_time` ← `updatedDate`
- [ ] `article:author` ← `ownerName`
- [ ] Twitter card مشابه OG

### Body
- [ ] یک `<h1>` = معمولاً `title` (نه لزوماً metaTitle)
- [ ] رندر امن `body` (sanitize اگر HTML)
- [ ] تصویر شاخص از `imageUrl` با `alt={title}`
- [ ] لینک دسته: `/blog/category/{categorySlug}`
- [ ] breadcrumb: خانه → بلاگ → دسته → مقاله

### JSON-LD (پیشنهادی)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "<effectiveMetaTitle یا title>",
  "description": "<effectiveMetaDescription>",
  "image": ["<absolute imageUrl>"],
  "datePublished": "<publishedDate>",
  "dateModified": "<updatedDate یا publishedDate>",
  "author": { "@type": "Person", "name": "<ownerName>" },
  "mainEntityOfPage": "https://yoursite.com/blog/<slug>"
}
```

### کیفیت محتوا (اختیاری در UI عمومی)
`humanReviewed` / `contentProvenance` / امتیازها بیشتر برای پنل ادمین و اعتماد داخلی‌اند؛ نمایش عمومی اختیاری است.

---

## ۶. ساخت sitemap.xml از API

```http
GET /api/blog/posts/sitemap
→ result: BlogSitemapItem[]
```

برای هر آیتم URL عمومی: `https://yoursite.com/blog/{slug}`  
`lastmod`: `updatedDate ?? publishedDate`  
تصویر اختیاری در image sitemap: absolute `imageUrl`.

صفحات دسته را هم می‌توانید از `GET /api/blog/categories` اضافه کنید: `/blog/category/{slug}`.

---

## ۷. ادمین بلاگ (Bearer Admin)

ورود: `POST /api/user/auth/admin/login` → `{ username: "admin", password: "Admin@12345" }`.  
جزئیات JWT: [`frontend-auth-integration.md`](frontend-auth-integration.md).

کلاس کنترلر: `[Authorize(Roles=Admin)]` + `ResponseCache(NoStore)` روی کل ادمین.

### ۷.۱ مقالات — `api/admin/blog/posts`

| Method | Path | توضیح |
|---|---|---|
| POST | `/` | ایجاد (FormData) — `body` و `ImageFile` الزامی |
| PUT | `/` | ویرایش (FormData) — عکس اختیاری |
| GET | `/{id}` | جزئیات شامل پیش‌نویس · `X-Robots-Tag: noindex` |
| GET | `/search?...` | جستجو **با پیش‌نویس** (قبلاً `api/blog/posts/admin/search`) |
| PATCH | `/{id}/seo` | فقط meta |
| PATCH | `/{id}/slug` | تغییر slug (+ `keepCanonical` پیش‌فرض true) |
| PATCH | `/{id}/publish` | انتشار |
| PATCH | `/{id}/unpublish` | برگشت به پیش‌نویس |
| DELETE | `/{id}` | حذف + پاک شدن فایل تصویر |

#### ایجاد (multipart/form-data)
| فیلد | الزامی | توضیح |
|---|---|---|
| `title` | بله | حداکثر ~۷۰ (بک‌اند validate) |
| `description` | بله | خلاصه / excerpt ~۱۶۰ |
| `body` | بله | متن کامل |
| `slug` | بله | یکتا؛ الگوی a-z0-9 و خط تیره |
| `userId` | بله | Guid نویسنده (فعلاً از ادمین/ثابت پنل) |
| `ownerName` | بله | نام نمایشی نویسنده |
| `categoryId` | بله | Guid دسته بلاگ |
| `ImageFile` | بله | jpg/png/gif/webp |
| `metaTitle` / `metaDescription` / `metaKeywords` | خیر | SEO |
| `contentProvenance` / `humanReviewed` / `readabilityScore` / `originalityScore` | خیر | کیفیت |

#### تغییر slug
```json
{ "id": "<guid>", "newSlug": "new-steel-guide", "keepCanonical": true }
```
با `keepCanonical: true` درخواست‌های slug قدیمی از API عمومی **301** می‌شوند.

#### به‌روزرسانی SEO
```json
{ "id": "<guid>", "metaTitle": "...", "metaDescription": "...", "metaKeywords": "..." }
```
شناسه در مسیر و body باید یکی باشد.

### فلوی پیشنهادی پنل ادمین
1. ایجاد پیش‌نویس (بدون publish)  
2. پر کردن SEO (`PATCH .../seo`)  
3. پیش‌نمایش فقط در پنل با `GET /api/admin/blog/posts/{id}` — **عمومی 404 است تا publish**  
4. `PATCH .../publish`  
5. اگر URL عوض شد: `PATCH .../slug` با `keepCanonical: true`

### ۷.۲ دسته‌ها — `api/admin/blog/categories`

| Method | Path |
|---|---|
| POST | `/api/admin/blog/categories` |
| PUT | `/api/admin/blog/categories` |
| DELETE | `/api/admin/blog/categories/{id}` |

```json
{ "title": "بازار آهن", "slug": "steel-market", "metaTitle": null, "metaDescription": null }
```
حذف دستهٔ دارای پست → Conflict؛ اول پست‌ها را جابه‌جا/حذف کنید.

خواندن دسته‌ها برای پنل می‌تواند همان `GET /api/blog/categories` عمومی باشد.

---

## ۸. تصاویر

| فیلد API | مثال | URL مرورگر |
|---|---|---|
| `imageUrl` | `docs/blog/images/abc.jpg` | `http://localhost:5062/docs/blog/images/abc.jpg` |

Vite proxy باید `/docs` را هم مثل `/api` به بک‌اند بفرستد (در سند اصلی آمده).

---

## ۹. نقشهٔ سریع endpointها

```
عمومی
├── GET  /api/blog/posts/by-slug/{slug}          ← SEO صفحه
├── GET  /api/blog/posts/search
├── GET  /api/blog/posts/latest|most-visited|best
├── GET  /api/blog/posts/by-category-slug/{slug}
├── GET  /api/blog/posts/by-category/{id}        ← ترجیح ندهید برای URL
├── GET  /api/blog/posts/sitemap
├── GET  /api/blog/categories
└── GET  /api/blog/categories/by-slug/{slug}

ادمین (Bearer Admin)
├── POST/PUT/DELETE  /api/admin/blog/posts
├── GET              /api/admin/blog/posts/{id}
├── GET              /api/admin/blog/posts/search
├── PATCH            /api/admin/blog/posts/{id}/seo|slug|publish|unpublish
└── POST/PUT/DELETE  /api/admin/blog/categories
```

---

## ۱۰. اشتباهات رایج

| اشتباه | درست |
|---|---|
| لینک مقاله با Guid | `/blog/{slug}` + `by-slug` |
| استفاده از `metaTitle` خالی بدون fallback | همیشه `effectiveMetaTitle` |
| نادیده گرفتن 301 | `redirect: 'manual'` یا چک `statusCode === 301` |
| نمایش پیش‌نویس در سایت عمومی | تا `publish` فقط پنل ادمین |
| نوشتن روی `/api/blog/posts` | نوشتن فقط `/api/admin/blog/posts` |
| `GET .../admin/search` قدیمی | `GET /api/admin/blog/posts/search` |
| منوی بازار از دسته‌های بلاگ | `/api/catalog/categories` |
| `imageUrl` نسبی در OG | absolute با origin API |
| ایندکس شدن صفحات ادمین | noindex + مسیر جدا از سایت عمومی |

---

## ۱۱. چک‌لیست پیاده‌سازی فرانت

### عمومی / SEO
- [ ] Routeهای slug-based بدون Guid
- [ ] هندل 200 / 301 / 404 برای `by-slug`
- [ ] Head + OG + JSON-LD از `effective*` و تاریخ‌ها
- [ ] لندینگ دسته با `categorySlug`
- [ ] sitemap از `/api/blog/posts/sitemap`
- [ ] تصویر absolute + proxy `/docs`

### ادمین
- [ ] JWT Admin جدا از مشتری
- [ ] CRUD روی `api/admin/blog/...`
- [ ] فلوی draft → SEO → publish
- [ ] Change slug با keepCanonical
- [ ] جستجوی پیش‌نویس فقط در پنل
