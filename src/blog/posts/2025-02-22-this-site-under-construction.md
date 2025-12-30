---
title: "This page is under construction"
subtitle: A love letter to the personal website
date: 2025-02-22
excerptText: "If you take just one thing away from this article, I want it to be this: please build your own website."
tags: ["conferences", "tech", "nostalgia","personal websites", "long read"]
---

*This is an updated & abridged version of the talk I gave at several conferences throughout 2022/23, including [Beyond Tellerrand](https://www.youtube.com/watch?v=2ZUqa-lTbnU), [CSS Day](https://www.youtube.com/watch?v=H2Ux0hGQcs4) and [FFConf](https://www.youtube.com/watch?v=vGYm9VdfJ8s).*

If you take just one thing away from this article, I want it to be this: **please build your own website**. A little home on the independent web.

A reflection of your personality in HTML and CSS (and a little bit of JS, as a treat). This could be a professional [portfolio](https://www.cassie.codes/), listing your accomplishments. It might be a [blog](https://ohhelloana.blog/) where you [write](https://rknight.me/) about [things](https://sallylait.com/blog/) that [matter](https://www.miriamsuzanne.com/) to you. It could even be something very [weird](http://endless.horse/) and [pointless](https://eelslap.com/) (even better) &ndash; I love a good [single-joke website](https://theuselessweb.com/). Ultimately, **it's your space and you can do whatever you want with it**.

In the early days of the web, there were a lot of sites like this. People would build websites for their families, fansites for bands they liked, or just homepages they filled with random junk. It was a fun thing to do, and a great way to connect with people. They really don't make 'em like they used to. 

<figure>
<img src="/img/blog/build-1999/geocities1.png" alt="A brightly coloured website that says 'Welcome to Tom & Sherry's Proud Grandparents page. The Proud Grandparents page was created to show pictures of our grandchildren to family and friends, and an occasional Web surfer. The grandkids, our pride and joy, and their parents have made us very proud. Okay, let's see the pictures!'">
<figcaption><a href="https://geocities.restorativland.org/Heartland/Ridge/1217/">The Proud Grandparents Page</a>
</figcaption></figure>

It feels like we've lost this decades-old art form; the individuality of design and the uniqueness of content you used to see on these webpages. The notion of experimenting with HTML and CSS without worrying about something looking weird or out of place. The beauty of a website built by a person, *because they wanted to*.

## But websites are for business... right?

Many of you reading this will probably get paid to build websites. I do, to an extent. And a lot of these websites will probably be very similar: marketing, e-commerce, ultimately something designed to make money either by selling something or advertising something. Maybe you've had to stick some tracking pixels in, do some a/b testing to see what variant converts better, and do some forbidden invocations to get Google Tag Manager working. The kind of web development that makes you question your life choices.

And these sites all look *identical*. The same style of icons, black CTAs, the same pops of the same colours. I keep landing on websites and thinking I'm looking at [Vercel](https://vercel.com), and it's become this kind of bland VC-funded corporate identity that all startups have nowadays. And a lot of the content is similar too, because it ultimately comes down to what works for SEO. I gave this talk before Generative AI was quite so ubiquitous, and it's even worse now with so many websites full of absolute garbage content spewed out of ChatGPT, and nobody knows how Google ranks pages any more. 

These sites are providing a service, and are transactional in nature. There's always going to be a place on the internet for them &ndash; even if I wish they'd put a bit more effort into making their sites a bit more interesting-looking. I guess I'm asking: *where did the fun web go?*

I learned HTML back in 2000, and things were pretty different then*. I can't imagine how intimidating it must be to be a newcomer now with all of these frameworks and expectations. If you do get into web dev now you're probably doing it to make a career of it; you might do a bootcamp, or a course, some kind of formalised training. And if you are studying with a view to doing it professionally, you're much more likely to target what people are hiring for &ndash; whichever framework is so hot right now &ndash; skipping right over the basics. 

I've interviewed quite a few folks for web development jobs over the years, where it's clear they've only ever done React &ndash; and the requisite amount of JavaScript required to *do React* &ndash; and never got a good foundation in HTML or CSS that you need to build good quality, accessible, performant websites. 

\* but 99% of that HTML would still work perfectly on the web today, thanks to glorious backwards compatibility! Isn’t that cool? (Provided it wasn’t mostly `<marquee>` tags, of course...)

## But I still have fun on the web!

Well, sure. But ultimately the websites we use for fun are also for business. Think about how you use the web today: chances are, many of you spend the majority of your time on a handful of websites and apps owned by big companies like Meta and Condé Nast. 

Under the guise of a free service, these companies are making money from data they're harvesting from us. "We are the product" may be a tired cliché at this point, but it's a cliché for a reason. They might not be explicitly selling it on, but they are 100% using your data to feed into advertising algorithms. We upload images, videos, run our social lives and even our businesses on these platforms. Instagram's terms of service give Meta carte blanche to reproduce, distribute or copy your images royalty-free. 

Meta makes an absolute killing on advertising that can reach highly specific target markets, and they wouldn't be able to do that without using your personal data and browsing habits to label your user account with things they think you like. 

Have you looked at your Instagram/Facebook settings lately, in the ad preferences section? It's quite illuminating what they decide to use to target you.

Laura Kalbag gave [a great talk about digital privacy](https://ffconf.org/talks/privacy/) at FFConf 2019, and it was this talk that spurred me on to ditch Gmail and set up a paid-for email account. I recommend giving it a watch.

## Sign in to view more

For many people, a social media account is the lowest-friction way to have an online presence. You don’t need any technical skills, it doesn’t cost you anything, and you’ve got a captive audience in the form of people on the social network. 

The flip side of this is, if anyone *doesn’t* have an account on the site they can’t see very much at all. My two local cafés both have an Instagram account and nothing else, and I don’t have Instagram any more so I can only see about two pictures on the web before the page asks me to sign in. Similarly, many small businesses only have a Facebook page which won’t show me many posts or pictures until I log in. 

![A screenshot of a Georgian restaurant on Facebook. There is a translucent overlay on the screen preventing any interaction with the page, with a modal that says "Sign in to Facebook".](/img/blog/personal-website-post/facebook-barrier.png)

## Unfollow

It took a billionaire narcissist taking over my favourite social network in 2022 to disrupt my very unhealthy relationship with social media. I was perma-glued to Twitter, workshopping tweets and thinking about how I could phrase things to get the maximum number of likes &ndash;  addicted to the dopamine hits of likes and follows. You start to think: "what can I post that people will respond positively to?". The more followers I had, the higher the bar for engagement got: I couldn't risk posting something *not funny* or *boring*. I didn't know these people, they didn't know me, and yet it was occupying far too much of my brain.

And because you only have a set character limit, you find yourself pre-empting the backlash you might get. There's absolutely no room for nuance, so you have to think "how could someone (often deliberately) misinterpret this?". 

![A screenshot of a tweet by @haircut_hippie from Sept 16, 2021 that says "there's an extraordinarily defensive style of writing where I can recognize if someone is probably active on Twitter or not by how often they include weird preemptive defenses of positions no sane person would ever take"](/img/blog/personal-website-post/twitter-defensive.jpg)

Well, the good news is there's no reply guys on your own website. You can write at length, ramble nonsensically, and people can choose to read it or not. It’s about putting things out on the internet for yourself. 

All of this content we’re writing on other people’s platforms is also stuck in that platform unless you request a data export of it, and even then it’s often in some weird proprietary format. During one of the big Twitter exoduses in 2022, the systems were under a lot of strain and it seemed like the export wasn’t going to arrive at all. What if you get banned for some reason, or locked out of your account &ndash; there’s nobody to talk to to appeal the decision, and your data might be lost forever. It won’t get archived by the Wayback Machine if it’s behind a login screen.

I still dip in to Mastodon and Bluesky periodically, posting the odd silly thing or bit of news, but anything I really care about goes on here now, in cross-compatible Markdown format, archived on GitHub and elsewhere. 

You can be a creator anywhere on the internet these days, but there's only a small handful of places where you actually *own your own content*. Your own website is one of them.

## Internet of Slop

When I originally wrote the Personal Websites talk in 2022, generative AI was something people were just starting to experiment with, mainly to make really stupid-looking generated images with DALL-E. Within a couple of years it's absolutely everywhere: we have a million identical "AI" startups popping up &ndash; many of whose products are just ChatGPT in a trenchcoat &ndash; and creators’ work is being ripped off left, right and centre. Silicon Valley is trying to invent AI solutions to problems we don't even have. Companies like LinkedIn are using our data and the content we post on their platforms to train their models, but what's worse, most are making it *opt-out*. 

Side note, imagine a model trained on the entirety of LinkedIn: talk about garbage-in-garbage-out.

I’d like to point you towards Maggie Appleton’s excellent talk [The Expanding Dark Forest and Generative AI](https://maggieappleton.com/forest-talk) which goes into this in a little more detail and offers some food for thought that may give you indigestion. 

> [It] feels like we’re surrounded by content that doesn’t feel authentic and human. Lots of this content is authored by bots, marketing automation, and growth hackers pumping out generic clickbait with ulterior motives.

People have already started putting little badges on their site that say “Made by a human”, and Maggie asks: is there a future in which we need to have some kind of "reverse Turing test" to prove our humanity on the internet? 

Well, shit. What do we do about all of this? The internet sounds like a pretty dire place right now. Should we just abandon ship and leave it to burn, let the AI models train on AI slop and spit out nonsensical word salad that humans don't even read?

Of course not.

## It wasn't supposed to be like this
The whole idea of the World Wide Web was that it was decentralised and independent. It was released as an open standard so that access could be as democratic as possible. 

Tim Berners-Lee gave an [interview](https://www.vanityfair.com/news/2018/07/the-man-who-created-the-world-wide-web-has-some-regrets) in Vanity Fair in 2018 where he said:

> It was all based on there being no central authority that you had to go to to ask permission... The spirit there was very decentralized. The individual was incredibly empowered. That feeling of individual control, that empowerment, is something we’ve lost.

We owe it to ourselves to bring that spirit back, and we can do that by carving out our own individual spaces on the web.

## The modern web is for consumers, not creators

There are so many tools out there for building personal websites, HTML is wonderfully backwards-compatible, and there are a plethora of free web hosts out there. So *why aren't we doing it?*

Somewhere along the way, websites stopped being about the creators, and started being about the consumers: we don’t build websites for ourselves like we used to, we build them for the audiences we want. 

I see the personal website as being an antidote to the corporate, centralised web. Yeah, sure, it's probably hosted on someone else's computer &ndash; but it's a piece of the web that belongs to you. If your host goes down, you can just move it somewhere else, because it's just HTML. 

Sure, it's not going to fix democracy, or topple the online pillars of capitalism; but it's making a political statement nonetheless. It says "I want to carve my own space on the web, away from the corporations". I think this is a radical act. It was when I originally said this in 2022, and I mean it even more today. 

## Damn it, I'm in! Where do I sign up?

I want to be clear, I'm not telling you to ditch social media completely, or stop building websites for business. There is still plenty of room on the web for commercial websites alongside the independent personal web. This is very much not a plea to go back to the old days of GeoCities, but rather a plea to bring the magic of the old days into the present day. 

I also don't want to be prescriptive about what this website should be. It's your space, and you can do with it whatever you want &ndash; whether that's a maximalist extravaganza, or plain text on a plain background. You might spent hours hand-crafting your HTML, or use a drag-and-drop builder. You may host it on someone else's platform, or on a box in your bedroom. All of these things are valid, as long as you build it *for you*.

This website used to be just a blog and portfolio, but I've been continuously adding more and more things to it because I wanted to: pages about [keyboards](/keyboards), my favourite [games](/games), things I [use](/uses), weird [projects](/projects) I've done. I've built multiple themes with some really silly features, but it's all done in a way that works without JS and respects people's motion preferences. I believe you can - and should - have a creator-focussed website which is still considerate towards the people reading it. 

You don't need to think about SEO or design trends... unless you want to. You could... list recipes you like, start a blog, write about tech things, share pictures, poems, little notes. Your space is an opportunity to be as weird as you want, to experiment and learn.

For the nerds: try out the things behind experimental flags. Go to MDN and find the weirdest sounding API. Experiment in production, write bad code and ship it. If you screw it up, just revert. Undo. This site deploys in &lt;30 seconds, so nobody would ever know I messed it up (and I have, repeatedly). Drop in new features of CSS without worrying about whether your customers’ browsers support it; just make sure you lean on [progressive enhancement](https://www.gov.uk/service-manual/technology/using-progressive-enhancement) so your page still works for everyone. As long as you're building the foundation of your site in regular old HTML, the content will show up regardless of the fancy stuff, and the weird stuff will be there for you (and anyone else who's got Chrome Canary).

The tools are the same as they've ever been: HTML and CSS. It's still completely possible to write some HTML and CSS, stick it on a server and have a static webpage. It's so easy nowadays to get bogged down in build tools and frameworks. You can use them if you want, but it's not a requirement for web development even in 2025.

Free hosting is better than it's ever been thanks to storage getting cheaper and cheaper. This website is hosted on [Neocities](https://neocities.org), which has a free tier with zero ads and 100% good vibes. It's aimed at anyone who wants to make a website, and they've got an HTML tutorial for beginners. You can upload static files, use the inline editor, or [deploy automatically via CI](https://localghost.dev/blog/how-i-deploy-my-eleventy-site-to-neocities/) if you're a bit more technically-minded. A lot of the sites on Neocities are very nostalgic and evoke the late 90s and early 2000s: there’s a really nice community vibe there. 

I especially like their manifesto:

> We are tired of living in an online world where people are isolated from each other on boring, generic social networks that don't let us truly express ourselves. It's time we took back our personalities from these sterilized, lifeless, monetized, data mined, monitored addiction machines and let our creativity flourish again.

The personal site isn't dead. It's just been forgotten in the commercialised, capitalist web of today. We owe it to ourselves to rediscover this lost art.

We can still be creators for the sake of creating. 

We can still post content without someone else making money from it. 

So, once again my digital call to arms: build your own website. Make it fun. Make it pointless. But most importantly: make it **yours**.

## Appendix: look at these cool websites

Here are some of the excellent personal and weird and wonderful websites that inspired me while writing this talk, and subsequently this post, and now, and forever.

* [Henry from Online](https://henry.codes/)
* [Lynn Fisher](https://lynnandtonic.com/)
* [Make Frontend Shit Again](https://makefrontendshitagain.party)
* [Carol Gomez-Gilabert](https://carol.gg)
* [Kara Brightwell](https://ghost.computer/)
* [Alistair Shepherd](https://alistairshepherd.uk/)
* [David Darnes](https://darn.es)
* [Sara Joy](https://sarajoy.dev)
* [Nic Chan](https://www.nicchan.me/)
* [oh hello ana](https://ohhelloana.blog)
* [Cassie Codes](https://cassie.codes)
* [Robb Knight](https://rknight.me)
* [Christopher Kirk-Nielsen](https://chriskirknielsen.com)
* [machine cat in space](https://machine-cat.space/home/)
