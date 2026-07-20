import Link from "next/link";
import { routes } from "@/lib/routes";
import { orderStatusLabels } from "@/lib/labels";
import { OrderTimeline } from "@/shared/ui/OrderTimeline";
import type { ProfileOrder } from "@/types";

type OrderDetailViewProps = {
  order: ProfileOrder;
};

export function OrderDetailView({ order }: OrderDetailViewProps) {
  return (
    <div className="px-4 py-6">
      <Link href={routes.orders.list} className="mb-4 inline-block text-sm text-accent">
        ← بازگشت
      </Link>
      <h1 className="mb-1 text-xl font-bold text-text">{order.orderNumber}</h1>
      <p className="mb-4 text-sm text-text-muted">
        {orderStatusLabels[order.status]} · {order.date}
      </p>

      <section className="mb-4 rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
        <h2 className="mb-3 text-base font-bold">پیگیری وضعیت</h2>
        <OrderTimeline status={order.status} />
      </section>

      <section className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">تعداد اقلام</span>
          <span className="font-medium">{order.items}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-text-muted">مبلغ برآوردی</span>
          <span className="font-bold text-accent">{order.total} تومان</span>
        </div>
      </section>

      <a
        href={routes.phone.call}
        className="mt-6 flex min-h-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] bg-primary text-base font-bold text-white"
      >
        تماس با کارشناس
      </a>
    </div>
  );
}
