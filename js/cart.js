import { setCart, getCart } from "./utils.js";
const cartCounter = document.querySelector(".cart__count");
let productsData = [];

getProducts();

async function getProducts() {
  const res = await fetch("assets/data/data.json");
  if (!res.ok) {
    alert("Ошибка " + res.status);
    return;
  }
  productsData = await res.json();
  renderCart(productsData);
}

function renderCart(data) {
  const currentCart = getCart("cart");
  const cards = document.querySelector(".cards");
  cartCounter.textContent = getCart("cart") ? getCart("cart").length : 0;

  data.forEach((dataItem) => {
    if (currentCart.includes(String(dataItem.id))) {
      const { name, price, discount, img } = dataItem;
      const priceWithDiscount = price - (price * discount) / 100;
      let counter = 1;

      const cardItem = `
              <div class="cards__item">
              <div class="card-info">
                  <img class="card-info__image" src="assets/images/${img}.png" alt="Картинка товара">
                  <div class="card-counter">
                      <button class="counter__btn counter-minus">-</button>
                      <span class="counter-current">${counter}</span>
                      <button class="counter__btn counter-plus">+</button>
                  </div>
              </div>
              <div class="card-info__text">
                  <h2 class="card-name">${name}</h2>
                  <p class="card-price">${priceWithDiscount} ₽</p>
              </div>
              <div class="card-info__total">
                  <button class="card-delete"><img src="assets/icons/delete.svg" alt="Удалить"></button>
                  <p class="card-total-price">${priceWithDiscount} ₽</p>
              </div>
          </div>
                            `;
      cards.insertAdjacentHTML("beforeend", cardItem);
    }
  });
}
cartCounter.textContent = getCart("cart").length;
