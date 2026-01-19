export const getGuestCart = () =>
  JSON.parse(localStorage.getItem("cart") || "[]");

export const addToGuestCart = (product) => {
  const cart = getGuestCart();
  const item = cart.find(i => i.id === product.id);

  if (item) item.qty += 1;
  else cart.push({ ...product, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
};

export const removeFromGuestCart = (productId) => {
  const cart = getGuestCart().filter(i => i.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const clearGuestCart = () => {
  localStorage.removeItem("cart");
};
