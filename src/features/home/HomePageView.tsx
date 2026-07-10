import { HeroSlider } from "@/features/home/HeroSlider";
import { CategoryGrid } from "@/features/home/CategoryGrid";
import { PriceTable } from "@/features/home/PriceTable";
import { UserJourney } from "@/features/home/UserJourney";
import { TeamSection } from "@/features/home/TeamSection";
import { ArticleCards } from "@/features/home/ArticleCards";
import { ExpandableText } from "@/features/home/ExpandableText";
import type {
  ArticleSummary,
  Banner,
  HomeCategory,
  JourneyStep,
  PriceRow,
  TeamMember,
} from "@/types";

type HomePageViewProps = {
  banners: Banner[];
  categories: HomeCategory[];
  prices: PriceRow[];
  steps: JourneyStep[];
  team: TeamMember[];
  articles: ArticleSummary[];
  aboutText: string;
};

export function HomePageView({
  banners,
  categories,
  prices,
  steps,
  team,
  articles,
  aboutText,
}: HomePageViewProps) {
  return (
    <div>
      <HeroSlider banners={banners} />
      <CategoryGrid categories={categories} />
      <PriceTable prices={prices} />
      <UserJourney steps={steps} />
      <TeamSection members={team} />
      <ArticleCards articles={articles} />
      <ExpandableText text={aboutText} />
    </div>
  );
}
