import Link from "next/link";
import { routes } from "@/lib/routes";
import { OrderTimeline } from "@/shared/ui/OrderTimeline";
import { EmptyState } from "@/shared/ui/EmptyState";
import type { ProfileOrder } from "@/types";

const statusLabel: Record<ProfileOrder["status"], string> = {
  Submitted: "ثبت شده — در انتظار تماس",
  InReview: "در حال بررسی کارشناس",
  Confirmed: "تأیید شده — آماده ارسال",
  Completed: "تکمیل / تحویل",
  Cancelled: "لغو شده",
};

type OrdersListViewProps = {
  orders: ProfileOrder[];
};

export function OrdersListView({ orders }: OrdersListViewProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        title="سفارشی ندارید"
        description="پس از ثبت سفارش، وضعیت اینجا نمایش داده می‌شود."
        icon="📦"
      />
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-text">سفارش‌های من</h1>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={routes.orders.detail(order.id)}
              className="block rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)] active:scale-[0.99]"
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="font-bold text-text">{order.orderNumber}</span>
                <span className="text-sm font-bold text-accent">
                  {order.total} ت
                </span>
              </div>
              <p className="mb-3 text-xs text-text-muted">
                {statusLabel[order.status]} · {order.date} · {order.items} قلم
              </p>
              <OrderTimeline status={order.status} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
