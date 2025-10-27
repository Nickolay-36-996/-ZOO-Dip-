"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const salesContainer = document.getElementById("promotions-wrap");

  async function fetchAllSales() {
    let allSales = [];

    let nextUrl = "https://oliver1ck.pythonanywhere.com/api/get_sales_list/";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          allSales = [...allSales, ...data.results];
        }

        nextUrl = data.next;
        console.log("Следующая страница:", nextUrl);
      }

      console.log("Загрузка завершена! Всего акций:", allSales.length);

      return allSales;
    } catch (error) {
      console.error("Ошибка при загрузке акций:", error);
      throw error;
    }
  }

  fetchAllSales()
    .then((allSales) => {
      console.log("Всего акций:", allSales.length);
      showSalesDisplay(allSales);
    })

    .catch((error) => {
      console.error("❌ Ошибка загрузки акций:", error);
    });

  function showSalesDisplay(allSales) {
    allSales.sort(() => Math.random() - 0.5);

    for (const sale of allSales) {
      const promotionItem = document.createElement("div");
      promotionItem.classList = "promotion__item";
      promotionItem.innerHTML = `
      <h2 class="promotion__title">${sale.title}</h2>
      <h3 class="promotion__title__percent">${sale.percent} %</h3>
      <div class="promotion__img__wrap">
      <img class="promotion__img" src="${sale.image}" alt="${sale.title}">
      </div>
      <p class="promotion__date__sales">${sale.start_sale}</p>
      <p class="promotion__date__sales">${sale.stop_sale}</p>
      `;

      salesContainer.appendChild(promotionItem);

      if (sale.percent <= 0) {
        promotionItem.classList.add("promotion__item__hide");
      }
    }
  }
});
