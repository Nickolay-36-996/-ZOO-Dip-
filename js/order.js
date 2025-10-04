"use strict";
document.addEventListener("DOMContentLoaded", () => {
  function getOrderData() {
    return JSON.parse(localStorage.getItem("orderData")) || null;
  }

  function showDataBasket() {
    const container = document.querySelector(".registration__order__quantity");
    const priceContainer = document.querySelector(".registration__order__price__box");
    const orderData = getOrderData();

    if (!container) return;

    if (!orderData) {
      container.innerHTML = `
        <div class="empty__order__message">
          <p>Нет данных о заказе. Вернитесь в корзину.</p>
          <a href="basket.html" class="back__to__basket">Вернуться в корзину</a>
        </div>
      `;
      return;
    }

    const hasTotalPrice = orderData.hasOwnProperty("totalPrice");
    const hasTotalItems = orderData.hasOwnProperty("totalItems");

    if (!hasTotalPrice || !hasTotalItems) {
      container.innerHTML = `
      <div class="empty__order__message">
        <p>Данные заказа неполные. Вернитесь в корзину.</p>
        <a href="basket.html" class="back__to__basket">Вернуться в корзину</a>
      </div>
    `;
      return;
    }

    const totalPrice = orderData.totalPrice;
    const totalOldPrice = orderData.oldTotalPrice;
    const totalItems = orderData.totalItems;

    let productText = "товаров";
    if (totalItems === 1) productText = "товар";
    else if (totalItems >= 2 && totalItems <= 4) productText = "товара";

    if (orderData.oldTotalPrice) {
      const priceElement = document.createElement("div");
      priceElement.className = "registration__order__quantity__price";
      priceElement.textContent = `${totalPrice.toFixed(2)} BYN`;

      priceContainer.appendChild(priceElement);

      const oldPriceElement = document.createElement("div");
      oldPriceElement.className = "registration__order__quantity__old__price";
      oldPriceElement.textContent = `${totalOldPrice.toFixed(2)} BYN`;

      priceContainer.appendChild(oldPriceElement);

    } else {
      const priceElement = document.createElement("div");
      priceElement.className = "registration__order__quantity__price";
      priceElement.textContent = `${totalPrice.toFixed(2)} BYN`;
      priceContainer.appendChild(priceElement);
    }

    const quantityElement = document.createElement("div");
    quantityElement.className = "registration__order__quantity__qnt";
    quantityElement.textContent = `${totalItems} ${productText}`;

    container.appendChild(quantityElement);

    console.log("✅ Данные заказа отображены:");
    console.log("Общая цена:", totalPrice.toFixed(2) + " BYN");
    console.log("Количество позиций:", totalItems);
  }

  showDataBasket();
});
