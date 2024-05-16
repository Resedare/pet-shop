export function getCart(cart) {
  return JSON.parse(localStorage.getItem(cart));
}

export function setCart(cart, id) {
  let cartData = JSON.parse(localStorage.getItem(cart)) || [];

  if (!cartData.includes(id)) {
    cartData.push(id);
    localStorage.setItem(cart, JSON.stringify(cartData));
  }
}
