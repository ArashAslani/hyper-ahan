import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";
import { PriceBadge } from "@/shared/ui/PriceBadge";
import type { PriceRow } from "@/types";

type PriceTableProps = {
  prices: PriceRow[];
};

const trendConfig = {
  up: { icon: faArrowUp, className: "text-success" },
  down: { icon: faArrowDown, className: "text-danger" },
  flat: null,
} as const;

export function PriceTable({ prices }: PriceTableProps) {
  return (
    <section id="daily-prices" className="scroll-mt-[var(--topbar-h)] px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">قیمت روز</h2>
        <Link
          href={routes.products.list}
          className="text-sm font-medium text-accent"
        >
          مشاهده همه
        </Link>
      </div>
      <ul className="space-y-2">
        {prices.slice(0, 5).map((item) => {
          const trend = trendConfig[item.trend];
          return (
            <li
              key={item.id}
              className="rounded-[var(--radius-lg)] bg-surface p-3 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-text">
                    {item.product}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
                    <span className="rounded-[var(--radius-sm)] bg-accent/10 px-1.5 py-0.5 font-medium text-accent">
                      {item.type}
                    </span>
                    <span>سایز {item.size}</span>
                    <span aria-hidden>·</span>
                    <span>{item.loadingPlace}</span>
                  </div>
                </div>
                <div className="shrink-0 text-left">
                  <div className="flex items-center justify-end gap-1">
                    {trend ? (
                      <FontAwesomeIcon
                        icon={trend.icon}
                        className={`text-xs ${trend.className}`}
                        aria-hidden
                      />
                    ) : null}
                    <PriceBadge price={item.price} />
                  </div>
                  <p className="text-[11px] text-text-muted">تومان / تن</p>
                </div>
              </div>
              <Link
                href={routes.products.list}
                className="mt-2 flex min-h-[36px] items-center justify-center rounded-[var(--radius-sm)] border border-border text-xs font-medium text-text hover:border-accent hover:text-accent"
              >
                مشاهده جزئیات
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
