export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  availableStock: number;
}

export interface AppliedPromotion {
  promotionId: number;
  promotionName: string;
  discount: number;
}

export interface CartModel {
  items: CartItem[];
  subtotal: number;
  appliedPromotions: AppliedPromotion[];
  totalDiscount: number;
  total: number;
  shippingCost: number;
  freeShippingRemaining: number;
  totalWithShipping: number;
}

export interface AddCartItemInput {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
