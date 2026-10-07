import type { CartModel } from "../../../api/models/CartModel";

function money(value: number): string {
  return `${value.toFixed(2)} RON`;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  unitPriceLabel: string;
  quantity: number;
  subtotal: number;
  subtotalLabel: string;
  availableStock: number;
}

export interface AppliedPromotion {
  promotionId: number;
  promotionName: string;
  discount: number;
  discountLabel: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  subtotalLabel: string;
  appliedPromotions: AppliedPromotion[];
  totalDiscount: number;
  totalDiscountLabel: string;
  total: number;
  totalLabel: string;
  shippingCost: number;
  shippingLabel: string;
  freeShippingRemaining: number;
  freeShippingRemainingLabel: string;
  totalWithShipping: number;
  totalWithShippingLabel: string;
  itemCount: number;
}

export function toCartModel(dto: CartModel): Cart {
  return {
    items: dto.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.price,
      unitPriceLabel: money(item.price),
      quantity: item.quantity,
      subtotal: item.subtotal,
      subtotalLabel: money(item.subtotal),
      availableStock: item.availableStock,
    })),
    subtotal: dto.subtotal,
    subtotalLabel: money(dto.subtotal),
    appliedPromotions: dto.appliedPromotions.map((promotion) => ({
      promotionId: promotion.promotionId,
      promotionName: promotion.promotionName,
      discount: promotion.discount,
      discountLabel: money(promotion.discount),
    })),
    totalDiscount: dto.totalDiscount,
    totalDiscountLabel: money(dto.totalDiscount),
    total: dto.total,
    totalLabel: money(dto.total),
    shippingCost: dto.shippingCost,
    shippingLabel: dto.shippingCost === 0 ? "Free" : money(dto.shippingCost),
    freeShippingRemaining: dto.freeShippingRemaining,
    freeShippingRemainingLabel: money(dto.freeShippingRemaining),
    totalWithShipping: dto.totalWithShipping,
    totalWithShippingLabel: money(dto.totalWithShipping),
    itemCount: dto.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
