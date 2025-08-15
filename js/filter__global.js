"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const animalsContainer = document.getElementById("animals-list");
  const isCatalogPage = window.location.pathname.includes("catalog.html");
  const catalogTitle = document.querySelector(".products__catalog__title");
  const filterTypeList = document.querySelector(
    ".products__catalog__filter__type__list"
  );

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

  function initializeSidebarAnimalFilters(animals) {
    if (!filterTypeList) return;

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

        document.dispatchEvent(
          new CustomEvent("animalFilterClicked", {
            detail: { animalType: animal.type.toLowerCase() },
          })
        );
      });

      filterTypeList.appendChild(item);
    }
  }

  function loadAnimalsList() {
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

            document.dispatchEvent(
              new CustomEvent("animalFilterClicked", {
                detail: { animalType },
              })
            );

            updateCatalogTitle(animalType);
          });

          if (animalsContainer) animalsContainer.appendChild(link);
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
        if (animalsContainer)
          animalsContainer.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
      });
  }

  loadAnimalsList();
});
