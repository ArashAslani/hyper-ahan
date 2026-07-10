import { HomePageView } from "@/features/home/HomePageView";
import { homeService } from "@/services/homeService";

export default async function HomePage() {
  const [banners, categories, prices, steps, team, articles, aboutText] =
    await Promise.all([
      homeService.getBanners(),
      homeService.getCategories(),
      homeService.getPrices(),
      homeService.getJourneySteps(),
      homeService.getTeamMembers(),
      homeService.getFeaturedArticles(),
      homeService.getAboutText(),
    ]);

  return (
    <HomePageView
      banners={banners}
      categories={categories}
      prices={prices}
      steps={steps}
      team={team}
      articles={articles}
      aboutText={aboutText}
    />
  );
}
