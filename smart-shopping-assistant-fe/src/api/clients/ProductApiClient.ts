import { toProduct, type Product } from "../../components/shared/types/Product";
import { http } from "../base/http";
import type {
  PriceRangeModel,
  ProductInput,
  ProductModel,
  ProductSearchParams,
} from "../models/ProductModel";
import type { PagedResultModel } from "../models/PagedResultModel";

export interface PagedProducts {
  items: Product[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

function buildSearchQuery(params: ProductSearchParams): string {
  const query = new URLSearchParams();
  if (params.name) query.set("name", params.name);
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.inStockOnly) query.set("inStockOnly", "true");
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  params.categoryIds?.forEach((id) => query.append("categoryIds", String(id)));
  params.companyIds?.forEach((id) => query.append("companyIds", String(id)));
  return query.toString();
}

export const productsApi = {
  getAll: async (filters: { companyId?: number } = {}): Promise<Product[]> => {
    const query = filters.companyId ? `?companyId=${filters.companyId}` : "";
    const data = await http.get<ProductModel[]>(`/products${query}`);
    return data.map(toProduct);
  },
  search: async (params: ProductSearchParams): Promise<PagedProducts> => {
    const data = await http.get<PagedResultModel<ProductModel>>(
      `/products/search?${buildSearchQuery(params)}`,
    );
    return { ...data, items: data.items.map(toProduct) };
  },
  getPriceRange: () => http.get<PriceRangeModel>("/products/price-range"),
  getById: async (id: number): Promise<Product> => {
    return toProduct(await http.get<ProductModel>(`/products/${id}`));
  },
  getSimilar: async (id: number, take = 4): Promise<Product[]> => {
    const data = await http.get<ProductModel[]>(
      `/products/${id}/similar?take=${take}`,
    );
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
