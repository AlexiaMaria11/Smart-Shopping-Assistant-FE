import type { CategoryModel } from "./CategoryModel";

export interface ProductModel {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  companyId: number;
  companyName: string;
  companySlug: string;
  categories?: CategoryModel[];
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  companyId: number;
  categoryIds?: number[];
}
