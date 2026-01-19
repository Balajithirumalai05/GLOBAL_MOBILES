export const getCart = ()=>{
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart):[];
};

export const saveCart = (cart)=>{
    localStorage.setItem("cart",JSON.stringify(cart));
};