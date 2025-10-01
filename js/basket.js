"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("basket-contain");

  let fullPrice = 0;
  let fullOldPrice = 0;

  window.updateBasketDisplay = function () {
    fetchAllProducts()
      .then((allProducts) => {
        const basketItems = getBasketItemIds();
        if (basketItems.length > 0) {
          showBasketItems(allProducts);
        }
        return;
      })
      .catch((error) => {
        console.error("Ошибка обновления корзины:", error);
      });
  };

  async function fetchAllProducts() {
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
      console.error("Ошибка при загрузке товаров:", error);
      throw error;
    }
  }

  fetchAllProducts()
    .then((allProducts) => {
      console.log("Всего товаров загружено:", allProducts.length);
      const basketItems = getBasketItemIds();
      console.log("Товар в корзине", basketItems.length);
      window.allProducts = allProducts;

      if (basketItems.length > 0) {
        showBasketItems(allProducts);
      } else {
        console.log("Корзина пуста");
        container.innerHTML = `
        <div class="empty__cart">
              <div class="empty__img">
                <img src="./img/image 23 empty.jpg" alt="empty-cart" />
              </div>
              <h3 class="empty__cart__title">
                В корзине нет товаров. Выберите нужные товары в нашем каталоге
              </h3>
              <a href="./catalog.html" class="go__to__catalog"
                >Перейти в каталог товаров</a
              >
            </div>
        `;
      }
    })
    .catch((error) => {
      console.error("Ошибка", error);
    });

  function getBasketItemIds() {
    return JSON.parse(localStorage.getItem("basketItem")) || [];
  }

  function showBasketItems(allProducts) {
    container.innerHTML = "";
    const basketItems = getBasketItemIds();

    fullPrice = 0;
    fullOldPrice = 0;

    for (const basketItem of basketItems) {
      const product = allProducts.find((p) => p.id === basketItem.productId);
      if (product) {
        const basePrice = parseFloat(product.price) || 0;
        const promotion = product.sale?.percent || 0;

        fullPrice += basketItem.price;

        if (promotion > 0) {
          const originalPrice = basketItem.price / (1 - promotion / 100);
          fullOldPrice += originalPrice;
        } else {
          fullOldPrice += basketItem.price;
        }
      }
    }

    const myCart = document.createElement("div");
    myCart.className = "my__cart";
    myCart.innerHTML = `
    <h1 class="my__cart__title">Моя корзина</h1>
    <div class="my__cart__wrap">
    <div class="my__cart__items" id="cart-items"></div>
    <div class="my__cart__total">
    <div class="my__cart__total__wrap">
    <span class="my__cart__total__price">0 BYN</span>
    <span class="my__cart__total__product">0 товаров</span>
    </div>
    <div class="my__cart__pickup">
    <div class="my__cart__pickup__img">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.0186 0.244236L3.58017 8.43993C3.15194 8.66724 2.88428 9.1124 2.88428 9.59735V30.1702C2.88428 31.0012 3.35123 31.7615 4.09221 32.1374L19.2314 39.816C19.7144 40.0611 20.2854 40.0611 20.7683 39.816L35.9076 32.1374C36.6486 31.7615 37.1155 31.0011 37.1155 30.1702V9.59735C37.1155 9.1124 36.8479 8.66724 36.4195 8.43993L20.9813 0.244236C20.3677 -0.0813713 19.6323 -0.0813713 19.0186 0.244236Z" fill="#FFCE94"/>
    <path d="M20 40C20.2635 40 20.5271 39.9388 20.7685 39.8163L35.9078 32.1376C36.6487 31.7618 37.1157 31.0013 37.1157 30.1704V9.59735C37.1157 9.38316 37.061 9.17819 36.9658 8.99487L20 18.031V40Z" fill="#FCB043"/>
    <path d="M20 18.031L3.03429 8.99472C2.93897 9.17804 2.88428 9.38301 2.88428 9.5972V30.1702C2.88428 31.0012 3.35123 31.7615 4.09221 32.1373L19.2314 39.816C19.4729 39.9385 19.7364 39.9997 19.9998 39.9997V18.031H20Z" fill="#E2791B"/>
    <path d="M26.0485 2.93423L8.87842 12.0782V15.004C8.87842 15.2848 9.0333 15.5427 9.28106 15.6749L12.265 17.2653C12.5018 17.3915 12.7876 17.2199 12.7876 16.9516V14.2208L29.9844 5.02367L26.0485 2.93423Z" fill="#DEF2FC"/>
    <path d="M22.4731 34.1616L27.0537 31.9709C27.6402 31.6906 28.0075 31.092 27.9921 30.4421L27.9917 30.4218C27.979 29.8857 27.4098 29.5474 26.9327 29.7924L22.4733 32.0826V34.1616H22.4731Z" fill="#403A46"/>
    <path d="M22.4731 37.356L24.9885 36.1875C25.5841 35.9106 25.9592 35.3073 25.9437 34.6507C25.9309 34.1126 25.3585 33.7744 24.8812 34.023L22.4731 35.2767V37.356Z" fill="#403A46"/>
    <path d="M8.87842 12.1075V15.004C8.87842 15.2848 9.0333 15.5427 9.28106 15.6749L12.265 17.2653C12.5018 17.3915 12.7876 17.2199 12.7876 16.9516V14.2208L12.8167 14.2052C11.806 13.6669 10.1645 12.7925 8.87842 12.1075Z" fill="#B6C8CE"/>
    </svg>
    </div>
    <div class="my__cart__pickup__txt">
    <p class="my__cart__pickup__txt__title">Самовывоз</p>
    <div class="my__cart__pickup__txt__location">
    <div class="my__cart__pickup__txt__location__img">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_809_3928)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4001 6.4C14.4001 2.864 11.5361 0 8.0001 0C4.4641 0 1.6001 2.864 1.6001 6.4C1.6001 6.52 1.6001 6.632 1.6081 6.752C1.7121 9.592 3.2001 12.848 7.3121 15.784C7.7201 16.072 8.2801 16.072 8.6881 15.784C12.8001 12.848 14.2881 9.592 14.3921 6.752C14.4001 6.63202 14.4001 6.51997 14.4001 6.4ZM9.6969 8.0968C10.1473 7.6472 10.4001 7.0368 10.4001 6.4C10.4001 5.7632 10.1465 5.1536 9.6969 4.7032C9.2473 4.2528 8.6369 4 8.0001 4C7.3633 4 6.7537 4.2536 6.3033 4.7032C5.8529 5.1528 5.6001 5.7632 5.6001 6.4C5.6001 7.0368 5.8529 7.6472 6.3033 8.0968C6.7529 8.5472 7.3633 8.8 8.0001 8.8C8.6361 8.8 9.2465 8.5472 9.6969 8.0968Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_809_3928">
    <rect width="16" height="16" fill="white"/>
    </clipPath>
    </defs>
    </svg>
    </div>
    <p class="my__cart__pickup__txt__location__txt">Минск, ул. Чюрлёниса, 6.</p>
    </div>
    </div>
    </div>
    <button class="my__cart__btn">Оформить заказ</button>
    </div>
    `;

    container.appendChild(myCart);

    createCartItem(allProducts, basketItems);
    ItemRemove(allProducts);
    updateTotalCounter();
    transferDataOrder();
  }

  function createCartItem(allProducts, basketItems) {
    const cartItemsContainer = document.getElementById("cart-items");

    cartItemsContainer.innerHTML = "";

    for (const basketItem of basketItems) {
      let product = null;
      for (const currentProduct of allProducts) {
        if (currentProduct.id === basketItem.productId) {
          product = currentProduct;
          break;
        }
      }
      if (product) {
        const itemPrice = basketItem.price;

        const basePrice = parseFloat(product.price) || 0;
        const promotion = product.sale?.percent || 0;
        const discountedPrice = basePrice * (1 - promotion / 100);

        const cartItem = document.createElement("div");
        cartItem.className = "my__cart__item";
        cartItem.dataset.productID = product.id;
        cartItem.innerHTML = `
      <div class="my__cart__item__wrap">
      <a href="product__page.html?id=${product.id}">
      <img src="${product.image_prev}" alt="${
          product.image_prev
        }" class="my__cart__item__img">
      </a>
      <div class="my__cart__item__info">
      <a href="product__page.html?id=${product.id}">
      <h3 class="my__cart__item__info__title">${product.title}</h3>
      </a>
      <div class="my__cart__item__info__options"></div>
      </div>
      </div>
      <div class="my__cart__item__info__total__wrap">
      <div class="my__cart__item__info__total">
      <div class="product__page__pay__add">
      <button class="product__page__pay__operator" id="take-away">
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
      <div class="product__page__pay__counter">${basketItem.quantity || 1}</div>
      <button class="product__page__pay__operator" id="total-add">
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
      <div class="my__cart__item__price__container">
      <p class="my__cart__item__price">${itemPrice.toFixed(2)} BYN</p>
      ${
        promotion > 0
          ? `
      <p class="my__cart__item__old__price">${basePrice.toFixed(2)} BYN</p>
        `
          : ""
      }
      </div>
      </div>
      <button class="my__cart__item__remove">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1.75C13.733 1.75 15.1492 3.10645 15.2449 4.81558L15.25 5H20.5C20.9142 5 21.25 5.33579 21.25 5.75C21.25 6.1297 20.9678 6.44349 20.6018 6.49315L20.5 6.5H19.704L18.4239 19.5192C18.2912 20.8683 17.1984 21.91 15.8626 21.9945L15.6871 22H8.31293C6.95734 22 5.81365 21.0145 5.59883 19.6934L5.57614 19.5192L4.295 6.5H3.5C3.1203 6.5 2.80651 6.21785 2.75685 5.85177L2.75 5.75C2.75 5.3703 3.03215 5.05651 3.39823 5.00685L3.5 5H8.75C8.75 3.20507 10.2051 1.75 12 1.75ZM18.197 6.5H5.802L7.06893 19.3724C7.12768 19.9696 7.60033 20.4343 8.18585 20.4936L8.31293 20.5H15.6871C16.2872 20.5 16.7959 20.0751 16.9123 19.4982L16.9311 19.3724L18.197 6.5ZM13.75 9.25C14.1297 9.25 14.4435 9.53215 14.4932 9.89823L14.5 10V17C14.5 17.4142 14.1642 17.75 13.75 17.75C13.3703 17.75 13.0565 17.4678 13.0068 17.1018L13 17V10C13 9.58579 13.3358 9.25 13.75 9.25ZM10.25 9.25C10.6297 9.25 10.9435 9.53215 10.9932 9.89823L11 10V17C11 17.4142 10.6642 17.75 10.25 17.75C9.8703 17.75 9.55651 17.4678 9.50685 17.1018L9.5 17V10C9.5 9.58579 9.83579 9.25 10.25 9.25ZM12 3.25C11.0818 3.25 10.3288 3.95711 10.2558 4.85647L10.25 5H13.75C13.75 4.0335 12.9665 3.25 12 3.25Z" fill="#D82C0D"/>
      </svg>
      </button>
      ${
        promotion > 0
          ? `
      <div class="popular__product__sale__badge__basket">Акция</div>`
          : ""
      }
      </div>
    `;
        cartItemsContainer.appendChild(cartItem);
        if (basketItem.customWeight) {
          const weightInput = cartItem.querySelector(".set__weight__input");
          if (weightInput) {
            weightInput.value = basketItem.customWeight;
          }
        }

        weightOptions(product, cartItem, basketItem.packaging);
        setWeightOptions(product, cartItem, basketItem.packaging, itemPrice);
        weightInput(product, cartItem);
        setWeightInput(product, cartItem);
        addTotalWeight(product, cartItem);
      }
    }
  }

  function weightOptions(product, cartItem, packaging) {
    const optionsContainer = cartItem.querySelector(
      ".my__cart__item__info__options"
    );

    if (!optionsContainer) return;

    optionsContainer.innerHTML = "";

    if (
      !product.countitemproduct_set ||
      product.countitemproduct_set.length === 0
    ) {
      optionsContainer.innerHTML = "<p>Нет доступных вариантов фасовки</p>";
      return;
    }

    for (const option of product.countitemproduct_set) {
      const optionText = `${option.value} ${option.unit}`;

      const optionElement = document.createElement("span");
      optionElement.className = "my__cart__item__info__option";
      optionElement.textContent = optionText;

      if (packaging && packaging.toString().trim() === optionText.trim()) {
        optionElement.classList.add("my__cart__item__info__option__active");
      }

      optionsContainer.appendChild(optionElement);
    }
  }

  function setWeightOptions(product, cartItem, packaging, itemPrice) {
    const weightOption = cartItem.querySelectorAll(
      ".my__cart__item__info__option"
    );
    const priceCounter = cartItem.querySelector(".my__cart__item__price");
    const oldPriceCounter = cartItem.querySelector(
      ".my__cart__item__old__price"
    );
    const basePrice = parseFloat(product.price);
    const discountPercent = product.sale?.percent || 0;
    const discountedPrice = basePrice * (1 - discountPercent / 100);

    if (!weightOption.length) return;

    for (const option of weightOption) {
      option.addEventListener("click", function (e) {
        e.preventDefault();

        const optionText = this.textContent;
        const isCurrentlyActive = this.classList.contains(
          "my__cart__item__info__option__active"
        );

        const currentPrice = parseFloat(
          priceCounter.textContent.replace(" BYN", "")
        );

        if (isCurrentlyActive) {
          for (const opt of weightOption) {
            opt.classList.remove("my__cart__item__info__option__active");
          }

          let newPrice = 0;
          let newOldPrice = 0;

          if (discountPercent) {
            newPrice = discountedPrice;
            newOldPrice = basePrice;
          } else {
            newPrice = basePrice;
            newOldPrice = basePrice;
          }

          priceCounter.textContent = `${newPrice.toFixed(2)} BYN`;
          if (discountPercent > 0) {
            oldPriceCounter.textContent = `${newOldPrice.toFixed(2)} BYN`;
          }

          fullPrice = fullPrice - currentPrice + newPrice;

          if (discountPercent > 0) {
            fullOldPrice = fullOldPrice - basePrice + basePrice;
          } else {
            fullOldPrice = fullOldPrice - currentPrice + newPrice;
          }

          updateTotalCounter();
          updateBasketInLocalStorage(window.allProducts);
          return;
        }

        const weightValue = parseFloat(optionText.split(" ")[0]);

        for (const opt of weightOption) {
          opt.classList.remove("my__cart__item__info__option__active");
        }

        this.classList.add("my__cart__item__info__option__active");

        let newPrice = 0;
        let newOldPrice = 0;

        if (discountPercent > 0) {
          newPrice = discountedPrice * weightValue;
          newOldPrice = basePrice * weightValue;
        } else {
          newPrice = basePrice * weightValue;
        }

        priceCounter.textContent = `${newPrice.toFixed(2)} BYN`;
        if (discountPercent > 0) {
          oldPriceCounter.textContent = `${newOldPrice.toFixed(2)} BYN`;
        }

        fullPrice = fullPrice - currentPrice + newPrice;

        if (discountPercent > 0) {
          const oldPriceValue = basePrice * weightValue;
          fullOldPrice = fullOldPrice - currentPrice + oldPriceValue;
        } else {
          fullOldPrice = fullOldPrice - currentPrice + newPrice;
        }

        updateTotalCounter();
        updateBasketInLocalStorage(window.allProducts);
      });
    }
  }

  function weightInput(product, cartItem) {
    const weightContainer = cartItem.querySelector(".my__cart__item__info");
    const hasWeightOptions =
      product.countitemproduct_set &&
      product.countitemproduct_set.some((item) => item.unit.includes("кг"));

    if (!weightContainer) return;

    if (hasWeightOptions) {
      const customWeightElement = document.createElement("p");
      customWeightElement.className = "custom__weight__input";
      customWeightElement.innerHTML = `
      Задать свой вес
      `;
      weightContainer.appendChild(customWeightElement);

      const setWeightElements = document.createElement("div");
      setWeightElements.className = "set__weight";
      setWeightElements.style.display = "none";
      setWeightElements.innerHTML = `
        <h3 class="set__weight__title">Задайте свой вес</h3>
        <div class="set__weight__hide">
        <input class="set__weight__input" placeholder="Например: 1,2 кг" maxlength="4">
        <button class="set__weight__button" maxlength="4">Применить</button>
        </div>
        `;
      weightContainer.appendChild(setWeightElements);

      const weightInput = setWeightElements.querySelector(
        ".set__weight__input"
      );

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

      customWeightElement.addEventListener("click", () => {
        if (setWeightElements.style.display === "none") {
          setWeightElements.style.display = "flex";
        } else {
          setWeightElements.style.display = "none";
        }
      });
      setWeightInput(product, cartItem);
    }
  }

  function setWeightInput(product, cartItem) {
    const weightInput = cartItem.querySelector(".set__weight__input");
    const weightButton = cartItem.querySelector(".set__weight__button");
    const totalPriceElement = cartItem.querySelector(".my__cart__item__price");
    const oldPriceElement = cartItem.querySelector(
      ".my__cart__item__old__price"
    );
    const counter = cartItem.querySelector(".product__page__pay__counter");

    const basePrice = parseFloat(product.price) || 0;
    const promotion = product.sale?.percent || 0;
    const discountedPrice = basePrice * (1 - promotion / 100);

    if (!weightInput || !weightButton || !totalPriceElement) return;

    weightButton.addEventListener("click", function () {
      const inputValue = weightInput.value;
      const weightValue = parseFloat(inputValue.replace(",", "."));

      if (!isNaN(weightValue) && weightValue > 0) {
        const currentPrice = parseFloat(
          totalPriceElement.textContent.replace(" BYN", "")
        );

        const weightOptions = cartItem.querySelectorAll(
          ".my__cart__item__info__option"
        );
        if (weightOptions.length > 0) {
          for (const option of weightOptions) {
            option.classList.remove("my__cart__item__info__option__active");
          }
        }

        let newPrice = 0;
        let newOldPrice = 0;

        if (promotion > 0) {
          newPrice = discountedPrice * weightValue;
          newOldPrice = basePrice * weightValue;
        } else {
          newPrice = basePrice * weightValue;
          newOldPrice = newPrice;
        }

        totalPriceElement.textContent = newPrice.toFixed(2) + " BYN";
        oldPriceElement.textContent = newOldPrice.toFixed(2) + " BYN";

        fullPrice = fullPrice - currentPrice + newPrice;
        fullOldPrice = fullOldPrice - currentPrice + newOldPrice;

        updateTotalCounter();
        updateBasketInLocalStorage(window.allProducts);

        weightInput.value = "";
        const setWeightElements = cartItem.querySelector(".set__weight");
        if (setWeightElements) setWeightElements.style.display = "none";
      }
    });
  }

  function addTotalWeight(product, cartItem) {
    const add = cartItem.querySelector("#total-add");
    const takeAway = cartItem.querySelector("#take-away");
    const counter = cartItem.querySelector(".product__page__pay__counter");
    const basePriceElement = cartItem.querySelector(".my__cart__item__price");
    const oldPriceElement = cartItem.querySelector(
      ".my__cart__item__old__price"
    );

    if (!add || !takeAway || !counter || !basePriceElement) return;

    let count = parseInt(counter.textContent) || 1;
    counter.textContent = count;

    const basePrice = parseFloat(product.price) || 0;
    const promotion = product.sale?.percent || 0;

    add.addEventListener("click", function () {
      const currentTotalPrice = parseFloat(
        basePriceElement.textContent.replace(" BYN", "")
      );

      let currentWeight = 1;

      const activeOption = cartItem.querySelector(
        ".my__cart__item__info__option__active"
      );
      if (activeOption) {
        const optionText = activeOption.textContent;
        const weightValue = parseFloat(optionText.split(" ")[0]);
        if (!isNaN(weightValue)) {
          currentWeight = weightValue;
        }
      }

      const weightInput = cartItem.querySelector(".set__weight__input");
      if (weightInput && weightInput.value) {
        const inputValue = parseFloat(weightInput.value.replace(",", "."));
        if (!isNaN(inputValue) && inputValue > 0) {
          currentWeight = inputValue;
        }
      }

      count++;

      const totalWeight = currentWeight * count;

      const pricePerUnit = currentTotalPrice / (count - 1);
      const newTotalPrice = pricePerUnit * count;

      basePriceElement.textContent = newTotalPrice.toFixed(2) + " BYN";
      counter.textContent = count;

      const priceDifference = newTotalPrice - currentTotalPrice;
      fullPrice += priceDifference;

      if (promotion > 0) {
        const currentOldPrice = parseFloat(
          oldPriceElement.textContent.replace(" BYN", "")
        );
        const oldPricePerUnit = currentOldPrice / (count - 1);
        const newOldPrice = oldPricePerUnit * count;

        oldPriceElement.textContent = newOldPrice.toFixed(2) + " BYN";

        const oldPriceDifference = newOldPrice - currentOldPrice;
        fullOldPrice += oldPriceDifference;
      } else {
        fullOldPrice += priceDifference;
      }

      updateTotalCounter();
      updateBasketInLocalStorage(window.allProducts);
    });

    takeAway.addEventListener("click", function () {
      if (count > 1) {
        const currentTotalPrice = parseFloat(
          basePriceElement.textContent.replace(" BYN", "")
        );

        let currentWeight = 1;

        const activeOption = cartItem.querySelector(
          ".my__cart__item__info__option__active"
        );
        if (activeOption) {
          const optionText = activeOption.textContent;
          const weightValue = parseFloat(optionText.split(" ")[0]);
          if (!isNaN(weightValue)) {
            currentWeight = weightValue;
          }
        }

        const weightInput = cartItem.querySelector(".set__weight__input");
        if (weightInput && weightInput.value) {
          const inputValue = parseFloat(weightInput.value.replace(",", "."));
          if (!isNaN(inputValue) && inputValue > 0) {
            currentWeight = inputValue;
          }
        }

        count--;

        const totalWeight = currentWeight * count;

        const pricePerUnit = currentTotalPrice / (count + 1);
        const newTotalPrice = pricePerUnit * count;

        basePriceElement.textContent = newTotalPrice.toFixed(2) + " BYN";
        counter.textContent = count;

        const priceDifference = newTotalPrice - currentTotalPrice;
        fullPrice += priceDifference;

        if (promotion > 0) {
          const currentOldPrice = parseFloat(
            oldPriceElement.textContent.replace(" BYN", "")
          );
          const oldPricePerUnit = currentOldPrice / (count + 1);
          const newOldPrice = oldPricePerUnit * count;

          oldPriceElement.textContent = newOldPrice.toFixed(2) + " BYN";

          const oldPriceDifference = newOldPrice - currentOldPrice;
          fullOldPrice += oldPriceDifference;
        } else {
          fullOldPrice += priceDifference;
        }

        updateTotalCounter();
        updateBasketInLocalStorage(window.allProducts);
      }
    });
  }

  function updateTotalCounter() {
    const totalPriceElement = document.querySelector(".my__cart__total__price");
    const totalProductElement = document.querySelector(
      ".my__cart__total__product"
    );
    const totalPriceContainer = document.querySelector(
      ".my__cart__total__wrap"
    );
    const cartItems = document.querySelectorAll(".my__cart__item");

    const totalProducts = cartItems.length;

    totalPriceElement.textContent = fullPrice.toFixed(0) + " BYN";

    let oldPriceElement = document.querySelector(
      ".my__cart__old__total__price"
    );

    let hasDiscountItems = false;

    for (const item of cartItems) {
      const discountBadge = item.querySelector(
        ".popular__product__sale__badge__basket"
      );
      if (discountBadge) {
        hasDiscountItems = true;
        break;
      }
    }

    if (hasDiscountItems && fullOldPrice > fullPrice) {
      if (!oldPriceElement) {
        oldPriceElement = document.createElement("span");
        oldPriceElement.className = "my__cart__old__total__price";
        totalPriceElement.after(oldPriceElement);
      }
      oldPriceElement.textContent = fullOldPrice.toFixed(0) + " BYN";
    } else if (oldPriceElement) {
      oldPriceElement.remove();
    }

    let productText = "товаров";
    if (totalProducts === 1) productText = "товар";
    else if (totalProducts >= 2 && totalProducts <= 4) productText = "товара";

    totalProductElement.textContent = totalProducts + " " + productText;
  }

  function ItemRemove(allProducts) {
    const removeButtons = document.querySelectorAll(".my__cart__item__remove");

    for (const button of removeButtons) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const cartItem = this.closest(".my__cart__item");
        const cartID = parseInt(cartItem.dataset.productID);
        const itemPrice = parseFloat(
          cartItem
            .querySelector(".my__cart__item__price")
            .textContent.replace(" BYN", "")
        );

        const product = allProducts.find((p) => p.id === cartID);
        const discountPercent = product ? product.sale?.percent || 0 : 0;

        let basketItems = JSON.parse(localStorage.getItem("basketItem")) || [];
        let updateBasket = [];

        for (const item of basketItems) {
          if (item.productId !== cartID) {
            updateBasket.push(item);
          }
        }

        localStorage.setItem("basketItem", JSON.stringify(updateBasket));

        fullPrice -= itemPrice;

        if (discountPercent > 0) {
          const originalPrice = itemPrice / (1 - discountPercent / 100);
          fullOldPrice -= originalPrice;
        } else {
          fullOldPrice -= itemPrice;
        }

        cartItem.remove();

        const remainingItems = document.querySelectorAll(".my__cart__item");

        if (remainingItems.length === 0) {
          container.innerHTML = `
              <div class="empty__cart">
              <div class="empty__img">
              <img src="./img/image 23 empty.jpg" alt="empty-cart" />
              </div>
              <h3 class="empty__cart__title">
              В корзине нет товаров. Выберите нужные товары в нашем каталоге
              </h3>
              <a href="./catalog.html" class="go__to__catalog"
              >Перейти в каталог товаров</a>
              </div>
              `;
        } else {
          updateTotalCounter();
        }

        console.log("Товар удален! ID:", cartID);
      });
    }
  }

  function updateBasketInLocalStorage(allProducts) {
    const basketItems = document.querySelectorAll(".my__cart__item");
    const updatedBasket = [];

    for (const item of basketItems) {
      const productId = parseInt(item.dataset.productID);
      const price = parseFloat(
        item
          .querySelector(".my__cart__item__price")
          .textContent.replace(" BYN", "")
      );
      const counter = parseInt(
        item.querySelector(".product__page__pay__counter").textContent
      );

      let packaging = null;
      const activeOption = item.querySelector(
        ".my__cart__item__info__option__active"
      );
      if (activeOption) {
        packaging = activeOption.textContent.trim();
      } else {
        packaging = null;
      }

      const weightInput = item.querySelector(".set__weight__input");
      let customWeight = null;
      if (weightInput && weightInput.value) {
        customWeight = weightInput.value;
      }

      updatedBasket.push({
        productId: productId,
        price: price,
        packaging: packaging,
        quantity: counter,
        customWeight: customWeight,
      });
    }

    localStorage.setItem("basketItem", JSON.stringify(updatedBasket));
    console.log("Корзина обновлена в localStorage:", updatedBasket);
  }

  function transferDataOrder() {
    const orderButton = document.querySelector(".my__cart__btn");

    orderButton.addEventListener("click", function (e) {
      e.preventDefault();

      const basketItems = getBasketItemIds();

      if (basketItems.length === 0) {
        alert("Корзина пуста! Добавьте товары перед оформлением заказа.");
        return;
      }

      const orderData = {
        basketItems: basketItems,
        totalPrice: fullPrice,
        totalItems: basketItems.length,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("orderData", JSON.stringify(orderData));
      window.location.href = "order.html";
    });
  }
});
