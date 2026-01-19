import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api";
import { getGuestCart, removeFromGuestCart } from "../../../utils/cart";

import { ShoppingCart, User, Plus, Minus, Trash2 } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [openCart, setOpenCart] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [selected, setSelected] = useState({});

  const cartRef = useRef(null);
  const profileRef = useRef(null);

  /* ================= LOAD CART ================= */
  const loadCart = async () => {
    if (!user) {
      const cart = getGuestCart();
      setCartItems(cart);
      setCartCount(cart.reduce((s, i) => s + (i.qty || 1), 0));

      const sel = {};
      cart.forEach((i) => (sel[`${i.id}-${i.selected_type || "default"}`] = true));
      setSelected(sel);
    } else {
      const res = await api.get("/cart");
      setCartItems(res.data);
      setCartCount(res.data.reduce((s, i) => s + (i.quantity || 1), 0));

      const sel = {};
      res.data.forEach((i) => {
        sel[`${i.product_id}-${i.type_name || "default"}`] = true;
      });
      setSelected(sel);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (item) => {
    if (!user) {
      removeFromGuestCart(item.id, item.selected_type); // ✅ update util also
    } else {
      // ✅ remove should include type_name
      await api.delete(`/cart/remove/${item.product_id}`, {
        data: { type_name: item.type_name },
      });
    }
    loadCart();
  };

  /* ================= QUANTITY ================= */
  const updateQty = async (item, delta) => {
    if (!user) {
      const cart = getGuestCart();
      const i = cart.find(
        (p) => p.id === item.id && p.selected_type === item.selected_type
      );
      if (!i) return;
      i.qty = Math.max(1, (i.qty || 1) + delta);
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      await api.post("/cart/update", {
        product_id: item.product_id,
        type_name: item.type_name,
        delta,
      });
    }
    loadCart();
  };

  /* ================= TOTAL ================= */
  const totalAmount = cartItems.reduce((sum, item) => {
    const key = user
      ? `${item.product_id}-${item.type_name || "default"}`
      : `${item.id}-${item.selected_type || "default"}`;

    if (!selected[key]) return 0;

    const qty = item.qty || item.quantity || 1;
    return sum + (item.price || 0) * qty;
  }, 0);

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setOpenCart(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setOpenProfile(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setOpenProfile(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src="/assets/logo.png" alt="Logo" className="h-20 object-contain" />
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex gap-10 font-semibold text-gray-700">
          {["Home", "Categories", "Products", "About", "Contact"].map((l) => (
            <Link
              key={l}
              to={l === "Home" ? "/" : `/${l.toLowerCase()}`}
              className="relative hover:text-gray-900"
            >
              {l}
              <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-brand-yellow transition-all hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* CART */}
          <div className="relative" ref={cartRef}>
            <button
              onClick={() => setOpenCart(!openCart)}
              className="relative p-3 rounded-full border border-gray-300 text-brand-yellow hover:bg-gray-100"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-yellow text-black text-xs font-bold px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {openCart && (
              <div className="absolute right-0 mt-4 w-96 bg-white rounded-xl shadow-xl flex flex-col">
                {/* ITEMS */}
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                  {cartItems.length === 0 && (
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                  )}

                  {cartItems.map((item) => {
                    const id = item.id || item.product_id;
                    const qty = item.qty || item.quantity || 1;

                    const typeName = item.selected_type || item.type_name || "";
                    const imagePath = item.type_image || item.image || "";

                    const key = user
                      ? `${id}-${item.type_name || "default"}`
                      : `${id}-${item.selected_type || "default"}`;

                    return (
                      <div key={key} className="flex items-start gap-3 border-b pb-3">
                        {/* CHECKBOX */}
                        <input
                          type="checkbox"
                          checked={!!selected[key]}
                          onChange={() => setSelected({ ...selected, [key]: !selected[key] })}
                          className="mt-2 accent-yellow-500"
                        />

                        {/* IMAGE */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden border bg-gray-100 flex-shrink-0">
                          <img
                            src={
                              imagePath
                                ? `http://localhost:8000/${imagePath}`
                                : "https://via.placeholder.com/100x100?text=No+Image"
                            }
                            alt="cart"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* INFO */}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 truncate">
                            {item.name || `Product #${id}`}
                          </div>

                          {/* TYPE */}
                          {typeName && (
                            <div className="mt-1 inline-flex px-2 py-1 rounded-full bg-[#9d4edd]/10 text-[#9d4edd] text-xs font-extrabold">
                              {typeName.toUpperCase()}
                            </div>
                          )}

                          {/* QTY */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item, -1)}
                              className="p-1 border rounded"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-semibold">{qty}</span>
                            <button
                              onClick={() => updateQty(item, 1)}
                              className="p-1 border rounded"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* REMOVE */}
                        <button
                          onClick={() => removeItem(item)}
                          className="text-red-600 hover:text-red-700 mt-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t bg-white sticky bottom-0 space-y-3">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-brand-yellow">₹ {totalAmount}</span>
                  </div>

                  <button
                    disabled={totalAmount === 0}
                    onClick={() => navigate("/checkout")}
                    className={`w-full py-3 rounded-lg font-bold transition
                      ${
                        totalAmount === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-brand-yellow text-black hover:opacity-90"
                      }`}
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setOpenProfile(!openProfile)}
              className="p-3 rounded-full border border-gray-300 text-brand-yellow hover:bg-gray-100"
            >
              <User size={20} />
            </button>

            {openProfile && (
              <div className="absolute right-0 mt-4 w-48 bg-white rounded-xl shadow-xl text-sm overflow-hidden">
                {!user ? (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full px-4 py-3 hover:bg-gray-100 text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full px-4 py-3 hover:bg-gray-100 text-left"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 font-semibold border-b">
                      Welcome, {user.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-red-600 hover:bg-gray-100 text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
