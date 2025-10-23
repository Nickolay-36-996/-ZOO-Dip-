"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const brandsContainer = document.getElementById("brands-container");

  async function fetchAllBrands() {
    let allBrands = [];

    let nextUrl = "https://oliver1ck.pythonanywhere.com/api/get_brands_list/";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);

        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.results && data.results.length > 0) {
          allBrands = [...allBrands, ...data.results];
        }

        nextUrl = data.next;
        console.log("Следующая страница:", nextUrl);
      }

      console.log("Загрузка завершена! Всего брендов:", allBrands.length);

      return allBrands;
    } catch (error) {
      console.error("Ошибка при загрузке брендов:", error);
      throw error;
    }
  }

  fetchAllBrands()
    .then((allBrands) => {
      console.log("Всего брендов:", allBrands.length);
      showBrandsDisplay(allBrands);
    })

    .catch((error) => {
      console.error("❌ Ошибка загрузки брендов:", error);
    });

  function showBrandsDisplay(allBrands) {
    allBrands.sort(() => Math.random() - 0.5);

    for (const brand of allBrands) {
      const brandItem = document.createElement("div");
      brandItem.className = "brand__item";
      brandItem.innerHTML = `
        <img src="${brand.image}" class="brand__item__img" alt="${brand.name}">
        `;

      brandsContainer.appendChild(brandItem);
    }
  }
});
