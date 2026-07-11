import Link from "next/link";
import { HeroSlider } from "@/features/home/HeroSlider";
import { CategoryGrid } from "@/features/home/CategoryGrid";
import { PriceTable } from "@/features/home/PriceTable";
import { routes } from "@/lib/routes";
import type {
  Banner,
  HomeCategory,
  PriceRow,
} from "@/types";

type HomePageViewProps = {
  banners: Banner[];
  categories: HomeCategory[];
  prices: PriceRow[];
};

export function HomePageView({
  banners,
  categories,
  prices,
}: HomePageViewProps) {
  return (
    <div>
      <HeroSlider banners={banners} />
      <div className="px-4 pt-4">
        <Link
          href={routes.products.list}
          className="flex min-h-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] bg-accent text-base font-bold text-white active:scale-95"
        >
          مشاهده محصولات و قیمت
        </Link>
      </div>
      <CategoryGrid categories={categories} />
      <PriceTable prices={prices} />
      <section className="px-4 pb-8">
        <div className="rounded-[var(--radius-lg)] bg-primary p-4 text-white">
          <h2 className="text-base font-bold">نیاز به مشاوره دارید؟</h2>
          <p className="mt-1 text-sm opacity-90">
            کارشناس فروش در کوتاه‌ترین زمان با شما تماس می‌گیرد.
          </p>
          <a
            href={routes.phone.call}
            className="mt-3 inline-flex min-h-[var(--touch-min)] items-center justify-center rounded-[var(--radius-md)] bg-accent px-4 text-sm font-bold text-white"
          >
            تماس مستقیم
          </a>
        </div>
      </section>
    </div>
  );
}
