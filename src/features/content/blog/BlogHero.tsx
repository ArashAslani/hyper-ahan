import { Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { BlogSearchBar } from "./BlogSearchBar";

type BlogHeroProps = {
  initialQuery: string;
  totalArticles: number;
};

export function BlogHero({ initialQuery, totalArticles }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-primary px-4 py-10 text-white md:py-14">
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
          <FontAwesomeIcon icon={faNewspaper} />
          {totalArticles > 0 ? `${totalArticles} مقاله منتشر شده` : "بلاگ هایپر آهن"}
        </span>
        <h1 className="mt-4 text-2xl font-bold leading-snug md:text-4xl">
          راهنمای خرید و تحلیل بازار آهن‌آلات
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
          مقالات تخصصی برای انتخاب درست مقاطع فولادی، محاسبات فنی و رصد روزانه قیمت بازار
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <BlogSearchBar initialQuery={initialQuery} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
