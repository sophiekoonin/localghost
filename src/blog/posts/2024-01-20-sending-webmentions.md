---
title: Sending webmentions from a static site
date: '2024-01-20'
tags: ['webmentions']
---

It occurred to me this week that even though I’ve been using webmentions as comments for a really long time, I hadn’t actually been sending them myself. The shame! Here's how I set it up.

<!--more-->

Certified good egg [Remy Sharp](https://remysharp.com) has a tool called [webmention.app](https://webmention.app) which will send webmentions for you &ndash; you CURL it with the URL of your post, and it’ll search through it for any links and check to see if the owners of those sites have webmentions or wingbacks set up. There’s also an npm package, [@remy/webmention](https://www.npmjs.com/package/@remy/webmention), which you give an RSS feed and it does the same thing. That’s the version I’ve used.

I’ve added it as the `postbuild` script in my `package.json`, so it’ll run after every `yarn build`. 

```json
"scripts": {
    "postbuild": "webmention _site/feed.xml --limit 1 --send"
},
```

I was concerned that if my build runs every 12 hours, it’ll keep sending webmentions for the same posts. Remy assures me that duplicate webmentions aren’t an issue, as the accepting server will just respond with a 200 if I send a webmention that it’s already seen.

Now, every time I build and deploy my site, the script will send webmentions to anyone I’ve mentioned in the last post I wrote, as long as they have the webmention meta tags set up!