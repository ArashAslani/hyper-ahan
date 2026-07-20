import Link from "next/link";
import { footerProductLinks, footerQuickLinks } from "@/config/nav.config";
import { siteConfig } from "@/config/site";

export function HomeFooter() {
  return (
    <footer className="bg-primary px-4 pt-8 pb-6 text-white">
      <div className="mb-2 text-lg font-bold text-accent">
        {siteConfig.name}
      </div>
      <p className="text-sm leading-relaxed text-white/70">
        {siteConfig.description} — با بیش از یک دهه تجربه در تامین مستقیم
        مقاطع فولادی برای پیمانکاران و صنعتگران.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h3 className="mb-2 text-sm font-bold">دسترسی سریع</h3>
          <ul className="space-y-1.5 text-sm text-white/70">
            {footerQuickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-bold">محصولات</h3>
          <ul className="space-y-1.5 text-sm text-white/70">
            {footerProductLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/60">
        &copy; {new Date().getFullYear()} {siteConfig.name}. تمامی حقوق محفوظ
        است.
      </div>
    </footer>
  );
}
