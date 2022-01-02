---
title: "Start at the beginning: the importance of learning the basics"
date: '2022-01-02'
draft: true
tags: ['advice', 'learning']
---

If you're an early-career developer, Twitter is overflowing with people tweeting great tips -- and some absolute rubbish -- about how to improve your skills and become better at your job. I've spoken to more than a few people who've asked me, "how should I start?". And I tell everyone the same thing: **learn the basics.**

However you learn best -- book, video, interactive tutorial -- **you need to learn HTML and CSS  before you can call yourself a web developer**. I don't think that's a particularly controversial statement.

Once you start getting into interactive website territory, with API calls and fancy stuff, that's where you need JavaScript (JS) knowledge. More specifically, **vanilla JS**: plain JS with no additional frameworks or plugins. The JS that your browser understands without having to do any pre-processing. It makes working with frameworks a whole lot easier, and it'll help you to know when *not* to use a framework (and avoid making users download massive JS bundles when all you need is a tiny bit of code). Browsers have come a *long* way, and a lot of what we might have needed to use [Babel](https://babeljs.io/) to do even just a couple of years ago is now natively supported in the big 4 browsers (Chrome, Firefox, Edge and Safari).

## Where I started

I started building websites when I was ten years old. I was lucky enough to grow up with computers in the house, and had a book called "Make Your Own Webpage" which taught me the basics of HTML (as it was in 1999). You can even [read it on archive.org](https://archive.org/details/makeyourownwebpa00pede).

{{<img src="*/make-your-own-webpage.jpg" alt="The front cover of the book 'Make Your Own Webpage, a guide for kids, from the Creators of Internet for Kids!' by Ted Pedersen and Francis Moss. The cover features a CRT monitor and beige desktop computer with a computer mouse that looks like a real mouse, on a mousemat that looks like a slice of cheese." class="inset-image" >}}

A few years later, I built my personal website full of webrings and stolen gifs with the help of [Lissa Explains It All](http://lissaexplains.com/), the ultimate HTML bible for anyone on the internet in 2002. (It's still online today, but pretty out of date!)

Fast-forward through LiveJournal, Greymatter, Blogger, Wordpress, pretty much any pre-2010 blogging site/CMS framework you can imagine -- and now I'm building websites (or web apps) as my actual job, using React. A fair bit has changed -- but not as much as you'd think. 

I'm telling you this because I **still use the knowledge I learned when I was ten** every day at work. HTML tags are still HTML tags, they're still written much the same way -- HTML5 got rid of some of the ones I used to use (pour one out for `marquee`) and introduced some new ones, but the fundamentals are still the same. Most of the websites that I built in 1999 would still render today.

My first professional web development experience was a React app. I'd just about heard of React at that point, but I'd recently learned JavaScript and Node.JS which gave me a good foundation to build upon. I brushed up on some newer CSS concepts I hadn't used, but all the HTML and CSS of my past web adventures came right back. The good thing about this stuff is that it's all over the internet, so when you inevitably forget how to do something really simple, you can just google it. 

## Frameworks serve a purpose, but they don't replace the basics
People might tell you to learn React, because everyone's using React. I write React every day, and a lot of that is just JavaScript and HTML. If you don't know either of those, you're going to have a bad time -- or you'll end up with highly specialised framework-specific knowledge that will bite you later on when you need to use a different framework. Lots of people are using React, sure -- but a lot more people aren't. A far, far larger proportion of the web runs on Wordpress, for example. Lots of sites are built in plain old HTML, CSS and JS, like the [emojinator](https://emojinator.fun) and this very website you're reading.

Besides, in a few years we'll probably using the newest, hottest framework and React will become the butt of jokes in the way that Angular has. Or you'll land a job at your dream company and find they use Vue, or some state management library from 2011 which has no documentation. I'm not saying don't learn React -- I'm saying learn the basics first, so you can apply your knowledge to all manner of other frameworks and tools.

The same goes for CSS. There was a particularly bad take floating around Twitter recently where someone suggested that junior developers should skip CSS and just learn [Tailwind](https://tailwindcss.com/). I have used Tailwind, and I dislike it for various reasons, but I can see use cases for it such as quick prototyping and a set of nice defaults in the absence of specialist design. However, it doesn't and shouldn't "replace" CSS. Tailwind is literally just a library of someone else's CSS classes, except you have a separate class for nearly every rule instead of writing all your rules together in reusable classes for each component. Instead of learning hundreds of class names, why not learn the CSS rules they translate to and write one CSS class with multiple selectors? When you go to your next job or project and find they don't use Tailwind, it'll slow you down as you need to learn the selectors all over again. 


## Recommended resources
I'd recommend going in the order HTML, CSS, JS. That way, you can build something in HTML, add CSS to it as you learn it, and finally soup it up with your new-found JS knowledge.

If you're a backend engineer who only touches the frontend occasionally, you don't need to go too deep -- but you need a decent grasp of which element does what ([semantic HTML](/0221/06/the-right-tag-for-the-job-why-you-should-use-semantic-html/)) so you can make sure you're using the right elements and not creating any accessibiliy problems. 

### Learning HTML
I usually recommend these tutorials which provide a really nice overview of different types of elements. Try using some of the tags in [Codepen](https://codepen.io/pen/), and watch things render before your eyes. 
* [Getting started with HTML - MDN](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)
* [FreeCodeCamp's Responsive Web Design course - Basic HTML and HTML5](https://.freecodecamp.org/learn/responsive-web-design/#basic-html-and-html5)

Learn from how other people do it. Web pages are so bloated with scripts and analytics these days that it's hard to just right-click and "View Source" in the same way that I did back in the early 00s -- I learnt a lot of HTML by nicking other people's code! But you can use browser dev tools to look at the structure of the page (the Document Object Model or DOM, as it's known):
* [Chrome dev tools](https://developer.chrome.com/docs/devtools/open/#elements)
* [Firefox inspector](https://developer.mozilla.org/en-US/docs/Tools/Page_Inspector)
### Learning CSS
[Codepen](https://codepen.io/pen/) comes in useful again here to easily write and apply CSS styles to HTML, and have it update instantly.

Again, MDN has a great beginners' guide. CSS Tricks is my favourite place for useful CSS knowledge (I referred back to their Flexbox cheatsheet for YEARS) and really clearly written guides.

**Free**
* [CSS basics -- MDN](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics)
* [CSS Almanac -- CSS Tricks](https://css-tricks.com/almanac/) -- a guide to nearly every selector and property in CSS
* [CSS Tricks guides](https://css-tricks.com/guides/) for in-depth info

**Paid**
* [CSS fundamentals on egghead.io](https://egghead.io/courses/css-fundamentals) by Tyler Clark (video)
  
### Learning JavaScript
You want to start with vanilla JS. Having a solid foundation in that will make it easier to use frameworks and libraries in the future.

How in-depth you go is up to you, and depends on how much interactive stuff you want to build on your website. If you just want a plain static site with a bit of markdown, you probably don't need JavaScript. This website has a tiny bit of JS on that controls dark mode; without that, it'd just be HTML and CSS (though I did use a static site generator to build it).

Besides the obligatory MDN article, these resources have been recommended by folks on [Twitter](https://twitter.com/type__error/status/1477734460741369860) - there are more suggestions in the replies. 

**Free**
* [Getting started with JavaScript -- MDN](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics)
* [FreeCodeCamp](https://freecodecamp.org)
* [javascript.info](https://javascript.info/)
* [Wes Bos's Beginner JS Notes & Reference](https://wesbos.com/javascript)
* [Wes Bos -- 30 Day Vanilla JS Coding Challenge](https://javascript30.com/)
  
**Paid**
* [Vanilla JS Academy](https://vanillajsacademy.com/essentials/) (structured course)