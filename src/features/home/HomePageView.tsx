import { Suspense } from "react";
import { HeroSliderSection } from "@/features/home/HeroSliderSection";
import { HeroSkeleton } from "@/features/home/HeroSkeleton";
import { WeightCalcCta } from "@/features/home/WeightCalcCta";
import { CategoryGrid } from "@/features/home/CategoryGrid";
import { PriceTable } from "@/features/home/PriceTable";
import { FeaturedProducts } from "@/features/home/FeaturedProducts";
import { LatestArticles } from "@/features/home/LatestArticles";
import { WhyHyperAhan } from "@/features/home/WhyHyperAhan";
import { ContactExpertCta } from "@/features/home/ContactExpertCta";
import { HomeFooter } from "@/features/home/HomeFooter";
import type { BlogPostSummary, HomeCategory, PriceRow, Product } from "@/types";

type HomePageViewProps = {
  categories: HomeCategory[];
  prices: PriceRow[];
  featuredProducts: Product[];
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
