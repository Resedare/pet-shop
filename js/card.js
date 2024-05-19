import {
  setCart,
  getCart,
  getLiked,
  checkValidity,
  likeProduct,
  setCurrency,
  getCurrency,
} from "./utils.js";
const cartCounter = document.querySelector(".cart__count");
const likedCounter = document.querySelector(".liked__count");
let currentCurency;
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
  checkValidity(productsData, "cart", "liked");
  renderCardInfo(productsData);
  cartCounter.textContent = getCart("cart") ? getCart("cart").length : 0;
  likedCounter.textContent = getLiked("liked") ? getLiked("liked").length : 0;
}

// Рендер карточки товара
function renderCardInfo(data) {
  data.forEach((card) => {
    const cardInner = document.querySelector(".card__inner");
    const { id, name, price, discount, img, description, otherimg } = card;
    let newPrice;
    currentCurency = getCurrency("currency");

    switch (currentCurency) {
      case "₽":
        newPrice = price;
        break;
      case "$":
        newPrice = price / 100;
        break;
      case "₸":
        newPrice = price * 5;
    }
    const priceWithDiscount = newPrice - (newPrice * discount) / 100;

    const newDescription = description.split("; ");
    const liked = getLiked("liked");

    let otherImages;

    if (otherimg) {
      otherImages = otherimg.split(";");
    }

    // Получаем текущий айди в url
    const url = new URLSearchParams(window.location.search);
    const currentCardURL = url.get("id");

    // Проверяем соответствие айди в url и айди в data файле
    if (card.id === Number(currentCardURL)) {
      cardInner.innerHTML = "";
      const cardItem = `
        <div class="card__display" data-id="${id}">
        <img src="assets/icons/${
          liked.includes(String(id)) ? "like-active" : "like-inactive"
        }.svg" alt="Понравилось" class="card__like">

        <div class="display__inner">
            <img class="card__image" src="assets/images/${img}.png" alt="Товар">
            ${
              otherimg
                ? otherImages
                    .map(
                      (image) =>
                        `<img class="card__image" src="assets/images/${image}.png" alt="Товар">`
                    )
                    .join("")
                : ""
            }
        </div>
        <div class="display__footer">
            <h2 class="card__name">${name}</h2>
            <div class="card__price-container">
                <div class="card__prices">
                    <p class="card__current-price">${priceWithDiscount} ${currentCurency}</p>
                    <p class="card__full-price"><del>${
                      discount ? newPrice + currentCurency : "&ensp;"
                    }</del></p>
                </div>
                <p class="card__discount">${discount}%</p>
            </div>
        </div>
      </div>
      <div class="card__description">
        <div class="description__block">
            <div class="description__block--title">Описание и характеристики</div>
            <div class="description__block--text">
            ${newDescription.map((line) => `<p>${line}</p>`).join("")}
            </div>
        </div>
        <div class="card__buttons">
            <button class="buy__btn">Купить</button>
            <button class="cart__btn" data-id="${id}"><img src="assets/icons/whitecart.svg" alt="">Добавить в
                корзину</button>
        </div>
      </div>
       `;
      cardInner.insertAdjacentHTML("beforeend", cardItem);
    }
  });
  // Добавляем логику для кнопок покупки, а также функцию добавления в избранное
  const addCart = document.querySelector(".cart__btn");
  const likeBtn = document.querySelector(".card__like");
  likeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target.closest(".card__display");
    likeProduct("liked", target.dataset.id);
    likedCounter.textContent = getLiked("liked") ? getLiked("liked").length : 0;
    renderCardInfo(data);
  });

  // Добавление товара в корзину
  addCart.addEventListener("click", (e) => {
    setCart("cart", e.currentTarget.dataset.id);
    cartCounter.textContent = getCart("cart").length;
  });

  const currencyBtns = document.querySelectorAll(".choose-currency");
  currencyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentCurency = btn.textContent;
      setCurrency("currency", currentCurency);
      renderCardInfo(data);
    });
  });
}
