import type { CategoryModel } from "./CategoryModel";

export interface ProductImageModel {
  id: number;
  url: string;
  altText?: string;
  isMain: boolean;
}

export interface ProductModel {
  id: number;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  companyId: number;
  companyName: string;
  companySlug: string;
  categories?: CategoryModel[];
  images?: ProductImageModel[];
}

export interface ProductImageInput {
  // 0 for an image that is being added
  id: number;
  url: string;
  altText?: string;
  isMain: boolean;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  companyId: number;
  categoryIds?: number[];
  images?: ProductImageInput[];
}
