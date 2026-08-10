import Link from "next/link";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { catalogService } from "@/services/catalogService";
import { routes } from "@/lib/routes";
import { EmptyState } from "@/shared/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdminCatalogPage() {
  const [categories, factories] = await Promise.all([
    catalogService.getCategories().catch(() => []),
    catalogService.getFactories().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="کاتالوگ"
        description="نمای خواندنی از دسته‌ها و کارخانه‌ها. ایجاد/ویرایش از API ادمین در فاز فرم‌ویزارد."
        breadcrumbs={[
          { label: "ادمین", href: routes.admin.dashboard },
          { label: "کاتالوگ" },
        ]}
      />

      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-text">دسته‌بندی‌ها</h2>
          <Link
            href={routes.admin.catalog.categories}
            className="text-sm text-accent"
          >
            جزئیات
          </Link>
        </div>
        {categories.length === 0 ? (
          <EmptyState title="دسته‌ای نیست" description="API در دسترس نیست یا خالی است." />
        ) : (
          <ul className="divide-y divide-border text-sm">
            {categories.map((c) => (
              <li key={c.id} className="flex justify-between gap-2 py-2">
                <span className="font-medium text-text">{c.name}</span>
                <span className="text-text-muted">
                  {c.isRoot ? "ریشه" : "فرزند"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-text">کارخانه‌ها</h2>
          <Link
            href={routes.admin.catalog.factories}
            className="text-sm text-accent"
          >
            جزئیات
          </Link>
        </div>
        {factories.length === 0 ? (
          <EmptyState title="کارخانه‌ای نیست" description="API در دسترس نیست یا خالی است." />
        ) : (
          <ul className="divide-y divide-border text-sm">
            {factories.map((f) => (
              <li key={f.id} className="flex justify-between gap-2 py-2">
                <span className="font-medium text-text">{f.name}</span>
                <span className="text-text-muted">
                  {f.isActive ? "فعال" : "غیرفعال"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
