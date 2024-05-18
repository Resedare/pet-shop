import { getCart, getLiked, checkValidity, likeProduct } from "./utils.js";
const cartCounter = document.querySelector(".cart__count");
const likedCounter = document.querySelector(".liked__count");
const likedCards = document.querySelector(".liked__cards");
const likedInner = document.querySelector(".liked__inner");
let productsData = [];

getProducts();
async function getProducts() {
  const res = await fetch("assets/data/data.json");
  if (!res.ok) {
    alert("Ошибка " + res.status);
    return;
  }
  productsData = await res.json();
  renderLikedCards(productsData);
  checkValidity(productsData, "cart", "liked");
  cartCounter.textContent = getCart("cart") ? getCart("cart").length : 0;
  likedCounter.textContent = getLiked("liked") ? getLiked("liked").length : 0;
}

// Рендер страницы с избранным
function renderLikedCards(data) {
  likedCards.innerHTML = "";
  const likedData = getLiked("liked");
  if (likedData.length) {
    data.forEach((card) => {
      if (likedData.includes(String(card.id))) {
        const { id, name, price, rating, discount, img } = card;
        const priceWithDiscount = price - (price * discount) / 100;
        const cardItem = `
        <div class="card__item" data-id="${id}">
            <img src="assets/icons/${
              likedData.includes(String(id)) ? "like-active" : "like-inactive"
            }.svg" alt="Понравилось" class="card__like">
            <img src="assets/images/${img}.png" alt="Картинка товара" class="card__image">
            <div class="card__info">
                <div class="card__name">${name}</div>
                <div class="card__price-container">
                    <p class="card__current-price">${priceWithDiscount} ₽</p>
                    <p class="card__full-price"><del>${
                      discount ? price + "₽" : "&ensp;"
                    }</del></p>
                </div>
            </div>
            <div class="card__footer">
                <img class="rate-icon" src="assets/icons/rate.svg" alt="">
                <span class="rate-text">${rating}</span>
            </div>
        </div>
         `;
        likedCards.insertAdjacentHTML("beforeend", cardItem);
      }
    });
    // Переход на страницу с карточкой
    likedCards.addEventListener("click", (e) => {
      const cardItem = e.target.closest(".card__item");
      if (cardItem && cardItem.dataset.id) {
        window.location.href = `card.html?id=${cardItem.dataset.id}`;
      }
    });

    // Функция добавления в избранное
    const likeBtns = document.querySelectorAll(".card__like");
    likeBtns.forEach((like) => {
      like.addEventListener("click", (e) => {
        e.stopPropagation();
        const target = e.target.closest(".card__item");
        likeProduct("liked", target.dataset.id);
        likedCounter.textContent = getLiked("liked")
          ? getLiked("liked").length
          : 0;
        renderLikedCards(data);
      });
    });
    // Если избранных нет
  } else {
    const likedEmpty = `
      <h2 class="empty-liked">Вы ещё ничего не добавили в избранное</h2>
      <a href="/" class="empty-like__button">Вернуться на главную</a>
      `;
    likedInner.insertAdjacentHTML("beforeend", likedEmpty);
  }
}
