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

        for (const item of basketItems) {
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
          itemHTML += `<p class="basket__dropdown__more">И ещё ${basketItems.length - 5} товаров</p>`;
        }

        dropdown.innerHTML = itemHTML;
      }

      dropdown.style.display = "flex";
    });

    basketIcone.addEventListener('mouseleave', function() {
      dropdown.style.display = "none";
    });
  }

  window.addEventListener("resize", handleResize);
  updateBasketCounter();
  createBasketDropdown();
});
