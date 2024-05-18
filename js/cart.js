import { getCart, getLiked, deleteCart, checkValidity } from "./utils.js";
const cartCounter = document.querySelector(".cart__count");
const likedCounter = document.querySelector(".liked__count");
const cart = document.querySelector(".cart");

let productsData = [];

// Получаем данные и тут же вызываем функцию
getProducts();
async function getProducts() {
  const res = await fetch("assets/data/data.json");
  if (!res.ok) {
    alert("Ошибка " + res.status);
    return;
  }
  productsData = await res.json();
  renderCart(productsData);
  checkValidity(productsData, "cart", "liked");
  cartCounter.textContent = getCart("cart") ? getCart("cart").length : 0;
  likedCounter.textContent = getLiked("liked") ? getLiked("liked").length : 0;
}

// Рендер страницы корзины
function renderCart(data) {
  const currentCart = getCart("cart");
  cart.innerHTML = "";
  // Рендер корзины, если есть товар
  if (currentCart && currentCart.length > 0) {
    const cartInner = `
      <div class="container">
              <div class="cart__inner">
                  <h1 class="cart__title">Корзина</h1>
                  <div class="cart__sections">
                      <div class="cards">
                      </div>
                      <div class="total">
                          <div class="total__price">
                              <p class="price-text">Итого</p>
                              <span class="price-number"></span>
                          </div>
                          <button class="order__btn">Перейти к оформлению</button>
                      </div>
                  </div>
              </div>
          </div>
          `;
    cart.insertAdjacentHTML("beforeend", cartInner);
    const cards = document.querySelector(".cards");
    let priceNumber = document.querySelector(".price-number");
    let totalPrice = 0;

    // Проходимся по data файлу в поисках объектов с ID, которые есть в localstorage
    data.forEach((dataItem) => {
      if (currentCart.includes(String(dataItem.id))) {
        const { id, name, price, discount, img } = dataItem;
        const priceWithDiscount = price - (price * discount) / 100;
        let counter = 1;
        const cardItem = `
                <div class="cards__item" data-id="${id}">
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

        totalPrice += priceWithDiscount;
        updateTotalPrice(totalPrice);

        // Счетчик количества товаров
        const cardElement = document.querySelector(
          `.cards__item[data-id="${id}"]`
        );
        const minusBtn = cardElement.querySelector(".counter-minus");
        const plusBtn = cardElement.querySelector(".counter-plus");
        const currentCounter = cardElement.querySelector(".counter-current");
        const counterPrice = cardElement.querySelector(".card-total-price");
        const deleteBtn = cardElement.querySelector(".card-delete");

        plusBtn.addEventListener("click", () => {
          counter++;
          currentCounter.textContent = counter;
          const newPrice = priceWithDiscount * counter;
          totalPrice += priceWithDiscount;
          counterPrice.textContent = `${newPrice} ₽`;
          updateTotalPrice(totalPrice);
        });
        minusBtn.addEventListener("click", () => {
          if (counter > 1) {
            counter--;
            currentCounter.textContent = counter;
            const newPrice = priceWithDiscount * counter;
            totalPrice -= priceWithDiscount;
            counterPrice.textContent = `${newPrice} ₽`;
            updateTotalPrice(totalPrice);
          }
        });

        // Удаление из корзины
        deleteBtn.addEventListener("click", (e) => {
          const target = e.target.closest(".cards__item");
          deleteCart("cart", target.dataset.id);
          cartCounter.textContent = getCart("cart")
            ? getCart("cart").length
            : 0;

          renderCart(data);
        });
      }
      function updateTotalPrice(price) {
        priceNumber.textContent = `${price} ₽`;
      }
    });

    // Если корзина пустая, рендерим страницу пустой корзины
  } else {
    const cartInner = `
      <div class="container">
              <div class="empty-cart__inner">
                  <img src="assets/images/Cart.png" alt="Тележка" class="empty-cart__image">
                  <h2 class="empty-cart__title">Корзина пуста</h2>
                  <p class="empty-cart__text">Но это никогда не поздно исправить :)</p>
                  <a href="/" class="back-to-shop">В каталог товаров</a>
              </div>
          </div>
          `;
    cart.insertAdjacentHTML("beforeend", cartInner);
  }
}
