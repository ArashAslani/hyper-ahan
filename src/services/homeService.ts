import {
  aboutCompanyText,
  journeyStepsMock,
  teamMembersMock,
  toArticleSummaries,
  articlesMock,
} from "@/mocks/home";
import { catalogService } from "@/services/catalogService";
import type {
  ArticleSummary,
  HomeCategory,
  JourneyStep,
  PriceRow,
  TeamMember,
} from "@/types";
import type { CatalogProduct } from "@/types/catalog";

export const homeService = {
  async getCategories(): Promise<HomeCategory[]> {
    try {
      const tree = await catalogService.getCategoryTree();
      return tree.slice(0, 8).map((c) => ({
        id: c.id,
        name: c.name,
      }));
    } catch {
      return [];
    }
  },

  /** No public price-board API in contracts — soft-empty. */
  getPrices(): Promise<PriceRow[]> {
    return Promise.resolve([]);
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

  /**
   * No dedicated “featured products” endpoint — sample from first root category.
   */
  async getFeaturedProducts(): Promise<CatalogProduct[]> {
    try {
      const roots = await catalogService.getCategoryTree();
      const first = roots[0];
      if (!first) return [];
      const products = await catalogService.getProductsByCategory(first.id);
      return products.slice(0, 4);
    } catch {
      return [];
    }
  },

  getAboutText(): Promise<string> {
    return Promise.resolve(aboutCompanyText);
  },
};
