import { productsMock } from "@/mocks/products";
import type { Product } from "@/types";

export const productService = {
  getAll(): Promise<Product[]> {
    return Promise.resolve(productsMock);
  },

  getById(id: string | number): Promise<Product | null> {
    const numericId = typeof id === "string" ? Number(id) : id;
    const product = productsMock.find((p) => p.id === numericId) ?? null;
    return Promise.resolve(product);
  },
};
