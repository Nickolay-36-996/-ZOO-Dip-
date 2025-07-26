"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const isCatalogPage = window.location.pathname.includes("catalog.html");
  const container = document.getElementById("animals-list");

  fetch("https://oliver1ck.pythonanywhere.com/api/get_animals_list/")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log("Полученные данные:", data);
      container.innerHTML = "";

      if (!data.results || data.results.length === 0) {
        container.innerHTML = "<p>Нет данных о категориях</p>";
        return;
      }

      if (isCatalogPage) {
        initializeSidebarAnimalFilters(data.results);
      }

      for (const animal of data.results) {
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
          loadProductsForFilters(animalType);
          filterProductsByAnimal(animalType);
        });

        container.appendChild(link);
      }

      if (isCatalogPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const animalParam = urlParams.get("animal");
        if (animalParam) {
          const activeLink = document.querySelector(
            `[data-animal-type="${animalParam}"]`
          );
          if (activeLink) activeLink.click();
        }
      }
    })
    .catch((error) => {
      console.error("Error loading animals:", error);
      container.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
    });
});

function updateCatalogTitle(animalType) {
  const catalogTitle = document.querySelector(".products__catalog__title");
  if (!catalogTitle) return;

  if (animalType) {
    const animalNames = {
      кошки: "кошек",
      собаки: "собак",
      грызуны: "грызунов",
      птицы: "птиц",
      рыбы: "рыб",
    };

    const multipleName = animalNames[animalType] || animalType;
    catalogTitle.textContent = `Каталог товаров для ${multipleName}`;
  } else {
    catalogTitle.textContent = "Каталог товаров";
  }
}

function filterProductsByAnimal(animalType) {
  const promotionalIndicator = document.querySelector(
    ".promotional__item__indicator"
  );
  const promotionalOnly = promotionalIndicator.classList.contains(
    "promotional__item__indicator__active"
  );

  const event = new CustomEvent("filterProducts", {
    detail: {
      animalType: animalType,
      categoryId: null,
      promotionalOnly: promotionalOnly,
    },
  });
  document.dispatchEvent(event);
  updateAnimalFilters(animalType);
  loadProductsForFilters(animalType);
  updateFilterTitle(animalType);
  updateCatalogTitle(animalType);
}

function filterProductsByCategory(categoryId) {
  const activeAnimalLink = document.querySelector(
    ".animal__category__catalog__active"
  );
  if (!activeAnimalLink) return;

  const animalType = activeAnimalLink.dataset.animalType;
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
    },
  });
  document.dispatchEvent(event);
  updateFilterTitle(animalType);
}

function updateAnimalFilters(animalType) {
  const mainAnimalLinks = document.querySelectorAll(
    ".animal__category__catalog"
  );
  for (const categoryLink of mainAnimalLinks) {
    const isActive = categoryLink.dataset.animalType === animalType;
    categoryLink.classList.toggle(
      "animal__category__catalog__active",
      isActive
    );
  }

  const filterItems = document.querySelectorAll(
    ".products__catalog__filter__type__list__item"
  );
  for (const filterItem of filterItems) {
    const itemTextElement = filterItem.querySelector(
      ".products__catalog__filter__type__txt"
    );
    if (itemTextElement) {
      const isActive = itemTextElement.textContent.toLowerCase() === animalType;
      const indicator = filterItem.querySelector(
        ".products__catalog__filter__type__indicator"
      );
      if (indicator) {
        indicator.classList.toggle(
          "products__catalog__filter__type__indicator__active",
          isActive
        );
      }
    }
  }
}

function loadProductsForFilters(animalType) {
  fetch("https://oliver1ck.pythonanywhere.com/api/get_products_list/")
    .then((response) => response.json())
    .then((data) => {
      updateCategoryFilters(animalType, data.results || []);
    })
    .catch((error) => console.error("Ошибка загрузки продуктов:", error));
}

function initializeSidebarAnimalFilters(animals) {
  const filterTypeList = document.querySelector(
    ".products__catalog__filter__type__list"
  );
  filterTypeList.innerHTML = "";

  for (const animal of animals) {
    const item = document.createElement("li");
    item.className = "products__catalog__filter__type__list__item";
    item.dataset.animalType = animal.type.toLowerCase();
    item.innerHTML = `
      <div class="products__catalog__filter__type__indicator"></div>
      <p class="products__catalog__filter__type__txt">${animal.type}</p>
    `;

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

      filterProductsByAnimal(animal.type.toLowerCase());
    });

    filterTypeList.appendChild(item);
  }
}

function updateFilterTitle(animalType) {
  const filterTitle = document.querySelector(
    ".products__catalog__filter__title"
  );
  if (filterTitle) {
    filterTitle.textContent = animalType ? "Тип товара" : "Выберите животного";
  }
}

function updateCategoryFilters(animalType, products) {
  const filterTypeList = document.querySelector(
    ".products__catalog__filter__type__list"
  );

  filterTypeList.innerHTML = "";

  const categoryCounts = {};

  for (const product of products) {
    const isForCurrentAnimal = product.animal.some(
      (animal) => animal.type.toLowerCase() === animalType
    );

    if (isForCurrentAnimal && product.category) {
      const categoryId = product.category.id;

      if (!categoryCounts[categoryId]) {
        categoryCounts[categoryId] = {
          name: product.category.name,
          count: 0,
          hasSale: false,
        };
      }
      categoryCounts[categoryId].count++;

      if (product.sale && product.sale.percent > 0) {
        categoryCounts[categoryId].hasSale = true;
      }
    }
  }

  for (const categoryId in categoryCounts) {
    const categoryInfo = categoryCounts[categoryId];

    const item = document.createElement("li");
    item.className = "products__catalog__filter__type__list__item";
    item.dataset.categoryId = categoryId;

    item.innerHTML = `
      <div class="products__catalog__filter__type__indicator"></div>
      <p class="products__catalog__filter__type__txt">${categoryInfo.name}</p>
      <span class="products__catalog__filter__type__count">(${
        categoryInfo.count
      })</span>
      ${
        categoryInfo.hasSale
          ? '<span class="products__catalog__filter__type__sale">Акция</span>'
          : ""
      }
    `;

    item.addEventListener("click", () => {
      filterProductsByCategory(categoryId);
    });

    filterTypeList.appendChild(item);
  }
}
