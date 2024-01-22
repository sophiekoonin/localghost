---
title: Sending webmentions from a static site
date: 2024-01-20
tags: ['webmentions']
---

It occurred to me this week that even though I’ve been using webmentions as comments for a really long time, I hadn’t actually been sending them myself. The shame! Here's how I set it up.
<!--more-->

***Edit 22/01/23:** I've added in some checks to make sure I don't send webmentions for a post if I've already done it before.*

Certified good egg [Remy Sharp](https://remysharp.com) has a tool called [webmention.app](https://webmention.app) which will send webmentions for you &ndash; you CURL it with the URL of your post, and it’ll search through it for any links and check to see if the owners of those sites have webmentions or pingbacks set up. There’s also an npm package, [@remy/webmention](https://www.npmjs.com/package/@remy/webmention), which you give an RSS feed and it does the same thing. That’s the version I’ve used.

You can add it as the `postbuild` script in `package.json`, so it’ll run after every `yarn build`. 

```json
"scripts": {
    "postbuild": "webmention _site/feed.xml --limit 1 --send"
},
```

I was concerned that if my build runs every 12 hours, it’ll keep sending webmentions for the same posts. Remy assures me that duplicate webmentions aren’t an issue, as the accepting server will just respond with a 200 if I send a webmention that it’s already seen. However, if you build your site very often you might be at risk of nearly DOS-ing the websites you're sending mentions to. To get around this, you could:
* write a script that runs the webmention CLI but only after checking the post timestamp of the last post to see if it's recent enough
* keep a record somehow of the last post you sent webmentions for, e.g. in a text file in the repo
* check the message from the last commit and only send the webmentions if you mention "new post" or similar 

To be super safe, I've added it as a script in `package.json` but I'm calling it from within a bash script that checks the commit hash for the last commit, and records whether or not I've sent webmentions for that commit already.

```sh
#! /usr/bin/env bash

if ! test -f ./last_webmentions_commit; then
  echo "Last webmention commit file not found, exiting"
  exit 1
fi

# Read the contents of the file
LAST_COMMIT_SENT=$(cat ./last_webmentions_commit)

# Get latest commit hash
LATEST_COMMIT=$(git rev-parse --short HEAD)

# If the last commit hash I sent webmentions for is
# the same as the latest commit hash, exit
if [[ $LAST_COMMIT_SENT == $LATEST_COMMIT ]]; then
  echo "No new commits since we last sent webmentions, nothing to do"
  exit 0
fi

# Get the last commit message
LAST_COMMIT_MESSAGE=$(git log -1 --pretty=%B)

# Does the commit message contain 'post'?
if ! [[ $LAST_COMMIT_MESSAGE == *"post"* ]]; then
  echo "Last commit message does not contain 'post', nothing to do"
  exit 0
fi

# Update the file with the latest commit hash
echo $LATEST_COMMIT > ./last_webmentions_commit

yarn send-webmentions
```

When I write a new post, I always use the word "post" in the commit message, so this will help distinguish which commits we need to send webmentions for. 

Now, every time I build and deploy my site, the script will send webmentions to anyone I’ve mentioned in the last post I wrote, as long as I haven't already sent webmentions for that post and the recipients have the webmention meta tags set up!
