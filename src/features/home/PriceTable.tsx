import Link from "next/link";
import { routes } from "@/lib/routes";
import type { PriceRow } from "@/types";

type PriceTableProps = {
  prices: PriceRow[];
};

export function PriceTable({ prices }: PriceTableProps) {
  return (
    <section className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">قیمت روز</h2>
        <Link
          href={routes.products.list}
          className="text-sm font-medium text-accent"
        >
          خرید
        </Link>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-lg)] bg-surface shadow-[var(--shadow-soft)]">
        <ul className="divide-y divide-border">
          {prices.slice(0, 5).map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-text">{item.product}</p>
                <p className="text-xs text-text-muted">
                  سایز {item.size} · {item.loadingPlace}
                </p>
              </div>
              <div className="shrink-0 text-left">
                <p className="text-base font-bold text-accent">{item.price}</p>
                <p className="text-[11px] text-text-muted">تومان / تن</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
