---
title: 'x'
layout: 'blog-list.njk'
pagination:
  data: collections
  size: 1
  alias: tag
  filter: ['all', 'rss', 'blog', 'redirects']
permalink: '/tag/{{ tag | slugify }}/'
---
