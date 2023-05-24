let header = document.querySelector(".page-header");
let navToggle = document.querySelector(".navigation__button");

header.classList.remove("navigation--nojs");

navToggle.addEventListener("click", function () {
  if (header.classList.contains("navigation--closed")) {
    header.classList.remove("navigation--closed");
    header.classList.add("navigation--opened");
  } else {
    header.classList.add("navigation--closed");
    header.classList.remove("navigation--opened");
  }
});
