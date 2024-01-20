"use strict";

{
  //   const deactivateAllArticles = function () {  }
}
// const activateArticle = function (event) {};

const changeActiveArticle = function (event) {
  console.log("Link was clicked!");

  /* prevent default action for event */
  event.preventDefault();

  /* remove class 'active' from all article links  */
  for (let link of links) {
    link.classList.remove("active");
  }
  /* find all active articles */
  const activeArticles = document.querySelectorAll(".post.active");
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove("active");
  }
  /* get clicked element */
  const clickedElement = this;

  /* add class 'active' to the clicked link */
  clickedElement.classList.add("active");

  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute("href");

  /* find the correct article*/
  const targetArticle = document.querySelector(articleSelector);

  /* add class 'active' to the correct article */
  targetArticle.classList.add("active");
};

/* find all links to articles and add event listeners */
const links = document.querySelectorAll(".titles a");
for (let link of links) {
  console.log(`Added event listener to element`, link);
  link.addEventListener("click", changeActiveArticle);
}
