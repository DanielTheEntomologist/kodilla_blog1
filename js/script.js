'use strict';

{
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list';
  // optTagsSelector = 'a[href^="#tag-}"]';

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

  const generateTitleLinks = function (additionalTitleListSelector = '') {
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(
      optArticleSelector + additionalTitleListSelector
    );
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

  const tagClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    // My algorithm is similar enough to the one in the course, so I'll leave it as is.
    // remove active class from all tags
    /* get clicked tag element*/
    const clickedElement = this;
    console.log('clickedElement:', clickedElement);
    /* get href attribute from clicked tag */
    const href = clickedElement.getAttribute('href');
    /* extract tag from href attribute */
    const tag = href.replace('#tag-', '');

    /* find all active tags  that have a href starting with #tag-*/
    const previouslyActiveTags = document.querySelectorAll(
      'a.active[href^="#tag-"]'
    );
    console.log('previouslyActiveTags:', previouslyActiveTags);
    /* Loop over active tags and remove active class */
    for (let tag of previouslyActiveTags) {
      console.log('Removing active class from', tag);
      tag.classList.remove('active');
    }

    // add active class to all tags with clicked tag
    /* find all tags with the same tag */
    const newActiveTags = document.querySelectorAll(`a[href="#tag-${tag}"]`);
    console.log('newActiveTags:', newActiveTags);

    /* Loop over tags and add active class */
    for (let tag of newActiveTags) {
      tag.classList.add('active');
    }
    // regenerate article list with active tags only
    /* create a new selector that selects all articles having class .post and data-tags containing tag */
    const newArticleSelector = `.post[data-tags~="${tag}"]`;
    console.log('newArticleSelector:', newArticleSelector);
    /* call new modified generateTags function */
    generateTitleLinks(newArticleSelector);
  };

  const addClickListenersToTags = function () {
    /* find all links to tags */
    const tags = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for (let tag of tags) {
      console.log('Adding listener to tags', tag);
      /* add tagClickHandler as event listener for that link */
      tag.addEventListener('click', tagClickHandler);
      /* END LOOP: for each link */
    }
  };
  const addClicklListenersToArticleLinks = function () {
    /* find all links to articles and add event listeners */
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      console.log('Added event listener to element', link);
      link.addEventListener('click', changeActiveArticle);
    }
  };

  generateTags();
  generateTitleLinks();
  addClickListenersToTags();
  addClicklListenersToArticleLinks();
}
