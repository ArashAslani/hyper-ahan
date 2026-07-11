"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";
import { ProductCard } from "@/shared/ui/ProductCard";
import { SearchBar } from "@/shared/ui/SearchBar";
import { BottomSheet } from "@/shared/ui/BottomSheet";
import { Fab } from "@/shared/ui/Fab";
import { Button } from "@/shared/ui/Button";
import { EmptyState } from "@/shared/ui/EmptyState";
import { useCart } from "@/providers/CartProvider";
import { useToast } from "@/shared/ui/Toast";
import type { Product } from "@/types";

type ProductListViewProps = {
  products: Product[];
};

export function ProductListView({ products }: ProductListViewProps) {
  const [query, setQuery] = useState("");
  const [factory, setFactory] = useState<string>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const factories = useMemo(
    () => Array.from(new Set(products.map((p) => p.factoryName))),
    [products],
  );

  const filtered = products.filter((p) => {
    const q = query.trim();
    const matchesQuery =
      !q ||
      p.name.includes(q) ||
      p.factoryName.includes(q) ||
      p.size.includes(q);
    const matchesFactory = factory === "all" || p.factoryName === factory;
    return matchesQuery && matchesFactory;
  });

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    showToast(`${product.name} به سبد اضافه شد`, "success");
  };

  return (
    <div className="px-4 py-4">
      <h1 className="mb-3 text-xl font-bold text-text">محصولات</h1>
      <SearchBar sticky value={query} onChange={setQuery} />

      {filtered.length === 0 ? (
        <EmptyState
          title="محصولی یافت نشد"
          description="عبارت جستجو یا فیلتر را تغییر دهید."
          icon="🔍"
        />
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAdd}
            />
          ))}
        </div>
      )}

      <Fab onClick={() => setSheetOpen(true)} aria-label="فیلتر">
        <FontAwesomeIcon icon={faSliders} />
      </Fab>

      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="فیلتر محصولات"
      >
        <p className="mb-2 text-sm font-medium text-text">کارخانه</p>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFactory("all")}
            className={`min-h-11 rounded-full px-3 text-sm ${
              factory === "all"
                ? "bg-accent text-white"
                : "bg-bg text-text-muted"
            }`}
          >
            همه
          </button>
          {factories.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFactory(f)}
              className={`min-h-11 rounded-full px-3 text-sm ${
                factory === f ? "bg-accent text-white" : "bg-bg text-text-muted"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <Button fullWidth onClick={() => setSheetOpen(false)}>
          اعمال فیلتر
        </Button>
      </BottomSheet>
    </div>
  );
}
