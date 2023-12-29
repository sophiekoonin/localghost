---
title: 'Blog'
layout: 'blog-list.njk'
pagination:
  data: collections.blog
  size: 5
  reverse: true
permalink: 'blog{% if pagination.pageNumber > 0 %}/page/{{ pagination.pageNumber }}{% endif %}/index.html'
paginationPrevText: 'Newer posts'
paginationNextText: 'Older posts'
paginationAnchor: '#post-list'
aliases:
- '/posts/'
---
