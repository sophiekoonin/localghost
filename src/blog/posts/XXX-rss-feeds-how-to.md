---
title: Building post types and category RSS feeds in Eleventy
date: 2029-11-12
draft: true
tags: ['eleventy', 'how-to']
templateEngineOverride: md
---

I had to do a bit of fiddling to get this working in Eleventy &ndash; this is one thing that Hugo actually does much better &ndash; but I did sort it, so here's how I did it. It's not especially sophisticated, but it works!

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

I wanted to split up my feeds into the various different types of "micro" posts (the recommendations), and then everything else as one "articles" feed. 

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


### One RSS template for all

My RSS feed template lives in `_includes/rss.njk` alongside all my other layouts. It's pretty much the standard RSS template they suggest in the docs, but with a couple of tweaks to make it a bit more generic, allowing `title`, `subtitle` and `feedUrl` to be passed in as variables. 

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

The RSS template iterates over a given collection and includes all the posts it finds, so I have to tell it which collection to pull from. This is where the `feed` variable comes in. 
 