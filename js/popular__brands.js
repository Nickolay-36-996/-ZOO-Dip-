'use strict'
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('popular-brands-list');

    fetch('https://oliver1ck.pythonanywhere.com/api/get_brands_list/')
    .then(response => {
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Полученные данные:', data);
        container.innerHTML = '';
        if(data.results && data.results.length) {

            const shuffleArray = (array) => {
                for(let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };

            const shuffledBrands = shuffleArray([...data.results]);

            for(const brand of shuffledBrands) {
                const element = document.createElement('div');
                element.className = 'popular__brand'
                element.innerHTML = `
                <img class="popular__brand__img" src="${brand.image}" alt="${brand.name}">`;
                container.appendChild(element);
            }
        } else {
            container.innerHTML = '<p>Нет данных о брендах</p>';
        }
    })
    .catch(error => {
        container.innerHTML = `<p>Ошибка загрузки данных: ${error.message}</p>`;
        console.error('Ошибка fetch:', error);
    });
});