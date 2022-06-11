module.exports = {
  eleventyComputed: {
    isHome: ({ page }) => page.url === '/',
  },
};
