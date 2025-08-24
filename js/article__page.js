"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("article-wrap");
  const nav = document.querySelector(".catalog__nav__list");
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = parseInt(urlParams.get("id"));

  function updateNavigation(articleTitle) {
    if (!nav) return;
    const articleNavItem = document.createElement("li");
    articleNavItem.className = "catalog__nav__list__item";

    articleNavItem.innerHTML = `
    <a href="${window.location.href}" class="catalog__nav__list__item__link catalog__nav__list__item__link__article">
      ${articleTitle}
    </a>
  `;

    nav.appendChild(articleNavItem);
  }

  if (!articleId) {
    container.innerHTML = "<p>Статья не найдена</p>";
    return;
  }

  async function fetchAllArticles() {
    let allArticles = [];
    let nextUrl = "https://oliver1ck.pythonanywhere.com/api/get_articles_list/";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          allArticles = [...allArticles, ...data.results];
        }

        nextUrl = data.next;
      }
      return allArticles;
    } catch (error) {
      console.error("Ошибка при загрузке статей:", error);
      throw error;
    }
  }

  fetchAllArticles()
    .then((allArticles) => {
      console.log("Всего статей загружено:", allArticles.length);
      const findArticle = allArticles.find((item) => item.id === articleId);

      if (findArticle) {
        createArticle(findArticle);
      } else {
        container.innerHTML = `<div class="no__article"><h3>Статья не найдена</h3></div>`;
      }
    })
    .catch((error) => {
      console.error("Error loading article:", error);
      container.innerHTML = `<p>Ошибка загрузки статьи: ${error.message}</p>`;
    });

  function createArticle(article) {
    updateNavigation(article.title);

    document.title = `${article.title}`;

    container.innerHTML = `
    <div class="article__header">
    <h1 class="article__header__title">${article.title}</h1>
    <div class="article__header__meta">
    <div class="article__header__meta__param">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.0001 14.4001C4.4713 14.4001 1.6001 11.5289
    1.6001 8.0001C1.6001 4.4713 4.4713 1.6001 8.0001 1.6001C11.5289 1.6001 14.4001 4.4713 14.4001 8.0001C14.4001
    11.5289 11.5289 14.4001 8.0001 14.4001ZM9.8345 10.6345C9.6297 10.6345 9.4249 10.5561 9.2689 10.4001L7.4345 8.5657C7.2841
    8.4161 7.2001 8.2121 7.2001 8.0001V4.8001C7.2001 4.3585 7.5577 4.0001 8.0001 4.0001C8.4425 4.0001 8.8001 4.3585 8.8001
    4.8001V7.6689L10.4001 9.2689C10.7129 9.5817 10.7129 10.0873 10.4001 10.4001C10.2441 10.5561 10.0393 10.6345 9.8345 10.6345Z"
    fill="#00A0AC"/>
    </svg>
    <span>Время чтения ${article.read_time}</span>
    </div>
    <div class="article__header__meta__param">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.2001 3.2001C13.8628 3.2001 14.4001 3.73736 14.4001 4.4001V13.2001C14.4001
    13.8628 13.8628 14.4001 13.2001 14.4001H2.8001C2.13736 14.4001 1.6001 13.8628 1.6001 13.2001V4.4001C1.6001 3.73736 2.13736 3.2001
    2.8001 3.2001H4.0001V2.4001C4.0001 1.9585 4.3577 1.6001 4.8001 1.6001C5.2425 1.6001 5.6001 1.9585 5.6001
    2.4001V3.2001H10.4001V2.4001C10.4001 1.9585 10.7577 1.6001 11.2001 1.6001C11.6425 1.6001 12.0001 1.9585 12.0001
    2.4001V3.2001H13.2001ZM12.8001 6.4001H3.2001V12.8001H12.8001V6.4001Z" fill="#00A0AC"/>
    </svg>
    <span>${new Date(article.date_create).toLocaleDateString("ru-RU")}</span>
    </div>
    </div>
    </div>
    <div class="article__img">
    <img src="${article.image}" alt="${article.image}">
    </div>
    <div class="article__txt">${article.text}</div>
    `;
  }
});
