import Link from "next/link";
import { routes } from "@/lib/routes";
import type { Product } from "@/types";

type ProductListViewProps = {
  products: Product[];
};

export function ProductListView({ products }: ProductListViewProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        محصولات آهنی و فلزی
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
              <p className="mt-1 text-gray-600">سایز: {product.size}</p>
              <p className="text-gray-600">برند: {product.brand}</p>
              <p className="mt-2 text-lg font-bold text-blue-600">
                {product.price} تومان
              </p>
              <Link
                href={routes.products.detail(product.id)}
                className="mt-4 inline-block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-blue-700"
              >
                مشاهده جزئیات
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
