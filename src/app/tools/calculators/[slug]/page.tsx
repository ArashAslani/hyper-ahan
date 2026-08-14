import { notFound } from "next/navigation";
import Link from "next/link";
import { DynamicToolForm } from "@/features/tools/DynamicToolForm";
import { TrackToolVisit } from "@/features/catalog/TrackToolVisit";
import { calculationToolService } from "@/services/calculationToolService";
import { readCatalogNavParam } from "@/lib/catalogNavigationContext";
import { routes } from "@/lib/routes";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    productId?: string;
    return?: string;
    nav?: string | string[];
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await calculationToolService.getBySlug(slug).catch(() => null);
  if (!tool) return { title: "محاسبه‌گر" };
  return {
    title: tool.seoTitle || tool.title,
    description: tool.seoDescription || tool.description,
  };
}

export default async function ToolDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const tool = await calculationToolService.getBySlug(slug).catch(() => null);
  if (!tool) notFound();

  const productId = sp.productId?.trim() || null;
  const returnPath = sp.return?.trim() || null;
  const backHref = productId
    ? routes.tools.listWithProduct(productId)
    : routes.tools.list;

  return (
    <div className="px-4 py-4">
      <TrackToolVisit slug={tool.slug} title={tool.title} />
      <Link href={backHref} className="text-sm text-accent">
        ← همه محاسبه‌گرها
      </Link>
      <h1 className="mt-3 text-xl font-bold text-text">{tool.title}</h1>
      {tool.description ? (
        <p className="mt-2 text-sm text-text-muted">{tool.description}</p>
      ) : null}
      {productId ? (
        <p className="mt-2 text-xs text-text-muted">
          پس از محاسبه می‌توانید نتیجه مهندسی را برای خرید این محصول ادامه دهید.
        </p>
      ) : null}
      <div className="mt-6 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
        <DynamicToolForm
          tool={tool}
          productId={productId}
          returnPath={returnPath}
          nav={readCatalogNavParam(sp.nav)}
        />
      </div>
    </div>
  );
}
