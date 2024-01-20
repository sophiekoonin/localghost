---
title: How I deploy my Eleventy site to Neocities
date: 2024-01-20
tags: ['eleventy', 'how-to', 'neocities']
excerptText: "My setup for automatically deploying my Eleventy site to Neocities from GitHub." 
---

Skip to the bit you care about: 
- [About Neocities](#about-neocities)
- [Hosting a static site on Neocities](#hosting-a-static-site-on-neocities)
- [Continuous deployment to Neocities with Github Actions](#continuous-deployment-to-neocities-with-github-actions)
  - [Scheduling builds](#scheduling-builds)

I’ve hosted this website in a few different places since I started it in 2019. It started out on Netlify, but after my post about everything I googled went viral, I exceeded the bandwidth of the free plan. Then I moved it to Vercel, which (at least at the time) had more generous bandwidth on the free tier. I enjoyed very quick deployment speeds, but it gave me big Corporate Web vibes. Now I host localghost.dev on [Neocities](https://neocities.org). 

## About Neocities
Neocities reminds me of everything I love about the old web. It’s a place for people to create [bizarre, oddly specific websites](https://neocities.org/browse) for things they love, or random collections of digital trinkets they’ve found on their online travels. 

The manifesto on their [about page](https://neocities.org/about) resonated with me:

> We are tired of living in an online world where people are isolated from each other on boring, generic social networks that don't let us truly express ourselves. **It's time we took back our personalities from these sterilized, lifeless, monetized, data mined, monitored addiction machines and let our creativity flourish again.** 

## Hosting a static site on Neocities
Neocities offers free static site hosting, and (unlike the free hosts of yore) there are NO ADS. None. It’s been around for years, so it’s not going anywhere any time soon. 

You can manually build your site and upload the assets via the web editor, if you want. However, I’d recommend using version control so that you can easily roll back changes, and move your site somewhere else if you need to. There’s a [CLI tool](https://neocities.org/cli) and an [API](https://neocities.org/api) that make it much easier to upload new versions of your site.

The [supporter plan](https://neocities.org/supporter) allows you to use custom domains, gives you loads more storage and bandwidth, and allows as many sites as you want under the same account. It costs $5 a month, which really isn’t very much, and I’m happy to pay for it knowing that it’s supporting people creating websites for free and learning web development the same way I did. 

## Continuous deployment to Neocities with Github Actions
Like with Netlify and Vercel, I wanted to be able to set up a pipeline to automatically deploy my site when I pushed to the main branch. I’ve used CircleCI in the past, but I wanted to use [Github Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions) as it’s just... nicer.

I was very excited to discover that there’s a [GitHub Action for deploying to Neocities](https://github.com/bcomnes/deploy-to-neocities) by Bret Comnes! It uses the Neocities API under the hood, so you need to create an API key. 

You can do this via the API (this example is from the API docs):
```sh
$ curl "https://USER:PASS@neocities.org/api/key"
{
  "result": "success",
  "api_key": "da77c3530c30593663bf7b797323e48c"
}
```

Or you can create a new key from your site settings page at `https://neocities.org/settings/<your username>#api_key`.

Once you’ve got the key, store it in your repo’s actions secrets. Head to your repo’s settings page, and open “Secrets and Variables” > “Actions” under the “Security” heading. Create a new repository secret called `NEOCITIES_TOKEN` and set its value as the key you just created.

If you don’t have any other GH Actions workflows set up, you’ll need to create the `.github/workflows` directory. In here, I’ve got a workflow called `deploy-neocities.yml`. 

I’ve added some comments to show you what each bit does.

```yaml
name: "Deploy to Neocities"
on:
  push:
    branches:
      - main # run this job when I push to main
jobs:
  deploy:
    name: "Deploy to Neocities"
    runs-on: ubuntu-latest # the system the runner uses
    steps:
      - uses: actions/checkout@v4 # checkout the repo
      - uses: actions/setup-node@v3 # install node.js
        with:
          node-version: "18"
          cache: "yarn" # I'm using yarn rather than npm
      - run: yarn install # install dependencies
      - run: yarn build # build my project
        env: # the env vars I need to build my site
          WEBMENTION_IO_TOKEN: ${{ secrets.WEBMENTION_IO_TOKEN }} 
      - uses: bcomnes/deploy-to-neocities@v1 # deploy!
        with: # config for the action
          api_token: ${{ secrets.NEOCITIES_TOKEN }}
          dist_dir: "_site/" # my build output directory
          cleanup: true # delete anything on neocities that's not in my dist_dir
```

The workflow runs every time I push commits to the main branch. 

The environment variables you need for the `yarn build` step will vary, and you might not need any at all.

You *will* need the `NEOCITIES_TOKEN` for the `deploy-to-neocities` action, which we pass in here as the `api_token` param. 

The default value of the `cleanup` param is `false`, and I had it set to that for ages, but then I realised that if I accidentally published a post and unpublished it by setting it back to draft, it wouldn’t delete the built post on Neocities. So even if it wasn’t linked from the site, the page itself would still be hosted there. I’ve since set `cleanup` to `true` so it removes any files from Neocities that aren’t in my newly built site output. 

Once you’ve got that workflow file finished, commit it and push it to your repo. GitHub will pick it up, and start running it automatically depending on what you told it to do. I find it goes pretty fast &ndash; my site deploys in about 30s. 

### Scheduling builds 
Branch pushes aren’t the only triggers for workflows! You can have time-based triggers as well, using cron, the scheduling tool.

For example, I automatically rebuild my site at 8am and 6pm every day to fetch the latest webmentions (there’s a script that runs every time the site is built). 

```yaml
on:
  schedule:
    - cron: 0 8/9 * * *  
```

 I recommend [crontab.guru](https://crontab.guru) for help with cron syntax. 