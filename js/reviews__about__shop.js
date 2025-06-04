"use strict";

// выгрузка данных

// document.addEventListener("DOMContentLoaded", () => {
//   const container = document.getElementById("reviews-about-shop-slider");
//   const counter = document.querySelector(".reviews__about__shop__counter");

//   fetch("https://oliver1ck.pythonanywhere.com/api/get_reviews_list/")
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP Error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log("Полученные данные", data);
//       container.innerHTML = "";

//       const totalReviews = data.results ? data.results.length : 0;
//       counter.textContent = `${totalReviews} из ${totalReviews}`;

//       if (data.results && data.results.length > 0) {
//         for (const review of data.results) {
//           const windowReview = document.createElement("div");
//           windowReview.className = "review__about__shop";
//           windowReview.innerHTML = `
//                 <h3 class="reviev__about__shop__title">${review.user}</h3>
//                 <p class="review__about__shop__txt">${review.text}</p>
//             <div class ="review__about__shop__details">
//                 <a href="#" class="review__about__shop__phone__user">
//                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
//                  <g clip-path="url(#clip0_576_1460)">
//                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.87402 1.95702C2.87402 1.30146 3.40546 0.77002 4.06102 0.77002H12.7657C13.4212 0.77002 13.9527 1.30146 13.9527 1.95702V15.4097C13.9527 16.0652 13.4212 16.5967 12.7657 16.5967H4.06102C3.40546 16.5967 2.87402 16.0652 2.87402 15.4097V1.95702ZM4.45669 2.35268H12.37V13.4313H4.45669V2.35268ZM7.62202 14.2227C7.18498 14.2227 6.83068 14.577 6.83068 15.014C6.83068 15.451 7.18498 15.8053 7.62202 15.8053H9.20468C9.64172 15.8053 9.99601 15.451 9.99601 15.014C9.99601 14.577 9.64172 14.2227 9.20468 14.2227H7.62202Z" fill="#8C9196"/>
//                  </g>
//                  <defs>
//                  <clipPath id="clip0_576_1460">
//                  <rect width="16" height="16" fill="white" transform="translate(0.5 0.77002)"/>
//                  </clipPath>
//                  </defs>
//                  </svg>
//                  ${review.phone_number}
//                 </a>
//                 <div class="review__about__shop__pet">
//                  <p>Питомец: <span>${review.pet}</span></p>
//                 </div>
//             </div>`;
//           container.appendChild(windowReview);
//         }
//       } else {
//         container.innerHTML = "<p>Нет данных о отзывах</p>";
//         counter.textContent = "0 из 0";
//       }
//     })
//     .catch((error) => {
//       container.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
//       counter.textContent = "0 из 0";
//       console.error("Ошибка fetch:", error);
//     });
// });

// имитация

document.addEventListener("DOMContentLoaded", () => {
  const sliderOuter = document.getElementById("reviews-about-shop-slider-outer");
  const sliderInner = document.getElementById("reviews-about-shop-slider-inner");
  const counter = document.querySelector(".reviews__about__shop__counter");
  const vectorLeft = document.querySelector(".reviews__about__shop__slider__control__vector__left");
  const vectorRight = document.querySelector(".reviews__about__shop__slider__control__vector__right");

  const dataReviews = {
    results: [
      {
        user: "Меженная Марина Мельников Руслан",
        text: "Мы являемся хозяевами замечательного голден ретривера по кличке Умка. Своего пса мы очень любим, хотим видеть его красивым и здоровым, а потому к выбору корма подошли ответственно: прочитали соответствующую литературу, изучили составы различных кормов, проконсультировались у заводчиков. В результате свой выбор остановили на Акане: это сбалансированный корм с высоким содержанием протеинов, но без «разбухающих» зерновых культур. Сейчас Умке два с половиной года и в течение последних полутора лет мы кормим его «Acana Grasslands» с лососем и ягненком. Да, корм недешевый, но мы ни разу не пожалели о своем выборе: Умка в отличной форме, а главное – он получает все необходимые питательные вещества и микроэлементы в нужном количестве. Аллергических реакций на корм замечено не было. Вобщем, кормом мы довольны!",
        phone_number: "+375 44 672 23 43",
        pet: "собака умка"
      },
      {
        user: "Иванова Анна Петровна",
        text: "Мы являемся хозяевами замечательного голден ретривера по кличке Умка. Своего пса мы очень любим, хотим видеть его красивым и здоровым, а потому к выбору корма подошли ответственно: прочитали соответствующую литературу, изучили составы различных кормов, проконсультировались у заводчиков. В результате свой выбор остановили на Акане: это сбалансированный корм с высоким содержанием протеинов, но без «разбухающих» зерновых культур. Сейчас Умке два с половиной года и в течение последних полутора лет мы кормим его «Acana Grasslands» с лососем и ягненком. Да, корм недешевый, но мы ни разу не пожалели о своем выборе: Умка в отличной форме, а главное – он получает все необходимые питательные вещества и микроэлементы в нужном количестве. Аллергических реакций на корм замечено не было. Вобщем, кормом мы довольны!",
        phone_number: "+375 29 123 45 67",
        pet: "собака умка"
      }
    ],
  };

  let currentIndex = 0;
  const slides = [];

  setTimeout(() => {
    console.log("Полученные данные (имитация)", dataReviews);
    sliderInner.innerHTML = "";

    const totalReviews = dataReviews.results ? dataReviews.results.length : 0;

    if(dataReviews.results && dataReviews.results.length > 0) {
      dataReviews.results.forEach(review => {
        const slide = document.createElement("div");
        slide.className = "review__about__shop";
        slide.style.flex = "0 0 100%";
        slide.style.minWidth = "100%";
        slide.innerHTML = `
          <h3 class="review__about__shop__title">${review.user}</h3>
          <p class="review__about__shop__txt">${review.text}</p>
          <div class="review__about__shop__details">
            <a href="#" class="review__about__shop__phone__user">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_576_1460)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M2.87402 1.95702C2.87402 1.30146 3.40546 0.77002 4.06102 0.77002H12.7657C13.4212 0.77002 13.9527 1.30146 13.9527 1.95702V15.4097C13.9527 16.0652 13.4212 16.5967 12.7657 16.5967H4.06102C3.40546 16.5967 2.87402 16.0652 2.87402 15.4097V1.95702ZM4.45669 2.35268H12.37V13.4313H4.45669V2.35268ZM7.62202 14.2227C7.18498 14.2227 6.83068 14.577 6.83068 15.014C6.83068 15.451 7.18498 15.8053 7.62202 15.8053H9.20468C9.64172 15.8053 9.99601 15.451 9.99601 15.014C9.99601 14.577 9.64172 14.2227 9.20468 14.2227H7.62202Z" fill="#8C9196"/>
                </g>
                <defs>
                  <clipPath id="clip0_576_1460">
                    <rect width="16" height="16" fill="white" transform="translate(0.5 0.77002)"/>
                  </clipPath>
                </defs>
              </svg>
              ${review.phone_number}
            </a>
            <div class="review__about__shop__pet">
              <p>Питомец: <span>${review.pet}</span></p>
            </div>
          </div>`;
        sliderInner.appendChild(slide);
        slides.push(slide);
      });

      const updateSlider = () => {
        sliderInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        counter.textContent = `${currentIndex + 1} из ${totalReviews}`;
      };

      vectorLeft.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + totalReviews) % totalReviews;
        updateSlider();
      });

      vectorRight.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % totalReviews;
        updateSlider();
      });

      updateSlider();
    } else {
      sliderInner.innerHTML = "<p>Нет данных об отзывах</p>";
      counter.textContent = "0 из 0";
    }
  }, 500);
});
