import type { ProductModel } from "../../../api/models/ProductModel";
import { toCategory, type Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
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
    imageUrl: dto.imageUrl ?? "",
    companyId: dto.companyId,
    companyName: dto.companyName,
    companySlug: dto.companySlug,
    categories: dto.categories?.map(toCategory) ?? [],
  };
}
