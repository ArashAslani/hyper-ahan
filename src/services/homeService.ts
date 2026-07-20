import {
  aboutCompanyText,
  homeCategoriesMock,
  journeyStepsMock,
  pricesMock,
  teamMembersMock,
  toArticleSummaries,
  articlesMock,
} from "@/mocks/home";
import { productsMock } from "@/mocks/products";
import type {
  ArticleSummary,
  HomeCategory,
  JourneyStep,
  PriceRow,
  Product,
  TeamMember,
} from "@/types";

/** No `featured` flag exists on Product yet — pick a fixed subset for the Home page. */
const FEATURED_PRODUCT_IDS = [1, 3, 5, 6];

export const homeService = {
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

  getFeaturedProducts(): Promise<Product[]> {
    return Promise.resolve(
      productsMock.filter((product) => FEATURED_PRODUCT_IDS.includes(product.id)),
    );
  },

  getAboutText(): Promise<string> {
    return Promise.resolve(aboutCompanyText);
  },
};
