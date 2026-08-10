import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { catalogService } from "@/services/catalogService";
import { routes } from "@/lib/routes";
import { EmptyState } from "@/shared/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdminCatalogCategoriesPage() {
  const categories = await catalogService.getCategories().catch(() => []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="دسته‌بندی‌های کاتالوگ"
        breadcrumbs={[
          { label: "ادمین", href: routes.admin.dashboard },
          { label: "کاتالوگ", href: routes.admin.catalog.root },
          { label: "دسته‌ها" },
        ]}
      />
      {categories.length === 0 ? (
        <EmptyState title="دسته‌ای یافت نشد" />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-surface">
          <table className="min-w-full text-sm">
            <thead className="bg-bg text-text-muted">
              <tr>
                <th className="px-3 py-2 text-start font-medium">نام</th>
                <th className="px-3 py-2 text-start font-medium">ریشه</th>
                <th className="px-3 py-2 text-start font-medium">شناسه</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium text-text">{c.name}</td>
                  <td className="px-3 py-2">{c.isRoot ? "بله" : "خیر"}</td>
                  <td className="px-3 py-2 font-mono text-xs text-text-muted">
                    {c.id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
