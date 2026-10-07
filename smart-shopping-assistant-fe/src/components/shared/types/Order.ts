import {
  OrderStatus,
  PaymentMethod,
  type OrderModel,
} from "../../../api/models/OrderModel";

export { OrderStatus, PaymentMethod };

export function money(value: number): string {
  return `${value.toFixed(2)} RON`;
}

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  companyId: number;
  companyName: string;
  status: OrderStatus;
}

export interface Order {
  id: number;
  number: string;
  createdAt: Date;
  status: OrderStatus;
  canCancel: boolean;
  customerName: string;
  customerEmail: string;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  cardLast4: string | null;
  shippingFullName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingCounty: string;
  shippingPostalCode: string;
  notes: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  appliedPromotions: { name: string; discount: number }[];
  items: OrderItem[];
  itemCount: number;
}

export function toOrder(dto: OrderModel): Order {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    cardLast4: dto.cardLast4 ?? null,
    notes: dto.notes ?? "",
    items: dto.items.map((item) => ({
      ...item,
      productId: item.productId ?? null,
      imageUrl: item.imageUrl ?? "",
    })),
    itemCount: dto.items
      .filter((i) => i.status !== OrderStatus.Cancelled)
      .reduce((sum, i) => sum + i.quantity, 0),
  };
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: "Placed",
  [OrderStatus.Confirmed]: "Being prepared",
  [OrderStatus.Shipped]: "Shipped",
  [OrderStatus.Delivered]: "Delivered",
  [OrderStatus.Cancelled]: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<
  OrderStatus,
  "default" | "info" | "warning" | "success" | "error"
> = {
  [OrderStatus.Pending]: "warning",
  [OrderStatus.Confirmed]: "info",
  [OrderStatus.Shipped]: "info",
  [OrderStatus.Delivered]: "success",
  [OrderStatus.Cancelled]: "error",
};

export function paymentLabel(order: Order): string {
  if (order.paymentMethod === PaymentMethod.Card) {
    return `Card ending in ${order.cardLast4} · paid`;
  }
  return order.isPaid ? "Cash on delivery · paid" : "Cash on delivery";
}

export function formatDate(date: Date): string {
  return date.toLocaleString("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
