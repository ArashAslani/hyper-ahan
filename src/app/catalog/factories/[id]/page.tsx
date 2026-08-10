import { CatalogProductList } from "@/features/catalog/CatalogProductList";
import { catalogService } from "@/services/catalogService";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CatalogFactoryPage({ params }: PageProps) {
  const { id } = await params;

  const [factory, products, factories] = await Promise.all([
    catalogService.getFactoryById(id).catch(() => null),
    catalogService.getProductsByFactory(id).catch(() => []),
    catalogService.getFactories().catch(() => []),
  ]);

  return (
    <CatalogProductList
      title={factory?.name ?? "محصولات کارخانه"}
      products={products}
      factories={factories}
      emptyDescription="محصولی برای این کارخانه یافت نشد."
    />
  );
}
