import { HomePageView } from "@/features/home/HomePageView";
import { homeService } from "@/services/homeService";
import { blogService } from "@/services/blogService";

// Pulls live blog articles from the backend on every request — must not be
// statically prerendered at build time (backend isn't reachable then).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, prices, featuredProducts, latestArticlesResult] =
    await Promise.all([
      homeService.getCategories(),
      homeService.getPrices(),
      homeService.getFeaturedProducts(),
      blogService.list({ pageSize: 3 }),
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
