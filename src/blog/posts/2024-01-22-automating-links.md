---
title: Automated weekly links posts with raindrop.io and Eleventy
date: 2024-01-22
draft: true
tags: ['eleventy', 'how-to', 'projects']
templateEngineOverride: md
excerptText: "The quest: how could I mark a link or blog post as “good”, and have it show up in my blog on a Sunday without me having to do anything?"
---

A post that’s been getting a lot of traction recently is [I miss human curation](https://blog.cassidoo.co/post/human-curation/) by Cassidy Williams, in which she laments that we’re so reliant on algorithms to show us new stuff now, instead of having it recommended to us by other humans. 

Inspired by that, I decided to start posting weekly collections of posts and links I liked that week. Knowing I wouldn’t keep it up if I had to manually post it every week, I set about finding a way to automate it. How could I mark a link or blog post as “good”, and have it show up in my blog on a Sunday without me having to do anything?

It occurred to me that I’m already paying for raindrop.io, an excellent bookmark manager. It’s a great way of keeping links in sync across multiple platforms... and it has an API! This meant I could add links to a particular raindrop.io collection as I come across them, and then fetch them once a week and turn them into a post. 

## Collecting the links
I’ve created a separate raindrop.io collection for these links, which I can easily share to from the iOS share sheet, or from the Firefox extension. When I save the bookmark, I also add an accompanying note with a sentence or two about the link.

![A screenshot of a Firefox tab navigated to hidde.blog, with the raindrop.io extension visible. I am bookmarking a blog post by Hidde de Vries about his own link sharing plans, and I've written a note about it: 'Hidde's posted about sharing links on his own blog as well - great minds think alike!'. I have tagged the post 'good links'.](/img/blog/raindrop-bookmark.png)

I generated an API token for raindrop, and wrote a little script to pull the links from the collection using the `/raindrops/[collectionID]` [endpoint](https://developer.raindrop.io/v1/raindrops/multiple). 

I made sure to only fetch links from the past week so I didn’t duplicate anything. You can pass specific [search parameters](https://help.raindrop.io/using-search/#operators) in the query, so I restricted the links to any created *after* the previous Saturday, and *before* the current day - so, Sunday to Saturday. That means any links I clip on the Sunday will appear in the following week’s link post. 

```js
const todayDate = new Date();
const lastSatDate = subDays(todayDate, 8); // using date-fns here
const lastSat = format(lastSatDate, "yyyy-MM-dd");
const today = format(todayDate, "yyyy-MM-dd");

async function fetchLinks() {
  // Get content bookmarked between last Sunday and this Saturday inclusive
  const search = new URLSearchParams({
    search: `created:>${lastSat} created:<${today}`,
  });
  const url = new URL(`https://api.raindrop.io/rest/v1/raindrops/${collectionId}`);
  url.search = search;
  const rsp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await rsp.json();
}
```

## Creating the post
Once I’ve pulled the links, I need to turn them into an actual markdown post. I’ve created a very simple template that I can inject content into:

```md
---
date: {{date}}
---

{{links}}
```

I format the links into markdown, defaulting to raindrop’s excerpt if I didn’t write a note:
```js
const formattedLinks = raindrops.map((raindrop) => {
    const { link, title, excerpt, note } = raindrop;

    const description = note === "" ? excerpt : note;
    return `* [${title}](${link}) - ${description}`;
  });
```

Then I read the template as a string, interpolate the date and links I’ve just formatted, and write them to a file in my blog directory with the date as a filename.

```js
  let postContent = fs.readFileSync("./scripts/link_template.md", "utf8");
  postContent = postContent.replace("{{date}}", formattedToday);
  postContent = postContent.replace("{{links}}", formattedLinks.join("\n"));
  fs.writeFileSync(`./src/blog/links/${formattedToday}.md`, postContent);
```

## Scheduling the script
Running the script is easy enough: I added it into my `package.json` scripts as `yarn generate-links`. But I’d like to not even have to think about running it and have something do it for me.

It made sense to use GitHub Actions to run it on a schedule. I already deploy my website twice a day automatically so that new webmentions are fetched regularly. 

I randomly entered numbers into [crontab.guru](https://crontab.guru/) until it came out with “every Sunday at 6pm”, and then created a new workflow:

```yaml
name: "Generate and publish weekly link post"
on:
  schedule:
    - cron: 0 18 * * 0
jobs:
  generate-post:
    name: "Run script to generate post"
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "yarn"
      - run: yarn install
      - run: yarn generate-links
        env:
          RAINDROP_TOKEN: ${{ secrets.RAINDROP_TOKEN }}
          RAINDROP_COLLECTION_ID: ${{ secrets.RAINDROP_COLLECTION_ID }}
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: Generate weekly link post
```
I'm storing the raindrop.io token and collection ID in the repository secrets. 

My script generates a new `.md` file with the post, so I need it to commit and push the changes. For this I used [git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action). It detects changed files during a workflow run and commits and pushes them back to the repo.

My [deployment workflow](https://github.com/sophiekoonin/localghost/blob/main/.github/workflows/deploy-neocities.yml) listens for pushes to master, so once this workflow finishes running and pushes the changes, the deployment one will kick off and deploy my new blog post. Magic! 
