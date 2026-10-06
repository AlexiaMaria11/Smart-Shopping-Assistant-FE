import {
  toPromotion,
  type Promotion,
} from "../../components/shared/types/Promotion";
import { http } from "../base/http";
import type { PromotionInput, PromotionModel } from "../models/PromotionModel";

export const promotionsApi = {
  getAll: async (): Promise<Promotion[]> => {
    const data = await http.get<PromotionModel[]>("/promotions");
    return data.map(toPromotion);
  },
  getManaged: async (): Promise<Promotion[]> => {
    const data = await http.get<PromotionModel[]>("/promotions/manage");
    return data.map(toPromotion);
  },
  create: async (data: PromotionInput): Promise<Promotion> => {
    return toPromotion(await http.post<PromotionModel>("/promotions", data));
  },
  update: async (id: number, data: PromotionInput): Promise<Promotion> => {
    return toPromotion(
      await http.put<PromotionModel>(`/promotions/${id}`, data)
    );
  },
  remove: (id: number): Promise<void> => {
    return http.remove(`/promotions/${id}`);
  },
};
