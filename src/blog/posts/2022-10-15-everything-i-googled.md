---
title: Everything I googled in a week as a senior software engineer
date: 2022-10-15

tags: 
- 'engineering'
- 'work'
excerptText: "Three years ago I wrote a post listing everything I googled in a week. I'm a senior engineer and web eng lead now, and guess what: I still google a lot. Here's everything I googled in a week, 2022 edition."
---

Three years ago I wrote a post called [Everything I googled in a week as a professional software engineer](/blog/everything-i-googled-in-a-week-as-a-professional-software-engineer/), and it clearly resonated with people, because it went pretty viral. It _still_ gets most of the pageviews on this website. 

Well, a lot has changed in three years: I got promoted and I'm now a senior engineer and lead the web engineering discipline at [Monzo](https://monzo.com). But one thing hasn't changed: I still google a lot, every single day. Here's what I googled in a week, 2022 edition.

Obvious disclaimer: this is slightly edited as I've removed most of the non-work-related ones.

Some of these search terms might make you laugh and think "how did you not know that?". Well, there are several reasons you might not know something (choose all that apply):
* you've never used it before
* you've used it before but can't remember
* it's changed since the last time you used it
* you're tired
* you're distracted
* you're human

More than ever, we're constantly surrounded by new information. It's impossible to remember everything all of the time. 

I hope this makes you feel a bit better if you ever feel bad that you have to google something "obvious". 

## Monday
_slack channel bookmarks_ &ndash; trying to find some documentation on where to find channel bookmarks on mobile, as my friend couldn't find them.

_carbonara_ &ndash; my manager made the very lofty claim in standup that his carbonara was the best, so I googled a picture to make a "carbonara king" emoji of him

_directory tree cli_ - how to render a directory tree in a CLI

_react-toastify_ - a useful notification library

_anchor dataset_ - accessing data attributes in JS

_mdn element dataset_

_waitfornextupdate_ - trying to remember if this testing-library function was just for hooks. (It is.)

The next few are a direct result of the fact that in JS you still can't automatically download a file in a cross-browser way without creating an anchor element. There's the [downloads API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/downloads/download), but Safari doesn't support it.

_jest how to test detached elements_ &ndash; `jest-dom` can only see what's in the DOM under test, so if an element is detached from the DOM, it's not going to be able to test it. But this didn't immediately occur to me.

_`document.createElement('a')`_

_`document.createElement('a')` detached_

_react-hook-form_ - we're trying to add this to some of our web properties, as they don't have any form management and `react-hook-form` is a really nice abstraction.

_spread types may only be created from object types_ - I kept getting this error and I couldn't work out why, and it turns out we had an old version of `react-hook-form` installed in a different app (just monorepo things) which had different return types

_react-hook-form "spread types may only be created from object types"_

## Tuesday
_slack channel links in API_

_gilts_ &ndash; they were [in the news](https://www.ftadviser.com/investments/2022/10/10/boe-to-expand-gilt-intervention-as-obr-confirms-forecast-date/) and I didn't actually know what they were.

_js accessing nested object key_ &ndash; I momentarily couldn't remember whether you could access nested object keys like `myObj['key1.key2']`. (you can't, because the entire string is interpreted as one key)

_intensifies emoji maker_ &ndash; I went with [MakeEmoji](https://makeemoji.com/) which has a pleasing number of options

_modal accessibility_ &ndash; I was having a discussion with someone about why modals aren't accessible. It turns out there is some nuance to it, and that they aren't necessarily completely inaccessible, but they require a fair bit of work to make them accessible.

_modal window accessibility_

I hope you can feel the frustration in the next few search queries, in which I struggle with Storybook and then find that my problem isn't actually documented. I knew that there was a world in which you can write JSDoc comments above a component, and have them show up in Storybook docs, because we did that at my previous job. The docs don't seem to mention this at all, and it wasn't working for some reason. It turns out that it doesn't work with default export components, for some reason, but this isn't documented anywhere. 

_storybook docs markdown comments_

_storybook story description_

_storybook docs_

_storybook comments_

_storybook comment_

_storybook JSdoc_

## Wednesday
_mark hoppus_ &ndash; I mentioned that I was trying to get blink-182 tickets (I failed) and we were debating how old they are now.

_lofi girl_ &ndash; during retro we put music on while people are writing their Retrium tickets, and I thought this was the appropriate vibe.

_apollo query oncompleted_

_useLazyQuery_ &ndash; trying to figure out if this returns the return value, or `void`. Turns out the latest version returns the return value, and the version we're on doesn't :(

_sentry github_

_'RequestSessionStatus' is not exported from '@sentry/types'_ &ndash; this turned out to not be a problem with the Sentry lib, but actually a yarn.lock mismatch (just monorepo things). 

## Thursday
_document.write_ &ndash; I knew this was deprecated, but I wanted to find something to back up my PR comment.

_apollo server request size_ &ndash; Getting 412s from our apollo server and trying to figure out how to bump the max request size.

_apollo-server-koa_

_apollo server request size site:stackoverflow.com_ - a useful tip for googling is that you can restrict searches to a particular site using the `site:` param.

_mdn element dataset_

_open new window and set inner html_ &ndash; trying to find a suitable replacement for `document.write` for the person who requested it. We went for `window.open()` and `myWindow.document.documentElement.innerHTML = myHtml`.

_mock clock golang_ &ndash; figuring out the best way to mock the `time.Now()` function in Go. There are various ways of doing it across our codebase, I wasn't sure which one was the most up-to-date way, but I figured it out eventually.

_graphql server request entity too large_ &ndash; still trying to fix the apollo server request limit

_doggo ipsum_ &ndash; my [favourite ipsum generator](https://doggoipsum.com).

_apollo server body parser config_

_apollo server body parser config koa_

_koa_ - I finally realised we need to set the body parser config on the server itself, not the apollo-server wrapper.

_koa request size_

_britney spears albums_ &ndash; trying to find as many Britney track titles as possible to cram into a pun-filled gratitude post for my colleague who helped us out.

_ronseal_ &ndash; I like to google pictures of [Ronseal](https://ronseal.com) and put them in PR descriptions when the title describes exactly what the PR does (i.e. it [does what it says on the tin](https://en.wikipedia.org/wiki/Does_exactly_what_it_says_on_the_tin)). I think I got this habit from [b3ta](https://b3ta.com/dictionary/define/Ronseal/) back in the day.

## Friday
_read a symbolic link_ &ndash; I'm so shit at symbolic links lolol

_npm service status_

_apollo async oncompleted_

_window.history_ &ndash; looking for the arguments for `history.push`. 
  
I think the next few are particularly amusing given that I *literally gave a conference talk* on `redux-saga` in 2018, but it's been so long since I touched any code containing sagas that I completely forgot how they work:

_saga execute non-saga function_

_saga execute non-redux function_

_redux-saga effects_ 

More ipsum generators, because my colleagues enjoyed doggo ipsum:

_[cupcake ipsum](https://cupcakeipsum.com/)_ 

_[veggie ipsum](https://www.loremipsums.nl/lorem-ipsum-origineel/veggie-ipsum/)_ &ndash; I _love_ that I also googled this in the previous post as well, I promise it's a coincidence

_ts-command-line-args_ - onto some CLI building now!

_node.js interactive shell_

_node.js interactive shell select_ &ndash; I was looking for a CLI library that lets you select different options with the arrow keys. I found [inquirer.js](https://github.com/SBoudrias/Inquirer.js)!

_types/inquirer_

_ts-command-line-args_

_should you symlink from destination_ &ndash; I can never remember what order to do symlinks in

_TS2464_ 

_next-images_ - checking that some of our plugins are still relevant.

_nextjs document_

_react-hook-form radio buttons_ - sometimes you just need a good example. Turns out it was easier than I thought, and I just needed to forward a ref to our radio button component.

## Looking back
You might say "well, you googled fewer things this week than you did that week in 2019!". For one thing, I have more meetings now than I did back then. I'm in a different team, working on different things. 

It also depends from week to week what I'm working on; last week I spent a lot of time building data export in Go, and so my search history was full of frustrated queries like `golang readseeker from buffer` and `create a file from string golang`. (I still help out on backend tickets when it's needed.)

Some of the stuff I googled back then I can remember how to do without looking it up now, but some of it I definitely can't (e.g. I still can't get my brain to retain some more complex CSS grid things). For example, I'd 100% still have to google all of these from the last post:

_whitespace regex_

_regex not letter_

_js date_

_grid minmax_

There you have it &ndash; I still google loads of stuff. To finish, I'll leave you with what I said in the post from 2019:

> What I'm trying to show with all this is that you can do something 100 times but still not remember how to do it off the top of your head. Never be ashamed of googling, even if it seems like the most basic thing you're looking up.