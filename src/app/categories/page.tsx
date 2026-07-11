import Link from "next/link";
import { routes } from "@/lib/routes";
import { homeService } from "@/services/homeService";

export default async function CategoriesPage() {
  const categories = await homeService.getCategories();

  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-text">دسته‌بندی محصولات</h1>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={routes.products.category(cat.slug)}
            className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)] active:scale-95"
          >
            <span className="text-4xl" aria-hidden>
              {cat.icon}
            </span>
            <span className="text-base font-bold text-text">{cat.name}</span>
            <span className="text-xs text-text-muted">{cat.count} محصول</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
