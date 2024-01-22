'use strict';

{
  const changeActiveArticle = function (event) {
    console.log('Link was clicked!');

    /* prevent default action for event */
    event.preventDefault();

    /* remove class 'active' from all article links  */
    for (let link of links) {
      link.classList.remove('active');
    }
    /* find all active articles */
    const activeArticles = document.querySelectorAll('.post.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* get clicked element */
    const clickedElement = this;

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* find the correct article*/
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list';

  const generateTitleLinks = function () {
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(optArticleSelector);
    // console.log(articles);

    let html = '';

    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');

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
    firstArticleLink.classList.add('active');
  };

  const generateTags = function () {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper (list)*/
      const tagList = article.querySelector(optArticleTagsSelector);
      console.log('existing taglist', tagList.innerHTML);

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      console.log('articleTag extracted', articleTags);
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* make html variable with empty string */
      let html = '';
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        // const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
        const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

        /* add generated code to html variable */
        // DISCUSS - why does html = html +  linkHTML; result in differently formatted list?
        html = html + '\n' + linkHTML;
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagList.innerHTML = html;
      console.log('new taglist', tagList.innerHTML);
      /* END LOOP: for every article: */
    }
  };

  const tagClickHandler = function (event) {};

  generateTags();

  generateTitleLinks();

  /* find all links to articles and add event listeners */
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    console.log('Added event listener to element', link);
    link.addEventListener('click', changeActiveArticle);
  }
}
