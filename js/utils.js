// Функция получения текущей валюты из localstorage
export function getCurrency(value) {
  return localStorage.getItem(value)
    ? localStorage.getItem(value)
    : localStorage.setItem(value, "₽");
}

// Функция установки валюты в localstorage
export function setCurrency(value, key) {
  localStorage.setItem(value, key);
}

// Функция получения данных корзины из localstorage
export function getCart(cart) {
  return JSON.parse(localStorage.getItem(cart)) || {};
}

// Функция получения кол-ва товаров в корзине
export function getUniqueCartItemCount(cart) {
  const cartData = getCart(cart);
  return Object.keys(cartData).length;
}

// Функция получения данных избранного из localstorage
export function getLiked(liked) {
  return JSON.parse(localStorage.getItem(liked));
}

// Функция добавления товара в localstorage
export function setCart(cart, id, quantity = 1) {
  let cartData = JSON.parse(localStorage.getItem(cart)) || {};
  if (cartData[id]) {
    cartData[id] += quantity;
  } else {
    cartData[id] = quantity;
  }
  localStorage.setItem(cart, JSON.stringify(cartData));
}

// Функция удаления товара из корзины
export function deleteCart(cart, id) {
  let cartData = getCart(cart);

  if (cartData[id]) {
    delete cartData[id];
    localStorage.setItem(cart, JSON.stringify(cartData));
  }
}

export function updateCartItemQuantity(cart, id, counter) {
  let cartData = getCart(cart);

  cartData[id] = counter;
  localStorage.setItem(cart, JSON.stringify(cartData));
}
// Функция валидации товаров (проверка наличия товара из корзины в data)
export function checkValidity(data, cart, liked) {
  let cartData = getCart(cart) ? getCart(cart) : {};
  for (let id in cartData) {
    const availableItems = data.some((item) => item.id === Number(id));
    if (!availableItems) {
      delete cartData[id];
    }
  }
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
