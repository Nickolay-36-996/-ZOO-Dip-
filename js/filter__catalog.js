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
}
