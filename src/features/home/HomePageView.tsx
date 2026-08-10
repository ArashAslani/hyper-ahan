import { Suspense } from "react";
import { HeroSliderSection } from "@/features/home/HeroSliderSection";
import { HeroSkeleton } from "@/features/home/HeroSkeleton";
import { HomeGlobalSearch } from "@/features/home/HomeGlobalSearch";
import { WeightCalcCta } from "@/features/home/WeightCalcCta";
import { CategoryGrid } from "@/features/home/CategoryGrid";
import { PriceTable } from "@/features/home/PriceTable";
import { FeaturedProducts } from "@/features/home/FeaturedProducts";
import { LatestArticles } from "@/features/home/LatestArticles";
import { WhyHyperAhan } from "@/features/home/WhyHyperAhan";
import { ContactExpertCta } from "@/features/home/ContactExpertCta";
import { HomeFooter } from "@/features/home/HomeFooter";
import type { BlogPostSummary, HomeCategory, PriceRow } from "@/types";
import type { CatalogProduct } from "@/types/catalog";

type HomePageViewProps = {
  categories: HomeCategory[];
  prices: PriceRow[];
  featuredProducts: CatalogProduct[];
  latestArticles: BlogPostSummary[];
};

export function HomePageView({
  categories,
  prices,
  featuredProducts,
  latestArticles,
}: HomePageViewProps) {
  return (
    <div>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSliderSection />
      </Suspense>
      <HomeGlobalSearch />
      <WeightCalcCta />
      <CategoryGrid categories={categories} />
      <PriceTable prices={prices} />
      <FeaturedProducts products={featuredProducts} />
      <LatestArticles posts={latestArticles} />
      <WhyHyperAhan />
      <ContactExpertCta />
      <HomeFooter />
    </div>
  );
}
