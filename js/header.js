"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const burger = document.querySelector(".burger__menu");
  const burgerMobile = document.querySelector(".burger__menu__mobile");
  const nav = document.querySelector(".header__low__nav");
  const searchMobile = document.querySelector(".header__search__mobile");
  const basketMobile = document.querySelector(".header__low__basket__mobile");
  const transition = document.querySelector(".header__options__mobile");
  const sideBar = document.querySelector(
    ".products__catalog__products__filter"
  );

  let isMenuOpen = false;
  let currentBurger = null;

  async function fetchAllProducts() {
    let allProducts = [];
    let nextUrl =
      "https://oliver1ck.pythonanywhere.com/api/get_products_filter/?order=date_create";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
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
      console.log("✅ Всего товаров загружено для поиска:", allProducts.length);
      window.allProducts = allProducts;
      InitSearchInput(allProducts);
    })
    .catch((error) => {
      console.error("❌ Ошибка загрузки товаров для поиска:", error);
    });

  function InitSearchInput(allProducts) {
    const searchList = document.querySelector(".search__list");
    const searchInput = document.querySelector(".search__header__low__input");
    const searchListMobile = document.querySelector(".search__list__mobile");
    const searchInputMobile = document.querySelector(
      ".search__header__low__input__mobile"
    );

    if (searchList && searchInput) {
      searchInput.addEventListener("input", function () {
        handleSearch();
      });
    }

    if (searchListMobile && searchInputMobile) {
      searchInputMobile.addEventListener("input", function () {
        handleSearch();
      });
    }

    function handleSearch() {
      let activeInput = null;
      let activeList = null;

      if (document.activeElement === searchInput) {
        activeInput = searchInput;
        activeList = searchList;
        searchInputMobile.value = "";
      } else if (document.activeElement === searchInputMobile) {
        activeInput = searchInputMobile;
        activeList = searchListMobile;
        searchInput.value = "";
      }

      activeInput.placeholder = `Введите запрос..`;

      const searchText = activeInput.value.toLowerCase();
      let foundItems = false;

      activeList.innerHTML = "";

      if (searchText.length > 0) {
        activeList.style.display = "flex";
      } else {
        activeList.style.display = "none";
      }

      for (const item of allProducts) {
        const product = item.title.toLowerCase();

        if (product.startsWith(searchText)) {
          foundItems = true;
          const productItem = document.createElement("li");
          productItem.className = "search__list__item";
          productItem.innerHTML = `
                <a class="search__list__item__link" href="product__page.html?id=${item.id}">
                <img src="${item.image_prev}" alt="${item.title}" class="search__list__item__img">
                <p class="search__list__item__title">${item.title}</p>
                </a>
                `;

          activeList.appendChild(productItem);
        }
      }

      if (!foundItems) {
        const notFound = document.createElement("div");
        notFound.className = "not__found__items";
        notFound.innerHTML = `
            <img class="not__found__items__img" src="./img/image 36dog.jpg" alt="not-found">
            <h2 class="not__found__items__title">По вашему запросу ничего не найдено. Попробуйте изменить запрос или выбрать товары в нашем каталоге</h2>
            <a href="catalog.html" class="transfer__to__catalog">Перейти в каталог</a>
            `;

        activeList.appendChild(notFound);
      }
    }

    document.addEventListener("click", function (e) {
      const clickedElement = e.target;

      if (searchList && searchList.style.display === "flex") {
        if (
          !searchList.contains(clickedElement) &&
          clickedElement !== searchInput
        ) {
          searchList.style.display = "none";
          if (searchInput) {
            searchInput.value = "";
            searchInput.placeholder = "Поиск товаров...";
          }
        }
      }

      if (searchListMobile && searchListMobile.style.display === "flex") {
        if (
          !searchListMobile.contains(clickedElement) &&
          clickedElement !== searchInputMobile
        ) {
          searchListMobile.style.display = "none";
          if (searchInputMobile) {
            searchInputMobile.value = "";
            searchInputMobile.placeholder = "Search";
          }
        }
      }
    });
  }

  function backCall() {
    const backCallBtn = document.querySelector(".header__top__backcall__btn");
    const backCallBtnForFooter = document.querySelector(".back__call__footer");

    backCallBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      backCallModalEvent();
    });

    backCallBtnForFooter.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      backCallModalEvent();
    });

    function backCallModalEvent() {
      const overlay = document.createElement("div");
      overlay.classList = "modal__overlay";
      overlay.style.display = "block";

      const successModal = document.createElement("div");

      const backCallModal = document.createElement("div");
      backCallModal.className = "back__call";
      backCallModal.style.display = "flex";
      backCallModal.innerHTML = `
      <div class="back__call__wrap">
      <span class="back__call__close">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.89705 4.05379L3.96967 3.96967C4.23594 3.7034 4.6526 3.6792 4.94621 3.89705L5.03033 3.96967L10 8.939L14.9697 3.96967C15.2359 3.7034 15.6526 3.6792 15.9462 3.89705L16.0303 3.96967C16.2966 4.23594 16.3208 4.6526 16.1029 4.94621L16.0303 5.03033L11.061 10L16.0303 14.9697C16.2966 15.2359 16.3208 15.6526 16.1029 15.9462L16.0303 16.0303C15.7641 16.2966 15.3474 16.3208 15.0538 16.1029L14.9697 16.0303L10 11.061L5.03033 16.0303C4.76406 16.2966 4.3474 16.3208 4.05379 16.1029L3.96967 16.0303C3.7034 15.7641 3.6792 15.3474 3.89705 15.0538L3.96967 14.9697L8.939 10L3.96967 5.03033C3.7034 4.76406 3.6792 4.3474 3.89705 4.05379L3.96967 3.96967L3.89705 4.05379Z" fill="#5C5F62"/>
      </svg>
      </span>
      <h2 class="back__call__title">Перезвоним вам в течение 15 минут</h2>
      <div class="order__input__box">
      <div class="order__input__wrap">
      <h3 class="order__input__title">Имя</h3>
      <input
      type="text"
      id="back-name"
      name="name"
      maxlength="25"
      pattern="[А-Яа-яЁё\s]+"
      class="order__input"
      placeholder="Введите ваше имя"
      required
      />
      </div>
      <div class="order__input__wrap">
      <h3 class="order__input__title">Номер телефона</h3>
      <input
      type="tel"
      id="back-phone"
      name="phone"
      maxlength="13"
      pattern="\+375[0-9]{9}"
      placeholder="+375"
      class="order__input"
      required
      />
      </div>
      </div>
      <button class="back__call__sent">Отправить</button>
      <p class="back__call__p">Нажимая на кнопку вы даёте согласие на обработку <a class="back__call__link" href="#">персональных данных</a></p>
      </div>
      `;

      document.body.appendChild(overlay);
      document.body.appendChild(backCallModal);

      backCallClose();
      initInputsAndSentData();

      function initInputsAndSentData() {
        const inputName = document.getElementById("back-name");
        const inputPhone = document.getElementById("back-phone");
        const sentData = backCallModal.querySelector(".back__call__sent");

        if (inputName) {
          inputName.addEventListener("input", function () {
            const cursorPosition = this.selectionStart;

            this.value = this.value.replace(/[^А-Яа-яЁё\s]/g, "");
            this.value = this.value.replace(/\s+/g, " ");

            if (this.value.startsWith(" ")) {
              this.value = this.value.substring(1);
            }

            this.value = this.value.replace(/\s+/g, " ");
          });
        }

        if (inputPhone) {
          inputPhone.addEventListener("input", function (e) {
            const cursorPosition = this.selectionStart;

            let value = this.value.replace(/[^\d+]/g, "");

            if (!value.startsWith("+")) {
              value = "+";
            }

            this.value = value;
          });
        }

        if (sentData) {
          sentData.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (inputName.value === "" || inputPhone.value === "") {
              alert(
                "Пожалуйста, заполните все обязательные поля перед оформлением заказа!"
              );
              return;
            }

            const userName = inputName.value;
            const phoneNumber = inputPhone.value;

            const data = {
              userName: userName,
              phoneNumber: phoneNumber,
            };

            localStorage.setItem("backCallData", JSON.stringify(data));
            console.log("данные отправлены:", data);

            backCallModal.style.display = "none";

            successModal.className = "success__modal";
            successModal.innerHTML = `
                <div class="success__modal__wrap">
                <span class="succes__modal__close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.89705 4.05379L3.96967 3.96967C4.23594 3.7034 4.6526 3.6792 4.94621 3.89705L5.03033 3.96967L10 8.939L14.9697 3.96967C15.2359 3.7034 15.6526 3.6792 15.9462 3.89705L16.0303 3.96967C16.2966 4.23594 16.3208 4.6526 16.1029 4.94621L16.0303 5.03033L11.061 10L16.0303 14.9697C16.2966 15.2359 16.3208 15.6526 16.1029 15.9462L16.0303 16.0303C15.7641 16.2966 15.3474 16.3208 15.0538 16.1029L14.9697 16.0303L10 11.061L5.03033 16.0303C4.76406 16.2966 4.3474 16.3208 4.05379 16.1029L3.96967 16.0303C3.7034 15.7641 3.6792 15.3474 3.89705 15.0538L3.96967 14.9697L8.939 10L3.96967 5.03033C3.7034 4.76406 3.6792 4.3474 3.89705 4.05379L3.96967 3.96967L3.89705 4.05379Z" fill="#5C5F62"/>
                </svg>
                </span>
                <div>
                <svg class="success__modal__img" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4C35.0457 4 44 12.9543 44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4ZM32.6339 17.6161C32.1783 17.1605 31.4585 17.1301 30.9676 17.525L30.8661 17.6161L20.75 27.7322L17.1339 24.1161C16.6457 23.628 15.8543 23.628 15.3661 24.1161C14.9105 24.5717 14.8801 25.2915 15.275 25.7824L15.3661 25.8839L19.8661 30.3839C20.3217 30.8395 21.0416 30.8699 21.5324 30.475L21.6339 30.3839L32.6339 19.3839C33.122 18.8957 33.122 18.1043 32.6339 17.6161Z" fill="#008060"/>
                </svg>
                </div>
                <h1 class="success__modal__title">Мы получили вашу заявку</h1>
                <p class="success__modal__text">Ожидайте звонка в течение 15 минут</p>
                <button class="success__modal__btn">Понятно, жду</button>
                </div>
                `;

            document.body.appendChild(successModal);

            successModalClose();

            function successModalClose() {
              const successModalClose = successModal.querySelector(
                ".success__modal__btn"
              );
              const closeButton = successModal.querySelector(
                ".succes__modal__close"
              );

              successModalClose.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                overlay.style.display = "none";
                successModal.style.display = "none";

                document.body.removeChild(backCallModal);
              });

              closeButton.addEventListener("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                overlay.style.display = "none";
                successModal.style.display = "none";

                document.body.removeChild(backCallModal);
              });
            }
          });
        }
      }

      function backCallClose() {
        const backCallClose = backCallModal.querySelector(".back__call__close");

        backCallClose.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          overlay.style.display = "none";
          backCallModal.style.display = "none";

          document.body.removeChild(backCallModal);
        });

        overlay.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();

          overlay.style.display = "none";
          backCallModal.style.display = "none";

          if (successModal.style.display !== "none") {
            successModal.style.display = "none";
          }

          document.body.removeChild(backCallModal);
        });
      }
    }
  }

  function toggleMenu() {
    if (
      sideBar &&
      sideBar.classList.contains("products__catalog__products__filter__active")
    ) {
      sideBar.classList.remove("products__catalog__products__filter__active");
      closeMenu();
      return;
    }

    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }

  function openMenu() {
    if (currentBurger === "desktop") {
      burger.classList.add("burger__active");
    } else if (currentBurger === "mobile") {
      burgerMobile.classList.add("burger__active__mobile");
      searchMobile.classList.add("mobile__unactive");
      basketMobile.classList.add("mobile__unactive");
      transition.classList.add("header__options__mobile__unactive");
    }
    nav.classList.add("header__low__nav__active");
  }

  function closeMenu() {
    burger.classList.remove("burger__active");
    burgerMobile.classList.remove("burger__active__mobile");
    nav.classList.remove("header__low__nav__active");

    searchMobile.classList.remove("mobile__unactive");
    basketMobile.classList.remove("mobile__unactive");
    transition.classList.remove("header__options__mobile__unactive");
  }

  function checkBurgerType() {
    const width = window.innerWidth;
    currentBurger = width > 768 ? "desktop" : "mobile";
  }

  function handleResize() {
    const wasMenuOpen = isMenuOpen;
    const prevBurger = currentBurger;

    checkBurgerType();

    if (wasMenuOpen) {
      closeMenu();
      if (prevBurger !== currentBurger) {
        setTimeout(() => {
          isMenuOpen = true;
          openMenu();
        }, 10);
      } else {
        isMenuOpen = true;
        openMenu();
      }
    }

    if (window.innerWidth >= 992) {
      searchMobile.classList.remove("mobile__unactive");
      basketMobile.classList.remove("mobile__unactive");
      transition.classList.remove("header__options__mobile__unactive");
    }
  }

  checkBurgerType();

  if (burger) {
    burger.addEventListener("click", function () {
      checkBurgerType();
      toggleMenu();
    });
  }

  if (burgerMobile) {
    burgerMobile.addEventListener("click", function () {
      checkBurgerType();
      toggleMenu();
    });
  }

  if (searchMobile) {
    searchMobile.addEventListener("click", function () {
      checkBurgerType();
      if (!isMenuOpen) {
        toggleMenu();
      }
    });
  }

  window.updateBasketCounter = function () {
    const basketCounter = document.querySelector(".header__low__basket p");
    const basketCounterMobile = document.querySelector(
      ".header__low__basket__mobile p"
    );

    if (basketCounter) {
      const basketItems = JSON.parse(localStorage.getItem("basketItem")) || [];
      basketCounter.textContent = basketItems.length;
    }

    if (basketCounterMobile) {
      const basketItems = JSON.parse(localStorage.getItem("basketItem")) || [];
      basketCounterMobile.textContent = basketItems.length;
    }
  };

  function createBasketDropdown() {
    const basketWrap = document.querySelector(".header__low__basket__wrap");
    const basketIcone = document.querySelector(".header__low__basket");

    const dropdown = document.createElement("div");
    dropdown.className = "basket__dropdown";
    basketWrap.appendChild(dropdown);

    basketIcone.addEventListener("mouseenter", function () {
      const basketItems = JSON.parse(localStorage.getItem("basketItem")) || [];

      if (basketItems.length === 0) {
        dropdown.innerHTML = `
      <p class="empty__cart__drop">Ваша корзина пуста</p>
      `;
      } else {
        let itemHTML = "";
        const itemsToShow = basketItems.slice(0, 5);

        for (const item of itemsToShow) {
          itemHTML += `
        <div class="basket__dropdown__cart">
        <div>
        <img src="${item.image}" alt="${item.title}" class="basket__dropdown__cart__img">
        </div>
        <p class="basket__dropdown__cart__title">${item.title}</p>
        </div>
        `;
        }

        if (basketItems.length > 5) {
          itemHTML += `<p class="basket__dropdown__more">И ещё ${
            basketItems.length - 5
          }...</p>`;
        }

        dropdown.innerHTML = itemHTML;
      }

      dropdown.style.display = "flex";
    });

    basketIcone.addEventListener("mouseleave", function () {
      dropdown.style.display = "none";
    });
  }

  window.addEventListener("resize", handleResize);
  updateBasketCounter();
  createBasketDropdown();
  backCall();
});
