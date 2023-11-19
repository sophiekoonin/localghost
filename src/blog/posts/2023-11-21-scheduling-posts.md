---
title: "How to schedule posts in Eleventy"
date: 2023-11-22
categories: ["eleventy", "how-to"]
---

I scheduled this post, isn't that cute? <!--more-->

I find I have very little energy to write blog posts during the week, but occasionally I sit down on the weekend to write something and have a few ideas that turn into multiple posts. I'd like to be able to publish posts more often, but realistically I won't be writing things more than once every few weeks (which is okay!). I decided I needed to be able to schedule posts so I don't just publish a load at once. 

Eleventy's suggested [draft post setup](https://www.11ty.dev/docs/quicktips/draft-posts/) has been working nicely for me, and posts with `draft: true` in the frontmatter don't appear in the production site. However, I miss Hugo's scheduled posts feature, where I'd be able to write a post with a date in the future and it'd only appear on the blog after that date. Thankfully it's pretty straightforward to set up in Eleventy, in a similar way to drafts. 

## Scheduling website builds
My website already builds twice a day to fetch the latest webmentions. I had a GitHub Actions job to build and deploy my site to Neocities, with a cron schedule that ran every 12 hours:

```yaml
name: "Deploy to Neocities"
on:
  schedule:
    - cron: 0 */12 * * *
  push:
    branches:
      - main
jobs:
  deploy:
    name: "Deploy to Neocities"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "yarn"
      - run: yarn install
      - run: yarn build
      - uses: bcomnes/deploy-to-neocities@v1
        with:
          api_token: ${{ secrets.SUPER_SECRET_TOKEN }}
          dist_dir: "_site/"
          cleanup: false

```

I tweaked the cron schedule so that it runs daily at 8am and 5pm, so I wouldn't publish a post at midnight.

```yaml
name: "Deploy to Neocities"
on:
  schedule:
    - cron: 0 8/9 * * *
```

## Exclude scheduled posts from collections

In my `drafts.js` plugin, I added a new function to check whether a post's timestamp is in the future:
```js
const now = new Date();

function isScheduledPost(data) {
  return data.date != null && data.date > now;
}
```

Finally I added this function to the conditions in the `eleventyComputedPermalink` and `eleventyComputedExcludeFromCollections` functions which check for draft posts:

```js
function eleventyComputedPermalink() {
  // When using `addGlobalData` and you *want* to return a function, you must nest functions like this.
  // `addGlobalData` acts like a global data file and runs the top level function it receives.
  return (data) => {
    // Always skip during non-watch/serve builds
    if (!process.env.BUILD_DRAFTS && (data.draft || isScheduledPost(data))) {
      console.log(data.title);
      return false;
    }

    return data.permalink;
  };
}
```

That's it! The scheduled posts will always show up when running the site locally, as `process.env.BUILD_DRAFTS` is always true in the dev server. But they won't show up in the production site until the day comes and the site gets rebuilt. To be extra sure, you can run your site's prod build command and check the output &ndash; your scheduled page shouldn't be listed.