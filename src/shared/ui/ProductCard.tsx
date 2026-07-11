import Link from "next/link";
import { routes } from "@/lib/routes";
import { PriceBadge } from "@/shared/ui/PriceBadge";
import { Button } from "@/shared/ui/Button";
import type { Product } from "@/types";

const unitLabels: Record<Product["unit"], string> = {
  Kg: "کیلو",
  Ton: "تن",
  Piece: "شاخه",
};

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-card)] transition hover:-translate-y-0.5">
      <Link href={routes.products.detail(product.id)} className="block">
        <div className="relative aspect-[4/3] bg-border/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
          {product.discountPercent ? (
            <span className="absolute top-2 left-2 rounded-full bg-danger px-2 py-1 text-xs font-bold text-white">
              ٪{product.discountPercent}-
            </span>
          ) : null}
        </div>
      </Link>
      <div className="space-y-2 p-3">
        <Link href={routes.products.detail(product.id)}>
          <h3 className="text-base font-bold text-text">{product.name}</h3>
        </Link>
        <p className="text-sm text-text-muted">{product.factoryName}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-muted">
          {product.weight ? <span>وزن: {product.weight}</span> : null}
          <span>واحد: {unitLabels[product.unit]}</span>
          <span
            className={
              product.stock > 0 ? "text-success" : "text-danger"
            }
          >
            {product.stock > 0 ? `موجود ${product.stock}` : "ناموجود"}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 pt-1">
          <PriceBadge price={product.price} />
          {onAddToCart ? (
            <Button
              type="button"
              variant="accent"
              className="shrink-0 px-3 text-sm"
              onClick={() => onAddToCart(product)}
              disabled={product.stock <= 0}
            >
              افزودن
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
