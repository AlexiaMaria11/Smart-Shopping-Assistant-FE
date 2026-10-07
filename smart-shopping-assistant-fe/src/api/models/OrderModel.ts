export const OrderStatus = {
  Pending: 0,
  Confirmed: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 4,
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentMethod = {
  Card: 0,
  CashOnDelivery: 1,
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export interface OrderItemModel {
  id: number;
  productId?: number;
  productName: string;
  imageUrl?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  companyId: number;
  companyName: string;
  status: OrderStatus;
}

export interface OrderModel {
  id: number;
  number: string;
  createdAt: string;
  status: OrderStatus;
  canCancel: boolean;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  cardLast4?: string;
  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCounty: string;
  shippingPostalCode: string;
  notes?: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  appliedPromotions: { name: string; discount: number }[];
  items: OrderItemModel[];
}

export interface CardInput {
  holderName: string;
  number: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

export interface CheckoutInput {
  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCounty: string;
  shippingPostalCode: string;
  notes?: string;
  paymentMethod: PaymentMethod;
  card?: CardInput;
}
