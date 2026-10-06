import { createContext, useContext } from "react";
import type { Cart } from "../../components/shared/types/Cart";

export interface CartContextValue {
  cart: Cart | null;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Resolves to false when the user had to be sent to the login page first
  addItem: (productId: number, quantity: number) => Promise<boolean>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeProduct: (itemId: number) => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
