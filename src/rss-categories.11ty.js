function maybePlural(str) {
  return str.endsWith("s") ? str : `${str}s`;
}

function stripPlural(str) {
  return str.endsWith("s") ? str.slice(0, -1) : str;
}

class RSSCategories {
  data() {
    return {
      pagination: {
        data: "collections.categoryFeeds",
        size: 1,
        alias: "feed",
      },
      permalink: ({ feed }) => `/${maybePlural(feed)}.xml`,
      eleventyExcludeFromCollections: true,
      layout: "rss.njk",
      eleventyComputed: {
        title: ({ feed }) => `localghost.dev - posts about ${maybePlural(feed)}`,
        subtitle: ({ feed }) => `A feed of the latest ${stripPlural(feed)} recommendations from localghost.dev`,
        feedUrl: ({ feed }) => `https://localghost.dev/${maybePlural(feed)}.xml`,
      },
    };
  }
  render() {
    return null;
  }
}

module.exports = RSSCategories;
