"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const productPage = document.getElementById("product-page-wrap");
  const nav = document.querySelector(".catalog__nav__list");
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  let currentWeight = 1;
  let currentPrice = 0;
  let oldPrice = 0;
  let count = 1;

  if (!productId) {
    productPage.innerHTML = "<p>Товар не найден</p>";
    return;
  }

  function updateNavigation(productTitle) {
    if (!nav) return;
    const articleNavItem = document.createElement("li");
    articleNavItem.className = "catalog__nav__list__item";

    articleNavItem.innerHTML = `
    <a href="${window.location.href}" class="catalog__nav__list__item__link catalog__nav__list__item__link__article">
      ${productTitle}
    </a>
  `;

    nav.appendChild(articleNavItem);
  }

  async function fetchAllProducts() {
    let allProducts = [];
    let nextUrl =
      "https://oliver1ck.pythonanywhere.com/api/get_products_filter/?order=date_create";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
      const product = allProducts.find((item) => item.id === productId);

      if (product) {
        createProductPage(product);
      } else {
        productPage.innerHTML = `<div class="no__product"><h3>Продукт не найден</h3></div>`;
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      productPage.innerHTML = `<p>Ошибка загрузки товара: ${error.message}</p>`;
    });

  function createProductPage(product) {
    document.title = `${product.title}`;
    updateNavigation(product.title);
    const hasKeyFeatures =
      product.key_features && product.key_features.trim().length > 0;
    const hasCompound = product.compound && product.compound.trim().length > 0;
    const hasGuarantedAnalysis =
      product.guaranteed_analysis &&
      product.guaranteed_analysis.trim().length > 0;
    const hasNutritionalSupplements =
      product.nutritional_supplements &&
      product.nutritional_supplements.trim().length > 0;

    const basePrice = parseFloat(product.price) || 0;
    const promotion = product.sale?.percent || 0;
    const discountedPrice = basePrice * (1 - promotion / 100);

    productPage.innerHTML = `
    <div class="product__page__title__wrap">
    <h1 class="product__page__title">${product.title}</h1>
    ${
      promotion > 0
        ? `
      <div class="sale__badge__page">Акция</div>`
        : ""
    }
    </div>
    <div class="product__page__contain">
    <div class="product__page__img__wrap">
    <img src="${product.image_prev}" alt="${
      product.image_prev
    }" class="product__page__img__main">
    </div>
    <div class="product__page__registration">
    <div class="product__page__weight">
    <h3 class="product__page__weight__title">Варианты фасовки.</h3>
    <div class="product__page__weight__option__wrap"></div>
    </div>
    <div class="product__page__pickup">
    <div class="product__page__pickup__img">
    <svg width="40" height="41" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_750_3493)">
    <path d="M19.0186 0.744205L3.58017 8.9399C3.15194 9.16721 2.88428 9.61237 2.88428 10.0973V30.6702C2.88428 31.5012 3.35123 32.2615 4.09221 32.6373L19.2314 40.316C19.7144 40.561 20.2854 40.561 20.7683 40.316L35.9076 32.6373C36.6486 32.2615 37.1155 31.501 37.1155 30.6702V10.0973C37.1155 9.61237 36.8479 9.16721 36.4195 8.9399L20.9813 0.744205C20.3677 0.418598 19.6323 0.418598 19.0186 0.744205Z" fill="#FFCE94"/>
    <path d="M20 40.5C20.2635 40.5 20.5271 40.4388 20.7685 40.3163L35.9078 32.6376C36.6487 32.2618 37.1157 31.5013 37.1157 30.6704V10.0973C37.1157 9.88316 37.061 9.67819 36.9658 9.49487L20 18.531V40.5Z" fill="#FCB043"/>
    <path d="M20 18.5311L3.03429 9.49475C2.93897 9.67807 2.88428 9.88304 2.88428 10.0972V30.6702C2.88428 31.5012 3.35123 32.2615 4.09221 32.6374L19.2314 40.316C19.4729 40.4385 19.7364 40.4997 19.9998 40.4997V18.5311H20Z" fill="#E2791B"/>
    <path d="M26.0488 3.4342L8.87866 12.5781V15.504C8.87866 15.7848 9.03355 16.0427 9.2813 16.1749L12.2652 17.7653C12.502 17.8914 12.7878 17.7199 12.7878 17.4516V14.7208L29.9846 5.52364L26.0488 3.4342Z" fill="#DEF2FC"/>
    <path d="M22.4734 34.6616L27.054 32.4709C27.6405 32.1905 28.0078 31.592 27.9923 30.9421L27.9919 30.9218C27.9792 30.3857 27.41 30.0473 26.9329 30.2924L22.4735 32.5826V34.6616H22.4734Z" fill="#403A46"/>
    <path d="M22.4734 37.8559L24.9888 36.6874C25.5843 36.4105 25.9595 35.8072 25.9439 35.1506C25.9312 34.6125 25.3588 34.2744 24.8814 34.5229L22.4734 35.7766V37.8559Z" fill="#403A46"/>
    <path d="M8.87842 12.6075V15.504C8.87842 15.7848 9.0333 16.0427 9.28106 16.1749L12.265 17.7653C12.5018 17.8915 12.7876 17.7199 12.7876 17.4516V14.7208L12.8167 14.7052C11.806 14.1669 10.1645 13.2925 8.87842 12.6075Z" fill="#B6C8CE"/>
    </g>
    <defs>
    <clipPath id="clip0_750_3493">
    <rect width="40" height="40" fill="white" transform="translate(0 0.5)"/>
    </clipPath>
    </defs>
    </svg>
    </div>
    <div class="product__page__pickup__info">
    <h3 class="product__page__pickup__info__title">Самовывоз</h3>
    <p class="product__page__pickup__info__txt">В данный момент товар можно забрать только самовывозом из нашего уютного магазина по адресу:</p>
    <div class="adress__header__top header__top__page">
                <div class="adress__header__top__box">
                  <div>
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_7780_735)">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M14.4001 6.52988C14.4001 2.99388 11.5361 0.129883 8.0001 0.129883C4.4641 0.129883 1.6001 2.99388 1.6001 6.52988C1.6001 6.64988 1.6001 6.76188 1.6081 6.88188C1.7121 9.72188 3.2001 12.9779 7.3121 15.9139C7.7201 16.2019 8.2801 16.2019 8.6881 15.9139C12.8001 12.9779 14.2881 9.72188 14.3921 6.88188C14.4001 6.76191 14.4001 6.64986 14.4001 6.52988ZM9.6969 8.22668C10.1473 7.77708 10.4001 7.16668 10.4001 6.52988C10.4001 5.89308 10.1465 5.28348 9.6969 4.83308C9.2473 4.38268 8.6369 4.12988 8.0001 4.12988C7.3633 4.12988 6.7537 4.38348 6.3033 4.83308C5.8529 5.28268 5.6001 5.89308 5.6001 6.52988C5.6001 7.16668 5.8529 7.77708 6.3033 8.22668C6.7529 8.67708 7.3633 8.92988 8.0001 8.92988C8.6361 8.92988 9.2465 8.67708 9.6969 8.22668Z"
                          fill="#8C9196"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_7780_735">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0 0.129883)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p class="adress__header__top__txt">
                    Минск, ул. Чюрлёниса, 6.
                  </p>
                </div>
                <div class="adress__header__top__metro">
                  <div>
                    <svg
                      width="18"
                      height="13"
                      viewBox="0 0 18 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_7780_739)">
                        <path
                          d="M16.7616 10.4535L12.5568 0.129883L9 6.16481L5.4576 0.129883L1.2384 10.4535H0V12.0181H6.3648V10.4535H5.4144L6.336 7.88308L9 12.1299L11.664 7.88308L12.5856 10.4535H11.6352V12.0181H18V10.4535H16.7616Z"
                          fill="#D72C0D"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_7780_739">
                          <rect
                            width="18"
                            height="12"
                            fill="white"
                            transform="translate(0 0.129883)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <p class="adress__heaer__top__metro__txt">Малиновка</p>
                </div>
              </div>
    </div>
    </div>
     <div class="product__page__price__wrap"></div>
    <div class="product__page__pay">
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
    <div class="product__page__pay__counter"></div>
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
    <button class="product__page__pay__add__to__basked" data-product-id="${
      product.id
    }">Добавить в корзину</button>
    <p class="product__page__buy">Купить в 1 клик</p>
    </div>
    </div>
    </div>
    </div>
    <div class="product__page__info">
    <h2 class="product__page__info__title">Описание</h2>
    <div class="product__page__info__txt__wrap">
    <div class="product__page__info__txt__block__first">
    <div class="product__page__info__txt__description">${
      product.description || "Описание отсутствует"
    }</div>
    ${
      hasKeyFeatures
        ? `
    <div class="product__page__info__signing">
    <h3 class="product__page__info__signing__title">Ключевые особенности:</h3>
    <div class="product__page__info__signing__txt">${product.key_features}</div>
    </div>  
      `
        : ""
    }
     ${
       hasCompound
         ? `
    <div class="product__page__info__signing">
    <h3 class="product__page__info__signing__title">Состав:</h3>
    <div class="product__page__info__signing__txt">${product.compound}</div>
    </div>  
      `
         : ""
     }  
    </div>
    <div class="product__page__info__txt__block__second">
    ${
      hasGuarantedAnalysis
        ? `
    <div class="product__page__info__signing">
    <h3 class="product__page__info__signing__title">Гарантированный анализ:</h3>
    <div class="product__page__info__signing__txt">${product.guaranteed_analysis}</div>
    </div>  
      `
        : ""
    }
      ${
        hasNutritionalSupplements
          ? `
    <div class="product__page__info__signing">
    <h3 class="product__page__info__signing__title">Пищевые добавки:</h3>
    <div class="product__page__info__signing__txt">${product.nutritional_supplements}</div>
    </div>  
      `
          : ""
      }
    </div>
    </div>
    </div>
    `;
    brandProducts(product);
    packagingTitle(product);
    packaging(product);
    totalPrice(product);
    const { totalWeightElement, basePriceElement, oldPriceElement } =
      updateTotalPrice(product);
    setWeight(product);
    addTotalWeight(
      product,
      basePriceElement,
      oldPriceElement,
      totalWeightElement
    );
    addToBasketAndModal(product, productPage);
  }

  function brandProducts(product) {
    if (!product.brand) return;
    const subtitle = document.createElement("span");
    subtitle.className = "product__page__subtitle__wrap";

    subtitle.innerHTML = `
    <a href="catalog.html?brand=${product.brand.id}" class="product__page__subtitle">Смотреть все товары бренда ${product.brand.name}</a>
    `;

    const titleWrap = document.querySelector(".product__page__title__wrap");
    if (titleWrap) {
      titleWrap.appendChild(subtitle);
    }
  }

  function packagingTitle(product) {
    const title = document.querySelector(".product__page__weight__title");
    const hasWeight =
      product.countitemproduct_set &&
      product.countitemproduct_set.some((item) => item.unit === "кг");

    if (hasWeight && title) {
      title.textContent += " Выберите удобный вес";
    }
  }

  function packaging(product) {
    const packagingWrap = document.querySelector(
      ".product__page__weight__option__wrap"
    );

    if (!packagingWrap) return;

    packagingWrap.innerHTML = "";

    if (
      !product.countitemproduct_set ||
      product.countitemproduct_set.length === 0
    ) {
      packagingWrap.innerHTML = "<p>Нет доступных вариантов фасовки</p>";
      return;
    }

    for (const option of product.countitemproduct_set) {
      const optionElement = document.createElement("div");
      optionElement.className = "weight__option";

      let unitText = option.unit;

      if (unitText.includes("шт")) {
        unitText = "шт.";
      } else if (unitText.includes("кг")) {
        unitText = "кг";
      }

      const basePrice = parseFloat(product.price) || 0;
      let optionPrice = (basePrice * option.value).toFixed(2);

      const promotion = product.sale?.percent || 0;
      const discountedPrice = basePrice * (1 - promotion / 100);

      if (promotion) {
        optionPrice = (discountedPrice * option.value).toFixed(2);
      }

      optionElement.innerHTML = `
            <span class="weight__value">${option.value} ${unitText}</span>
            <span class="weight__price">${optionPrice} BYN</span>
        `;

      packagingWrap.appendChild(optionElement);
    }
  }

  function totalPrice(product) {
    const priceWrap = document.querySelector(".product__page__price__wrap");
    const basePrice = parseFloat(product.price) || 0;
    const promotion = product.sale?.percent || 0;
    const discountedPrice = basePrice * (1 - promotion / 100);

    let weightType = "Общее кол-во:";
    let weightCount = 1;
    let weightUnit = "шт.";

    if (!priceWrap) return;

    if (product.countitemproduct_set) {
      for (const item of product.countitemproduct_set) {
        if (item.unit.includes("кг")) {
          weightType = "Общий вес:";
          weightCount = 1;
          weightUnit = "кг.";
          break;
        } else if (item.unit.includes("шт")) {
          weightType = "Общее кол-во:";
          weightCount = 1;
          weightUnit = "шт.";
          break;
        }
      }
    }

    currentWeight = weightCount;
    currentPrice = basePrice;

    priceWrap.innerHTML = `
      <div class="total__price">
      ${
        promotion > 0
          ? `
      <span class="old__price">${basePrice.toFixed(2)} BYN</span>
      <span class="base__price">${discountedPrice.toFixed(2)} BYN</span>
        `
          : `
      <span class="base__price">${basePrice.toFixed(2)} BYN</span>    
          `
      }
      </div>
      <div class="total__weight">${weightType} ${weightCount} ${weightUnit}</div>     
    `;
  }

  function updateTotalPrice(product) {
    const weightOptions = document.querySelectorAll(".weight__option");
    const totalPriceElement = document.querySelector(".total__price");
    const basePriceElement = totalPriceElement.querySelector(".base__price");
    const totalWeightElement = document.querySelector(".total__weight");
    const basePrice = parseFloat(product.price) || 0;
    const promotion = product.sale?.percent || 0;
    const discountedPrice = basePrice * (1 - promotion / 100);
    const oldPriceElement = totalPriceElement.querySelector(".old__price");
    let currentlySelected = null;
    let weightType = "Общее кол-во:";

    currentWeight = 1;
    currentPrice = promotion > 0 ? discountedPrice : basePrice;
    oldPrice = promotion > 0 ? basePrice : 0;

    if (product.countitemproduct_set) {
      for (const item of product.countitemproduct_set) {
        if (item.unit.includes("кг")) {
          weightType = "Общий вес:";
          break;
        }
      }
    }

    for (const option of weightOptions) {
      option.addEventListener("click", function () {
        const counter = document.querySelector(".product__page__pay__counter");
        let newPrice = null;

        if (counter) {
          count = 1;
          counter.textContent = "1";
        }

        if (this === currentlySelected) {
          this.classList.remove("weight__option__active");
          currentlySelected = null;

          if (promotion) {
            newPrice = discountedPrice.toFixed(2);
            if (oldPriceElement) {
              oldPriceElement.textContent = basePrice.toFixed(2) + " BYN";
            }
          } else {
            newPrice = basePrice.toFixed(2);
          }

          basePriceElement.textContent = newPrice + " BYN";
          totalWeightElement.textContent =
            weightType + " 1 " + (weightType.includes("вес") ? "кг" : "шт");

          currentWeight = 1;
          currentPrice = parseFloat(newPrice);
          oldPrice = promotion ? basePrice : 0;
          return;
        }

        if (currentlySelected) {
          currentlySelected.classList.remove("weight__option__active");
        }

        this.classList.add("weight__option__active");
        currentlySelected = this;

        const weightText = this.querySelector(".weight__value").textContent;
        const weightValue = parseFloat(weightText);
        const unit = weightText.split(" ")[1];

        if (promotion) {
          newPrice = (discountedPrice * weightValue).toFixed(2);
          const originalPrice = (basePrice * weightValue).toFixed(2);
          if (oldPriceElement) {
            oldPriceElement.textContent = originalPrice + " BYN";
          }
          oldPrice = parseFloat(originalPrice);
          currentPrice = parseFloat(newPrice);
        } else {
          newPrice = (basePrice * weightValue).toFixed(2);
          oldPrice = 0;
          currentPrice = parseFloat(newPrice);
        }

        basePriceElement.textContent = newPrice + " BYN";
        totalWeightElement.textContent =
          weightType + " " + weightValue + " " + unit;

        currentWeight = weightValue;
      });
    }
    return { totalWeightElement, basePriceElement, oldPriceElement };
  }

  function setWeight(product) {
    const weightContainer = document.querySelector(".product__page__weight");
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
      setWeightInput(product);
    }
  }

  function setWeightInput(product) {
    const weightInput = document.querySelector(".set__weight__input");
    const weightButton = document.querySelector(".set__weight__button");
    const totalWeight = document.querySelector(".total__weight");
    const totalPriceElement = document.querySelector(".base__price");
    const counter = document.querySelector(".product__page__pay__counter");
    const oldPriceElement = document.querySelector(".old__price");
    const basePrice = parseFloat(product.price) || 0;
    const promotion = product.sale?.percent || 0;
    const discountedPrice = basePrice * (1 - promotion / 100);

    if (!weightInput || !weightButton || !totalWeight || !totalPriceElement)
      return;

    weightButton.addEventListener("click", function () {
      const inputValue = weightInput.value;
      const weightValue = parseFloat(inputValue.replace(",", "."));

      if (!isNaN(weightValue) && weightValue > 0) {
        count = 1;
        counter.textContent = "1";

        totalWeight.textContent =
          "Общий вес: " + weightValue.toFixed(2) + " кг";

        if (promotion) {
          const newPrice = (discountedPrice * weightValue).toFixed(2);
          const originalPrice = (basePrice * weightValue).toFixed(2);
          totalPriceElement.textContent = newPrice + " BYN";
          if (oldPriceElement) {
            oldPriceElement.textContent = originalPrice + " BYN";
          }
          currentPrice = parseFloat(newPrice);
          oldPrice = parseFloat(originalPrice);
        } else {
          const newPrice = (basePrice * weightValue).toFixed(2);
          totalPriceElement.textContent = newPrice + " BYN";
          currentPrice = parseFloat(newPrice);
          oldPrice = 0;
        }

        weightInput.value = "";
        currentWeight = weightValue;
      }
    });
  }

  function addTotalWeight(
    product,
    basePriceElement,
    oldPriceElement,
    totalWeightElement
  ) {
    const add = document.getElementById("total-add");
    const takeAway = document.getElementById("take-away");
    const counter = document.querySelector(".product__page__pay__counter");
    const promotion = product.sale?.percent || 0;

    if (
      !add ||
      !takeAway ||
      !counter ||
      !totalWeightElement ||
      !basePriceElement
    )
      return;

    counter.textContent = count;

    add.addEventListener("click", function () {
      count++;

      const totalWeightValue = currentWeight * count;
      const totalPriceValue = currentPrice * count;
      const oldTotalPriceValue = oldPrice * count;

      totalWeightElement.textContent = totalWeightElement.textContent.replace(
        /\d+\.?\d*/,
        totalWeightValue.toFixed(2)
      );

      if (promotion > 0 && oldPriceElement && oldPrice > 0) {
        basePriceElement.textContent = totalPriceValue.toFixed(2) + " BYN";
        oldPriceElement.textContent = oldTotalPriceValue.toFixed(2) + " BYN";
      } else {
        basePriceElement.textContent = totalPriceValue.toFixed(2) + " BYN";

        if (oldPriceElement) {
          oldPriceElement.style.display = "none";
        }
      }

      counter.textContent = count;
    });

    takeAway.addEventListener("click", function () {
      if (count > 1) {
        count--;
        const totalWeightValue = currentWeight * count;
        const totalPriceValue = currentPrice * count;
        const oldTotalPriceValue = oldPrice * count;

        totalWeightElement.textContent = totalWeightElement.textContent.replace(
          /\d+\.?\d*/,
          totalWeightValue.toFixed(2)
        );

        if (promotion > 0 && oldPriceElement) {
          basePriceElement.textContent = totalPriceValue.toFixed(2) + " BYN";
          oldPriceElement.textContent = oldTotalPriceValue.toFixed(2) + " BYN";
        } else {
          basePriceElement.textContent = totalPriceValue.toFixed(2) + " BYN";
        }

        counter.textContent = count;
      }
    });
  }
});
