import Link from "next/link";
import { footerProductLinks, footerQuickLinks } from "@/config/nav.config";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 pt-12 pb-6 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 text-2xl font-bold text-blue-400">
              {siteConfig.name}
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              اولین و بزرگترین بازار آنلاین خرید و فروش آهن‌آلات با بیش از یک
              دهه تجربه.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">دسترسی سریع</h3>
            <ul className="space-y-2 text-gray-400">
              {footerQuickLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-blue-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">محصولات</h3>
            <ul className="space-y-2 text-gray-400">
              {footerProductLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-blue-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">نمادهای اعتماد</h3>
            <div className="mb-6 flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://placehold.co/80x80/e2e8f0/1e293b?text=نماد۱"
                alt="نماد اعتماد"
                className="h-16 w-16 rounded bg-gray-700"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://placehold.co/80x80/e2e8f0/1e293b?text=نماد۲"
                alt="نماد اعتماد"
                className="h-16 w-16 rounded bg-gray-700"
              />
            </div>
            <h3 className="mb-4 text-lg font-semibold">شبکه‌های اجتماعی</h3>
            <div className="flex gap-4 text-2xl text-gray-400">
              <span>📘</span>
              <span>📷</span>
              <span>🐦</span>
              <span>💼</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. تمامی حقوق
            محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
