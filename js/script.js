'use strict';

{
  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    // optTagsSelector = 'a[href^="#tag-}"]';
    optArticleAuthorSelector = '.post-author',
    optTagsListSelector = '.tags.list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-',
    optAuthorsList = '.authors.list';

  const templates = {
    articleLink: Handlebars.compile(
      document.querySelector('#template-article-link').innerHTML
    ),
    tagLink: Handlebars.compile(
      document.querySelector('#template-tag-link').innerHTML
    ),
    authorLink: Handlebars.compile(
      document.querySelector('#template-author-link').innerHTML
    ),
    tagCloudList: Handlebars.compile(
      document.querySelector('#template-tag-cloud-list').innerHTML
    ),
    authorList: Handlebars.compile(
      document.querySelector('#template-author-list').innerHTML
    ),
  };

  const changeActiveArticle = function (event) {
    /* prevent default action for event */
    event.preventDefault();

    const links = document.querySelectorAll('.titles a');

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
    /* get currently active article */
    const previouslyActiveArticle = document.querySelector('.post.active');

    /* create a new selector that selects all article links matching the href attribute of the active article */
    const previouslyActiveArticleSelector = `.titles>li>a[href="#${previouslyActiveArticle.id}"]`;

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);

    titleList.innerHTML = '';

    /* find all the articles and save them to variable: articles */
    const articles = document.querySelectorAll(
      optArticleSelector + additionalTitleListSelector
    );

    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');

      /* find the title element */
      const articleTitle = article.querySelector(optTitleSelector);

      /* get the title from the title element */
      const articleTitleText = articleTitle.innerHTML;

      /* create HTML of the link */
      const linkHTML = templates.articleLink({
        id: articleId,
        title: articleTitleText,
      });
      // `<li><a href="#${articleId}"><span>${articleTitleText}</span></a></li>`;

      /* insert link into html variable */
      titleList.insertAdjacentHTML('beforeend', linkHTML);
    }

    /* try to select previously active article link */
    const ActiveArticleLink = document.querySelector(
      previouslyActiveArticleSelector
    );
    if (ActiveArticleLink != null) {
      ActiveArticleLink.classList.add('active');
    }

    /* add event listeners after generating links */
    addClicklListenersToArticleLinks();
  };

  const generateTags = function () {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper (list)*/
      const tagList = article.querySelector(optArticleTagsSelector);

      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');

      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');

      /* make html variable with empty string */
      for (let tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkHTML = templates.tagLink({ tag: tag });
        tagList.insertAdjacentHTML('beforeend', linkHTML);
      }
    }
  };

  const generateTagList = function () {
    /* [NEW] create a new variable allTags with an empty array */

    let allTagsCounter = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles) {
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
      for (let tag of articleTagsArray) {
        if (allTagsCounter[tag] == undefined) {
          /* [NEW] add counter for each tag */
          allTagsCounter[tag] = 1;
        } else {
          allTagsCounter[tag]++;
        }
      }
    }

    /* construct object with all tag classes */
    const tagsParams = calculateTagsParams(allTagsCounter);
    const tagClassess = { tags: [] };
    for (let tag in allTagsCounter) {
      const tagCount = allTagsCounter[tag];
      const tagClass = calculateTagClass(tagCount, tagsParams);
      tagClassess.tags.push({
        tag: tag,
        tagClass: tagClass,
      });
    }
    const tagCloudListHTML = templates.tagCloudList(tagClassess);

    /* find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector);
    tagList.innerHTML = tagCloudListHTML;
  };

  const calculateTagsParams = function (tagsCounter) {
    const params = { max: -Infinity, min: Infinity };
    for (let tag in tagsCounter) {
      if (tagsCounter[tag] > params.max) {
        params.max = tagsCounter[tag];
      }
      if (tagsCounter[tag] < params.min) {
        params.min = tagsCounter[tag];
      }
    }
    return params;
  };

  const calculateTagClass = function (count, params) {
    const reducedCount = count - params.min;
    const range = params.max - params.min;
    const percentage = reducedCount / range;
    const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);
    return optCloudClassPrefix + classNumber;
  };

  const tagClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    // My algorithm is similar enough to the one in the course, so I'll leave it as is.
    // remove active class from all tags
    /* get clicked tag element*/
    const clickedElement = this;

    /* get href attribute from clicked tag */
    const href = clickedElement.getAttribute('href');
    /* extract tag from href attribute */
    const tag = href.replace('#tag-', '');

    /* reset active tags and authors*/
    resetFiltering();

    // add active class to all tags with clicked tag
    /* find all tags with the same tag */
    const newActiveTags = document.querySelectorAll(`a[href="#tag-${tag}"]`);

    /* Loop over tags and add active class */
    for (let tag of newActiveTags) {
      tag.classList.add('active');
    }
    // regenerate article list with active tags only
    /* create a new selector that selects all articles having class .post and data-tags containing tag */
    const newArticleSelector = `.post[data-tags~="${tag}"]`;

    /* call new modified generateTags function */
    generateTitleLinks(newArticleSelector);
  };

  const generateAuthors = function () {
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper (list)*/
      const author = article.querySelector(optArticleAuthorSelector);

      /* get author from data-tags attribute */
      const articleAuthor = article.getAttribute('data-author');

      /* set author element inner html to articleAuthor */
      const authorID = articleAuthor.replace(' ', '-');
      // const authorLink = `by <a href="#author-${authorID}">${articleAuthor}</a>`;
      const authorLinkHTML = templates.authorLink({
        id: authorID,
        author: articleAuthor,
      });
      author.insertAdjacentHTML('beforeend', authorLinkHTML);
    }
  };

  const generateAuthorsList = function () {
    /* [NEW] create a new variable allTags with an empty array */

    let authorsArticleCounter = {};
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    for (let article of articles) {
      const articleAuthor = article.getAttribute('data-author');

      if (authorsArticleCounter[articleAuthor] == undefined) {
        authorsArticleCounter[articleAuthor] = 1;
      } else {
        authorsArticleCounter[articleAuthor]++;
      }
    }

    /* construct HTML of the all the links with counts */
    let allAuthors = { authors: [] };

    for (let author in authorsArticleCounter) {
      const articleCount = authorsArticleCounter[author];
      const authorID = author.replace(' ', '-');

      allAuthors.authors.push({
        author: author,
        authorID: authorID,
        articleCount: articleCount,
      });
    }

    /* find list of tags in right column */
    const authorsList = document.querySelector(optAuthorsList);

    /*  add html from allTags to tagList */
    authorsList.innerHTML = templates.authorList(allAuthors);
  };

  const authorClickHandler = function (event) {
    /* prevent default action for this event */
    event.preventDefault();

    /* get clicked tag element*/
    const clickedElement = this;

    /* get href attribute from clicked tag */
    const href = clickedElement.getAttribute('href');
    /* extract author from href attribute */
    const authorID = href.replace('#author-', '');
    const author = authorID.replace('-', ' ');

    // remove active class from all authors
    resetFiltering();

    // add active class to all authors with clicked tag
    /* find all tags with the same tag */
    const newActiveAuthor = document.querySelectorAll(
      `a[href="#author-${authorID}"]`
    );

    /* Loop over Author and add active class */
    for (let tag of newActiveAuthor) {
      tag.classList.add('active');
    }
    // regenerate article list with active tags only
    /* create a new selector that selects all articles having class .post and data-author containing tag */
    const newArticleSelector = `.post[data-author="${author}"]`;

    /* call new modified generateTags function */
    generateTitleLinks(newArticleSelector);
  };

  const resetFiltering = function () {
    /* remove active class from all tags */
    const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
    for (let tag of activeTags) {
      tag.classList.remove('active');
    }
    /* remove active class from all authors */
    const activeAuthors = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );
    for (let author of activeAuthors) {
      author.classList.remove('active');
    }
  };

  const addClickListenersToTags = function () {
    /* find all links to tags */
    const tags = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for (let tag of tags) {
      /* add tagClickHandler as event listener for that link */
      tag.addEventListener('click', tagClickHandler);
    }
  };
  const addClicklListenersToArticleLinks = function () {
    /* find all links to articles and add event listeners */
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', changeActiveArticle);
    }
  };

  const addClickListenersToAuthors = function () {
    /* find all links to authors */
    const authors = document.querySelectorAll('a[href^="#author-"]');

    /* START LOOP: for each link */
    for (let author of authors) {
      /* add authorClickHandler as event listener for that link */
      author.addEventListener('click', authorClickHandler);
    }
  };

  generateTags();
  generateAuthors();
  generateTitleLinks();
  generateTagList();
  generateAuthorsList();
  addClickListenersToTags();
  addClickListenersToAuthors();
  // addClicklListenersToArticleLinks();
}
