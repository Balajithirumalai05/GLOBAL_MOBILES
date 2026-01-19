import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";
import { getGuestCart } from "../utils/cart";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  // 🔥 LOAD CART WHEN USER CHANGES
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    if (!user) {
      setItems(getGuestCart());
    } else {
      const res = await api.get("/cart");
      setItems(res.data);
    }
  };

  const refreshCart = () => loadCart();

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount: items.reduce(
          (s, i) => s + (i.qty || i.quantity),
          0
        ),
        refreshCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
