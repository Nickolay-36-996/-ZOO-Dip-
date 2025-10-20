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

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  async function fetchAllPopularProducts() {
    let allProducts = [];
    let nextUrl =
      "https://oliver1ck.pythonanywhere.com/api/get_products_filter/?order=date_create";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          allProducts = [...allProducts, ...data.results];
        }
        nextUrl = data.next;
      }
      return allProducts;
    } catch (error) {
      console.error("Error fetching all products:", error);
      return [];
    }
  }

  fetchAllPopularProducts()
    .then((data) => {
      console.log("Все товары загружены:", data);
      container.innerHTML = "";

      if (data && data.length > 0) {
        cardsData = data.sort(
          (a, b) => (b.sales_counter || 0) - (a.sales_counter || 0)
        );

        cardsData = shuffleArray(cardsData);
        cardsData = cardsData.filter((product) => product.sales_counter > 0);

        createCards();
        addToBasket(data);
        buyClick(cardsData);
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
                     data-count="${item.value}">
                     ${item.value} ${item.unit}
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
          <a href="product__page.html?id=${
            product.id
          }" class="popular__products__card__photo__link">
            <img class="popular__products__card__photo" src="${
              product.image_prev
            }" alt="${product.title}" />
          </a>
          <a href="product__page.html?id=${
            product.id
          }" class="popular__products__card__title__link">${product.title}</a>
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
                <div class="popular__products__card__pay__price__box">
              <p class="popular__products__card__pay__price__old">${displayOldPrice} BYN</p>
              <p class="popular__products__card__pay__price__p">${displayPrice} BYN</p>
              </div>
            `
                : `
              <p class="popular__products__card__pay__price__p">${displayPrice} BYN</p>
            `
            }
            <button class="popular__products__card__basked__add" data-product-id="${
              product.id
            }>
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
            for (const el of quantityElements) {
              el.classList.remove("popular__products__card__quantity__active");
            }

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
    let cardWidth, gap, widthAllElements, cardCount;
    let saveTranslate = 0;

    function updateSizes() {
      cardCount = container.children.length;
      cardWidth = container.children[0].offsetWidth;
      gap = parseInt(window.getComputedStyle(container).gap) || 30;
      widthAllElements = cardWidth * cardCount + gap * (cardCount - 1);
    }

    updateSizes();

    vectorLeft.addEventListener("click", function () {
      updateSizes();
      if (saveTranslate >= 0) {
        saveTranslate = -widthAllElements + cardWidth;
      } else {
        saveTranslate = saveTranslate + (cardWidth + gap);
      }
      container.style.transform = `translateX(${saveTranslate}px)`;
    });

    vectorRight.addEventListener("click", function () {
      updateSizes();
      if (!(saveTranslate <= -widthAllElements + (cardWidth + gap))) {
        saveTranslate = saveTranslate - (cardWidth + gap);
      } else {
        saveTranslate = 0;
      }
      container.style.transform = `translateX(${saveTranslate}px)`;
    });

    window.addEventListener("resize", function () {
      updateSizes();
      saveTranslate = 0;
      container.style.transform = `translateX(0)`;
    });
  }

  function addToBasket(allProducts) {
    const addToCartBtn = document.querySelectorAll(
      ".popular__products__card__basked__add"
    );

    for (const cart of addToCartBtn) {
      cart.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const card = this.closest(".popular__products__card");
        const productId = this.getAttribute("data-product-id");

        const priceElement = card.querySelector(
          ".popular__products__card__pay__price__p"
        );
        const oldPriceElement = card.querySelector(
          ".popular__products__card__pay__price__old"
        );
        const activeQuantity = card.querySelector(
          ".popular__products__card__quantity__active"
        );

        const saleBadge = card.querySelector(".new__product__sale__badge");

        let price = 0;
        let oldPrice = 0;
        let packaging = null;
        let hasPromotion = false;

        if (saleBadge) {
          hasPromotion = true;
        }

        if (activeQuantity) {
          packaging = activeQuantity.textContent;
        }

        if (priceElement) {
          const priceText = priceElement.textContent;
          price = parseFloat(priceText.replace(" BYN", "").trim());
        }

        if (oldPriceElement) {
          const oldPriceText = oldPriceElement.textContent;
          oldPrice = parseFloat(oldPriceText.replace(" BYN", "").trim());
        } else {
          oldPrice = price;
        }

        const product = allProducts.find((p) => p.id === parseInt(productId));

        const cardData = {
          productId: parseInt(productId),
          price: price,
          oldPrice: oldPrice,
          packaging: packaging,
          hasPromotion: hasPromotion !== null,
          title: product.title,
          image: product.image_prev,
        };

        let basketItems = JSON.parse(localStorage.getItem("basketItem")) || [];
        basketItems.push(cardData);
        localStorage.setItem("basketItem", JSON.stringify(basketItems));

        console.log("Товар добавлен в корзину! ID:", productId);

        if (typeof updateBasketDisplay === "function") {
          updateBasketDisplay();
        }

        updateBasketCounter();
      });
    }
  }

  function buyClick(cardsData) {
    const buyItems = container.querySelectorAll(
      ".popular__products__card__pay__btn"
    );

    const overlay = document.createElement("div");
    overlay.className = "modal__overlay";

    const buyModal = document.createElement("div");
    buyModal.className = "buy__modal";

    document.body.appendChild(buyModal);
    document.body.appendChild(overlay);

    for (const buyItem of buyItems) {
      buyItem.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();

        overlay.style.display = "block";
        buyModal.style.display = "block";

        const card = this.closest(".popular__products__card");

        const cardId = card
          .querySelector(".popular__products__card__basked__add")
          .getAttribute("data-product-id");

        const quantityActiveOption = card.querySelector(
          ".popular__products__card__quantity__active"
        );

        let activeOptionCount = 0;
        if (quantityActiveOption) {
          const quantityActiveText = quantityActiveOption.textContent.trim();
          activeOptionCount = parseFloat(quantityActiveText);
        }

        const product = cardsData.find((item) => item.id === parseInt(cardId));

        if (product) {
          let quantityOptions = "";

          if (
            product.countitemproduct_set &&
            product.countitemproduct_set.length > 0
          ) {
            quantityOptions = product.countitemproduct_set
              .map((item) => {
                const isActive =
                  item.value === activeOptionCount
                    ? "popular__products__card__quantity__active"
                    : "";
                return `<span class="popular__products__card__quantity ${isActive}" 
                     data-count="${item.value}">
                     ${item.value} ${item.unit}
                   </span>`;
              })
              .join("");
          }

          const hasWeightOptions =
            product.countitemproduct_set &&
            product.countitemproduct_set.some((item) =>
              item.unit.includes("кг")
            );

          const basePrice = parseFloat(product.price) || 0;
          const discountPercent = product.sale?.percent || 0;
          const discountedPrice = basePrice * (1 - discountPercent / 100);

          let count = 1;

          buyModal.innerHTML = `
             <div class="buy__modal__wrap">
             ${
               discountPercent > 0
                 ? `
              <div class="popular__product__sale__badge buy__modal__badge">Акция</div>
              `
                 : ""
             }
             <span class="buy__modal__close">
             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M3.89705 4.05379L3.96967 3.96967C4.23594 3.7034 4.6526 3.6792 4.94621 3.89705L5.03033 3.96967L10 8.939L14.9697 3.96967C15.2359 3.7034 15.6526 3.6792 15.9462 3.89705L16.0303 3.96967C16.2966 4.23594 16.3208 4.6526 16.1029 4.94621L16.0303 5.03033L11.061 10L16.0303 14.9697C16.2966 15.2359 16.3208 15.6526 16.1029 15.9462L16.0303 16.0303C15.7641 16.2966 15.3474 16.3208 15.0538 16.1029L14.9697 16.0303L10 11.061L5.03033 16.0303C4.76406 16.2966 4.3474 16.3208 4.05379 16.1029L3.96967 16.0303C3.7034 15.7641 3.6792 15.3474 3.89705 15.0538L3.96967 14.9697L8.939 10L3.96967 5.03033C3.7034 4.76406 3.6792 4.3474 3.89705 4.05379L3.96967 3.96967L3.89705 4.05379Z" fill="#5C5F62"/>
             </svg>
             </span>
             <h2 class="buy__modal__title">Оформление заказа в 1 клик</h2>
             <div class="buy__modal__card">
             <div>
             <img src="${product.image_prev}" alt="${
            product.title
          }" class="buy__modal__card__img">
             </div>
             <div class="buy__modal__card__description">
             <h3 class="buy__modal__card__title">${product.title}</h3>
             <div class="buy__modal__card__options">${
               quantityOptions ||
               '<span class="popular__products__card__quantity">1 шт.</span>'
             }</div>
             <div class="buy__modal__card__set__weight__wrap">${
               hasWeightOptions
                 ? `
             <div class="buy__modal__card__set__weight">
             <button class="buy__modal__card__btn">Указать свой вес</button>
             <div class="buy__modal__card__set__weight__box">
             <h3 class="buy__modal__card__set__weight__title">Задайте свой вес</h3>
             <div class="buy__modal__card__set__weight__hide">
             <input class="product__page__modal__set__weight__value" placeholder="Например: 1,2 кг" maxlength="4">
             <button class="product__page__modal__set__weight__btn">Применить</button>
             </div>
             </div>
             </div>
              `
                 : ""
             }</div>
             </div>
             <div class="buy__modal__card__price__wrap">
             <div class="product__page__pay__add">
             <button class="product__page__pay__operator modal__operator__take__away" id="take-away-modal">
             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
             <g clip-path="url(#clip0_933_8222)">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M15 9H5C4.447 9 4 9.448 4 10C4 10.552 4.447 11 5 11H15C15.553 11 16 10.552 16 10C16 9.448 15.553 9 15 9Z" fill="#008060"/>
             </g>
             <defs>
             <clipPath id="clip0_933_8222">
             <rect width="20" height="20" fill="white"/>
             </clipPath>
             </defs>
             </svg>
             </button>
             <div class="product__page__pay__counter modal__counter"></div>
             <button class="product__page__pay__operator modal__operator__add" id="total-add-modal">
             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
             <g clip-path="url(#clip0_933_8230)">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M17 9H11V3C11 2.448 10.553 2 10 2C9.447 2 9 2.448 9 3V9H3C2.447 9 2 9.448 2 10C2 10.552 2.447 11 3 11H9V17C9 17.552 9.447 18 10 18C10.553 18 11 17.552 11 17V11H17C17.553 11 18 10.552 18 10C18 9.448 17.553 9 17 9Z" fill="#008060"/>
             </g>
             <defs>
             <clipPath id="clip0_933_8230">
             <rect width="20" height="20" fill="white"/>
             </clipPath>
             </defs>
             </svg>
             </button>
             </div>
             <div class="buy__modal__card__price__box">
             ${
               discountPercent > 0
                 ? `
             <span class="buy__modal__card__old__price">${parseFloat(
               product.price
             ).toFixed(0)} BYN</span>
             <span class="buy__modal__card__price">${discountedPrice.toFixed(
               0
             )} BYN</span>
              `
                 : `
            <span class="buy__modal__card__price">${parseFloat(
              product.price
            ).toFixed(0)} BYN</span>
              `
             }
             </div>
             </div>
             </div>
             <p class="buy__modal__card__p">Заполните данные и нажмите кнопку «Оформить заказ». Товар будет ждать вас по адресу: Минск, ул. Чюрлёниса, 6.</p>
             <form class="order__input__box input__box__buy__click">
                  <div class="order__input__wrap">
                    <h3 class="order__input__title">Имя</h3>
                    <input
                      type="text"
                      id="buy-name"
                      name="name"
                      maxlength="25"
                      pattern="[А-Яа-яЁё\s]+"
                      class="order__input"
                      placeholder="Введите ваше имя"
                      required
                    />
                  </div>
                  <div class="order__input__wrap">
                    <h3 class="order__input__title">Номер телефона</h3>
                    <input
                      type="tel"
                      id="buy-phone"
                      name="phone"
                      maxlength="13"
                      pattern="\+375[0-9]{9}"
                      placeholder="+375"
                      class="order__input"
                      required
                    />
                  </div>
                </form>
                <button class="buy__modal__card__form__btn">Оформить заказ</button>
                <p class="buy__modal__card__privaty">Нажимая на кнопку вы даёте согласие на обработку <a href="#" class="buy__modal__card__privaty__link">персональных данных</a></p>
             </div>
             `;

          function setOptionsBuyClick() {
            const quantityOptions = buyModal.querySelectorAll(
              ".popular__products__card__quantity"
            );

            const priceElement = buyModal.querySelector(
              ".buy__modal__card__price"
            );
            const oldPriceElement = buyModal.querySelector(
              ".buy__modal__card__old__price"
            );
            const counter = buyModal.querySelector(
              ".product__page__pay__counter"
            );

            let newPrice = 0;
            let newOldPrice = 0;

            const activeOption = buyModal.querySelector(
              ".popular__products__card__quantity__active"
            );

            if (activeOption) {
              const optionText = activeOption.textContent.trim();
              const optionQuantity = parseFloat(optionText);

              if (discountPercent > 0) {
                newPrice = discountedPrice * optionQuantity;
                newOldPrice = basePrice * optionQuantity;

                priceElement.textContent = newPrice.toFixed(0) + " BYN";
                oldPriceElement.textContent = newOldPrice.toFixed(0) + " BYN";
              } else {
                newPrice = basePrice * optionQuantity;
                priceElement.textContent = newPrice.toFixed(0) + " BYN";
              }
            }

            for (const option of quantityOptions) {
              option.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                count = 1;
                counter.textContent = count;

                const optionText = this.textContent.trim();
                const optionQuantity = parseFloat(optionText);

                const isActive = this.classList.contains(
                  "popular__products__card__quantity__active"
                );

                if (isActive) {
                  for (const opt of quantityOptions) {
                    opt.classList.remove(
                      "popular__products__card__quantity__active"
                    );
                    if (discountPercent > 0) {
                      newPrice = discountedPrice;
                      newOldPrice = basePrice;

                      priceElement.textContent = newPrice.toFixed(0) + " BYN";
                      oldPriceElement.textContent =
                        newOldPrice.toFixed(0) + " BYN";
                    } else {
                      newPrice = basePrice;
                      priceElement.textContent = newPrice.toFixed(0) + " BYN";
                    }
                  }
                } else {
                  for (const opt of quantityOptions) {
                    opt.classList.remove(
                      "popular__products__card__quantity__active"
                    );
                  }
                  this.classList.add(
                    "popular__products__card__quantity__active"
                  );

                  if (discountPercent > 0) {
                    newPrice = optionQuantity * discountedPrice;
                    newOldPrice = optionQuantity * basePrice;

                    priceElement.textContent = newPrice.toFixed(0) + " BYN";
                    oldPriceElement.textContent =
                      newOldPrice.toFixed(0) + " BYN";
                  } else {
                    newPrice = optionQuantity * basePrice;
                    priceElement.textContent = newPrice.toFixed(0) + " BYN";
                  }
                }
              });
            }
          }

          function setInputBuyClick() {
            const setWeightShow = buyModal.querySelector(
              ".buy__modal__card__btn"
            );
            const setWeightInputContainer = buyModal.querySelector(
              ".buy__modal__card__set__weight__box"
            );
            const weightInput = buyModal.querySelector(
              ".product__page__modal__set__weight__value"
            );
            const weightButton = buyModal.querySelector(
              ".product__page__modal__set__weight__btn"
            );
            const optionActive = buyModal.querySelector(
              ".popular__products__card__quantity__active"
            );
            const priceElement = buyModal.querySelector(
              ".buy__modal__card__price"
            );
            const oldPriceElement = buyModal.querySelector(
              ".buy__modal__card__old__price"
            );

            setWeightShow.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              if (setWeightInputContainer.style.display === "flex") {
                setWeightInputContainer.style.display = "none";
              } else {
                setWeightInputContainer.style.display = "flex";
              }
            });

            if (weightInput) {
              weightInput.addEventListener("input", function (event) {
                let value = event.target.value;

                value = value.replace(/[^\d,.]/g, "");

                const hasComma = value.includes(",");
                const hasDot = value.includes(".");

                if (hasComma && hasDot) {
                  const commaIndex = value.indexOf(",");
                  const dotIndex = value.indexOf(".");

                  if (commaIndex < dotIndex) {
                    value = value.replace(/\./g, "");
                  } else {
                    value = value.replace(/,/g, "");
                  }
                }
                event.target.value = value;
              });
            }

            if (weightButton) {
              weightButton.addEventListener("click", function () {
                const InputValue = weightInput.value;
                const weightValue = parseFloat(InputValue.replace(",", "."));

                if (discountPercent) {
                  priceElement.textContent =
                    (discountedPrice * weightValue).toFixed(0) + " BYN";
                  oldPriceElement.textContent =
                    (basePrice * weightValue).toFixed(0) + " BYN";
                } else {
                  priceElement.textContent =
                    (basePrice * weightValue).toFixed(0) + " BYN";
                }

                if (optionActive) {
                  optionActive.classList.remove(
                    "popular__products__card__quantity__active"
                  );
                }

                weightInput.value = "";
                setWeightInputContainer.style.display = "none";
              });
            }
          }

          function addTotalBuyClick() {
            const add = buyModal.querySelector(".modal__operator__add");
            const takeAway = buyModal.querySelector(
              ".modal__operator__take__away"
            );
            const priceElement = buyModal.querySelector(
              ".buy__modal__card__price"
            );
            const oldPriceElement = buyModal.querySelector(
              ".buy__modal__card__old__price"
            );
            const counter = buyModal.querySelector(
              ".product__page__pay__counter"
            );

            counter.textContent = count;

            add.addEventListener("click", function (e) {
              count++;
              counter.textContent = count;

              const quantityActive = buyModal.querySelector(
                ".popular__products__card__quantity__active"
              );

              let multiplier = 1;

              if (quantityActive) {
                const quantityActiveText = quantityActive.textContent.trim();
                multiplier = parseFloat(quantityActiveText);
              }

              if (discountPercent > 0) {
                const newPrice = discountedPrice * multiplier * count;
                const newOldPrice = basePrice * multiplier * count;

                priceElement.textContent = newPrice.toFixed(0) + " BYN";
                if (oldPriceElement) {
                  oldPriceElement.textContent = newOldPrice.toFixed(0) + " BYN";
                }
              } else {
                const newPrice = basePrice * multiplier * count;
                priceElement.textContent = newPrice.toFixed(0) + " BYN";
              }
            });

            takeAway.addEventListener("click", function (e) {
              if (count > 1) {
                count--;
                counter.textContent = count;

                const quantityActive = buyModal.querySelector(
                  ".popular__products__card__quantity__active"
                );
                let multiplier = 1;
                if (quantityActive) {
                  const quantityActiveText = quantityActive.textContent.trim();
                  multiplier = parseFloat(quantityActiveText);
                }

                if (discountPercent > 0) {
                  const newPrice = discountedPrice * multiplier * count;
                  const newOldPrice = basePrice * multiplier * count;

                  priceElement.textContent = newPrice.toFixed(0) + " BYN";
                  if (oldPriceElement) {
                    oldPriceElement.textContent =
                      newOldPrice.toFixed(0) + " BYN";
                  }
                } else {
                  const newPrice = basePrice * multiplier * count;
                  priceElement.textContent = newPrice.toFixed(0) + " BYN";
                }
              }
            });
          }

          function initNameValidationAndSent() {
            const nameInput = document.getElementById("buy-name");
            const phoneInput = document.getElementById("buy-phone");
            const sentInput = buyModal.querySelector(
              ".buy__modal__card__form__btn"
            );

            if (nameInput) {
              nameInput.addEventListener("input", function () {
                const cursorPosition = this.selectionStart;

                this.value = this.value.replace(/[^А-Яа-яЁё\s]/g, "");
                this.value = this.value.replace(/\s+/g, " ");

                if (this.value.startsWith(" ")) {
                  this.value = this.value.substring(1);
                }

                this.value = this.value.replace(/\s+/g, " ");
              });
            }

            if (phoneInput) {
              phoneInput.addEventListener("input", function (e) {
                const cursorPosition = this.selectionStart;

                let value = this.value.replace(/[^\d+]/g, "");

                if (!value.startsWith("+")) {
                  value = "+";
                }

                this.value = value;
              });
            }

            sentInput.addEventListener("click", function (e) {
              e.preventDefault();
              e.stopPropagation();

              function checkFromFilled() {
                const isNameFilled = nameInput && nameInput.value.trim() !== "";
                const isPhoneFilled =
                  phoneInput && phoneInput.value.trim() !== "";

                return isNameFilled && isPhoneFilled;
              }

              if (!checkFromFilled()) {
                alert(
                  "Пожалуйста, заполните все обязательные поля перед оформлением заказа!"
                );
                return;
              }
              const priceElement = buyModal.querySelector(
                ".buy__modal__card__price"
              );

              const orderData = {
                productId: product.id,
                prdoductPrice: parseFloat(priceElement.textContent),
                Name: nameInput.value.trim(),
                Phone: phoneInput.value.trim(),
              };

              localStorage.setItem("SentItem", JSON.stringify(orderData));
              console.log("Данные заказа сохранены:", orderData);

              buyModal.style.display = "none";

              const successModal = document.createElement("div");
              successModal.className = "success__modal";
              successModal.innerHTML = `
                <div class="success__modal__wrap">
                <span class="succes__modal__close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.89705 4.05379L3.96967 3.96967C4.23594 3.7034 4.6526 3.6792 4.94621 3.89705L5.03033 3.96967L10 8.939L14.9697 3.96967C15.2359 3.7034 15.6526 3.6792 15.9462 3.89705L16.0303 3.96967C16.2966 4.23594 16.3208 4.6526 16.1029 4.94621L16.0303 5.03033L11.061 10L16.0303 14.9697C16.2966 15.2359 16.3208 15.6526 16.1029 15.9462L16.0303 16.0303C15.7641 16.2966 15.3474 16.3208 15.0538 16.1029L14.9697 16.0303L10 11.061L5.03033 16.0303C4.76406 16.2966 4.3474 16.3208 4.05379 16.1029L3.96967 16.0303C3.7034 15.7641 3.6792 15.3474 3.89705 15.0538L3.96967 14.9697L8.939 10L3.96967 5.03033C3.7034 4.76406 3.6792 4.3474 3.89705 4.05379L3.96967 3.96967L3.89705 4.05379Z" fill="#5C5F62"/>
                </svg>
                </span>
                <div>
                <svg class="success__modal__img" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM32.6339 17.6161C32.1783 17.1605 31.4585 17.1301 30.9676 17.525L30.8661 17.6161L20.75 27.7322L17.1339 24.1161C16.6457 23.628 15.8543 23.628 15.3661 24.1161C14.9105 24.5717 14.8801 25.2915 15.275 25.7824L15.3661 25.8839L19.8661 30.3839C20.3217 30.8395 21.0416 30.8699 21.5324 30.475L21.6339 30.3839L32.6339 19.3839C33.122 18.8957 33.122 18.1043 32.6339 17.6161Z" fill="#008060"/>
                </svg>
                </div>
                <h1 class="success__modal__title">Мы получили вашу заявку</h1>
                <p class="success__modal__text">Ожидайте звонка в течение 15 минут</p>
                <button class="success__modal__btn">Понятно, жду</button>
                </div>
                `;

              document.body.appendChild(successModal);

              function closeSuccessModal() {
                const closeButton = successModal.querySelector(
                  ".succes__modal__close"
                );

                closeButton.addEventListener("click", function (e) {
                  e.preventDefault();
                  e.stopPropagation();

                  successModal.style.display = "none";
                  overlay.style.display = "none";
                });
              }

              closeSuccessModal();
            });
          }

          setOptionsBuyClick();
          setInputBuyClick();
          addTotalBuyClick();
          initNameValidationAndSent();
        }

        const closeBuyModal = buyModal.querySelector(".buy__modal__close");
        closeBuyModal.addEventListener("click", function () {
          overlay.style.display = "none";
          buyModal.style.display = "none";
        });
      });

      overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        buyModal.style.display = "none";

        const successModal = document.querySelector(".success__modal");
        if (successModal) {
          successModal.style.display = "none";
        }
      });
    }
  }
});
