import type { ProductModel } from "../../../api/models/ProductModel";
import { toCategory, type Category } from "./Category";

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
  };
}

// Below this many units the shop warns that the product is almost sold out
export const LOW_STOCK_THRESHOLD = 5;
