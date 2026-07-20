import { AdminSection } from "../AdminSection";
import { AdminTextInput } from "./AdminTextInput";
import { AdminTextarea } from "./AdminTextarea";
import { AdminSelect } from "./AdminSelect";

type AdminSeoPanelProps = {
  /** Prefixes every field name (e.g. "seo" → "seo.metaTitle"). Pass "" for flat schemas. */
  namePrefix?: string;
  /** Slug field — hide for entities that do not use a public content slug (e.g. Slider). */
  showSlug?: boolean;
  showCanonicalUrl?: boolean;
  showRobots?: boolean;
  className?: string;
};

const META_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;

const ROBOTS_OPTIONS = [
  { value: "index,follow", label: "index, follow" },
  { value: "noindex,follow", label: "noindex, follow" },
  { value: "index,nofollow", label: "index, nofollow" },
  { value: "noindex,nofollow", label: "noindex, nofollow" },
];

/** Reusable SEO field set (meta title/description/keywords, slug, canonical, robots) — shared by Blog, Categories, Products. */
export function AdminSeoPanel({
  namePrefix = "seo",
  showSlug = true,
  showCanonicalUrl = false,
  showRobots = false,
  className = "",
}: AdminSeoPanelProps) {
  const field = (key: string) => (namePrefix ? `${namePrefix}.${key}` : key);

  return (
    <AdminSection
      title="بهینه‌سازی موتور جستجو (SEO)"
      description="عنوان و توضیحاتی که در نتایج گوگل نمایش داده می‌شود"
      className={className}
    >
      <div className="space-y-4">
        <AdminTextInput
          name={field("metaTitle")}
          label="عنوان متا (Meta Title)"
          placeholder="عنوان صفحه برای موتورهای جستجو"
          maxLength={META_TITLE_MAX}
          showCounter
        />
        <AdminTextarea
          name={field("metaDescription")}
          label="توضیحات متا (Meta Description)"
          placeholder="خلاصه‌ای کوتاه برای نمایش در نتایج جستجو"
          rows={3}
          maxLength={META_DESCRIPTION_MAX}
          showCounter
          autoResize={false}
        />
        <AdminTextInput
          name={field("metaKeywords")}
          label="کلمات کلیدی (اختیاری)"
          placeholder="کلمه۱, کلمه۲, کلمه۳"
          description="با کاما از هم جدا کنید"
        />
        {showSlug ? (
          <AdminTextInput
            name={field("slug")}
            label="آدرس (Slug)"
            placeholder="my-article-title"
            description="فقط حروف انگلیسی، عدد و خط تیره"
          />
        ) : null}
        {showCanonicalUrl ? (
          <AdminTextInput
            name={field("canonicalUrl")}
            label="آدرس Canonical (اختیاری)"
            placeholder="https://example.com/path"
            type="url"
          />
        ) : null}
        {showRobots ? (
          <AdminSelect
            name={field("robots")}
            label="Robots (اختیاری)"
            options={ROBOTS_OPTIONS}
            placeholder="پیش‌فرض"
          />
        ) : null}
      </div>
    </AdminSection>
  );
}
