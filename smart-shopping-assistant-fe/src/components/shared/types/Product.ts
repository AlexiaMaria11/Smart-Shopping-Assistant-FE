import type {
  ProductImageModel,
  ProductModel,
} from "../../../api/models/ProductModel";
import { toCategory, type Category } from "./Category";

export interface ProductImage {
  id: number;
  url: string;
  altText: string;
  isMain: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  companyId: number;
  companyName: string;
  companySlug: string;
  categories: Category[];
  images: ProductImage[];
}

export function toProductImage(dto: ProductImageModel): ProductImage {
  return {
    id: dto.id,
    url: dto.url,
    altText: dto.altText ?? "",
    isMain: dto.isMain,
  };
}

export function toProduct(dto: ProductModel): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    price: dto.price,
    stockQuantity: dto.stockQuantity,
    imageUrl: dto.imageUrl ?? "",
    companyId: dto.companyId,
    companyName: dto.companyName,
    companySlug: dto.companySlug,
    categories: dto.categories?.map(toCategory) ?? [],
    images: dto.images?.map(toProductImage) ?? [],
  };
}

// The pictures to show on the product page: the gallery, or the single image of
// a product that was created before galleries existed
export function galleryOf(product: Product): ProductImage[] {
  if (product.images.length > 0) return product.images;
  if (product.imageUrl === "") return [];
  return [{ id: 0, url: product.imageUrl, altText: product.name, isMain: true }];
}

// Below this many units the shop warns that the product is almost sold out
export const LOW_STOCK_THRESHOLD = 5;

// A product can have at most this many pictures (the server enforces it too)
export const MAX_PRODUCT_IMAGES = 8;
