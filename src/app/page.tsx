import { HomePageView } from "@/features/home/HomePageView";
import { homeService } from "@/services/homeService";

export default async function HomePage() {
  const [banners, categories, prices] = await Promise.all([
    homeService.getBanners(),
    homeService.getCategories(),
    homeService.getPrices(),
  ]);

  return (
    <HomePageView banners={banners} categories={categories} prices={prices} />
  );
}
