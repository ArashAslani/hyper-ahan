import type { PriceRow } from "@/types";
import { Button } from "@/shared/ui/Button";

type PriceTableProps = {
  prices: PriceRow[];
};

function getTrendIcon(trend: PriceRow["trend"]) {
  if (trend === "up") return "📈";
  if (trend === "down") return "📉";
  return "➡️";
}

export function PriceTable({ prices }: PriceTableProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
        قیمت آهن‌آلات امروز
      </h2>

      <div className="hidden overflow-x-auto rounded-lg bg-white shadow md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "نام محصول",
                "سایز",
                "آنالیز/گرید",
                "محل بارگیری",
                "نوع",
                "قیمت (تومان)",
                "نمودار",
                "خرید",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {prices.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {item.product}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.size}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.grade}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.loadingPlace}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.type}</td>
                <td className="px-6 py-4 font-mono whitespace-nowrap">
                  {item.price}
                </td>
                <td className="px-6 py-4 text-xl whitespace-nowrap">
                  {getTrendIcon(item.trend)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Button className="px-4 py-1">خرید</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {prices.map((item) => (
          <div key={item.id} className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold">{item.product}</h3>
                <p className="text-sm text-gray-500">
                  سایز: {item.size} | گرید: {item.grade}
                </p>
                <p className="text-sm text-gray-500">
                  بارگیری: {item.loadingPlace} | نوع: {item.type}
                </p>
              </div>
              <div className="text-xl">{getTrendIcon(item.trend)}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-mono text-lg font-bold">
                {item.price} تومان
              </span>
              <Button className="px-4 py-1 text-sm">خرید</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
