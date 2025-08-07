"use strict";
document.addEventListener("DOMContentLoaded", () => {
  let currentAnimalFilter = null;
  let currentCategoryFilter = null;
  let currentPromotionalFilter = false;
  let currentBrandFilter = null;
  let currentSortType = "date";
  let allBrandsData = [];
  let searchTimeout;

  let tempFilters = {
    animalType: null,
    categoryId: null,
    promotionalOnly: false,
    brandIds: null,
  };

  const promotionalIndicator = document.querySelector(
    ".promotional__item__indicator"
  );
  const promotional = document.querySelector(".promotional__item__lbl");
  const revealSelect = document.querySelector(
    ".products__catalog__sort__select"
  );
  const selectList = document.querySelector(
    ".products__catalog__sort__select__list"
  );
  const revealSelectIndicator = document.querySelector(".select__icon");
  const applyFiltersBtn = document.querySelector(".apply__filter__mobile");
  const filterTitle = document.querySelector(
    ".products__catalog__filter__title"
  );

  const isCatalogPage = window.location.pathname.includes("catalog.html");
  const animalsContainer = document.getElementById("animals-list");

  fetch("https://oliver1ck.pythonanywhere.com/api/get_animals_list/")
    .then((response) => {
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      console.log("Полученные данные:", data);
      animalsContainer.innerHTML = "";

      if (!data.results || data.results.length === 0) {
        animalsContainer.innerHTML = "<p>Нет данных о категориях</p>";
        return;
      }

      if (isCatalogPage) {
        initializeSidebarAnimalFilters(data.results);

        fetchAllProducts()
          .then((allProducts) => {
            loadBrandFilters(allProducts);
          })
          .catch(console.error);
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

        animalsContainer.appendChild(link);
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
      animalsContainer.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
    });

  function filterProductsByAnimal(animalType) {
    const promotionalOnly = promotionalIndicator.classList.contains(
      "promotional__item__indicator__active"
    );

    currentAnimalFilter = animalType;
    currentCategoryFilter = null;

    const event = new CustomEvent("filterProducts", {
      detail: {
        animalType: animalType,
        categoryId: null,
        promotionalOnly: promotionalOnly,
        brandIds: currentBrandFilter,
        sortType: currentSortType,
      },
    });
    document.dispatchEvent(event);

    updateAnimalFilters(animalType);
    loadProductsForFilters(animalType);
    updateCatalogTitle(animalType);
    updateFilterTitle(animalType);
  }

  function filterProductsByCategory(categoryIds) {
    const activeAnimalLink = document.querySelector(
      ".animal__category__catalog__active"
    );
    if (!activeAnimalLink) return;

    const animalType = activeAnimalLink.dataset.animalType;
    const promotionalOnly = promotionalIndicator.classList.contains(
      "promotional__item__indicator__active"
    );

    if (window.innerWidth >= 993) {
      currentCategoryFilter = Array.isArray(categoryIds)
        ? categoryIds
        : categoryIds
        ? [categoryIds]
        : null;
      const event = new CustomEvent("filterProducts", {
        detail: {
          animalType: animalType,
          categoryId: currentCategoryFilter,
          promotionalOnly: promotionalOnly,
          brandIds: currentBrandFilter,
          sortType: currentSortType,
        },
      });
      document.dispatchEvent(event);
    } else {
      tempFilters.categoryId = Array.isArray(categoryIds)
        ? categoryIds
        : categoryIds
        ? [categoryIds]
        : null;
    }
    updateFilterTitle(animalType);
  }

  function filterProductsByBrand() {
    const activeAnimalLink = document.querySelector(
      ".animal__category__catalog__active"
    );
    const animalType = activeAnimalLink
      ? activeAnimalLink.dataset.animalType
      : null;

    const activeCategoryItem = document.querySelector(
      ".products__catalog__filter__type__indicator__active"
    );
    const categoryId =
      activeCategoryItem?.closest(
        ".products__catalog__filter__type__list__item"
      )?.dataset.categoryId || null;

    const promotionalOnly = promotionalIndicator.classList.contains(
      "promotional__item__indicator__active"
    );

    const event = new CustomEvent("filterProducts", {
      detail: {
        animalType: animalType,
        categoryId: categoryId,
        promotionalOnly: promotionalOnly,
        brandIds: currentBrandFilter,
        sortType: currentSortType,
      },
    });
    document.dispatchEvent(event);
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
        const isActive =
          itemTextElement.textContent.toLowerCase() === animalType;
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

  function updateCatalogTitle(animalType) {
    const catalogTitle = document.querySelector(".products__catalog__title");
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

  function updateFilterTitle(animalType) {
    if (filterTitle) {
      filterTitle.textContent = animalType
        ? "Тип товара"
        : "Выберите животного";
    }
  }

  async function loadProductsForFilters(animalType) {
    try {
      const allProducts = await fetchAllProducts();
      updateCategoryFilters(animalType, allProducts);
    } catch (error) {
      console.error("Ошибка загрузки продуктов:", error);
    }
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

  function updateCategoryFilters(animalType, products) {
    const filterTypeList = document.querySelector(
      ".products__catalog__filter__type__list"
    );
    filterTypeList.innerHTML = "";

    const categoryCounts = {};
    const foodCategories = {};

    for (const product of products) {
      if (!product.animal.some((a) => a.type.toLowerCase() === animalType))
        continue;
      if (!product.category) continue;

      const categoryId = product.category.id;
      const categoryName = product.category.name;
      const isFood = categoryName.toLowerCase().includes("корм");
      const target = isFood ? foodCategories : categoryCounts;

      if (!target[categoryId]) {
        target[categoryId] = {
          name: categoryName,
          count: 0,
          hasSale: false,
        };
      }

      target[categoryId].count++;
      if (product.sale?.percent > 0) {
        target[categoryId].hasSale = true;
      }
    }

    if (Object.keys(foodCategories).length > 0) {
      const foodCategoryItem = document.createElement("li");
      foodCategoryItem.className = "food__category__item";

      const totalCount = Object.values(foodCategories).reduce(
        (sum, cat) => sum + cat.count,
        0
      );
      const hasSale = Object.values(foodCategories).some((cat) => cat.hasSale);

      foodCategoryItem.innerHTML = `
      <div class="food__category__contain">
        <div class="products__catalog__filter__type__indicator"></div>
        <p class="products__catalog__filter__type__txt">Корм</p>
        <span class="products__catalog__filter__type__count">(${totalCount})</span>
        ${
          hasSale
            ? '<span class="products__catalog__filter__type__sale">Акция</span>'
            : ""
        }
      </div>
      <div class="food__subcategories__list"></div>
    `;

      const subCategoriesList = foodCategoryItem.querySelector(
        ".food__subcategories__list"
      );
      const foodIndicator = foodCategoryItem.querySelector(
        ".products__catalog__filter__type__indicator"
      );

      foodCategoryItem
        .querySelector(".food__category__contain")
        .addEventListener("click", () => {
          resetAllIndicators();
          foodIndicator.classList.add(
            "products__catalog__filter__type__indicator__active"
          );

          const subItems = subCategoriesList.querySelectorAll(
            ".food__subcategory__item"
          );
          for (const subItem of subItems) {
            subItem
              .querySelector(".products__catalog__filter__brand__indicator")
              .classList.add(
                "products__catalog__filter__brand__indicator__active"
              );
          }

          filterProductsByCategory(Object.keys(foodCategories));
        });

      for (const [categoryId, categoryInfo] of Object.entries(foodCategories)) {
        const subItem = document.createElement("div");
        subItem.className = "food__subcategory__item";
        subItem.dataset.categoryId = categoryId;

        subItem.innerHTML = `
        <div class="products__catalog__filter__brand__indicator"></div>
        <p class="products__catalog__filter__brand__txt">${categoryInfo.name}</p>
        <span class="products__catalog__filter__type__count">(${categoryInfo.count})</span>
      `;

        const subIndicator = subItem.querySelector(
          ".products__catalog__filter__brand__indicator"
        );

        subItem.addEventListener("click", (e) => {
          e.stopPropagation();

          subIndicator.classList.toggle(
            "products__catalog__filter__brand__indicator__active"
          );

          const activeSubs = subCategoriesList.querySelectorAll(
            ".products__catalog__filter__brand__indicator__active"
          );

          foodIndicator.classList.toggle(
            "products__catalog__filter__type__indicator__active",
            activeSubs.length > 0
          );

          const selectedIds = [];
          for (const indicator of activeSubs) {
            selectedIds.push(
              indicator.closest(".food__subcategory__item").dataset.categoryId
            );
          }

          filterProductsByCategory(selectedIds.length > 0 ? selectedIds : null);
        });

        subCategoriesList.appendChild(subItem);
      }

      filterTypeList.appendChild(foodCategoryItem);
    }

    for (const [categoryId, categoryInfo] of Object.entries(categoryCounts)) {
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

      const indicator = item.querySelector(
        ".products__catalog__filter__type__indicator"
      );

      item.addEventListener("click", () => {
        resetAllIndicators();
        indicator.classList.add(
          "products__catalog__filter__type__indicator__active"
        );
        filterProductsByCategory(categoryId);
      });

      filterTypeList.appendChild(item);
    }
  }

  function resetAllIndicators() {
    const typeIndicators = document.querySelectorAll(
      ".products__catalog__filter__type__indicator"
    );
    for (const indicator of typeIndicators) {
      indicator.classList.remove(
        "products__catalog__filter__type__indicator__active"
      );
    }

    const brandIndicators = document.querySelectorAll(
      ".products__catalog__filter__brand__indicator"
    );
    for (const indicator of brandIndicators) {
      indicator.classList.remove(
        "products__catalog__filter__brand__indicator__active"
      );
    }
  }

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
      console.error("Error fetching all products:", error);
      return [];
    }
  }

  function loadBrandFilters(products) {
    const brandList = document.querySelector(
      ".products__catalog__filter__brand__list"
    );
    brandList.innerHTML = "";
    allBrandsData = [];

    const brandCounts = {};
    for (const product of products) {
      if (product.brand) {
        const brandId = product.brand.id;
        if (!brandCounts[brandId]) {
          brandCounts[brandId] = {
            name: product.brand.name,
            count: 0,
            hasSale: false,
          };
        }
        brandCounts[brandId].count++;
        if (product.sale?.percent > 0) brandCounts[brandId].hasSale = true;
      }
    }

    for (const [brandId, brandInfo] of Object.entries(brandCounts)) {
      allBrandsData.push({
        id: brandId,
        name: brandInfo.name,
        count: brandInfo.count,
        hasSale: brandInfo.hasSale,
      });

      const item = document.createElement("div");
      item.className = "products__catalog__filter__brand__item";
      item.dataset.brandId = brandId;

      item.innerHTML = `
        <div class="products__catalog__filter__brand__indicator"></div>
        <p class="products__catalog__filter__brand__txt">${brandInfo.name}</p>
        <span class="products__catalog__filter__brand__count">(${
          brandInfo.count
        })</span>
        ${
          brandInfo.hasSale
            ? '<span class="products__catalog__filter__brand__sale">Акция</span>'
            : ""
        }
      `;

      item.addEventListener("click", () => {
        const indicator = item.querySelector(
          ".products__catalog__filter__brand__indicator"
        );
        indicator.classList.toggle(
          "products__catalog__filter__brand__indicator__active"
        );

        if (window.innerWidth < 993) return;

        const selectedBrands = [];
        const activeIndicators = document.querySelectorAll(
          ".products__catalog__filter__brand__indicator__active"
        );

        for (const indicator of activeIndicators) {
          selectedBrands.push(
            indicator.closest(".products__catalog__filter__brand__item").dataset
              .brandId
          );
        }

        currentBrandFilter = selectedBrands.length > 0 ? selectedBrands : null;
        filterProductsByBrand();
      });

      brandList.appendChild(item);
    }

    initBrandSearch();
  }

  function initBrandSearch() {
    const brandSearchInput = document.querySelector(
      ".products__catalog__filter__brand__src__input"
    );
    brandSearchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(
        () => filterBrandsList(brandSearchInput.value),
        300
      );
    });
    addClearButton();
  }

  function filterBrandsList(searchText) {
    const brandItems = document.querySelectorAll(
      ".products__catalog__filter__brand__item"
    );
    let visibleCount = 0;
    const searchLower = searchText.toLowerCase().trim();

    for (const item of brandItems) {
      const brandName = item
        .querySelector(".products__catalog__filter__brand__txt")
        .textContent.toLowerCase();
      const isVisible =
        searchLower === "" || checkBrandMatch(brandName, searchLower);
      item.style.display = isVisible ? "flex" : "none";
      if (isVisible) visibleCount++;
    }

    updateBrandsCounter(visibleCount);
  }

  function checkBrandMatch(brandName, searchText) {
    const searchWords = searchText.split(" ");
    const brandWords = brandName.split(" ");

    for (const word of searchWords) {
      let wordFound = false;

      for (const brandWord of brandWords) {
        if (brandWord.startsWith(word)) {
          wordFound = true;
          break;
        }
      }

      if (!wordFound && !brandName.includes(word)) {
        return false;
      }
    }

    return true;
  }

  function updateBrandsCounter(count) {
    let counter = document.querySelector(".brands-counter");
    if (!counter) {
      counter = document.createElement("div");
      counter.className = "brands-counter";
      document
        .querySelector(".products__catalog__filter__brand")
        .appendChild(counter);
    }
    counter.textContent = `Найдено брендов: ${count}`;
  }

  function addClearButton() {
    const searchContainer = document.querySelector(
      ".products__catalog__filter__brand__src"
    );
    if (document.querySelector(".clear-search")) return;

    const clearBtn = document.createElement("span");
    clearBtn.className = "clear-search";
    clearBtn.innerHTML = "&times;";
    clearBtn.addEventListener("click", () => {
      const input = document.querySelector(
        ".products__catalog__filter__brand__src__input"
      );
      input.value = "";
      filterBrandsList("");
    });
    searchContainer.appendChild(clearBtn);
  }

  function initSorting() {
    const sortItems = document.querySelectorAll(
      ".products__catalog__sort__select__list__item"
    );

    for (const item of sortItems) {
      item.addEventListener("click", () => {
        const sortText = item.querySelector(
          ".products__catalog__sort__select__list__item__txt"
        ).textContent;
        document.querySelector(
          ".products__catalog__sort__select__active"
        ).textContent = sortText;

        if (sortText.includes("названию: «от А до Я»")) {
          currentSortType = "name_asc";
        } else if (sortText.includes("названию: «от Я до А»")) {
          currentSortType = "name_desc";
        } else if (sortText.includes("цене по возр")) {
          currentSortType = "price_asc";
        } else if (sortText.includes("цене по убыв")) {
          currentSortType = "price_desc";
        } else if (sortText.includes("популярности")) {
          currentSortType = "popularity";
        } else {
          currentSortType = "date";
        }

        applySorting();
      });
    }
  }

  function applySorting() {
    document.dispatchEvent(
      new CustomEvent("sortProducts", {
        detail: {
          sortType: currentSortType,
        },
      })
    );
  }

  promotional.addEventListener("click", function () {
    promotionalIndicator.classList.toggle(
      "promotional__item__indicator__active"
    );
    const isPromoActive = promotionalIndicator.classList.contains(
      "promotional__item__indicator__active"
    );

    if (window.innerWidth >= 993) {
      currentPromotionalFilter = isPromoActive;
      const activeAnimalLink = document.querySelector(
        ".animal__category__catalog__active"
      );
      const animalType = activeAnimalLink
        ? activeAnimalLink.dataset.animalType
        : null;

      const activeCategoryItem = document.querySelector(
        ".products__catalog__filter__type__indicator__active"
      );
      const categoryId =
        activeCategoryItem?.closest(
          ".products__catalog__filter__type__list__item"
        )?.dataset.categoryId || null;

      const event = new CustomEvent("filterProducts", {
        detail: {
          animalType: animalType,
          categoryId: categoryId,
          promotionalOnly: isPromoActive,
          brandIds: currentBrandFilter,
          sortType: currentSortType,
        },
      });
      document.dispatchEvent(event);
    } else {
      tempFilters.promotionalOnly = isPromoActive;
    }
  });

  revealSelect.addEventListener("click", function () {
    selectList.classList.toggle(
      "products__catalog__sort__select__list__active"
    );
    revealSelectIndicator.classList.toggle("select__icon__active");
  });

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener("click", function () {
      if (window.innerWidth < 993) {
        const selectedBrands = [];
        document
          .querySelectorAll(
            ".products__catalog__filter__brand__indicator__active"
          )
          .forEach((indicator) => {
            selectedBrands.push(
              indicator.closest(".products__catalog__filter__brand__item")
                .dataset.brandId
            );
          });
        currentBrandFilter = selectedBrands.length > 0 ? selectedBrands : null;
      }

      const activeAnimalLink = document.querySelector(
        ".animal__category__catalog__active"
      );
      const animalType = activeAnimalLink
        ? activeAnimalLink.dataset.animalType
        : null;

      currentAnimalFilter =
        tempFilters.animalType !== null ? tempFilters.animalType : animalType;
      currentCategoryFilter = tempFilters.categoryId;
      currentPromotionalFilter = tempFilters.promotionalOnly;

      const event = new CustomEvent("filterProducts", {
        detail: {
          animalType: currentAnimalFilter,
          categoryId: currentCategoryFilter,
          promotionalOnly: currentPromotionalFilter,
          brandIds: currentBrandFilter,
          sortType: currentSortType,
        },
      });
      document.dispatchEvent(event);

      const sideBar = document.querySelector(
        ".products__catalog__products__filter"
      );
      const burgerMobile = document.querySelector(".burger__menu__mobile");
      const burger = document.querySelector(".burger__menu");

      sideBar.classList.remove("products__catalog__products__filter__active");
      if (burgerMobile) burgerMobile.classList.remove("burger__active__mobile");
      if (burger) burger.classList.remove("burger__active");
    });
  }

  initSorting();
});
