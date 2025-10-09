"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-list");
  let cardsData = [];
  let filteredCardsData = [];
  let currentPage = 1;
  let cardsPerPage = getCardsPerPage();

  const paginationContainer = document.querySelector(
    ".products__catalog__products__list__slider__pangination"
  );
  const prevButton = document.querySelector(
    ".products__catalog__products__list__slider__item__switch:first-child"
  );
  const nextButton = document.querySelector(
    ".products__catalog__products__list__slider__item__switch:last-child"
  );

  function getCardsPerPage() {
    return window.innerWidth <= 992 ? 16 : 15;
  }

  prevButton.addEventListener("click", goToPrevPage);
  nextButton.addEventListener("click", goToNextPage);

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
    cardsPerPage = getCardsPerPage();
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = filteredCardsData.slice(startIndex, endIndex);
    createCards(currentCards);
    updatePaginationStyles();
  }

  async function fetchAllProducts() {
    let allProducts = [];
    let nextUrl =
      "https://oliver1ck.pythonanywhere.com/api/get_products_filter/?order=date_create";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok)
          throw new Error(`HTTP Error! status: ${response.status}`);

        const data = await response.json();
        if (data.results && data.results.length > 0) {
          allProducts = [...allProducts, ...data.results];
        }

        nextUrl = data.next;
      }

      console.log("Все товары загружены. Всего:", allProducts.length);
      return allProducts;
    } catch (error) {
      console.error("Ошибка при загрузке товаров:", error);
      throw error;
    }
  }

  fetchAllProducts()
    .then((data) => {
      console.log("данные товаров", data);
      cardsData = data || [];
      filteredCardsData = [...cardsData];
      container.innerHTML = "";

      if (cardsData.length === 0) {
        container.innerHTML = "<p>Товары не найдены</p>";
        return;
      }

      const totalPages = Math.ceil(cardsData.length / cardsPerPage);
      createPagination(totalPages);
      updateCardsDisplay();

      document.dispatchEvent(new CustomEvent("productsLoaded"));
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
          <a href="product__page.html?id=${
            product.id
          }" class="products__catalog__products__card__photo__link">
            <img class="products__catalog__products__card__photo__img" src="${
              product.image_prev
            }" alt="${product.title}" />
          </a>
          <a href="product__page.html?id=${
            product.id
          }" class="products__catalog__products__card__title__link">${
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
            <button class="products__catalog__products__card__basked__add" data-product-id="${
              product.id
            }">
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
    addToBasket(cardsData);
  }

  function addToBasket(cardsData) {
    const addToCartBtn = document.querySelectorAll(
      ".products__catalog__products__card__basked__add"
    );

    for (const cart of addToCartBtn) {
      cart.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        const card = this.closest(".products__catalog__products__card");
        const productId = this.getAttribute("data-product-id");

        const priceElement = card.querySelector(
          ".products__catalog__products__card__pay__price__p"
        );
        const oldPriceElement = card.querySelector(
          ".products__catalog__products__card__pay__price__old"
        );
        const activeQuantity = card.querySelector(
          ".products__catalog__products__card__quantity__active"
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

        const product = cardsData.find((p) => p.id === parseInt(productId));

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

  window.addEventListener("resize", () => {
    const newCardsPerPage = getCardsPerPage();
    if (newCardsPerPage !== cardsPerPage) {
      cardsPerPage = newCardsPerPage;
      currentPage = 1;
      updateCardsDisplay();
    }
  });

  function sortProducts(sortType) {
    if (!filteredCardsData || filteredCardsData.length === 0) return;

    switch (sortType) {
      case "name_asc":
        filteredCardsData.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name_desc":
        filteredCardsData.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price_asc":
        filteredCardsData.sort((a, b) => {
          const priceA =
            parseFloat(a.price) * (1 - (a.sale?.percent || 0) / 100);
          const priceB =
            parseFloat(b.price) * (1 - (b.sale?.percent || 0) / 100);
          return priceA - priceB;
        });
        break;
      case "price_desc":
        filteredCardsData.sort((a, b) => {
          const priceA =
            parseFloat(a.price) * (1 - (a.sale?.percent || 0) / 100);
          const priceB =
            parseFloat(b.price) * (1 - (b.sale?.percent || 0) / 100);
          return priceB - priceA;
        });
        break;
      case "popularity":
        filteredCardsData.sort(
          (a, b) => (b.sales_counter || 0) - (a.sales_counter || 0)
        );
        break;
      case "date":
      default:
        const originalOrder = new Map(
          cardsData.map((item, index) => [item.id, index])
        );
        filteredCardsData.sort(
          (a, b) => originalOrder.get(a.id) - originalOrder.get(b.id)
        );
        break;
    }

    currentPage = 1;
    createPagination(Math.ceil(filteredCardsData.length / cardsPerPage));
    updateCardsDisplay();
  }

  document.addEventListener("filterProducts", (e) => {
    const { animalType, categoryId, promotionalOnly, brandIds, sortType } =
      e.detail;

    filteredCardsData = cardsData.filter((product) => {
      const animalMatch =
        !animalType ||
        product.animal.some((a) => a.type.toLowerCase() === animalType);
      const categoryMatch =
        !categoryId ||
        (product.category &&
          (Array.isArray(categoryId)
            ? categoryId.includes(String(product.category.id))
            : categoryId == product.category.id));
      const promotionalMatch =
        !promotionalOnly || (product.sale && product.sale.percent > 0);
      const brandMatch =
        !brandIds ||
        (product.brand && brandIds.includes(String(product.brand.id)));

      return animalMatch && categoryMatch && promotionalMatch && brandMatch;
    });

    document.dispatchEvent(
      new CustomEvent("updateBrandFilters", {
        detail: { products: filteredCardsData },
      })
    );

    if (sortType) {
      sortProducts(sortType);
    } else {
      currentPage = 1;
      createPagination(Math.ceil(filteredCardsData.length / cardsPerPage));
      updateCardsDisplay();
    }
  });

  document.addEventListener("sortProducts", (e) => {
    sortProducts(e.detail.sortType);
  });
});
