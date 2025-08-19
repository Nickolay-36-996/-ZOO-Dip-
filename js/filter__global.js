"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const animalsContainer = document.getElementById("animals-list");
  const isCatalogPage = window.location.pathname.includes("catalog.html");
  const catalogTitle = document.querySelector(".products__catalog__title");
  const filterTypeList = document.querySelector(
    ".products__catalog__filter__type__list"
  );

  function handleUrlParamsAfterLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const animalParam = urlParams.get("animal");
    if (animalParam) {
      const activeLink = document.querySelector(
        `[data-animal-type="${animalParam}"]`
      );
      if (activeLink) {
        activeLink.click();

        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
  }

  function resetFiltersOnPageLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("animal")) {
      const activeLinks = document.querySelectorAll(
        ".animal__category__catalog__active, " +
          ".products__catalog__filter__type__indicator__active, " +
          ".products__catalog__filter__brand__indicator__active"
      );

      for (const link of activeLinks) {
        link.classList.remove(
          "animal__category__catalog__active",
          "products__catalog__filter__type__indicator__active",
          "products__catalog__filter__brand__indicator__active"
        );
      }

      const promoIndicator = document.querySelector(
        ".promotional__item__indicator"
      );
      if (promoIndicator) {
        promoIndicator.classList.remove("promotional__item__indicator__active");
      }

      if (catalogTitle) {
        catalogTitle.textContent = "Каталог товаров";
      }
    }
  }

  fetch("https://oliver1ck.pythonanywhere.com/api/get_animals_list/")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        if (animalsContainer)
          animalsContainer.innerHTML = "<p>Нет данных о категориях</p>";
        return;
      }

      if (animalsContainer) animalsContainer.innerHTML = "";

      if (isCatalogPage) {
        initializeSidebarAnimalFilters(data.results);
        document.dispatchEvent(new CustomEvent("loadBrandsRequest"));
      }

      for (const animal of data.results) {
        const animalType = animal.type.toLowerCase();
        const link = createAnimalCategoryElement(animal);
        handleAnimalCategoryClick(link, animalType);

        if (animalsContainer) animalsContainer.appendChild(link);
      }

      if (isCatalogPage) {
        document.addEventListener("productsLoaded", handleUrlParamsAfterLoad, {
          once: true,
        });
      }
    })
    .catch((error) => {
      console.error("Error loading animals:", error);
      if (animalsContainer)
        animalsContainer.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
    });

  function createAnimalCategoryElement(animal) {
    const animalType = animal.type.toLowerCase();
    const link = document.createElement("a");

    link.href = isCatalogPage
      ? `#${animalType}`
      : `catalog.html?animal=${animalType}`;
    link.className = "animal__category__catalog";
    link.dataset.animalType = animalType;
    link.innerHTML = `
      <img src="${animal.image}" alt="${animal.type}">
      <p class="animal__category__catalog__title">${animal.type}</p>
    `;

    return link;
  }

  function handleAnimalCategoryClick(link, animalType) {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      if (!isCatalogPage) {
        window.location.href = link.href;
        return;
      }

      const allCategories = document.querySelectorAll(
        ".animal__category__catalog"
      );
      for (const category of allCategories) {
        category.classList.remove("animal__category__catalog__active");
      }
      link.classList.add("animal__category__catalog__active");

      document.dispatchEvent(
        new CustomEvent("animalFilterClicked", {
          detail: { animalType },
        })
      );

      updateCatalogTitle(animalType);
    });
  }

  function createSidebarFilterItem(animal) {
    const item = document.createElement("li");
    item.className = "products__catalog__filter__type__list__item";
    item.dataset.animalType = animal.type.toLowerCase();
    item.innerHTML = `
      <div class="products__catalog__filter__type__indicator"></div>
      <p class="products__catalog__filter__type__txt">${animal.type}</p>
    `;
    return item;
  }

  function handleSidebarFilterClick(item, animalType) {
    item.addEventListener("click", () => {
      const allItems = document.querySelectorAll(
        ".products__catalog__filter__type__list__item"
      );
      for (const el of allItems) {
        el.querySelector(
          ".products__catalog__filter__type__indicator"
        )?.classList.remove(
          "products__catalog__filter__type__indicator__active"
        );
      }

      item
        .querySelector(".products__catalog__filter__type__indicator")
        ?.classList.add("products__catalog__filter__type__indicator__active");

      document.dispatchEvent(
        new CustomEvent("animalFilterClicked", {
          detail: { animalType },
        })
      );
    });
  }

  function initializeSidebarAnimalFilters(animals) {
    if (!filterTypeList) return;

    filterTypeList.innerHTML = "";

    for (const animal of animals) {
      const item = createSidebarFilterItem(animal);
      handleSidebarFilterClick(item, animal.type.toLowerCase());
      filterTypeList.appendChild(item);
    }
  }

  function updateCatalogTitle(animalType) {
    if (!catalogTitle) return;

    const animalNames = {
      кошки: "кошек",
      собаки: "собак",
      грызуны: "грызунов",
      птицы: "птиц",
      рыбы: "рыб",
    };

    catalogTitle.textContent = animalType
      ? `Каталог товаров для ${animalNames[animalType] || animalType}`
      : "Каталог товаров";
  }
});
