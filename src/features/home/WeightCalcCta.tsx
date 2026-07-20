import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { routes } from "@/lib/routes";

export function WeightCalcCta() {
  return (
    <section className="px-4 py-4">
      <div className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-2xl text-accent">
            <FontAwesomeIcon icon={faCalculator} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-text">
              محاسبه‌گر وزن آهن‌آلات
            </h2>
            <p className="mt-0.5 text-sm text-text-muted">
              وزن دقیق میلگرد، تیرآهن، پروفیل و سایر مقاطع را قبل از سفارش
              محاسبه کنید.
            </p>
          </div>
        </div>
        <Link
          href={routes.weightCalc("rebar")}
          className="mt-4 flex min-h-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] bg-accent px-4 text-sm font-bold text-white active:scale-95"
        >
          رفتن به محاسبه‌گر وزن
        </Link>
      </div>
    </section>
  );
}
