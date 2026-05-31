import type { ProductModel } from "../../../api/models/ProductModel";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export function toProduct(dto: ProductModel): Product {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? "",
    price: dto.price,
    imageUrl: dto.imageUrl ?? "",
  };
}
