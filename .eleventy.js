// Plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const tweetPlugin = require('eleventy-plugin-embed-tweet');
const syntaxPlugin = require('@11ty/eleventy-plugin-syntaxhighlight');
// Filters
const dateFilter = require('./src/filters/date-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const debugFilter = require('./src/filters/debug');
const markdownIt = require('markdown-it');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItAnchor = require('markdown-it-anchor');
const mdfigcaption = require('markdown-it-image-figures');
const codeSnippet = require('./src/plugins/code-snippet');

const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true,
};
const markdownLib = markdownIt(markdownItOptions)
  .use(markdownItAttrs)
  .use(markdownItAnchor)
  .use(mdfigcaption, { figcaption: true, lazy: true, async: true });

module.exports = (config) => {
  config.addWatchTarget('./src');
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxPlugin);
  config.addPlugin(tweetPlugin, {
    useInlineStyles: false,
    cacheDirectory: 'tweets',
  });
  config.addPassthroughCopy({ './src/static': '/' });
  config.setLibrary('md', markdownLib);
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('w3DateFilter', w3DateFilter);
  config.addFilter('markdown', markdownFilter);
  config.addFilter('debug', debugFilter);

  config.setFrontMatterParsingOptions({
    excerpt: true,
    // Optional, default is "---"
    excerpt_separator: '<!--more-->',
  });
  config.addShortcode('codepen', codeSnippet);
  config.addCollection('blog', (collection) => {
    return [...collection.getFilteredByGlob('./src/blog/*.md')].reverse();
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);
  return {
    dir: {
      input: 'src',
      output: '_site',
    },
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
};
