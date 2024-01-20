"use strict";

{
  //   const deactivateAllArticles = function () {  }
}
// const activateArticle = function (event) {};

const changeActiveArticle = function (event) {
  /* remove class 'active' from all article links  */
  for (let link of links) {
    link.classList.remove("active");
  }
  /* find all active articles */
  const activeArticles = document.querySelectorAll(".post.active");
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }
  /* get 'href' attribute from the clicked link */
  console.log(event);
  const clickedElement = event.target;
  console.log(clickedElement);
  const articleSelector = clickedElement.getAttribute("href");
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add("active");
};
const links = document.querySelectorAll(".titles a");
for (let link of links) {
  console.log(link);
  link.addEventListener("click", changeActiveArticle);
}
