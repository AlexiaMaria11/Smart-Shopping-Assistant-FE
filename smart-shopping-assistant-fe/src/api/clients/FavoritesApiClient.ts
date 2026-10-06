import { toProduct, type Product } from "../../components/shared/types/Product";
import { http } from "../base/http";
import type { ProductModel } from "../models/ProductModel";

export const favoritesApi = {
  getProducts: async (): Promise<Product[]> => {
    const data = await http.get<ProductModel[]>("/favorites");
    return data.map(toProduct);
  },
  getIds: () => http.get<number[]>("/favorites/ids"),
  add: (productId: number) => http.post<void>(`/favorites/${productId}`, {}),
  remove: (productId: number) => http.remove<void>(`/favorites/${productId}`),
};
