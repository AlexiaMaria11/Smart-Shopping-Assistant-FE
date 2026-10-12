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
  averageRating?: number;
  reviewCount?: number;
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

// Matches the backend's ProductSortOption enum names exactly
export const ProductSortOption = {
  PriceAsc: "PriceAsc",
  PriceDesc: "PriceDesc",
  NameAsc: "NameAsc",
  NameDesc: "NameDesc",
} as const;
export type ProductSortOption =
  (typeof ProductSortOption)[keyof typeof ProductSortOption];

export interface ProductSearchParams {
  name?: string;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  companyIds?: number[];
  inStockOnly?: boolean;
  sort?: ProductSortOption;
  page?: number;
  pageSize?: number;
}

export interface PriceRangeModel {
  min: number;
  max: number;
}
