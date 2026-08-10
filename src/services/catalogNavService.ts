import { catalogService } from "@/services/catalogService";
import { calculationToolService } from "@/services/calculationToolService";
import type { CategoryNode, WeightCalcItem } from "@/types";
import type { CatalogCategory } from "@/types/catalog";

function toNavNode(category: CatalogCategory): CategoryNode {
  return {
    id: category.id,
    name: category.name,
    children: (category.children ?? []).map(toNavNode),
  };
}

export const catalogNavService = {
  async getCategories(): Promise<CategoryNode[]> {
    try {
      const tree = await catalogService.getCategoryTree();
      return tree.map(toNavNode);
    } catch {
      return [];
    }
  },

  async getWeightCalcItems(): Promise<WeightCalcItem[]> {
    try {
      const tools = await calculationToolService.list();
      return tools.map((t) => ({ name: t.title, slug: t.slug }));
    } catch {
      return [];
    }
  },
};
