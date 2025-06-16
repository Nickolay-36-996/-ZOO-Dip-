"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const revealSelect = document.querySelector(".select__icon");
  const selectList = document.querySelector(
    ".products__catalog__sort__select__list"
  );
  revealSelect.addEventListener("click", function () {
    selectList.classList.toggle(
      "products__catalog__sort__select__list__active"
    );
    revealSelect.classList.toggle("select__icon__active");
  });

  const promotionalIndicator = document.querySelector(
    ".promotional__item__indicator"
  );
  promotionalIndicator.addEventListener("click", function () {
    promotionalIndicator.classList.toggle(
      "promotional__item__indicator__active"
    );
  });

  document
    .querySelector(".products__catalog__filter__type__list")
    .addEventListener("click", function (e) {
      const indicator = e.target.closest(
        ".products__catalog__filter__type__indicator"
      );
      if (indicator) {
        document
          .querySelectorAll(".products__catalog__filter__type__indicator")
          .forEach((el) => {
            el.classList.remove(
              "products__catalog__filter__type__indicator__active"
            );
          });
        indicator.classList.add(
          "products__catalog__filter__type__indicator__active"
        );
      }
    });

  const container = document.getElementById("products-list");
  let cardsData = [];

  fetch("https://oliver1ck.pythonanywhere.com/api/get_products_list/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("данные товаров", data);
      cardsData = data.result || [];
      container.innerHTML = "";

      if (cardsData.length === 0) {
        container.innerHTML = "<p>Товары не найдены</p>";
        return;
      }

      createCards(cardsData);
    })
    .catch((error) => {
      console.error("Ошибка загрузки:", error);
      container.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
    });

  function createCards(cardsData) {
    container.innerHTML = "";

    for (cards of cardsData) {
      const card = document.createElement("div");
      card.className = "products__catalog__products__card";

      card.innerHTML = `
      <div class="products__catalog__products__card__info">
      <a href="#" class="products__catalog__products__card__photo__link">
      <img class="products__catalog__products__card__photo__img" src="${
        cards.image_prev
      }" alt="${cards.title}" />
      </a>
      <a href="#" class="products__catalog__products__card__title__link">${
        cards.title
      }</a>
      </div>
      <div class="products__catalog__products__card__quantity__container">
      <div class="products__catalog__products__card__quantity__box">${
        quantityOptions ||
        '<span class="products__catalog__products__card__quantity">1 шт.</span>'
      }</div>
      </div>
      <div class="products__catalog__products__card__pay"></div>
      `;
      container.appendChild(card);
    }
  }
});
