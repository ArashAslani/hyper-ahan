import { CatalogBrowseView } from "@/features/catalog/CatalogBrowseView";
import { catalogService } from "@/services/catalogService";
import { calculationToolService } from "@/services/calculationToolService";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [categories, tools] = await Promise.all([
    catalogService.getCategoryTree().catch(() => []),
    calculationToolService.list().catch(() => []),
  ]);

  return <CatalogBrowseView categories={categories} tools={tools} />;
}
