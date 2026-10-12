export interface StatsPeriodModel {
  revenue: number;
  orderCount: number;
}

export interface TopProductModel {
  productId: number | null;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface TopCategoryModel {
  categoryId: number;
  categoryName: string;
  quantitySold: number;
  revenue: number;
}

export interface SellerStatsModel {
  today: StatsPeriodModel;
  last30Days: StatsPeriodModel;
  allTime: StatsPeriodModel;
  topProducts: TopProductModel[];
}

export interface AdminStatsModel extends SellerStatsModel {
  topCategories: TopCategoryModel[];
}
