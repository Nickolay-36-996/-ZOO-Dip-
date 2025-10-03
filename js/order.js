"use strict";
document.addEventListener("DOMContentLoaded", () => {
  function getOrderData() {
    return JSON.parse(localStorage.getItem("orderData")) || null;
  }

  function showDataBasket() {
    const container = document.querySelector(".registration__order__quantity");
    const orderData = getOrderData();

    if (!container) return;

    container.innerHTML = "";

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
    const totalItems = orderData.totalItems;

    let productText = "товаров";
    if (totalItems === 1) productText = "товар";
    else if (totalItems >= 2 && totalItems <= 4) productText = "товара";

    const priceElement = document.createElement("div");
    priceElement.className = "registration__order__quantity__price";
    priceElement.textContent = `${totalPrice.toFixed(2)} BYN`;

    const quantityElement = document.createElement("div");
    quantityElement.className = "registration__order__quantity__qnt";
    quantityElement.textContent = `${totalItems} ${productText}`;

    container.appendChild(priceElement);
    container.appendChild(quantityElement);

    console.log("✅ Данные заказа отображены:");
    console.log("Общая цена:", totalPrice.toFixed(2) + " BYN");
    console.log("Количество позиций:", totalItems);
  }

  showDataBasket();
});
