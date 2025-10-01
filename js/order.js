"use strict";
document.addEventListener("DOMContentLoaded", () => {
  function getOrderData() {
    return JSON.parse(localStorage.getItem("orderData")) || null;
  }

  function showDataBasket() {
    const container = document.querySelector(".registration__order__quantity");
    const orderData = getOrderData();
  }
});
