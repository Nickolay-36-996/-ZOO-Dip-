'use strict'
document.addEventListener("DOMContentLoaded", function() {
    const burger = document.querySelector(".burger__menu");
    const nav = document.querySelector(".header__low__nav");
    burger.addEventListener("click", function() {
        this.classList.toggle("burger__active");
        nav.classList.toggle("header__low__nav__active");
    });

    const burgerMobile = document.querySelector(".burger__menu__mobile");
    burgerMobile.addEventListener("click", function() {
        this.classList.toggle("burger__active__mobile");
        nav.classList.toggle("header__low__nav__active");
    })
});