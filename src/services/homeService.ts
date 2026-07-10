import {
  aboutCompanyText,
  bannersMock,
  homeCategoriesMock,
  journeyStepsMock,
  pricesMock,
  teamMembersMock,
  toArticleSummaries,
  articlesMock,
} from "@/mocks/home";
import type {
  ArticleSummary,
  Banner,
  HomeCategory,
  JourneyStep,
  PriceRow,
  TeamMember,
} from "@/types";

export const homeService = {
  getBanners(): Promise<Banner[]> {
    return Promise.resolve(bannersMock);
  },

  getCategories(): Promise<HomeCategory[]> {
    return Promise.resolve(homeCategoriesMock);
  },

  getPrices(): Promise<PriceRow[]> {
    return Promise.resolve(pricesMock);
  },

  getJourneySteps(): Promise<JourneyStep[]> {
    return Promise.resolve(journeyStepsMock);
  },

  getTeamMembers(): Promise<TeamMember[]> {
    return Promise.resolve(teamMembersMock);
  },

  getFeaturedArticles(): Promise<ArticleSummary[]> {
    return Promise.resolve(toArticleSummaries(articlesMock).slice(0, 3));
  },

  getAboutText(): Promise<string> {
    return Promise.resolve(aboutCompanyText);
  },
};
