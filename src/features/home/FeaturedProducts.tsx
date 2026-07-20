import Link from "next/link";
import { ProductCard } from "@/shared/ui/ProductCard";
import { routes } from "@/lib/routes";
import type { Product } from "@/types";

type FeaturedProductsProps = {
  products: Product[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">محصولات منتخب</h2>
        <Link
          href={routes.products.list}
          className="text-sm font-medium text-accent"
        >
          همه
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
