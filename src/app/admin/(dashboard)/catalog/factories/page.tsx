import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { catalogService } from "@/services/catalogService";
import { routes } from "@/lib/routes";
import { EmptyState } from "@/shared/ui/EmptyState";

export const dynamic = "force-dynamic";

export default async function AdminCatalogFactoriesPage() {
  const factories = await catalogService.getFactories().catch(() => []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="کارخانه‌ها"
        breadcrumbs={[
          { label: "ادمین", href: routes.admin.dashboard },
          { label: "کاتالوگ", href: routes.admin.catalog.root },
          { label: "کارخانه‌ها" },
        ]}
      />
      {factories.length === 0 ? (
        <EmptyState title="کارخانه‌ای یافت نشد" />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-surface">
          <table className="min-w-full text-sm">
            <thead className="bg-bg text-text-muted">
              <tr>
                <th className="px-3 py-2 text-start font-medium">نام</th>
                <th className="px-3 py-2 text-start font-medium">وضعیت</th>
                <th className="px-3 py-2 text-start font-medium">شناسه</th>
              </tr>
            </thead>
            <tbody>
              {factories.map((f) => (
                <tr key={f.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium text-text">{f.name}</td>
                  <td className="px-3 py-2">
                    {f.isActive ? "فعال" : "غیرفعال"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-text-muted">
                    {f.id}
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
