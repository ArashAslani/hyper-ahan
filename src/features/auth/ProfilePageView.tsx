import Link from "next/link";
import { routes } from "@/lib/routes";
import { Button } from "@/shared/ui/Button";
import { OrderTimeline } from "@/shared/ui/OrderTimeline";
import type { ProfileOrder, ProfileUser } from "@/types";

const statusLabel: Record<ProfileOrder["status"], string> = {
  Submitted: "ثبت شده — در انتظار تماس",
  InReview: "در حال بررسی کارشناس",
  Confirmed: "تأیید شده — آماده ارسال",
  Completed: "تکمیل / تحویل",
  Cancelled: "لغو شده",
};

type ProfilePageViewProps = {
  user: ProfileUser;
  orders: ProfileOrder[];
};

export function ProfilePageView({ user, orders }: ProfilePageViewProps) {
  return (
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-xl font-bold text-text">حساب کاربری</h1>

      <section className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
        <h2 className="mb-3 text-base font-bold">اطلاعات شخصی</h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-text-muted">نام</dt>
            <dd className="font-medium">{user.name}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-text-muted">تلفن</dt>
            <dd className="font-medium">{user.phone}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-text-muted">عضویت</dt>
            <dd className="font-medium">{user.memberSince}</dd>
          </div>
        </dl>
        <div className="mt-4 flex gap-2">
          <Link
            href={routes.orders.list}
            className="inline-flex min-h-[var(--touch-min)] flex-1 items-center justify-center rounded-[var(--radius-md)] bg-accent text-sm font-bold text-white"
          >
            سفارش‌های من
          </Link>
          <Link
            href={routes.auth.login}
            className="inline-flex min-h-[var(--touch-min)] flex-1 items-center justify-center rounded-[var(--radius-md)] border border-border text-sm font-medium"
          >
            ورود / تغییر
          </Link>
        </div>
      </section>

      <section className="rounded-[var(--radius-lg)] bg-surface p-4 shadow-[var(--shadow-soft)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">آخرین سفارش‌ها</h2>
          <Link href={routes.orders.list} className="text-sm text-accent">
            همه
          </Link>
        </div>
        <ul className="space-y-4">
          {orders.slice(0, 2).map((order) => (
            <li key={order.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">{order.orderNumber}</span>
                <span className="text-accent">{order.total} ت</span>
              </div>
              <p className="mb-2 text-xs text-text-muted">
                {statusLabel[order.status]} · {order.date}
              </p>
              <OrderTimeline status={order.status} />
            </li>
          ))}
        </ul>
      </section>

      <Button variant="outline" fullWidth>
        ویرایش پروفایل
      </Button>
    </div>
  );
}
