"use strict";
window.addToBasketAndModal = function (product, productPage) {
  const addCartBtn = document.querySelector(
    ".product__page__pay__add__to__basked"
  );

  function createModal(product, cardData) {
    const addCartBtn = document.querySelector(
      ".product__page__pay__add__to__basked"
    );

    const overlay = document.createElement("div");
    overlay.className = "modal__overlay";

    let quantityOptions = "";

    if (
      product.countitemproduct_set &&
      product.countitemproduct_set.length > 0
    ) {
      quantityOptions = product.countitemproduct_set
        .map((item) => {
          const isActive =
            cardData.packaging &&
            cardData.packaging.includes(item.value.toString());
          const activeClass = isActive
            ? "product__page__modal__main__active"
            : "";
          return `<span class="product__page__modal__main__qnt ${activeClass}"
                     data-count="${item.value}">
                     ${item.value} ${item.unit}
                   </span>`;
        })
        .join("");
    }

    const hasWeightOptions =
      product.countitemproduct_set &&
      product.countitemproduct_set.some((item) => item.unit.includes("кг"));

    const modalContent = document.createElement("div");
    modalContent.className = "product__page__modal";
    modalContent.innerHTML = `
      <div class="product__page__modal__wrap">
      ${
        cardData.hasPromotion > 0
          ? `
        <div class="product__page__modal__wrap__sale__badge">Акция</div>
        `
          : ""
      }
      <div class="product__page__modal__close">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.89705 4.05379L3.96967 3.96967C4.23594 3.7034 4.6526 3.6792 4.94621 3.89705L5.03033 3.96967L10 8.939L14.9697 3.96967C15.2359 3.7034 15.6526 3.6792 15.9462 3.89705L16.0303 3.96967C16.2966 4.23594 16.3208 4.6526 16.1029 4.94621L16.0303 5.03033L11.061 10L16.0303 14.9697C16.2966 15.2359 16.3208 15.6526 16.1029 15.9462L16.0303 16.0303C15.7641 16.2966 15.3474 16.3208 15.0538 16.1029L14.9697 16.0303L10 11.061L5.03033 16.0303C4.76406 16.2966 4.3474 16.3208 4.05379 16.1029L3.96967 16.0303C3.7034 15.7641 3.6792 15.3474 3.89705 15.0538L3.96967 14.9697L8.939 10L3.96967 5.03033C3.7034 4.76406 3.6792 4.3474 3.89705 4.05379L3.96967 3.96967L3.89705 4.05379Z" fill="#5C5F62"/>
      </svg>
      </div>
      <div class="product__page__modal__checked">
      <div class="product__page__modal__checked__img">
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 12C2.5 17.514 6.986 22 12.5 22C18.014 22 22.5 17.514 22.5 12C22.5 6.486 18.014 2 12.5 2C6.986 2 2.5 6.486 2.5 12ZM17.7071 10.2071C18.0976 9.81658 18.0976 9.18342 17.7071 8.79289C17.3166 8.40237 16.6834 8.40237 16.2929 8.79289L11.5 13.5858L9.20711 11.2929C8.81658 10.9024 8.18342 10.9024 7.79289 11.2929C7.40237 11.6834 7.40237 12.3166 7.79289 12.7071L10.7929 15.7071C11.1834 16.0976 11.8166 16.0976 12.2071 15.7071L17.7071 10.2071Z" fill="#008060"/>
      </svg>
      </div>
      <h1 class="product__page__modal__checked__title">Товар добавлен в корзину</h1>
      </div>
      <div class="product__page__modal__contain">
      <div>
      <img class="product__page__modal__img" src="${product.image_prev}" alt="${
      product.title
    }">
      </div>
      <div class="product__page__modal__main">
      <h3 class="product__page__modal__main__title">${product.title}</h3>
      <div class="product__page__modal__main__qnt__wrap">${
        quantityOptions || "<p>Нет данных о фасовках</p>"
      }</div>
      ${
        hasWeightOptions
          ? `
      <div class="product__page__modal__set__weight__wrap">
      <button class="product__page__modal__set__weight__input">Указать свой вес</button>
      <div class="product__page__modal__set__weight__box">
      <h3 class="product__page__modal__set__weight__title">Задайте свой вес</h3>
      <div class="product__page__modal__set__weight__hide">
      <input class="product__page__modal__set__weight__value" placeholder="Например: 1,2 кг" maxlength="4">
      <button class="product__page__modal__set__weight__btn">Применить</button>
      </div>
      </div>
      </div>
      `
          : ""
      }
      </div>
      <div class="product__page__modal__count__wrap">
      <div class="product__page__pay__add">
      <button class="product__page__pay__operator modal__operator__take__away" id="take-away-modal">
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
      <div class="product__page__pay__counter modal__counter">${
        cardData.count
      }</div>
      <button class="product__page__pay__operator modal__operator__add" id="total-add-modal">
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
      <div class="product__page__modal__price__wrap">
      ${
        cardData.hasPromotion > 0
          ? `
        <span class="product__page__modal__old__price">${cardData.oldPrice.toFixed(
          0
        )} BYN</span>
        <span class="product__page__modal__price">${cardData.price.toFixed(
          0
        )} BYN</span>
        `
          : `
        <span class="product__page__modal__price">${cardData.oldPrice.toFixed(
          0
        )} BYN</span>
        `
      }
      </div>
      </div>
      </div>
      <div class="product__page__modal__btn__choice">
      <a href="./basket.html" class="product__page__modal__btn" id="prpduct-page-modal-to-basket">Перейти в корзину</a>
      <button class="product__page__modal__btn btn__in__modal">Продолжить покупки</button>
      </div>
      </div>
      `;

    document.body.appendChild(modalContent);
    document.body.appendChild(overlay);

    modalSetWeightOption(product, cardData);
    modalAddTotal(product, cardData);
    modalSetWeightValue(cardData, product);

    function modalSetWeightOption(product, cardData) {
      const optionElement = modalContent.querySelectorAll(
        ".product__page__modal__main__qnt"
      );
      const priceElement = modalContent.querySelector(
        ".product__page__modal__price"
      );
      const oldPriceElement = modalContent.querySelector(
        ".product__page__modal__old__price"
      );

      const basePrice = parseFloat(product.price);
      const discountPercent = product.sale?.percent || 0;
      const discountedPrice = basePrice * (1 - discountPercent / 100);

      let newPrice = 0;
      let newOldPrice = 0;

      for (const option of optionElement) {
        option.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          const optionText = this.textContent;
          const optionQuantity = parseFloat(optionText);

          const isActive = this.classList.contains(
            "product__page__modal__main__active"
          );

          if (isActive) {
            for (const opt of optionElement) {
              opt.classList.remove("product__page__modal__main__active");
            }

            if (cardData.hasPromotion > 0 && discountPercent > 0) {
              newPrice = discountedPrice;
              newOldPrice = basePrice;

              priceElement.textContent = newPrice.toFixed(0) + " BYN";
              oldPriceElement.textContent = newOldPrice.toFixed(0) + " BYN";
            } else {
              newPrice = basePrice;
              priceElement.textContent = newPrice.toFixed(0) + " BYN";
            }
          } else {
            for (const opt of optionElement) {
              opt.classList.remove("product__page__modal__main__active");
            }

            this.classList.add("product__page__modal__main__active");

            if (cardData.hasPromotion > 0 && discountPercent > 0) {
              newPrice = discountedPrice * optionQuantity;
              newOldPrice = basePrice * optionQuantity;

              priceElement.textContent = newPrice.toFixed(0) + " BYN";
              oldPriceElement.textContent = newOldPrice.toFixed(0) + " BYN";
            } else {
              newPrice = basePrice * optionQuantity;
              priceElement.textContent = newPrice.toFixed(0) + " BYN";
            }
          }
          updateLocalStorageInModal();
        });
      }
    }

    function modalAddTotal(product, cardData) {
      const add = modalContent.querySelector(".modal__operator__add");
      const takeAway = modalContent.querySelector(
        ".modal__operator__take__away"
      );
      const priceElement = modalContent.querySelector(
        ".product__page__modal__price"
      );
      const oldPriceElement = modalContent.querySelector(
        ".product__page__modal__old__price"
      );
      const counter = modalContent.querySelector(
        ".product__page__pay__counter"
      );

      const basePrice = parseFloat(product.price);
      const discountPercent = product.sale?.percent || 0;
      const discountedPrice = basePrice * (1 - discountPercent / 100);

      let count = parseInt(counter.textContent) || 1;

      add.addEventListener("click", function (e) {
        count++;
        counter.textContent = count;

        const quantityActive = modalContent.querySelector(
          ".product__page__modal__main__active"
        );
        let multiplier = 1;
        if (quantityActive) {
          const quantityActiveText = quantityActive.textContent.trim();
          multiplier = parseFloat(quantityActiveText);
        }

        if (cardData.hasPromotion > 0 && discountPercent > 0) {
          const newPrice = discountedPrice * multiplier * count;
          const newOldPrice = basePrice * multiplier * count;

          priceElement.textContent = newPrice.toFixed(0) + " BYN";
          if (oldPriceElement) {
            oldPriceElement.textContent = newOldPrice.toFixed(0) + " BYN";
          }
        } else {
          const newPrice = basePrice * multiplier * count;
          priceElement.textContent = newPrice.toFixed(0) + " BYN";
        }

        updateLocalStorageInModal();
      });

      takeAway.addEventListener("click", function (e) {
        if (count > 1) {
          count--;
          counter.textContent = count;

          const quantityActive = modalContent.querySelector(
            ".product__page__modal__main__active"
          );
          let multiplier = 1;
          if (quantityActive) {
            const quantityActiveText = quantityActive.textContent.trim();
            multiplier = parseFloat(quantityActiveText);
          }

          if (cardData.hasPromotion > 0 && discountPercent > 0) {
            const newPrice = discountedPrice * multiplier * count;
            const newOldPrice = basePrice * multiplier * count;

            priceElement.textContent = newPrice.toFixed(0) + " BYN";
            if (oldPriceElement) {
              oldPriceElement.textContent = newOldPrice.toFixed(0) + " BYN";
            }
          } else {
            const newPrice = basePrice * multiplier * count;
            priceElement.textContent = newPrice.toFixed(0) + " BYN";
          }

          updateLocalStorageInModal();
        }
      });
    }

    function modalSetWeightValue(cardData, product) {
      const startSetWeightInput = modalContent.querySelector(
        ".product__page__modal__set__weight__input"
      );
      const contentSetWeightInput = modalContent.querySelector(
        ".product__page__modal__set__weight__box"
      );
      const weightInput = modalContent.querySelector(
        ".product__page__modal__set__weight__value"
      );
      const weightButton = modalContent.querySelector(
        ".product__page__modal__set__weight__btn"
      );
      const priceElement = modalContent.querySelector(
        ".product__page__modal__price"
      );
      const oldPriceElement = modalContent.querySelector(
        ".product__page__modal__old__price"
      );

      const basePrice = parseFloat(product.price);
      const discountPercent = product.sale?.percent || 0;
      const discountedPrice = basePrice * (1 - discountPercent / 100);

      if (startSetWeightInput) {
        startSetWeightInput.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          if (contentSetWeightInput.style.display === "flex") {
            contentSetWeightInput.style.display = "none";
          } else {
            contentSetWeightInput.style.display = "flex";
          }
        });
      }

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

      weightButton.addEventListener("click", function () {
        const InputValue = weightInput.value;
        const weightValue = parseFloat(InputValue.replace(",", "."));

        if (discountPercent) {
          priceElement.textContent = (discountedPrice * weightValue).toFixed(2);
          oldPriceElement.textContent = (basePrice * weightValue).toFixed(2);
        } else {
          priceElement.textContent = (basePrice * weightValue).toFixed(2);
        }

        contentSetWeightInput.style.display = "none";
        weightInput.value = "";
        updateLocalStorageInModal();
      });
    }

    function updateLocalStorageInModal() {
      const priceElement = modalContent.querySelector(
        ".product__page__modal__price"
      );
      const oldPriceElement = modalContent.querySelector(
        ".product__page__modal__old__price"
      );
      const counter = modalContent.querySelector(
        ".product__page__pay__counter"
      );
      const optionActive = modalContent.querySelector(
        ".product__page__modal__main__active"
      );

      const price = parseFloat(priceElement.textContent);
      const count = parseInt(counter.textContent);
      const packaging = optionActive ? optionActive.textContent.trim() : null;

      let totalWeight = null;
      if (packaging) {
        const packagingValue = parseFloat(packaging);
        totalWeight = packagingValue * count;
      }

      cardData.price = price;
      cardData.count = count;
      cardData.packaging = packaging;
      cardData.totalWeight = totalWeight;

      if (oldPriceElement) {
        cardData.oldPrice = parseFloat(oldPriceElement.textContent);
      }

      let basketItems = JSON.parse(localStorage.getItem("basketItem")) || [];
      const itemIndex = basketItems.findIndex(
        (item) => item.productId === cardData.productId
      );

      if (itemIndex !== -1) {
        basketItems[itemIndex] = cardData;
        localStorage.setItem("basketItem", JSON.stringify(basketItems));
      }

      if (typeof updateBasketDisplay === "function") updateBasketDisplay();
      updateBasketCounter();
    }

    modalContent.style.display = "block";
    overlay.style.display = "block";

    const closeModal = modalContent.querySelector(
      ".product__page__modal__close"
    );
    const continueShop = modalContent.querySelector(".btn__in__modal");

    closeModal.addEventListener("click", function (e) {
      e.preventDefault();

      modalContent.style.display = "none";
      overlay.style.display = "none";
    });

    continueShop.addEventListener("click", function (e) {
      e.preventDefault();

      modalContent.style.display = "none";
      overlay.style.display = "none";
    });

    overlay.addEventListener("click", function (e) {
      e.preventDefault();

      modalContent.style.display = "none";
      overlay.style.display = "none";
    });

    return { overlay, modalContent };
  }

  addCartBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const productId = this.getAttribute("data-product-id");

    const priceElement = productPage.querySelector(".base__price");
    const oldPriceElement = productPage.querySelector(".old__price");
    const quantityActive = productPage.querySelector(".weight__option__active");
    const countElement = productPage.querySelector(
      ".product__page__pay__counter"
    );

    const saleBadge = productPage.querySelector(".sale__badge__page");

    let price = 0;
    let oldPrice = 0;
    let count = 0;
    let packaging = null;
    let hasPromotion = false;

    if (saleBadge) {
      hasPromotion = true;
    }

    if (quantityActive) {
      packaging = quantityActive.textContent;
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

    if (countElement) {
      const countText = countElement.textContent;
      count = parseFloat(countText.trim());
    }

    const cardData = {
      productId: parseInt(productId),
      price: price,
      oldPrice: oldPrice,
      count: count,
      packaging: packaging,
      hasPromotion: hasPromotion,
      title: product.title,
      image: product.image_prev,
    };

    let basketItems = JSON.parse(localStorage.getItem("basketItem")) || [];
    basketItems.push(cardData);
    localStorage.setItem("basketItem", JSON.stringify(basketItems));

    console.log("Товар добавлен в корзину! ID:", productId, basketItems);

    if (typeof updateBasketDisplay === "function") {
      updateBasketDisplay();
    }

    updateBasketCounter();
    createModal(product, cardData);
  });
};
