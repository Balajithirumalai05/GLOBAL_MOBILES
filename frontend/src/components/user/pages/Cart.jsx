import { useEffect, useState } from "react";
import api from "../../../api";
import { useAuth } from "../../../context/AuthContext";
import {
  getGuestCart,
  removeFromGuestCart
} from "../../../utils/cart";

export default function Cart() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const loadCart = async () => {
    if (user) {
      const res = await api.get("/cart");
      setItems(res.data);
    } else {
      setItems(getGuestCart());
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  /* ================= DELETE ITEM ================= */
  const removeItem = async (item) => {
    if (!user) {
      removeFromGuestCart(item.id);
      setItems(getGuestCart());
      return;
    }

    await api.delete(`/cart/remove/${item.product_id}`);
    loadCart();
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Cart</h1>

      {items.length === 0 && (
        <p className="text-gray-500">Your cart is empty</p>
      )}

      {items.map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center border-b py-3"
        >
          <div>
            <div className="font-medium">
              {item.name || `Product #${item.product_id}`}
            </div>
            <div className="text-sm text-gray-500">
              Qty: {item.qty || item.quantity}
            </div>
          </div>

          <button
            onClick={() => removeItem(item)}
            className="text-red-600 hover:text-red-700 text-sm"
          >
            ❌ Remove
          </button>
        </div>
      ))}
    </div>
  );
}
