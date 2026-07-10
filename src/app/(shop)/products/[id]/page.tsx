import { notFound } from "next/navigation";
import { ProductDetailView } from "@/features/catalog/ProductDetailView";
import { productService } from "@/services/productService";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await productService.getById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
