import Link from "next/link";
import { routes } from "@/lib/routes";
import { Button } from "@/shared/ui/Button";

type CartSummaryBarProps = {
  totalItems: number;
  totalPrice: number;
  /** Defaults to approximate-quote framing. */
  totalLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  /** When true, CTA is shown disabled (no navigation). */
  ctaDisabled?: boolean;
};

export function CartSummaryBar({
  totalItems,
  totalPrice,
  totalLabel = "جمع تقریبی",
  ctaLabel = "بررسی استعلام",
  ctaHref = routes.checkout,
  onCtaClick,
  ctaDisabled = false,
}: CartSummaryBarProps) {
  return (
    <div className="fixed right-0 bottom-[var(--bottom-nav-h)] left-0 z-40 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-xl items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-muted">{totalItems} قلم</p>
          <p className="text-xs text-text-muted">{totalLabel}</p>
          <p className="truncate text-lg font-bold text-accent">
            {new Intl.NumberFormat("fa-IR").format(totalPrice)} ریال
          </p>
        </div>
        {onCtaClick || ctaDisabled ? (
          <Button
            variant="accent"
            className="min-w-[8.5rem]"
            disabled={ctaDisabled}
            onClick={onCtaClick}
          >
            {ctaLabel}
          </Button>
        ) : (
          <Link
            href={ctaHref}
            className="inline-flex min-h-[var(--touch-min)] min-w-[8.5rem] items-center justify-center rounded-[var(--radius-md)] bg-accent px-4 text-base font-medium text-white active:scale-95"
          >
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
