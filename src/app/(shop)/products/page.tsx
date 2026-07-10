import { ProductListView } from "@/features/catalog/ProductListView";
import { productService } from "@/services/productService";

export default async function ProductsPage() {
  const products = await productService.getAll();
  return <ProductListView products={products} />;
}
