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

module.exports = (config) => {
  config.addWatchTarget("./src");
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxPlugin);
  config.addPlugin(tweetPlugin, {
    useInlineStyles: false,
    cacheDirectory: "tweets",
  });

  // Don't run the OG image generator on CI cos it doesn't have the nice fonts
  if (!process.env.CI) {
    config.on("afterBuild", ogToPng);
  }
  config.addPassthroughCopy({ "./src/static": "/" });
  config.setLibrary("md", markdownLib);
  config.addFilter("dateFilter", dateFilter);
  config.addFilter("splitlines", splitLines);
  config.addFilter("w3DateFilter", w3DateFilter);
  config.addFilter("markdown", markdownFilter);
  config.addFilter("debug", debugFilter);
  config.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });
  config.addFilter("webmentionsForUrl", webmentionsFilter);
  config.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "<!--more-->",
  });
  config.addShortcode("codepen", codeSnippet);
  config.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("./src/blog/**/*.md");
  });

  config.addPlugin(redirectsPlugin, {
    template: "clientSide",
  });

  // Return all the tags used in a collection
  config.addFilter("getAllTags", (collection) => {
    let tagSet = new Set();
    for (let item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  config.addFilter("filterTagList", function filterTagList(tags) {
    return (tags || []).filter(
      (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
    );
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);
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
