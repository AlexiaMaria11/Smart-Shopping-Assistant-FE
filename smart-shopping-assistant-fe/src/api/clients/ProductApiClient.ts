import { toProduct, type Product } from "../../components/shared/types/Product";
import { http } from "../base/http";
import type { ProductInput, ProductModel } from "../models/ProductModel";

export const productsApi = {
  getAll: async (filters: { companyId?: number } = {}): Promise<Product[]> => {
    const query = filters.companyId ? `?companyId=${filters.companyId}` : "";
    const data = await http.get<ProductModel[]>(`/products${query}`);
    return data.map(toProduct);
  },
  getManaged: async (): Promise<Product[]> => {
    const data = await http.get<ProductModel[]>("/products/manage");
    return data.map(toProduct);
  },
  create: async (data: ProductInput): Promise<Product> => {
    return toProduct(await http.post<ProductModel>("/products", data));
  },
  update: async (id: number, data: ProductInput): Promise<Product> => {
    return toProduct(await http.put<ProductModel>(`/products/${id}`, data));
  },
  remove: (id: number): Promise<void> => {
    return http.remove(`/products/${id}`);
  },
};
