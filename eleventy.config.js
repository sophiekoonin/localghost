const slugify = require("@sindresorhus/slugify");
// Plugins
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxPlugin = require("@11ty/eleventy-plugin-syntaxhighlight");
const redirectsPlugin = require("eleventy-plugin-redirects");
const convertOGImage = require("./src/plugins/og-to-png");
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

// Filters
const dateFilter = require("./src/filters/date-filter");
const urlDateFilter = require("./src/filters/date-filter-url");
const w3DateFilter = require("./src/filters/w3-date-filter");
const splitLines = require("./src/filters/split-lines");
const markdownFilter = require("./src/filters/markdown-filter");
const debugFilter = require("./src/filters/debug");
const draftPlugin = require("./src/plugins/drafts");
const markdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItAnchor = require("markdown-it-anchor");
const mdfigcaption = require("markdown-it-image-figures");
const codeSnippet = require("./src/plugins/code-snippet");
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
  eleventyConfig.addPlugin(draftPlugin);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(syntaxPlugin);

  eleventyConfig.on("afterBuild", ogToPng);

  if (process.env.IS_PREVIEW === "true") {
    eleventyConfig.addPassthroughCopy({
      "./src/robots.dev.txt": "/robots.txt",
    });
  } else {
    eleventyConfig.addPassthroughCopy({
      "./src/robots.prod.txt": "/robots.txt",
    });
  }

  eleventyConfig.addPassthroughCopy({ "./src/static": "/" });
  eleventyConfig.setLibrary("md", markdownLib);
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("urlDateFilter", urlDateFilter);
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
  eleventyConfig.addFilter("isNan", (value) => {
    return isNaN(value);
  });
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: "<!--more-->",
  });
  eleventyConfig.addShortcode("codepen", codeSnippet);
  eleventyConfig.addCollection("blog", (collection) => {
    return collection.getFilteredByGlob("./src/blog/**/*.md");
  });
  eleventyConfig.addCollection("categoryFeeds", () => ["recipe", "book", "music", "game", "podcast", "links"]);
  eleventyConfig.addCollection("articles", (collection) => {
    return collection.getFilteredByGlob("./src/blog/posts/*.md");
  });

  eleventyConfig.addPlugin(redirectsPlugin, {
    template: "clientSide",
  });
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    widths: [280, 640, 960],
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async",
      },
    },
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
    return (tags || []).filter((tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
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
