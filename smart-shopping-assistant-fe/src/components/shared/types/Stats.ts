import type {
  AdminStatsModel,
  SellerStatsModel,
  StatsPeriodModel,
  TopCategoryModel,
  TopProductModel,
} from "../../../api/models/StatsModel";

export type StatsPeriod = StatsPeriodModel;
export type TopProduct = TopProductModel;
export type TopCategory = TopCategoryModel;
export type SellerStats = SellerStatsModel;
export type AdminStats = AdminStatsModel;

export function toSellerStats(dto: SellerStatsModel): SellerStats {
  return dto;
}

export function toAdminStats(dto: AdminStatsModel): AdminStats {
  return dto;
}
