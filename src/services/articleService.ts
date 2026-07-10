import { articlesMock } from "@/mocks/home";
import type { Article, ArticleSummary } from "@/types";
import { toArticleSummaries } from "@/mocks/home";

export const articleService = {
  getAll(): Promise<ArticleSummary[]> {
    return Promise.resolve(toArticleSummaries(articlesMock));
  },

  getById(id: string | number): Promise<Article | null> {
    const numericId = typeof id === "string" ? Number(id) : id;
    return Promise.resolve(articlesMock.find((a) => a.id === numericId) ?? null);
  },
};
