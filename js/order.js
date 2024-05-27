import {
  getCart,
  getLiked,
  checkValidity,
  likeProduct,
  setCurrency,
  getCurrency,
  getUniqueCartItemCount,
} from "./utils.js";
const cartCounter = document.querySelector(".cart__count");
const likedCounter = document.querySelector(".liked__count");
const order = document.querySelector(".order");
let productsData = [];
let currentCurency;

getProducts();
async function getProducts() {
  const res = await fetch("assets/data/data.json");
  if (!res.ok) {
    alert("Ошибка " + res.status);
    return;
  }
  productsData = await res.json();
  checkValidity(productsData, "cart", "liked");
  getCurrency("currency");
  renderOrder(productsData);
  cartCounter.textContent = getUniqueCartItemCount("cart");
  likedCounter.textContent = getLiked("liked") ? getLiked("liked").length : 0;
}

function renderOrder(data) {
  const currentCart = getCart("cart");
  order.innerHTML = "";
  const orderInner = `
        <div class="container">
        <div class="order__inner">
            <h1 class="order__title">Оформление заказа</h1>
            <div class="order__blocks">
                <div class="order__delivery">
                    <div class="order__delivery-header">
                        <h2 class="order__delivery-title">Доставка курьером</h2>
                        <p class="order__delivery-price"></p>
                    </div>
                    <div class="order__delivery-address">
                        <img src="assets/icons/location.svg" alt="" class="order__delivery-address-image">
                        <p class="order__delivery-address-text">Адрес доставки</p>
                    </div>
                    <div class="order__delivery-box">
                        <form action="" class="order__delivery-form">
                            <input list="cities" id="delivery-city" name="delivery-city" placeholder="Город">
                            <datalist id="cities">
                                <option value="Москва">Москва</option>
                                <option value="Санкт-Петербург">Санкт-Петербург</option>
                                <option value="Казань">Казань</option>
                            </datalist>
                            <input type="text" id="delivery-street" placeholder="Улица / Район">
                            <div class="order__delivery-box-footer">
                                <input type="text" id="delivery-house" placeholder="Дом">
                                <input type="text" id="delivery-entrance" placeholder="Подъезд">
                                <input type="text" id="delivery-room" placeholder="Квартира">
                            </div>
                        </form>
                    </div>
                    <div class="order__delivery-footer">
                        <p class="order__delivery-footer-info">Доставка по Москве и Санкт-Петербургу <span class="order__delivery-footer-free">бесплатная<span></p>
                    </div>
                </div>
                <div class="order__confirmation">
                    <div class="order__confirmation-total-price">
                        <h2 class="order__confirmation-total-price-title">Ваш заказ</h2>
                        <div class="order__confirmation-product-list">
                        </div>
                        <div class="order__confirmation-product-delivery">
                            <p class="order__confirmation-product-delivery-text">Доставка</p>
                            <p class="order__confirmation-product-delivery-price"></p>
                        </div>
                        <div class="order__confirmation-to-be-paid">
                            <p class="order__confirmation-to-be-paid-text">К оплате</p>
                            <p class="order__confirmation-to-be-paid-price"></p>
                        </div>
                    </div>
                    <div class="order__confirmation-payment-method">
                        <h2 class="order__confirmation-payment-method-title">Способ оплаты</h2>
                        <div class="order__confirmation-payment-method-box">
                            <div class="order__confirmation-payment-method-choice">
                                <img src="assets/icons/visa.svg" alt=""
                                    class="order__confirmation-payment-method-choice-img">
                                <select name="choice" id="choise-field">
                                    <option value="visa" selected>VISA</option>
                                    <option value="mastercard">Mastercard</option>
                                </select>
                            </div>
                            <div class="order__confirmation-payment-method-promocode">
                                <img src="assets/icons/promo.svg" alt=""
                                    class="order__confirmation-payment-method-promocode-img">
                                <input type="text" id="promocode-field" placeholder="Есть промокод?">
                            </div>
                        </div>
                    </div>
                    <div class="order__confirmation-recipient-info">
                        <h2 class="order__confirmation-recipient-info-title">Номер получателя</h2>
                        <input type="tel" id="recipient-number" placeholder="+7 ___ ___ __ __">
                    </div>
                    <div class="order__confirmation-confirm">
                        <button class="order__confirmation-confirm-btn">Закончить оформление</button>

                    </div>
                </div>
            </div>
        </div>
        </div>
        `;
  order.insertAdjacentHTML("beforeend", orderInner);

  //   Доставка и общая стоимость
  const deliveryPriceBlock = document.querySelector(".order__delivery-price");
  const orderDeliveryPrice = document.querySelector(
    ".order__confirmation-product-delivery-price"
  );
  const toBePaid = document.querySelector(
    ".order__confirmation-to-be-paid-price"
  );
  const orderList = document.querySelector(".order__confirmation-product-list");

  const deliveryPrice = 500;
  let newDeliveryPrice;
  let totalPrice = 0;

  data.forEach((dataItem) => {
    if (currentCart[dataItem.id]) {
      const { id, name, price, rating, discount, img } = dataItem;
      let newPrice;
      currentCurency = getCurrency("currency");

      switch (currentCurency) {
        case "₽":
          newPrice = price;
          newDeliveryPrice = deliveryPrice;
          break;
        case "$":
          newPrice = price / 100;
          newDeliveryPrice = deliveryPrice / 100;
          break;
        case "₸":
          newPrice = price * 5;
          newDeliveryPrice = deliveryPrice * 5;
          break;
      }
      const priceWithDiscount = newPrice - (newPrice * discount) / 100;
      const orderItem = `
        <div class="order__confirmation-product-item">
            <div class="order__confirmation-product-info">
                <span class="order__confirmation-product-count">${currentCart[id]}х</span>
                <span class="order__confirmation-product-name">${name}</span>
            </div>
            <p class="order__confirmation-product-price">${priceWithDiscount} ${currentCurency}</p>
        </div>
        `;
      orderList.insertAdjacentHTML("beforeend", orderItem);
      totalPrice += priceWithDiscount * currentCart[id];
      updateTotalPrice(totalPrice, newDeliveryPrice);
    }
  });
  const cities = document.querySelector("#cities");
  const options = cities.getElementsByTagName("option");
  const deliveryCity = document.querySelector("#delivery-city");

  // Стоимость доставки
  deliveryPriceBlock.textContent = `${newDeliveryPrice} ${currentCurency}`;
  orderDeliveryPrice.textContent = `${newDeliveryPrice} ${currentCurency}`;

  deliveryCity.addEventListener("change", () => {
    if (
      deliveryCity.value === options[0].value ||
      deliveryCity.value === options[1].value
    ) {
      orderDeliveryPrice.textContent = "Бесплатно";
      deliveryPriceBlock.textContent = "Бесплатно";
      updateTotalPrice(totalPrice);
    } else {
      deliveryPriceBlock.textContent = `${newDeliveryPrice} ${currentCurency}`;
      orderDeliveryPrice.textContent = `${newDeliveryPrice} ${currentCurency}`;
      updateTotalPrice(totalPrice, newDeliveryPrice);
    }
  });

  // Апдейт конечной цены
  function updateTotalPrice(price, deliveryPrice = 0) {
    toBePaid.textContent = `${price + deliveryPrice} ${currentCurency}`;
  }

  // Смена валюты
  const currencyBtns = document.querySelectorAll(".choose-currency");
  currencyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCurency = btn.textContent;
      setCurrency("currency", currentCurency);
      renderOrder(data);
    });
  });

  const confirmBtn = document.querySelector(".order__confirmation-confirm-btn");
  confirmBtn.addEventListener("click", () => {
    alert("Ваш заказ был добавлен в очередь");
    delete localStorage.cart;
    window.location.replace("/");
  });
}
