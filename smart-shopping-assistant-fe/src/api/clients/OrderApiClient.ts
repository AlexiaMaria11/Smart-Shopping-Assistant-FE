import { toOrder, type Order } from "../../components/shared/types/Order";
import {
  toAdminStats,
  toSellerStats,
  type AdminStats,
  type SellerStats,
} from "../../components/shared/types/Stats";
import { http } from "../base/http";
import type {
  CheckoutInput,
  OrderModel,
  OrderStatus,
} from "../models/OrderModel";
import type { AdminStatsModel, SellerStatsModel } from "../models/StatsModel";

export const ordersApi = {
  place: async (data: CheckoutInput): Promise<Order> => {
    return toOrder(await http.post<OrderModel>("/orders", data));
  },
  getMine: async (): Promise<Order[]> => {
    return (await http.get<OrderModel[]>("/orders/mine")).map(toOrder);
  },
  getForSeller: async (): Promise<Order[]> => {
    return (await http.get<OrderModel[]>("/orders/seller")).map(toOrder);
  },
  getSellerStats: async (): Promise<SellerStats> => {
    return toSellerStats(await http.get<SellerStatsModel>("/orders/seller/stats"));
  },
  getAdminStats: async (): Promise<AdminStats> => {
    return toAdminStats(await http.get<AdminStatsModel>("/orders/admin/stats"));
  },
  getAll: async (): Promise<Order[]> => {
    return (await http.get<OrderModel[]>("/orders")).map(toOrder);
  },
  getById: async (id: number): Promise<Order> => {
    return toOrder(await http.get<OrderModel>(`/orders/${id}`));
  },
  cancel: async (id: number): Promise<Order> => {
    return toOrder(await http.post<OrderModel>(`/orders/${id}/cancel`, {}));
  },
  updateStatus: async (
    id: number,
    status: OrderStatus,
    companyId?: number,
  ): Promise<Order> => {
    const query = companyId ? `?companyId=${companyId}` : "";
    return toOrder(
      await http.put<OrderModel>(`/orders/${id}/status${query}`, { status }),
    );
  },
};
