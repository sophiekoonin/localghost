export default {
  eleventyComputed: {
    isHome: ({ page }) => page.url === "/",
  },
};
