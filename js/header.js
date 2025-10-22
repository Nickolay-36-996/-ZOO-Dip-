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

  async function fetchAllProductsForSearch() {
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

  fetchAllProductsForSearch()
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

    searchInput.addEventListener("input", function () {
      searchInput.placeholder = `Введите запрос..`;

      const searchText = searchInput.value;

      if (searchList) {
        searchList.innerHTML = "";
      }

      if (searchText.length > 0) {
        searchList.style.display = "flex";
      } else {
        searchList.style.display = "none";
      }

      for (const item of allProducts) {
        const product = item.title;
        if (searchText[0].toLowerCase() === product[0].toLowerCase()) {
          const prdouctItem = document.createElement("li");
          prdouctItem.className = "search__list__item";
          prdouctItem.innerHTML = `
          <a class="search__list__item__link" href="product__page.html?id=${item.id}">
          <img src="${item.image_prev}" alt="${item.title}" class="search__list__item__img">
          <p class="search__list__item__title">${item.title}</p>
          </a>
          `;

          searchList.appendChild(prdouctItem);
        }
      }
    });

    document.addEventListener("click", function (e) {
      if (searchList && searchList.style.display === "flex") {
        const clickedElement = e.target;

        if (
          !searchList.contains(clickedElement) &&
          clickedElement !== searchInput
        ) {
          searchList.style.display = "none";
        }

        if (searchInput.value.length > 0) {
          searchInput.value = "";
          searchInput.placeholder = "Поиск товаров...";
        }
      }
    });
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
});
