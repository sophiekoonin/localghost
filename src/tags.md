---
layout: 'blog-list.njk'
eleventyComputed:
  title: Posts tagged "{{ tag }}"
pagination:
  data: collections
  size: 1
  alias: tag
  filter: ['all', 'categoryFeeds', 'blog', 'redirects']
permalink: '/tags/{{ tag | slugify }}/'
---
