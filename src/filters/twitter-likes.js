const shuffle = require('lodash/shuffle');
const metadata = require('../_data/metadata.json');

function normaliseTrailingSlash(url) {
  if (url.endsWith('/')) {
    return url.slice(0, -1);
  }
}

// https://github.com/maxboeck/eleventy-webmentions/
module.exports = function (webmentions, url, aliases = []) {
  // define which types of webmentions should be included per URL.
  // possible values listed here:
  // https://github.com/aaronpk/webmention.io#find-links-of-a-specific-type-to-a-specific-page
  const allowedTypes = ['like-of', 'repost-of'];
  const potentialUrls = [
    normaliseTrailingSlash(url),
    ...aliases.map((a) =>
      normaliseTrailingSlash(`https://${metadata.domain}${a}`)
    ),
  ];

  // only allow webmentions that have an author name
  const checkRequiredFields = (entry) => {
    const { author } = entry;
    return !!author && !!author.name;
  };

  // run all of the above for each webmention that targets the current URL
  const grouped = webmentions
    .filter((entry) =>
      potentialUrls.includes(normaliseTrailingSlash(entry['wm-target']))
    )
    .filter((entry) => allowedTypes.includes(entry['wm-property']))
    .reduce(
      (acc, curr) => {
        if (curr['wm-property'] === 'like-of') {
          return {
            likes: [...acc.likes, curr],
            retweets: acc.retweets,
          };
        }
        return {
          likes: [...acc.likes],
          retweets: [...acc.retweets, curr],
        };
      },
      { likes: [], retweets: [] }
    );
  return {
    likes: grouped.likes.length,
    retweets: grouped.retweets.length,
  };
};
