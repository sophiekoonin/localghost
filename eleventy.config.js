const slugify = require("@sindresorhus/slugify");
// Plugins
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const tweetPlugin = require("eleventy-plugin-embed-tweet");
const syntaxPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const redirectsPlugin = require("eleventy-plugin-redirects");
const convertOGImage = require("./src/plugins/og-to-png");
// Filters
const dateFilter = require("./src/filters/date-filter");
const w3DateFilter = require("./src/filters/w3-date-filter");
const splitLines = require("./src/filters/split-lines");
const markdownFilter = require("./src/filters/markdown-filter");
const debugFilter = require("./src/filters/debug");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItAnchor = require("markdown-it-anchor");
const mdfigcaption = require("markdown-it-image-figures");
const codeSnippet = require("./src/plugins/code-snippet");
const webmentionsFilter = require("./src/filters/webmentions");
const draftPlugin = require("./src/plugins/drafts");
const ogToPng = require("./src/plugins/og-to-png");
const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true,
};
const markdownLib = markdownIt(markdownItOptions)
  .use(markdownItAttrs)
  .use(markdownItAnchor, { slugify: (s) => slugify(s) })
  .use(mdfigcaption, { figcaption: true, lazy: true, async: true });

module.exports = (eleventyConfig) => {
  eleventyConfig.addWatchTarget("./src");
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxPlugin);
  eleventyConfig.addPlugin(tweetPlugin, {
    useInlineStyles: false,
    cacheDirectory: "tweets",
  });
  eleventyConfig.addPlugin(draftPlugin);

  // Don't run the OG image generator on CI cos it doesn't have the nice fonts
  if (!process.env.CI) {
    eleventyConfig.on("afterBuild", ogToPng);
  }
  eleventyConfig.addPassthroughCopy({ "./src/static": "/" });
  eleventyConfig.setLibrary("md", markdownLib);
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("splitlines", splitLines);
  eleventyConfig.addFilter("w3DateFilter", w3DateFilter);
  eleventyConfig.addFilter("markdown", markdownFilter);
  eleventyConfig.addFilter("debug", debugFilter);
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });
  eleventyConfig.addFilter("webmentionsForUrl", webmentionsFilter);
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "<!--more-->",
  });
  eleventyConfig.addShortcode("codepen", codeSnippet);
  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("./src/blog/**/*.md");
  });

  eleventyConfig.addPlugin(redirectsPlugin, {
    template: "clientSide",
  });

  // Return all the tags used in a collection
  eleventyConfig.addFilter("getAllTags", (collection) => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
    );
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  eleventyConfig.setUseGitIgnore(false);
  return {
    dir: {
      input: "src",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
