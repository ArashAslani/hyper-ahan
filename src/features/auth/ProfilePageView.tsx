import type { ProfileOrder, ProfileUser } from "@/types";
import { Button } from "@/shared/ui/Button";

type ProfilePageViewProps = {
  user: ProfileUser;
  orders: ProfileOrder[];
};

export function ProfilePageView({ user, orders }: ProfilePageViewProps) {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        پروفایل کاربری
      </h1>

      <div className="mb-8 rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">اطلاعات شخصی</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">نام:</span> {user.name}
          </p>
          <p>
            <span className="font-semibold">ایمیل:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">تلفن:</span> {user.phone}
          </p>
          <p>
            <span className="font-semibold">عضویت از:</span> {user.memberSince}
          </p>
        </div>
        <Button className="mt-4">ویرایش پروفایل</Button>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">سفارش‌های قبلی</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">شماره سفارش</th>
                  <th className="px-4 py-2">تاریخ</th>
                  <th className="px-4 py-2">تعداد اقلام</th>
                  <th className="px-4 py-2">مبلغ کل</th>
                  <th className="px-4 py-2">وضعیت</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">{order.items}</td>
                    <td className="px-4 py-2">{order.total} تومان</td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          order.status === "تحویل شده"
                            ? "bg-green-100 text-green-800"
                            : order.status === "در حال ارسال"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        جزئیات
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
