import { HomePageView } from "@/features/home/HomePageView";
import { homeService } from "@/services/homeService";
import { blogService } from "@/services/blogService";
import type { BlogListResult } from "@/types";

// Pulls live blog articles from the backend on every request — must not be
// statically prerendered at build time (backend isn't reachable then).
export const dynamic = "force-dynamic";

const EMPTY_ARTICLES: BlogListResult = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 3,
  totalPages: 1,
};

export default async function HomePage() {
  const [categories, prices, featuredProducts, latestArticlesResult] =
    await Promise.all([
      homeService.getCategories().catch(() => []),
      homeService.getPrices().catch(() => []),
      homeService.getFeaturedProducts().catch(() => []),
      // Blog is non-critical for Home — degrade to empty when backend is down.
      blogService.list({ pageSize: 3 }).catch(() => EMPTY_ARTICLES),
    ]);

  return (
    <HomePageView
      categories={categories}
      prices={prices}
      featuredProducts={featuredProducts}
      latestArticles={latestArticlesResult.items}
    />
  );
}
