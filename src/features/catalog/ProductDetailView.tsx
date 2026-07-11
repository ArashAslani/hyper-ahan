"use client";

import Link from "next/link";
import { routes } from "@/lib/routes";
import { useCart } from "@/providers/CartProvider";
import { useToast } from "@/shared/ui/Toast";
import { Button } from "@/shared/ui/Button";
import { PriceBadge } from "@/shared/ui/PriceBadge";
import type { Product } from "@/types";

const unitLabels: Record<Product["unit"], string> = {
  Kg: "کیلو",
  Ton: "تن",
  Piece: "شاخه",
};

type ProductDetailViewProps = {
  product: Product;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast(`${product.name} به سبد اضافه شد`, "success");
  };

  return (
    <div className="pb-28">
      <div className="aspect-[4/3] bg-border/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-4 px-4 py-4">
        <Link href={routes.products.list} className="text-sm text-accent">
          ← بازگشت به لیست
        </Link>
        <h1 className="text-xl font-bold text-text">{product.name}</h1>
        <PriceBadge price={product.price} className="py-1" />
        <dl className="space-y-2 rounded-[var(--radius-lg)] bg-surface p-4 text-sm shadow-[var(--shadow-soft)]">
          <div className="flex justify-between gap-2">
            <dt className="text-text-muted">کارخانه</dt>
            <dd className="font-medium">{product.factoryName}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-text-muted">سایز</dt>
            <dd className="font-medium">{product.size}</dd>
          </div>
          {product.grade ? (
            <div className="flex justify-between gap-2">
              <dt className="text-text-muted">گرید</dt>
              <dd className="font-medium">{product.grade}</dd>
            </div>
          ) : null}
          {product.weight ? (
            <div className="flex justify-between gap-2">
              <dt className="text-text-muted">وزن</dt>
              <dd className="font-medium">{product.weight}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-2">
            <dt className="text-text-muted">واحد</dt>
            <dd className="font-medium">{unitLabels[product.unit]}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-text-muted">موجودی</dt>
            <dd
              className={`font-medium ${product.stock > 0 ? "text-success" : "text-danger"}`}
            >
              {product.stock > 0 ? product.stock : "ناموجود"}
            </dd>
          </div>
          {product.loadingPlace ? (
            <div className="flex justify-between gap-2">
              <dt className="text-text-muted">محل بارگیری</dt>
              <dd className="font-medium">{product.loadingPlace}</dd>
            </div>
          ) : null}
        </dl>
        {product.description ? (
          <p className="text-sm leading-relaxed text-text-muted">
            {product.description}
          </p>
        ) : null}
      </div>

      <div className="fixed right-0 bottom-[var(--bottom-nav-h)] left-0 z-40 border-t border-border bg-surface/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-xl gap-2">
          <a
            href={routes.phone.call}
            className="inline-flex min-h-[var(--touch-min)] flex-1 items-center justify-center rounded-[var(--radius-md)] border border-border text-base font-medium text-text"
          >
            تماس
          </a>
          <Button
            fullWidth
            className="flex-[1.4]"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            افزودن به سبد
          </Button>
        </div>
      </div>
    </div>
  );
}
