import Link from "next/link";
import { HeroSlider } from "@/features/home/HeroSlider";
import { routes } from "@/lib/routes";
import type { PublicSlide } from "@/types";

type HeroSectionProps = {
  slides: PublicSlide[];
};

export function HeroSection({ slides }: HeroSectionProps) {
  return (
    <section>
      <HeroSlider slides={slides} />
      <div className="px-4 pt-4">
        <div className="home-section-enter rounded-[var(--radius-lg)] bg-primary p-4 text-white shadow-[var(--shadow-card)]">
          <h1 className="text-lg font-bold">
            قیمت لحظه‌ای آهن، مستقیم از کارخانه
          </h1>
          <p className="mt-1 text-sm text-white/80">
            استعلام سریع قیمت و مشاوره رایگان کارشناسان هایپر آهن برای پیمانکاران و سازندگان
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href={routes.catalog.root}
              className="flex min-h-[var(--touch-min)] flex-1 items-center justify-center rounded-[var(--radius-md)] bg-accent px-3 text-sm font-bold text-white transition duration-200 hover:brightness-110 active:scale-95"
            >
              مشاهده کاتالوگ
            </Link>
            <Link
              href={routes.tools.list}
              className="flex min-h-[var(--touch-min)] flex-1 items-center justify-center rounded-[var(--radius-md)] border border-white/30 px-3 text-sm font-bold text-white transition duration-200 hover:bg-white/10 active:scale-95"
            >
              محاسبه‌گرها
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
