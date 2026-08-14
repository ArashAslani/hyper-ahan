import { notFound } from "next/navigation";
import { CatalogProductDetail } from "@/features/catalog/CatalogProductDetail";
import { catalogService } from "@/services/catalogService";
import { calculationToolService } from "@/services/calculationToolService";
import {
  buildCatalogProductHref,
  readCatalogReturnParam,
} from "@/lib/catalogNavigationContext";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    applyQty?: string;
    applyUnit?: string;
    openAtc?: string;
    from?: string | string[];
  }>;
};

async function resolveCalculatorHref(
  formulaTypeId: string | null,
  productId: string,
  pdpHref: string,
): Promise<string | null> {
  if (!formulaTypeId) return null;
  try {
    const slug =
      await calculationToolService.findSlugByFormulaTypeId(formulaTypeId);
    if (slug) {
      return routes.tools.detailWithProduct(slug, productId, pdpHref);
    }
  } catch {
    /* fall through to tools list */
  }
  return routes.tools.listWithProduct(productId);
}

export default async function CatalogProductPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const sp = await searchParams;
  const catalogFrom = readCatalogReturnParam({ from: sp.from });
  const pdpHref = buildCatalogProductHref(id, catalogFrom);

  const product = await catalogService.getProductById(id).catch(() => null);
  if (!product) notFound();

  const [category, factory, calculatorHref] = await Promise.all([
    catalogService.getCategoryById(product.categoryId).catch(() => null),
    catalogService.getFactoryById(product.factoryId).catch(() => null),
    resolveCalculatorHref(product.formulaTypeId, product.id, pdpHref),
  ]);

  const template = category?.specificationTemplateId
    ? await catalogService
        .getTemplateById(category.specificationTemplateId)
        .catch(() => null)
    : null;

  const engineeringHandoff =
    sp.applyQty != null || sp.applyUnit != null || sp.openAtc === "1"
      ? {
          applyQty: sp.applyQty ?? null,
          applyUnit: sp.applyUnit ?? null,
          openAtc: sp.openAtc === "1" || sp.applyQty != null,
        }
      : null;

  return (
    <CatalogProductDetail
      product={product}
      factoryName={factory?.name}
      categoryName={category?.name}
      template={template}
      calculatorHref={calculatorHref}
      engineeringHandoff={engineeringHandoff}
    />
  );
}
