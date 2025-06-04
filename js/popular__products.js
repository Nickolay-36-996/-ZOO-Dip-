"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("popular-products-cards");
  const vectorLeft = document.querySelector(
    ".popular__products__slider__vector__left"
  );
  const vectorRight = document.querySelector(
    ".popular__products__slider__vector__right"
  );

  let cardsData = [];
  let saveTranslate = 0;
  let cardWidth = 0;

  fetch("https://oliver1ck.pythonanywhere.com/api/get_products_list/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Данные товаров:", data);
      container.innerHTML = "";
      if (data.results && data.results.length > 0) {
        cardsData = data.results;
        function shuffleArray(array) {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        }
        shuffleArray(cardsData);
        createCards();
        if (container.children.length > 0) {
          cardWidth = container.children[0].clientWidth;
          initSliderControls();
        }
      } else {
        container.innerHTML = "<p>Нет данных о товарах</p>";
      }
    })
    .catch((error) => {
      container.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
      console.error("Ошибка fetch:", error);
    });

  function createCards() {
    container.innerHTML = "";
    for (const product of cardsData) {
      const card = document.createElement("div");
      card.className = "popular__products__card";
      const basePrice = parseFloat(product.price) || 0;
      const discountPercent = product.sale?.percent || 0;
      const discountedPrice = basePrice * (1 - discountPercent / 100);
      let quantityOptions = "";

      if (
        product.countitemproduct_set &&
        product.countitemproduct_set.length > 0
      ) {
        quantityOptions = product.countitemproduct_set
          .map((item) => {
            return `<span class="popular__products__card__quantity" 
                     data-count="${item.count}">
                     ${item.count} ${item.unit}
                   </span>`;
          })
          .join("");
      }

      const displayPrice = discountedPrice.toFixed(2);
      const displayOldPrice = basePrice.toFixed(2);

      card.innerHTML = `
        <div class="popular__products__card__info">
        ${
          discountPercent > 0
            ? `
      <div class="popular__product__sale__badge">Акция</div>`
            : ""
        }
          <a href class="popular__products__card__photo__link">
            <img class="popular__products__card__photo" src="${
              product.image_prev
            }" alt="${product.title}" />
          </a>
          <a href="#" class="popular__products__card__title__link">${
            product.title
          }</a>
          ${
            product.sale?.percent > 0
              ? `
            <div class="product__sale__badge"><span>${product.sale.percent}%</span></div>
          `
              : ""
          }
        </div>
        <div class="popular__products__card__quantity__container">
          <div class="popular__products__card__quantity__box">
            ${
              quantityOptions ||
              '<span class="popular__products__card__quantity">1 шт.</span>'
            }
          </div>
        </div>
        <div class="popular__products__card__pay">
          <div class="popular__products__card__pay__price">
            ${
              discountPercent > 0
                ? `
              <p class="popular__products__card__pay__price__old">${displayOldPrice} BYN</p>
              <p class="popular__products__card__pay__price__p">${displayPrice} BYN</p>
            `
                : `
              <p class="popular__products__card__pay__price__p">${displayPrice} BYN</p>
            `
            }
            <button class="popular__products__card__basked__add">
              <div class="popular__products__card__basket__img__box">
                <svg class="popular__products__card__basket__img" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_7865_204)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1 1.12988C1 0.577598 1.44932 0.129883 2.00358 0.129883H3.50894C4.34034 0.129883 5.01431 0.801455 5.01431 1.62988V2.19043L17.5883 3.09806C18.4651 3.15266 19.1089 3.94069 18.9846 4.80727L18.1194 10.842C18.0135 11.581 17.3783 12.1299 16.6292 12.1299H5.01431V14.1299H15.0572C16.72 14.1299 18.068 15.473 18.068 17.1299C18.068 18.7867 16.72 20.1299 15.0572 20.1299C13.3945 20.1299 12.0465 18.7867 12.0465 17.1299C12.0465 16.7792 12.1069 16.4427 12.2178 16.1299H6.85015C6.9611 16.4427 7.02147 16.7792 7.02147 17.1299C7.02147 18.7867 5.67352 20.1299 4.01073 20.1299C2.34795 20.1299 1 18.7867 1 17.1299C1 15.8237 1.83779 14.7124 3.00716 14.3006V3.13912C3.00711 3.13361 3.00711 3.12809 3.00716 3.12256V2.12988H2.00358C1.44932 2.12988 1 1.68217 1 1.12988ZM5.01431 4.19433V10.1299H16.194L16.9208 5.06039L5.01431 4.19433ZM14.0537 17.1299C14.0537 16.5776 14.503 16.1299 15.0572 16.1299C15.6115 16.1299 16.0608 16.5776 16.0608 17.1299C16.0608 17.6822 15.6115 18.1299 15.0572 18.1299C14.503 18.1299 14.0537 17.6822 14.0537 17.1299ZM3.00716 17.1299C3.00716 16.5776 3.45647 16.1299 4.01073 16.1299C4.56499 16.1299 5.01431 16.5776 5.01431 17.1299C5.01431 17.6822 4.56499 18.1299 4.01073 18.1299C3.45647 18.1299 3.00716 17.6822 3.00716 17.1299Z" fill="#5C5F62"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_7865_204">
                      <rect width="20" height="20" fill="white" transform="translate(0 0.129883)"/>
                    </clipPath>
                  </defs>
                </svg>
                <div class="popular__product__card__photo__box">
                  <svg class="popular__product__card__plus__img" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.871582 5.59961H4.10889V8.85156H5.55908V5.59961H8.80371V4.14209H5.55908V0.890137H4.10889V4.14209H0.871582V5.59961Z" fill="#5C5F62"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <button class="popular__products__card__pay__btn">Купить в 1 клик</button>
        </div>`;

      container.appendChild(card);

      const quantityBox = card.querySelector(
        ".popular__products__card__quantity__box"
      );
      const priceElement = card.querySelector(
        ".popular__products__card__pay__price__p"
      );
      const oldPriceElement = card.querySelector(
        ".popular__products__card__pay__price__old"
      );

      if (quantityBox) {
        const quantityElements = quantityBox.querySelectorAll(
          ".popular__products__card__quantity"
        );
        for (let element of quantityElements) {
          element.addEventListener("click", function () {
            const isActive = this.classList.contains(
              "popular__products__card__quantity__active"
            );
            quantityElements.forEach((el) =>
              el.classList.remove("popular__products__card__quantity__active")
            );

            if (!isActive) {
              this.classList.add("popular__products__card__quantity__active");
              const count = parseFloat(this.getAttribute("data-count")) || 1;
              const newPrice = (discountedPrice * count).toFixed(2);

              if (priceElement) {
                priceElement.textContent = `${newPrice} BYN`;
              }

              if (oldPriceElement && discountPercent > 0) {
                oldPriceElement.textContent = `${(basePrice * count).toFixed(
                  2
                )} BYN`;
              }
            } else {
              if (priceElement) {
                priceElement.textContent = `${displayPrice} BYN`;
              }

              if (oldPriceElement && discountPercent > 0) {
                oldPriceElement.textContent = `${displayOldPrice} BYN`;
              }
            }
          });
        }
      }
    }
  }

  function initSliderControls() {
    const gap = 30;
    const cardCount = container.children.length;
    const widthAllElements = cardWidth * cardCount + gap * (cardCount - 1);

    vectorLeft.addEventListener("click", function (event) {
      if (saveTranslate >= 0) {
        saveTranslate = -widthAllElements + cardWidth;
        container.style.transform = `translateX(${saveTranslate}px)`;
      } else {
        saveTranslate = saveTranslate + (cardWidth + gap);
        container.style.transform = `translateX(${saveTranslate}px)`;
      }
    });

    vectorRight.addEventListener("click", function (event) {
      if (!(saveTranslate <= -widthAllElements + (cardWidth + gap))) {
        saveTranslate = saveTranslate - (cardWidth + gap);
        container.style.transform = `translateX(${saveTranslate}px)`;
      } else {
        saveTranslate = 0;
        container.style.transform = `translateX(0)`;
      }
    });
  }
});
