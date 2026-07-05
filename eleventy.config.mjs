import slugify from "@sindresorhus/slugify";
// Plugins
import rssPlugin from "@11ty/eleventy-plugin-rss";
import syntaxPlugin from "@11ty/eleventy-plugin-syntaxhighlight";
import redirectsPlugin from "eleventy-plugin-redirects";
import convertOGImage from "./src/plugins/og-to-png.mjs";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

// Filters
import dateFilter from "./src/filters/date-filter.mjs";
import urlDateFilter from "./src/filters/date-filter-url.mjs";
import w3DateFilter from "./src/filters/w3-date-filter.mjs";
import splitLines from "./src/filters/split-lines.mjs";
import markdownFilter from "./src/filters/markdown-filter.mjs";
import debugFilter from "./src/filters/debug.mjs";
import draftPlugin from "./src/plugins/drafts.mjs";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";
import mdfigcaption from "markdown-it-image-figures";
import codeSnippet from "./src/plugins/code-snippet.mjs";
import ogToPng from "./src/plugins/og-to-png.mjs";

const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true,
};

const markdownLib = markdownIt(markdownItOptions)
  .use(markdownItAttrs)
  .use(markdownItAnchor, { slugify: (s) => slugify(s) })
  .use(mdfigcaption, { figcaption: true, lazy: true, async: true });

const config = (eleventyConfig) => {
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

export default config;
