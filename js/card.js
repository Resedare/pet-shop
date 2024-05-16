let productsData = [];

getProducts();
async function getProducts() {
  const res = await fetch("assets/data/data.json");
  if (!res.ok) {
    alert("Ошибка " + res.status);
    return;
  }
  productsData = await res.json();
  renderCardInfo(productsData);
}
function renderCardInfo(data) {
  data.forEach((card) => {
    const cardInner = document.querySelector(".card__inner");
    let otherImages;
    const { id, name, price, discount, img, description, otherimg } = card;
    const priceWithDiscount = price - (price * discount) / 100;

    const newDescription = description.split("; ");

    if (otherimg) {
      otherImages = otherimg.split(";");
    }

    let url = new URLSearchParams(window.location.search);
    let currentCardURL = url.get("id");

    if (card.id === Number(currentCardURL)) {
      const cardItem = `
  <div class="card__display" data-id="${id}">
  <img src="assets/icons/like-inactive.svg" alt="Понравилось" class="card__like">

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
              <p class="card__current-price">${priceWithDiscount} ₽</p>
              <p class="card__full-price"><del>${
                discount ? price + "₽" : "&ensp;"
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
      <button class="cart__btn"><img src="assets/icons/whitecart.svg" alt="">Добавить в
          корзину</button>
  </div>
</div>
            `;
      cardInner.insertAdjacentHTML("beforeend", cardItem);
    }
  });
}
