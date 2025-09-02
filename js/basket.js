"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("basket-contain");

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
      const basketItems = getBsketItemIds();
      console.log("Товар в корзине", basketItems.length);

      if (basketItems.length > 0) {
        showBasketItems(allProducts);
      } else {
        console.log("Корзина пуста");
      }
    })
    .catch((error) => {
      console.error("Ошибка", error);
    });

  function getBsketItemIds() {
    return JSON.parse(localStorage.getItem("basketItem")) || [];
  }

  function showBasketItems(allProducts) {
    container.innerHTML = "";
    const basketItems = getBsketItemIds();

    const myCart = document.createElement("div");
    myCart.className = "my__cart";
    myCart.innerHTML = `
    <h1 class="my__cart__title">Моя корзина</h1>
    <div class="my__cart__wrap">
    <div class="my__cart__items" id="cart-items"></div>
    <div class="my__cart__total">
    <div class="my__cart__total__wrap">
    <span class="my__cart__total__price">0 BYN</span>
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
  }

  function createCartItem(allProducts, basketItems) {
    const cartItemsContainer = document.getElementById("cart-items");

    cartItemsContainer.innerHTML = "";

    for (const itemID of basketItems) {
      let product = null;
      for (const currentProduct of allProducts) {
        if (currentProduct.id === itemID) {
          product = currentProduct;
          break;
        }
      }
      if (product) {
        const cartItem = document.createElement("div");
        cartItem.className = "my__cart__item";
        cartItem.innerHTML = `
      <img src="${product.image_prev}" alt="${product.image_prev}" class="my__cart__item__img">
      <div class="my__cart__item__info">
      <h3 class="my__cart__item__info__title">${product.title}</h3>
      <div class="my__cart__item__info__options"></div>
      </div>
      `;
        cartItemsContainer.appendChild(cartItem);

        weightOptions(product, cartItem);
      }
    }
  }

  function weightOptions(product, cartItem) {
    const optionsContainer = cartItem.querySelector(".my__cart__item__info__options");

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
      const optionElement = document.createElement("span");
      optionElement.className = "my__cart__item__info__option";
      optionElement.innerHTML = `${option.value} ${option.unit}`;

      optionsContainer.appendChild(optionElement);
    }
  }
});
