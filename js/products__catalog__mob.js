"use strict";
document.addEventListener("DOMContentLoaded", () => {
  function sideBarFilters() {
    const sideBar = document.querySelector(
      ".products__catalog__products__filter"
    );
    const sideBarActivator = document.querySelector(
      ".products__catalog__fliter__mobile__wrap"
    );

    sideBarActivator.addEventListener("click", function () {
      sideBar.classList.add("products__catalog__products__filter__active");
    });
  }
  sideBarFilters();
});
