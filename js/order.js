"use strict";
document.addEventListener("DOMContentLoaded", () => {
  function getOrderData() {
    return JSON.parse(localStorage.getItem("orderData")) || null;
  }

  function showDataBasket() {
    const container = document.querySelector(".registration__order__quantity");
    const priceContainer = document.querySelector(
      ".registration__order__price__box"
    );
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

  function initModalOrder() {
    const orderButton = document.querySelector(".registration__window__button");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");

    function checkFromFilled() {
      const isNameFilled = nameInput && nameInput.value.trim() !== "";
      const isPhoneFilled = phoneInput && phoneInput.value.trim() !== "";

      return isNameFilled && isPhoneFilled;
    }

    orderButton.addEventListener("click", function (e) {
      e.preventDefault();

      if (!checkFromFilled()) {
        alert(
          "Пожалуйста, заполните все обязательные поля перед оформлением заказа!"
        );
        return;
      }

      const userName = nameInput.value.trim();
      const userPhone = phoneInput.value.trim();

      const dataItems = JSON.parse(localStorage.getItem("orderData")) || [];
      dataItems.userName = userName;
      dataItems.userPhone = userPhone;

      localStorage.setItem("orderData", JSON.stringify(dataItems));

      console.log("данные обновлены:", dataItems);

      modalContent.style.display = "flex";
      overlay.style.display = "block";
    });

    const overlay = document.createElement("div");
    overlay.className = "modal__overlay";

    const modalContent = document.createElement("div");
    modalContent.className = "modal__order";
    modalContent.innerHTML = `
    <div class="modal__order__wrap">
    <button class="modal__order__close">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.89705 4.05379L3.96967 3.96967C4.23594 3.7034 4.6526 3.6792 4.94621 3.89705L5.03033 3.96967L10 8.939L14.9697 3.96967C15.2359
    3.7034 15.6526 3.6792 15.9462 3.89705L16.0303 3.96967C16.2966 4.23594 16.3208 4.6526 16.1029 4.94621L16.0303 5.03033L11.061 10L16.0303
    14.9697C16.2966 15.2359 16.3208 15.6526 16.1029 15.9462L16.0303 16.0303C15.7641 16.2966 15.3474 16.3208 15.0538 16.1029L14.9697 16.0303L10
    11.061L5.03033 16.0303C4.76406 16.2966 4.3474 16.3208 4.05379 16.1029L3.96967 16.0303C3.7034 15.7641 3.6792 15.3474 3.89705 15.0538L3.96967
    14.9697L8.939 10L3.96967 5.03033C3.7034 4.76406 3.6792 4.3474 3.89705 4.05379L3.96967 3.96967L3.89705 4.05379Z" fill="#5C5F62"/>
    </svg>
    </button>
    <div class="modal__order__img__wrap">
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM32.6339 17.6161C32.1783
    17.1605 31.4585 17.1301 30.9676 17.525L30.8661 17.6161L20.75 27.7322L17.1339 24.1161C16.6457 23.628 15.8543 23.628 15.3661 24.1161C14.9105 24.5717
    14.8801 25.2915 15.275 25.7824L15.3661 25.8839L19.8661 30.3839C20.3217 30.8395 21.0416 30.8699 21.5324 30.475L21.6339 30.3839L32.6339 19.3839C33.122
    18.8957 33.122 18.1043 32.6339 17.6161Z" fill="#008060"/>
    </svg>
    </div>
    <h1 class="modal__order__title">Заказ оформлен и ожидает вас по адресу:</h1>
    <div class="modal__order__info">
    <div class="footer__low__up__adress">
    <div class="footer__low__up__adress__icone order__modal__mobile">
    <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <g clip-path="url(#clip0_594_1568)">
    <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M14.4001 6.52988C14.4001 2.99388 11.5361 0.129883 8.0001 0.129883C4.4641 0.129883 1.6001 2.99388 1.6001 6.52988C1.6001 6.64988 1.6001 6.76188 1.6081 6.88188C1.7121 9.72188 3.2001 12.9779 7.3121 15.9139C7.7201 16.2019 8.2801 16.2019 8.6881 15.9139C12.8001 12.9779 14.2881 9.72188 14.3921 6.88188C14.4001 6.76191 14.4001 6.64986 14.4001 6.52988ZM9.6969 8.22668C10.1473 7.77708 10.4001 7.16668 10.4001 6.52988C10.4001 5.89308 10.1465 5.28348 9.6969 4.83308C9.2473 4.38268 8.6369 4.12988 8.0001 4.12988C7.3633 4.12988 6.7537 4.38348 6.3033 4.83308C5.8529 5.28268 5.6001 5.89308 5.6001 6.52988C5.6001 7.16668 5.8529 7.77708 6.3033 8.22668C6.7529 8.67708 7.3633 8.92988 8.0001 8.92988C8.6361 8.92988 9.2465 8.67708 9.6969 8.22668Z"
    fill="#8C9196"
    />
    </g>
    <defs>
    <clipPath id="clip0_594_1568">
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
    <p class="footer__low__up__adress__txt">
    Минск, ул. Чюрлёниса, 6.
    </p>
    <div class="footer__low__up__adress__metro">
    <svg
    width="18"
    height="13"
    viewBox="0 0 18 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <g clip-path="url(#clip0_891_7391)">
    <path
    d="M16.7616 11.0937L12.5568 0.77002L9 6.80494L5.4576 0.77002L1.2384 11.0937H0V12.6583H6.3648V11.0937H5.4144L6.336 8.52322L9 12.77L11.664 8.52322L12.5856 11.0937H11.6352V12.6583H18V11.0937H16.7616Z"
    fill="#D72C0D"
    />
    </g>
    <defs>
    <clipPath id="clip0_891_7391">
    <rect
    width="18"
    height="12"
    fill="white"
    transform="translate(0 0.77002)"
    />
    </clipPath>
    </defs>
    </svg>
    <p class="footer__low__up__adress__txt">Малиновка</p>
    </div>
    </div>
    <div class="footer__low__up__working__time__info order__modal__time__mobile">
    <div class="footer__low__up__working__time__info__icone order__modal__mobile">
    <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    >
    <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M8.0001 14.5299C4.4713 14.5299 1.6001 11.6587 1.6001 8.12986C1.6001 4.60106 4.4713 1.72986 8.0001 1.72986C11.5289 1.72986 14.4001 4.60106 14.4001 8.12986C14.4001 11.6587 11.5289 14.5299 8.0001 14.5299ZM9.8345 10.7643C9.6297 10.7643 9.4249 10.6859 9.2689 10.5299L7.4345 8.69546C7.2841 8.54586 7.2001 8.34186 7.2001 8.12986V4.92986C7.2001 4.48826 7.5577 4.12986 8.0001 4.12986C8.4425 4.12986 8.8001 4.48826 8.8001 4.92986V7.79866L10.4001 9.39866C10.7129 9.71146 10.7129 10.2171 10.4001 10.5299C10.2441 10.6859 10.0393 10.7643 9.8345 10.7643Z"
    fill="#8C9196"
    />
    </svg>
    </div>
    <p class="footer__low__up__working__time__info__txt padding remove__padding">
    Пон.-Пят. 10:00-21:00
    </p>
    <p class="footer__low__up__working__time__info__txt">
    Суб.-Вос. 10:00-20:00
    </p>
    </div>
    </div>
    <a href="./articles__pages.html" class="modal__order__read__articles">Читать полезные статьи</a>
    </div>
    `;

    document.body.appendChild(modalContent);
    document.body.appendChild(overlay);

    function clearFormAndBasket() {
      const nameInput = document.getElementById("name");
      const phoneInput = document.getElementById("phone");

      if (nameInput) {
        nameInput.value = "";
      }
      if (phoneInput) {
        phoneInput.value = "";
      }

      localStorage.removeItem("basketItem");
      localStorage.removeItem("orderData");

      window.location.href = "catalog.html";
    }

    const closeButton = document.querySelector(".modal__order__close");

    closeButton.addEventListener("click", function (e) {
      e.preventDefault();

      modalContent.style.display = "none";
      overlay.style.display = "none";
      clearFormAndBasket();
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        modalContent.style.display = "none";
        overlay.style.display = "none";
        clearFormAndBasket();
      }
    });
  }

  function initNameValidation() {
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone");

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        const cursorPosition = this.selectionStart;

        this.value = this.value.replace(/[^А-Яа-яЁё\s]/g, "");
        this.value = this.value.replace(/\s+/g, " ");

        if (this.value.startsWith(" ")) {
          this.value = this.value.substring(1);
        }

        this.value = this.value.replace(/\s+/g, " ");
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener("input", function (e) {
        const cursorPosition = this.selectionStart;

        let value = this.value.replace(/[^\d+]/g, "");

        if (!value.startsWith("+")) {
          value = "+";
        }

        this.value = value;
      });
    }
  }

  showDataBasket();
  initModalOrder();
  initNameValidation();
});
