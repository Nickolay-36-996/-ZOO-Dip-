"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("articles-pages-wrap");
  let allArticles = [];
  let filteredArticles = [];

  async function fetchAllArticles() {
    let nextUrl = "https://oliver1ck.pythonanywhere.com/api/get_articles_list";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          allArticles = [...allArticles, ...data.results];
        }
        nextUrl = data.next;
      }
      return allArticles;
    } catch (error) {
      console.error("Error fetching all articles", error);
      return [];
    }
  }

  fetchAllArticles()
    .then((articles) => {
      console.log("Загружено статей:", articles.length);
      allArticles = articles;
      filteredArticles = shuffleArray([...allArticles]);
      createArticles(filteredArticles);
      document.dispatchEvent(new CustomEvent("articlesLoaded"));
    })
    .catch((error) => {
      console.error("Ошибка:", error);
      container.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
    });

  function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  function createArticles(articles) {
    container.innerHTML = "";
    if (!articles || articles.length === 0) {
      container.innerHTML = `<div class="no__articles"><h3>Статей на данную тему нет</h3></div>`;
      return;
    }

    for (const article of articles) {
      const articleElement = document.createElement("div");
      articleElement.classList =
        "articles__article articles__article__for__pages";
      articleElement.innerHTML = `
      <a href="#" class="articles__article__link">
              <img src="${
                article.image
              }" class="articles__article__link__img img__articles__pages" alt="${
        article.title
      }">
            </a>
            <div class="articles__article__info">
              <a href="#">
                <h3 class="articles__article__title">${article.title}</h3>
              </a>
              <div class="articles__article__txt">${article.text}</div>
            </div>
            <div class="articles__article__details">
              <div class="articles__article__reading__time__box">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.0001 15.17C4.4713 15.17 1.6001 12.2988 1.6001 8.77002C1.6001 5.24122 4.4713 2.37002 8.0001 2.37002C11.5289 2.37002 14.4001 5.24122 14.4001 8.77002C14.4001 12.2988 11.5289 15.17 8.0001 15.17ZM9.8345 11.4044C9.6297 11.4044 9.4249 11.326 9.2689 11.17L7.4345 9.33562C7.2841 9.18602 7.2001 8.98202 7.2001 8.77002V5.57002C7.2001 5.12842 7.5577 4.77002 8.0001 4.77002C8.4425 4.77002 8.8001 5.12842 8.8001 5.57002V8.43882L10.4001 10.0388C10.7129 10.3516 10.7129 10.8572 10.4001 11.17C10.2441 11.326 10.0393 11.4044 9.8345 11.4044Z" fill="#8C9196"/>
                </svg>
                <p class="articles__article__reading__time">Время чтения: ${
                  article.read_time
                }</p>
              </div>
              <div class="articles__article__data__box">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2001 3.97002C13.8628 3.97002 14.4001 4.50728 14.4001 5.17002V13.97C14.4001 14.6328 13.8628 15.17 13.2001 15.17H2.8001C2.13736 15.17 1.6001 14.6328 1.6001 13.97V5.17002C1.6001 4.50728 2.13736 3.97002 2.8001 3.97002H4.0001V3.17002C4.0001 2.72842 4.3577 2.37002 4.8001 2.37002C5.2425 2.37002 5.6001 2.72842 5.6001 3.17002V3.97002H10.4001V3.17002C10.4001 2.72842 10.7577 2.37002 11.2001 2.37002C11.6425 2.37002 12.0001 2.72842 12.0001 3.17002V3.97002H13.2001ZM12.8001 7.17002H3.2001V13.57H12.8001V7.17002Z" fill="#8C9196"/>
                </svg>
                <p class="articles__article__data">${
                  article.date_create
                    ? new Date(article.date_create).toLocaleDateString("ru-RU")
                    : "Дата не указана"
                }</p>
              </div>
            </div>`;
      container.appendChild(articleElement);
    }
  }

  function filterArticlesByAnimal(animalId) {
    if (animalId) {
      filteredArticles = allArticles.filter(
        (article) => article.animal === animalId
      );
    } else {
      filteredArticles = [...allArticles];
    }

    createArticles(filteredArticles);
  }

  document.addEventListener("animalFilterClickedArticles", (e) => {
    const { animalId } = e.detail;
    filterArticlesByAnimal(animalId);
  });

  document.dispatchEvent(new CustomEvent("articlesLoaded"));
});
