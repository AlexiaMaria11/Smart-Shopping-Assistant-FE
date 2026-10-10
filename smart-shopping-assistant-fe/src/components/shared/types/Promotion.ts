import {
  PromotionReward,
  PromotionType,
  type PromotionModel,
} from "../../../api/models/PromotionModel";

export { PromotionType, PromotionReward };

export interface Promotion {
  id: number;
  name: string;
  type: PromotionType;
  threshold: number;
  reward: PromotionReward;
  rewardValue: number;
  productId: number | null;
  categoryId: number | null;
  companyId: number | null;
  isActive: boolean;
}

export function toPromotion(dto: PromotionModel): Promotion {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    threshold: dto.threshold,
    reward: dto.reward,
    rewardValue: dto.rewardValue,
    productId: dto.productId ?? null,
    categoryId: dto.categoryId ?? null,
    companyId: dto.companyId ?? null,
    isActive: dto.isActive,
  };
}

export const PROMOTION_TYPE_LABELS: Record<PromotionType, string> = {
  [PromotionType.Quantity]: "Quantity",
  [PromotionType.CartTotal]: "Cart Total",
};

export const PROMOTION_REWARD_LABELS: Record<PromotionReward, string> = {
  [PromotionReward.FreeItems]: "Free Items",
  [PromotionReward.PercentDiscount]: "Percent Discount",
};

// A plain-language summary of what the customer has to do and what they get,
// used where the promotion is shown to customers (the product page).
export function promotionDescription(promotion: Promotion): string {
  const condition =
    promotion.type === PromotionType.Quantity
      ? `Buy ${promotion.threshold} or more`
      : `Spend ${promotion.threshold.toFixed(2)} RON or more`;

  const reward =
    promotion.reward === PromotionReward.PercentDiscount
      ? `get ${promotion.rewardValue}% off`
      : `get ${promotion.rewardValue} free`;

  return `${condition} and ${reward}.`;
}
