---
title: "Building post types and category RSS feeds in Eleventy"
date: 2023-11-19
tags: ['eleventy', 'how-to', 'rss']
templateEngineOverride: md
excerptText: "I mentioned recently that I'd built separate RSS feeds for different kinds of posts. Here's how I did it!"
---

I [mentioned recently](/blog/introducing-separate-category-rss-feeds/) that I'd built separate RSS feeds for different kinds of posts. Here's how I did it!<!--more-->

I had to do a bit of fiddling to get this working in Eleventy &ndash; this is one of the few things I think Hugo actually does in a simpler way, as you can create different `rss.xml` templates inside specific layout directories. My solution is not especially sophisticated, but it works! (If you know a less complicated way... I'd love to hear it.)

## Building post types

Alongside the traditional long-form blog posts, I wanted to be able to publish little "micro" posts of recommendations and things I liked. In order to distinguish them, I added a new frontmatter field called `type` to all my posts. Right now, there are a few different types: article, podcast, game, book, and recipe. 

In my blog post list page, I add the `type` as a data attribute on the `<li>` for each "micro" post, so that I can display an appropriate emoji on the list item. (I haven't quite figured out how I want to show filters for post types yet.)

Each post type has a json file which specifies the default frontmatter for all files in that directory. It automatically formats the post title into a consistent format, and tags the post accordingly. Here's `podcasts.json`:

```json
{
  "layout": "good-podcast.njk",
  "hasCustomOGImage": true,
  "eleventyComputed": {
    "title": "A good podcast: {{ podcast }}"
  },
  "type": "podcast",
  "tags": [
    "podcast"
  ],
  "permalink": "/blog/a-good-podcast-{{ podcast | slugify }}/index.html"
}
```

The tags and type are identical because I wanted a quick way of accessing post type in things like the layout, but I wanted readers to be able to list all podcasts just like they can any other tag &ndash; and post tags might contain more than just "podcast", say. Any tags I set on the post itself will be added to that array, not replace it. 

I use the `hasCustomOGImage` variable to tell a layout whether to find a specific OG image based on the title of the post, or just use the default one.

The post itself has its own frontmatter, with the name of the podcast (or book, or game, etc), the date, an image with alt text, and the URL of the podcast.

```md
---
podcast: If Books Could Kill
url: https://pod.link/1651876897
date: 2023-07-16
image: if-books-could-kill.jpeg
alt: "The cover image for If Books Could Kill, with an illustration of a bleeding book" 
---

Michael Hobbes and Peter Shamshiri take us through some of the biggest "self-help"/pseudoscience books from the last few decades and deservedly tear them apart.

[...]
```

## Separating RSS feeds
If you don't already, you'll need the Eleventy RSS plugin set up. See the [plugin docs](https://www.11ty.dev/docs/plugins/rss/) for instructions.

My RSS feed was previously one single feed, set up with some basic settings &ndash; it was pretty much identical to the [example in the RSS plugin docs](https://www.11ty.dev/docs/plugins/rss/#sample-feed-templates). 

I wanted to split up my feeds into the various different types of "micro" posts (the recommendations), and then everything else as one "articles" feed; however, I also wanted to keep the "everything" feed for people who like their posts about Content-Security-Policy headers interspersed with brownie recipes from 2001. 

### Collections, collections, collections 
I've got a few custom collections for my post types. The first one pulls *all* of the posts in the `blog` directory, which encompasses all articles and post types:

```js
// eleventy.config.js

eleventyConfig.addCollection("blog", (collection) => {
  return collection.getFilteredByGlob("./src/blog/**/*.md");
});
```

Then I've got the `categoryFeeds` collection which contains all of the specific feeds I want for each "micro" post type. 

```js
eleventyConfig.addCollection("categoryFeeds", () => ["recipe", "book", "game", "podcast"]);
```

Finally, I've got one for "articles" - all the posts that *aren't* micro-categories. These all live in the same directory, so I used `getFilteredByGlob` again. (I've actually called the directory "posts" but I couldn't be bothered to change it.)

```js
  eleventyConfig.addCollection("articles", (collection) => {
    return collection.getFilteredByGlob("./src/blog/posts/*.md");
  });
```


### Paginating the category feeds

I used Eleventy's excellent pagination feature to generate the RSS feeds themselves. I've got a file called `rss-categories.11ty.js` which contains info about the data I want to paginate, and that will produce a feed for each of the feed categories in my `categoryFeeds` collection. Each generated file will have the same template (`rss.njk`) but a different title, subtitle and feed URL; it'll also have a different value of `feed` (set to whichever category the feed is for, based on the collection item).

```js
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
```

### One RSS template for all

My RSS feed template lives in `_includes/rss.njk` alongside all my other layouts. It's pretty much the standard RSS template they suggest in the docs, but with a couple of tweaks to make it a bit more generic, allowing `title`, `subtitle` and `feedUrl` to be optionally passed in as variables. 

```njk
<?xml version="1.0" encoding="utf-8"?>
{% if not title %}
{% set title = metadata.title %}
{% endif %}
{% if not subtitle %}
{% set subtitle = metadata.description %}
{% endif %}
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>{{ title }}</title>
  <subtitle>{{ subtitle }}</subtitle>
  <link href="{{ feedUrl }}" rel="self"/>
  <link href="{{ metadata.url }}"/>
  <updated>{{ collections[feed] | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>{{ metadata.url }}</id>
  <author>
    <name>{{metadata.author.name}}</name>
    <email>{{metadata.author.email}}</email>
  </author>
  {%- for post in collections[feed] %}
    {% set absolutePostUrl %}{{ post.url | url | absoluteUrl(url) }}{% endset %}
    <entry>
      <title>{{ post.data.title }}</title>
      <link href="{{ absolutePostUrl }}"/>
      <updated>{{ post.date | dateToRfc3339 }}</updated>
      <id>{{ absolutePostUrl }}</id>
      <content type="html">{{ post.templateContent | htmlToAbsoluteUrls(absolutePostUrl) }}</content>
    </entry>
  {%- endfor %}
</feed>
```

Oddly, the variables seem to leave a blank space in the outputted XML, but as long as the `<?xml>` declaration is at the top it doesn't seem to matter.

The RSS template iterates over a given collection and includes all the posts it finds, so I have to tell it which collection to pull from. This is where the `feed` variable comes in. It tells the template to iterate over posts tagged with e.g. "recipe" or "game". 
 
### A separate articles feed

Unlike my specific category fields, "everything else" isn't a tag, so I can't use the same pagination to generate the "articles" feed. That has to have its own file. Since it hasn't got any fancy variable templating, I can just create a nunjucks file and fill out the frontmatter:

```md
---
  permalink: 'articles.xml'
  eleventyExcludeFromCollections: true
  layout: "rss.njk"
  feed: articles
  title: "localghost.dev - all articles"
  subtitle: "Sophie builds fun things out of HTML, CSS & JavaScript, and writes blog posts about tech and mental health. This feed excludes recommendations about books, games, podcasts, recipes, etc."
  feedUrl: "https://localghost.dev/articles.xml"
---
<!--  rss-articles.njk -->
```

Because I created the `articles` category in my Eleventy config, I can pass that in as the `feed` variable, and then `collections[feed]` in the RSS layout will translate to `collections.articles`. The only posts in this feed will be anything that lives in my `/blog/posts/` folder.

## The primary feed

And finally, the tweak to my "everything" feed to get it to work with this new layout: make sure it also has a `feed` variable. The `blog` collection already exists, and contains everything in the `blog` directory, so we can pass that in and it'll add everything in there to the RSS feed (which is actually what it was doing before, anyway).
The metadata for my primary RSS feed is shared with the meta tags for the `<head>` of my site, so it lives elsewhere in `_data`. 

```md
---
permalink : "feed.xml"
eleventyExcludeFromCollections : true
feed: "blog"
layout: "rss.njk"
feedUrl: "https://localghost.dev/feed.xml"
---
<!-- rss-all.njk -->
```

And there you go! Multiple RSS feeds. I changed the [RSS link](/rss) in my footer to point towards a page where I added links to all the feeds. 