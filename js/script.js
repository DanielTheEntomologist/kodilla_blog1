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

const optArticleSelector = ".post",
  optTitleSelector = ".post-title",
  optTitleListSelector = ".titles";

function generateTitleLinks() {
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = "";

  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector);
  // console.log(articles);

  let html = "";

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute("id");

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector);

    /* get the title from the title element */
    const articleTitleText = articleTitle.innerHTML;

    /* create HTML of the link */
    const linkHTML = `<li><a href="#${articleId}"><span>${articleTitleText}</span></a></li>`;

    /* insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;
  /* set first article as active */
  const firstArticleLink = titleList.firstElementChild.firstElementChild;
  firstArticleLink.classList.add("active");
}

generateTitleLinks();

/* find all links to articles and add event listeners */
const links = document.querySelectorAll(".titles a");
for (let link of links) {
  console.log("Added event listener to element", link);
  link.addEventListener("click", changeActiveArticle);
}
