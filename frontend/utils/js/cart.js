// utils/js/cart.js
export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    // Dispatch custom event to notify all components
    window.dispatchEvent(new CustomEvent("cartUpdated", { 
      detail: { cart, timestamp: Date.now() } 
    }));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const addToCart = (product) => {
  const cart = getCart();
  const existingIndex = cart.findIndex((item) => item.id === product.id);
  
  if (existingIndex !== -1) {
    // Update existing item quantity
    cart[existingIndex] = {
      ...cart[existingIndex],
      qty: (cart[existingIndex].qty || 1) + 1
    };
  } else {
    // Add new item to cart
    cart.push({ ...product, qty: 1 });
  }
  
  saveCart(cart);
  return cart;
};

export const updateCartItemQty = (productId, newQty) => {
  const cart = getCart();
  const updatedCart = cart.map((item) => 
    item.id === productId ? { ...item, qty: Math.max(0, newQty) } : item
  ).filter(item => item.qty > 0); // Remove items with 0 quantity
  
  saveCart(updatedCart);
  return updatedCart;
};

export const removeFromCart = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
  return updatedCart;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};

export const getCartTotal = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * (item.qty || 1)), 0);
};

export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.qty || 1), 0);
};