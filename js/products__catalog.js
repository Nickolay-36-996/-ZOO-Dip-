'use strict'
document.addEventListener('DOMContentLoaded', () => {
    const revealSelect = document.querySelector('.select__icon');
    const selectList = document.querySelector('.products__catalog__sort__select__list');
    revealSelect.addEventListener('click', function() {
        selectList.classList.toggle('products__catalog__sort__select__list__active');
        revealSelect.classList.toggle('select__icon__active');
    })

    const promotionalIndicator = document.querySelector('.promotional__item__indicator');
    promotionalIndicator.addEventListener('click', function() {
        promotionalIndicator.classList.toggle('promotional__item__indicator__active');
    })
})