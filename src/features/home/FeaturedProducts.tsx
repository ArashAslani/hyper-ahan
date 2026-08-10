import Link from "next/link";
import { CatalogProductCard } from "@/features/catalog/CatalogProductCard";
import { routes } from "@/lib/routes";
import type { CatalogProduct } from "@/types/catalog";

type FeaturedProductsProps = {
  products: CatalogProduct[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="home-section-enter px-4 py-6" style={{ animationDelay: "180ms" }}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">محصولات منتخب</h2>
        <Link
          href={routes.catalog.root}
          className="text-sm font-medium text-accent transition duration-200 hover:opacity-80"
        >
          همه
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <CatalogProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
