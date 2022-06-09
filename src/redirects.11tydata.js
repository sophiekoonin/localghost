module.exports = {
  pagination: {
    data: 'redirects',
    size: 1,
    alias: 'redirect',
    addAllPagesToCollections: true,
  },
  tags: 'page',
  layout: 'redirects.njk',
  eleventyComputed: {
    permalink: ({ redirect }) => `${redirect.from}/index.html`,
  },
};
