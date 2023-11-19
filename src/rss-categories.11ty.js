class RSSCategories {
  data() {
    return {
      pagination: {
        data: "collections.categoryFeeds",
        size: 1,
        alias: "feed",
      },
      permalink: ({ feed }) => `/${feed}s.xml`,
      eleventyExcludeFromCollections: true,
      layout: "rss.njk",
      eleventyComputed: {
        title: ({ feed }) => `localghost.dev - posts about ${feed}s`,
        subtitle: ({ feed }) => `A feed of the latest ${feed} recommendations from localghost.dev`,
        feedUrl: ({ feed }) => `https://localghost.dev/${feed}s.xml`,
      },
    };
  }
  render() {
    return null;
  }
}

module.exports = RSSCategories;
