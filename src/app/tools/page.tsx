import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { calculationToolService } from "@/services/calculationToolService";
import { EmptyState } from "@/shared/ui/EmptyState";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ productId?: string }>;
};

export default async function ToolsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const productId = sp.productId?.trim() || null;
  const tools = await calculationToolService.list().catch(() => []);

  return (
    <div className="px-4 py-4">
      <h1 className="mb-1 text-xl font-bold text-text">محاسبه‌گرها</h1>
      <p className="mb-4 text-sm text-text-muted">
        فرم‌ها و فرمول‌ها از سرور بارگذاری می‌شوند.
      </p>
      {productId ? (
        <p className="mb-4 text-sm text-accent">
          یک محاسبه‌گر انتخاب کنید تا نتیجه مهندسی برای خرید محصول اعمال شود.
        </p>
      ) : null}

      {tools.length === 0 ? (
        <EmptyState
          title="محاسبه‌گری یافت نشد"
          description="فعلاً ابزاری منتشر نشده یا سرور در دسترس نیست."
          icon="🧮"
        />
      ) : (
        <ul className="space-y-3">
          {tools.map((tool) => {
            const href = productId
              ? routes.tools.detailWithProduct(
                  tool.slug,
                  productId,
                  routes.catalog.product(productId),
                )
              : routes.tools.detail(tool.slug);
            return (
              <li key={tool.id}>
                <Link
                  href={href}
                  className="flex min-h-[var(--touch-min)] items-start gap-3 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <FontAwesomeIcon icon={faCalculator} />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-text">
                      {tool.title}
                      {tool.isPinned ? (
                        <span className="mr-2 text-xs font-normal text-accent">
                          پین
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block text-sm text-text-muted">
                      {tool.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
