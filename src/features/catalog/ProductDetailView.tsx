"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { useCart } from "@/providers/CartProvider";
import { Button } from "@/shared/ui/Button";
import type { Product } from "@/types";

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    alert(`${product.name} به سبد خرید اضافه شد.`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href={routes.products.list}
        className="mb-6 inline-block text-blue-600"
      >
        ← بازگشت به لیست محصولات
      </Link>
      <div className="overflow-hidden rounded-xl bg-white shadow-md md:flex">
        <div className="md:w-1/2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-96 w-full object-cover"
          />
        </div>
        <div className="p-6 md:w-1/2">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            {product.name}
          </h1>
          <div className="space-y-3 text-gray-700">
            <p>
              <span className="font-semibold">سایز:</span> {product.size}
            </p>
            {product.grade ? (
              <p>
                <span className="font-semibold">آنالیز/گرید:</span>{" "}
                {product.grade}
              </p>
            ) : null}
            {product.loadingPlace ? (
              <p>
                <span className="font-semibold">محل بارگیری:</span>{" "}
                {product.loadingPlace}
              </p>
            ) : null}
            {product.type ? (
              <p>
                <span className="font-semibold">نوع:</span> {product.type}
              </p>
            ) : null}
            <p>
              <span className="font-semibold">برند:</span> {product.brand}
            </p>
            {product.description ? (
              <p>
                <span className="font-semibold">توضیحات:</span>{" "}
                {product.description}
              </p>
            ) : null}
            <p className="text-2xl font-bold text-blue-600">
              {product.price} تومان
            </p>
          </div>
          <Button onClick={handleAddToCart} fullWidth className="mt-6 py-3">
            افزودن به سبد خرید
          </Button>
        </div>
      </div>
    </div>
  );
}
