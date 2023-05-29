let header = document.querySelector(".page-header");
let navToggle = document.querySelector(".navigation__button");

header.classList.remove("page-header--nojs");

navToggle.addEventListener("click", function () {
  if (header.classList.contains("page-header--closed")) {
    header.classList.remove("page-header--closed");
    header.classList.add("page-header--opened");
  } else {
    header.classList.add("page-header--closed");
    header.classList.remove("page-header--opened");
  }
});
