import { categoriesData } from "@/mocks/categories";
import { weightCalcData } from "@/mocks/weightCalc";
import type { CategoryNode, WeightCalcItem } from "@/types";

export const catalogNavService = {
  getCategories(): Promise<CategoryNode[]> {
    return Promise.resolve(categoriesData);
  },

  getWeightCalcItems(): Promise<WeightCalcItem[]> {
    return Promise.resolve(weightCalcData);
  },
};
