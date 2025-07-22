"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const animalCategories = document.querySelectorAll(
    ".animal__category__catalog"
  );
  let currentAnimalFilter = null;
  let currentCategoryFilter = null;
  let currentPromotionalFilter = false;
  let currentBrandFilter = null;

  const revealSelect = document.querySelector(
    ".products__catalog__sort__select"
  );
  const selectList = document.querySelector(
    ".products__catalog__sort__select__list"
  );
  const revealSelectIndicator = document.querySelector(".select__icon");
  revealSelect.addEventListener("click", function () {
    selectList.classList.toggle(
      "products__catalog__sort__select__list__active"
    );
    revealSelectIndicator.classList.toggle("select__icon__active");
  });

  const promotionalIndicator = document.querySelector(
    ".promotional__item__indicator"
  );
  const promotional = document.querySelector(".promotional__item__lbl");
  promotional.addEventListener("click", function () {
    promotionalIndicator.classList.toggle(
      "promotional__item__indicator__active"
    );
    currentPromotionalFilter = promotionalIndicator.classList.contains(
      "promotional__item__indicator__active"
    );

    const activeAnimalLink = document.querySelector(
      ".animal__category__catalog__active"
    );
    const animalType = activeAnimalLink
      ? activeAnimalLink.dataset.animalType
      : null;

    const activeCategoryItem = document.querySelector(
      ".products__catalog__filter__type__indicator__active"
    );
    const categoryId =
      activeCategoryItem?.closest(
        ".products__catalog__filter__type__list__item"
      )?.dataset.categoryId || null;

    const event = new CustomEvent("filterProducts", {
      detail: {
        animalType: animalType,
        categoryId: categoryId,
        promotionalOnly: currentPromotionalFilter,
      },
    });
    document.dispatchEvent(event);
  });

  const container = document.getElementById("products-list");
  let cardsData = [];
  let filteredCardsData = [];

  const paginationContainer = document.querySelector(
    ".products__catalog__products__list__slider__pangination"
  );
  let currentPage = 1;
  const cardsPerPage = 12;

  const prevButton = document.querySelector(
    ".products__catalog__products__list__slider__item__switch:first-child"
  );
  const nextButton = document.querySelector(
    ".products__catalog__products__list__slider__item__switch:last-child"
  );

  function goToPrevPage() {
    if (currentPage > 1) {
      currentPage--;
      updateCardsDisplay();
      updatePaginationStyles();
    }
  }

  function goToNextPage() {
    const totalPages = Math.ceil(filteredCardsData.length / cardsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      updateCardsDisplay();
      updatePaginationStyles();
    }
  }

  prevButton.addEventListener("click", goToPrevPage);
  nextButton.addEventListener("click", goToNextPage);

  function createPagination(totalPages) {
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.className =
        "products__catalog__products__list__slider__pangination__item";

      if (i === 1) {
        pageItem.classList.add(
          "products__catalog__products__list__slider__pangination__item__active"
        );
      }

      pageItem.addEventListener("click", () => {
        currentPage = i;
        updateCardsDisplay();
      });

      pageItem.textContent = i;
      paginationContainer.appendChild(pageItem);
    }
  }

  function updatePaginationStyles() {
    const items = document.querySelectorAll(
      ".products__catalog__products__list__slider__pangination__item"
    );
    for (const item of items) {
      item.classList.remove(
        "products__catalog__products__list__slider__pangination__item__active"
      );
      if (parseInt(item.textContent) === currentPage) {
        item.classList.add(
          "products__catalog__products__list__slider__pangination__item__active"
        );
      }
    }
  }

  function updateCardsDisplay() {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = filteredCardsData.slice(startIndex, endIndex);
    createCards(currentCards);
    updatePaginationStyles();
  }

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  document.addEventListener("filterProducts", (e) => {
    const { animalType, categoryId, promotionalOnly } = e.detail;

    if (animalType !== undefined) currentAnimalFilter = animalType;
    if (categoryId !== undefined) currentCategoryFilter = categoryId;
    if (promotionalOnly !== undefined)
      currentPromotionalFilter = promotionalOnly;

    filteredCardsData = cardsData.filter((product) => {
      const animalMatch =
        !currentAnimalFilter ||
        product.animal.some(
          (a) => a.type.toLowerCase() === currentAnimalFilter
        );

      const categoryMatch =
        !currentCategoryFilter ||
        (product.category && product.category.id == currentCategoryFilter);

      const promotionalMatch =
        !currentPromotionalFilter || (product.sale && product.sale.percent > 0);

      return animalMatch && categoryMatch && promotionalMatch;
    });

    updateActiveFilters();
    filteredCardsData = shuffleArray(filteredCardsData);
    currentPage = 1;
    createPagination(Math.ceil(filteredCardsData.length / cardsPerPage));
    updateCardsDisplay();
  });

  function updateActiveFilters() {
    const animalCategories = document.querySelectorAll(
      ".animal__category__catalog"
    );
    for (const item of animalCategories) {
      item.classList.toggle(
        "animal__category__catalog__active",
        item.dataset.animalType === currentAnimalFilter
      );
    }

    const filterItems = document.querySelectorAll(
      ".products__catalog__filter__type__list__item"
    );
    for (const item of filterItems) {
      const indicator = item.querySelector(
        ".products__catalog__filter__type__indicator"
      );
      if (indicator) {
        const isActive = item.dataset.categoryId
          ? item.dataset.categoryId == currentCategoryFilter
          : item.dataset.animalType === currentAnimalFilter ||
            item
              .querySelector(".products__catalog__filter__type__txt")
              ?.textContent.toLowerCase() === currentAnimalFilter;

        indicator.classList.toggle(
          "products__catalog__filter__type__indicator__active",
          isActive
        );
      }
    }
  }

  function loadBrandFilters(products) {
    const brandList = document.querySelector(
      ".products__catalog__filter__brand__list"
    );
    brandList.innerHTML = "";

    const brandCounts = {};
    const brandHasSale = {};

    for (const product of products) {
      if (product.brand) {
        const brandId = product.brand.id;
        if (!brandCounts[brandId]) {
          brandCounts[brandId] = {
            name: product.brand.name,
            count: 0,
            hasSale: false,
          };
        }
        brandCounts[brandId].count++;

        if (product.sale && product.sale.percent > 0) {
          brandCounts[brandId].hasSale = true;
        }
      }
    }

    for (const [brandId, brandInfo] of Object.entries(brandCounts)) {
      const item = document.createElement("div");
      item.className = "products__catalog__filter__brand__item";
      item.dataset.brandId = brandId;

      item.innerHTML = `
      <div class="products__catalog__filter__brand__indicator"></div>
      <p class="products__catalog__filter__brand__txt">${brandInfo.name}</p>
      <span class="products__catalog__filter__brand__count">(${
        brandInfo.count
      })</span>
      ${
        brandInfo.hasSale
          ? '<span class="products__catalog__filter__brand__sale">Акция</span>'
          : ""
      }
    `;

      item.addEventListener("click", () => {
        const indicator = item.querySelector(
          ".products__catalog__filter__brand__indicator"
        );
        indicator.classList.toggle(
          "products__catalog__filter__brand__indicator__active"
        );

        const selectedBrands = [];
        const activeIndicators = document.querySelectorAll(
          ".products__catalog__filter__brand__indicator__active"
        );

        for (const indicator of activeIndicators) {
          const brandId = indicator.closest(
            ".products__catalog__filter__brand__item"
          ).dataset.brandId;
          selectedBrands.push(brandId);
        }

        currentBrandFilter = selectedBrands.length > 0 ? selectedBrands : null;
        filterProductsByBrand();
      });

      brandList.appendChild(item);
    }
  }

  function filterProductsByBrand() {
    const activeAnimalLink = document.querySelector(
      ".animal__category__catalog__active"
    );
    const animalType = activeAnimalLink
      ? activeAnimalLink.dataset.animalType
      : null;

    const activeCategoryItem = document.querySelector(
      ".products__catalog__filter__type__indicator__active"
    );
    const categoryId =
      activeCategoryItem?.closest(
        ".products__catalog__filter__type__list__item"
      )?.dataset.categoryId || null;

    const promotionalIndicator = document.querySelector(
      ".promotional__item__indicator"
    );
    const promotionalOnly = promotionalIndicator.classList.contains(
      "promotional__item__indicator__active"
    );

    const event = new CustomEvent("filterProducts", {
      detail: {
        animalType: animalType,
        categoryId: categoryId,
        promotionalOnly: promotionalOnly,
        brandIds: currentBrandFilter,
      },
    });
    document.dispatchEvent(event);
  }

  document.addEventListener("filterProducts", (e) => {
    const { animalType, categoryId, promotionalOnly, brandIds } = e.detail;

    if (animalType !== undefined) currentAnimalFilter = animalType;
    if (categoryId !== undefined) currentCategoryFilter = categoryId;
    if (promotionalOnly !== undefined)
      currentPromotionalFilter = promotionalOnly;
    if (brandIds !== undefined) currentBrandFilter = brandIds;

    filteredCardsData = [];

    for (const product of cardsData) {
      const animalMatch =
        !currentAnimalFilter ||
        product.animal.some(
          (a) => a.type.toLowerCase() === currentAnimalFilter
        );

      const categoryMatch =
        !currentCategoryFilter ||
        (product.category && product.category.id == currentCategoryFilter);

      const promotionalMatch =
        !currentPromotionalFilter || (product.sale && product.sale.percent > 0);

      const brandMatch =
        !currentBrandFilter ||
        (product.brand &&
          currentBrandFilter.includes(String(product.brand.id)));

      if (animalMatch && categoryMatch && promotionalMatch && brandMatch) {
        filteredCardsData.push(product);
      }
    }

    updateActiveFilters();
    filteredCardsData = shuffleArray(filteredCardsData);
    currentPage = 1;
    createPagination(Math.ceil(filteredCardsData.length / cardsPerPage));
    updateCardsDisplay();
  });

  fetch("https://oliver1ck.pythonanywhere.com/api/get_products_list/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP Error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("данные товаров", data);
      cardsData = data.results || [];
      filteredCardsData = shuffleArray([...cardsData]);
      container.innerHTML = "";

      if (cardsData.length === 0) {
        container.innerHTML = "<p>Товары не найдены</p>";
        return;
      }

      loadBrandFilters(cardsData);

      const totalPages = Math.ceil(cardsData.length / cardsPerPage);
      createPagination(totalPages);
      updateCardsDisplay();
    })
    .catch((error) => {
      console.error("Ошибка загрузки:", error);
      container.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
    });

  function createCards(cardsData) {
    container.innerHTML = "";

    for (const product of cardsData) {
      const card = document.createElement("div");
      card.className = "products__catalog__products__card";
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
            return `<span class="products__catalog__products__card__quantity" 
                     data-count="${item.value}">
                     ${item.value} ${item.unit}
                   </span>`;
          })
          .join("");
      }

      const displayPrice = discountedPrice.toFixed(2);
      const displayOldPrice = basePrice.toFixed(2);

      card.innerHTML = `
        <div class="products__catalog__products__card__info">
        ${
          discountPercent > 0
            ? `<div class="products__catalog__products__card__sale__badge">Акция</div>`
            : ""
        }
          <a href="#" class="products__catalog__products__card__photo__link">
            <img class="products__catalog__products__card__photo__img" src="${
              product.image_prev
            }" alt="${product.title}" />
          </a>
          <a href="#" class="products__catalog__products__card__title__link">${
            product.title
          }</a>
        </div>
        <div class="products__catalog__products__card__quantity__container">
          <div class="products__catalog__products__card__quantity__box">
            ${
              quantityOptions ||
              '<span class="products__catalog__products__card__quantity" data-count="1">1 шт.</span>'
            }
          </div>
        </div>
        <div class="products__catalog__products__card__pay">
          <div class="products__catalog__products__card__pay__price">
            ${
              discountPercent > 0
                ? `
                <div class="products__catalog__products__card__pay__price__box">
                  <p class="products__catalog__products__card__pay__price__old">${displayOldPrice} BYN</p>
                  <p class="products__catalog__products__card__pay__price__p">${displayPrice} BYN</p>
                </div>
            `
                : `
              <p class="products__catalog__products__card__pay__price__p">${displayPrice} BYN</p>
            `
            }
            <button class="products__catalog__products__card__basked__add">
              <div class="products__catalog__products__card__basked__img__box">
                <svg class="products__catalog__products__card__basked__img__box" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1 1C1 0.447715 1.44932 0 2.00358 0H3.50894C4.34034 0 5.01431 0.671572 5.01431 1.5V2.06055L17.5883 2.96818C18.4651 3.02278 19.1089 3.81081 18.9846 4.67739L18.1194 10.7121C18.0135 11.4511 17.3783 12 16.6292 12H5.01431V14H15.0572C16.72 14 18.068 15.3431 18.068 17C18.068 18.6569 16.72 20 15.0572 20C13.3945 20 12.0465 18.6569 12.0465 17C12.0465 16.6494 12.1069 16.3128 12.2178 16H6.85015C6.9611 16.3128 7.02147 16.6494 7.02147 17C7.02147 18.6569 5.67352 20 4.01073 20C2.34795 20 1 18.6569 1 17C1 15.6938 1.83779 14.5825 3.00716 14.1707V3.00923C3.00711 3.00372 3.00711 2.99821 3.00716 2.99268V2H2.00358C1.44932 2 1 1.55228 1 1ZM5.01431 4.06445V10H16.194L16.9208 4.93051L5.01431 4.06445ZM14.0537 17C14.0537 16.4477 14.503 16 15.0572 16C15.6115 16 16.0608 16.4477 16.0608 17C16.0608 17.5523 15.6115 18 15.0572 18C14.503 18 14.0537 17.5523 14.0537 17ZM3.00716 17C3.00716 16.4477 3.45647 16 4.01073 16C4.56499 16 5.01431 16.4477 5.01431 17C5.01431 17.5523 4.56499 18 4.01073 18C3.45647 18 3.00716 17.5523 3.00716 17Z" fill="#5C5F62"/>
                </svg>
                <div class="products__catalog__products__card__basket__img">
                  <svg class="products__catalog__products__card__plus__img" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.871582 5.46973H4.10889V8.72168H5.55908V5.46973H8.80371V4.01221H5.55908V0.760254H4.10889V4.01221H0.871582V5.46973Z" fill="#5C5F62"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <button class="products__catalog__products__card__pay__btn">Купить в 1 клик</button>
        </div>`;

      container.appendChild(card);

      const quantityBox = card.querySelector(
        ".products__catalog__products__card__quantity__box"
      );
      const priceElement = card.querySelector(
        ".products__catalog__products__card__pay__price__p"
      );
      const oldPriceElement = card.querySelector(
        ".products__catalog__products__card__pay__price__old"
      );

      if (quantityBox) {
        const quantityElements = quantityBox.querySelectorAll(
          ".products__catalog__products__card__quantity"
        );
        for (const element of quantityElements) {
          element.addEventListener("click", function () {
            const isActive = this.classList.contains(
              "products__catalog__products__card__quantity__active"
            );
            for (const el of quantityElements) {
              el.classList.remove(
                "products__catalog__products__card__quantity__active"
              );
            }

            if (!isActive) {
              this.classList.add(
                "products__catalog__products__card__quantity__active"
              );
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
});
