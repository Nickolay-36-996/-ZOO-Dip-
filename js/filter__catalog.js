"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("animals-list");

  fetch("https://oliver1ck.pythonanywhere.com/api/get_animals_list/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Полученные данные:", data);
      container.innerHTML = "";
      if (data.results && data.results.length > 0) {
        for (const animal of data.results) {
          const link = document.createElement("a");
          link.href = `#${animal.type.toLowerCase()}`;
          link.className = "animal__category__catalog";
          link.dataset.animalType = animal.type.toLowerCase();
          link.innerHTML = `
                        <img src="${animal.image}" alt="${animal.type}">
                        <p class="animal__category__catalog__title">${animal.type}</p>
                    `;

          link.addEventListener("click", (e) => {
            e.preventDefault();
            const allCategories = document.querySelectorAll(
              ".animal__category__catalog"
            );
            for (const category of allCategories) {
              category.classList.remove("animal__category__catalog__active");
            }
            link.classList.add("animal__category__catalog__active");
            loadProductsForFilters(animal.type.toLowerCase());
            filterProductsByAnimal(animal.type.toLowerCase());
          });

          container.appendChild(link);
        }
      } else {
        container.innerHTML = "<p>Нет данных о категориях</p>";
      }
    })
    .catch((error) => {
      container.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
      console.error("Ошибка fetch:", error);
    });
});

function filterProductsByAnimal(animalType) {
  const event = new CustomEvent('filterProducts', {
    detail: {
      animalType: animalType
    }
  });
  document.dispatchEvent(event);
  updateAnimalFilters(animalType);
}

function filterProductsByCategory(categoryId) {
  const activeAnimalLink = document.querySelector('.animal__category__catalog__active');
  if (!activeAnimalLink) return; 

  const animalType = activeAnimalLink.dataset.animalType;

  const event = new CustomEvent('filterProducts', {
    detail: {
      animalType: animalType,  
      categoryId: categoryId   
    }
  });
  document.dispatchEvent(event);
}

function updateAnimalFilters(animalType) {

  const mainAnimalLinks = document.querySelectorAll('.animal__category__catalog');
  for (const categoryLink of mainAnimalLinks) {
    const isActive = categoryLink.dataset.animalType === animalType;
    categoryLink.classList.toggle('animal__category__catalog__active', isActive);
  }

  const filterIndicators = document.querySelectorAll('.products__catalog__filter__type__indicator');
  const filterItems = document.querySelectorAll('.products__catalog__filter__type__list__item');
  
  for (const indicator of filterIndicators) {
    indicator.classList.remove('products__catalog__filter__type__indicator__active');
  }

  for (const filterItem of filterItems) {
    const itemTextElement = filterItem.querySelector('.products__catalog__filter__type__txt');
    if (itemTextElement && itemTextElement.textContent.toLowerCase() === animalType) {
      const currentIndicator = filterItem.querySelector('.products__catalog__filter__type__indicator');
      if (currentIndicator) {
        currentIndicator.classList.add('products__catalog__filter__type__indicator__active');
      }
      break;
    }
  }
}

function loadProductsForFilters(animalType) {
  fetch("https://oliver1ck.pythonanywhere.com/api/get_products_list/")
    .then(response => response.json())
    .then(data => {
      updateCategoryFilters(animalType, data.results || []);
    })
    .catch(error => console.error("Ошибка загрузки продуктов:", error));
}

function updateCategoryFilters(animalType, products) {
  const filterTypeList = document.querySelector('.products__catalog__filter__type__list');
  filterTypeList.innerHTML = '';
  
  const categoriesMap = {};

  for (const product of products) {
    let isForAnimal = false;
    for (const animal of product.animal) {
      if (animal.type.toLowerCase() === animalType) {
        isForAnimal = true;
        break;
      }
    }

    if (isForAnimal && product.category) {
      const catId = product.category.id;
      if (!categoriesMap[catId]) {
        categoriesMap[catId] = {
          id: catId,
          name: product.category.name,
          count: 0
        };
      }
      categoriesMap[catId].count++;
    }
  }

  const allItem = document.createElement('li');
  allItem.className = 'products__catalog__filter__type__list__item';
  allItem.innerHTML = `
    <div class="products__catalog__filter__type__indicator products__catalog__filter__type__indicator__active"></div>
    <p class="products__catalog__filter__type__txt">Все</p>
    <span class="products__catalog__filter__type__count">(${Object.values(categoriesMap).reduce((sum, cat) => sum + cat.count, 0)})</span>
  `;
  allItem.addEventListener('click', () => filterProductsByCategory(''));
  filterTypeList.appendChild(allItem);

  for (const category of Object.values(categoriesMap)) {
    const item = document.createElement('li');
    item.className = 'products__catalog__filter__type__list__item';
    item.innerHTML = `
      <div class="products__catalog__filter__type__indicator"></div>
      <p class="products__catalog__filter__type__txt">${category.name}</p>
      <span class="products__catalog__filter__type__count">(${category.count})</span>
    `;
    item.addEventListener('click', () => filterProductsByCategory(category.id));
    filterTypeList.appendChild(item);
  }
}
