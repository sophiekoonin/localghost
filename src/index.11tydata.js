module.exports = {
  eleventyComputed: {
    isHome: ({ page }) => page.url === '/',
    isBlog: ({ page }) => {
      return page.inputPath.includes('/blog/');
    },
  },
};
