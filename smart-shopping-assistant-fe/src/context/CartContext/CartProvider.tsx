import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Cart } from "../../components/shared/types/Cart";
import { cartApi } from "../../api/clients/CartApiClient";
import { useAuth } from "../AuthContext/auth-context";
import { CartContext } from "./cart-context";

interface UserCart {
  userId: number;
  cart: Cart;
}

function CartProvider({ children }: { children: ReactNode }) {
  const [userCart, setUserCart] = useState<UserCart | null>(null);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?.id ?? null;
  // Never show the previous user's cart after signing out or switching accounts
  const cart = userCart !== null && userCart.userId === userId ? userCart.cart : null;

  const loadCart = useCallback(() => {
    if (userId === null) return;
    cartApi
      .get()
      .then((data) => setUserCart({ userId, cart: data }))
      .catch(() => {});
  }, [userId]);

  function requireLogin(): boolean {
    if (userId !== null) return true;
    setOpen(false);
    navigate("/login", { state: { from: location.pathname } });
    return false;
  }

  async function addItem(productId: number, quantity: number) {
    if (!requireLogin()) return false;
    await cartApi.addItem({ productId, quantity });
    loadCart();
    return true;
  }

  async function updateQuantity(itemId: number, quantity: number) {
    await cartApi.updateItem(itemId, { quantity });
    loadCart();
  }

  async function removeProduct(itemId: number) {
    await cartApi.removeItem(itemId);
    loadCart();
  }

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  return (
    <CartContext.Provider
      value={{
        cart: cart,
        open: open,
        openCart: () => {
          if (requireLogin()) setOpen(true);
        },
        closeCart: () => setOpen(false),
        addItem: addItem,
        updateQuantity: updateQuantity,
        removeProduct: removeProduct,
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
