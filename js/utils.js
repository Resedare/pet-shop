export function getCurrency(value) {
  return localStorage.getItem(value)
    ? localStorage.getItem(value)
    : localStorage.setItem(value, "₽");
}

export function setCurrency(value, key) {
  localStorage.setItem(value, key);
}

// Функция получения данных корзины из localstorage
export function getCart(cart) {
  return JSON.parse(localStorage.getItem(cart));
}
// Функция получения данных избранного из localstorage
export function getLiked(liked) {
  return JSON.parse(localStorage.getItem(liked));
}

// Функция добавления товара в localstorage
export function setCart(cart, id) {
  let cartData = JSON.parse(localStorage.getItem(cart)) || [];
  if (!cartData.includes(id)) {
    cartData.push(id);
    localStorage.setItem(cart, JSON.stringify(cartData));
  }
}

// Функция удаления товара из корзины
export function deleteCart(cart, id) {
  let cartData = getCart(cart);

  if (cartData.includes(id)) {
    cartData.splice(cartData.indexOf(id), 1);
    localStorage.setItem(cart, JSON.stringify(cartData));
  }
}

// Функция валидации товаров (проверка наличия товара из корзины в data)
export function checkValidity(data, cart, liked) {
  let cartData = getCart(cart) ? getCart(cart) : [];
  cartData.forEach((cartId, index) => {
    const availableItems = data.some((item) => item.id === Number(cartId));
    if (!availableItems) {
      cartData.splice(index, 1);
    }
  });
  localStorage.setItem(cart, JSON.stringify(cartData));

  let likedData = getLiked(liked) ? getLiked(liked) : [];
  likedData.forEach((likedId, index) => {
    const availableItems = data.some((item) => item.id === Number(likedId));
    if (!availableItems) {
      likedData.splice(index, 1);
    }
  });
  localStorage.setItem(liked, JSON.stringify(likedData));
}

// Функция добавления в избранное
export function likeProduct(liked, id) {
  let likeData = JSON.parse(localStorage.getItem(liked)) || [];
  if (!likeData.includes(id)) {
    likeData.push(id);
    localStorage.setItem(liked, JSON.stringify(likeData));
  } else {
    likeData.splice(likeData.indexOf(id), 1);
    localStorage.setItem(liked, JSON.stringify(likeData));
  }
}
