+++
date = 2021-06-04T23:00:00Z
draft = true
summary = ""
tags = ["html", "accessibility"]
title = "The right tag for the job: why you should use semantic HTML"

+++
I've come across a lot of websites in my career (and in daily browsing) that are straight-up inaccessible. If you've ever worked on a project that is riddled with accessibility issues, you'll know that fixing these problems is a mammoth task - it needs _time_, it needs _people_, it needs *prioritisation*... it costs money, basically. As I mentioned in my blog post [7 myths designers and developers believe about web accessibility](https://localghost.dev/2020/10/7-myths-designers-and-developers-believe-about-web-accessibility/), retrofitting accessibility is *hard*.

The key is to *start out* with the right tools for the job - or rather, the right _tags_ for the job. In every website, underneath the layers of CSS, the bloated frameworks, the 45945 API calls, there's good old HTML, and that's the key to accessible websites. Specifically, **semantic HTML**.

## Semantic HTML conveys meaning

Semantics is the study of meaning, and semantic HTML is exactly that - HTML tags that convey meaning. They tell the browser - and assistive technology such as screenreaders - about the structure of the page, and how it should behave when you interact with those elements. A button should let you click on it. An ordered list should have numbers. 

Sighted people rely on visual information to tell them about the structure of a page. Based on our prior knowledge of UI conventions, we can identify where a header is, which parts of the page are buttons or form elements, and what the title of the page is, for example. But if you don't get that visual information, how can you tell what's on the page?

Assistive technology such as screenreaders will take the HTML markup of the page and present it to the user either by reading it out audibly, or sending the output to something like a [braille display](https://en.wikipedia.org/wiki/Refreshable_braille_display). They'll use the different types of HTML tags in the document to present structured information to the user, allowing them to navigate by headings, or cycle through the links in the page. 

## Example: a non-semantic news site

Take this mocked-up news site (as you can see, graphic design is my passion). I've built it using mostly `<div>` elements, with a couple of `<h1>`s as I wanted some nice big headings. My menu at the top is a series of `<div>`s containing links, and the footer at the bottom is the same. 

{{< snippet title="Semantic HTML blog post example: no semantics" id="jOBxyVB" >}}

If you're a sighted user like me, it looks perfectly fine. I can see a menu, a header, some titles and a footer. The byline and image caption is nicely italicised, and there are some nice buttons and fancy SVG checkboxes on the cookie banner.

But let's take a look at this page from the perspective of assistive tech, which relies on the underlying HTML markup to establish the structure of the document. I'm using the screenreader software [VoiceOver](https://support.apple.com/en-gb/guide/voiceover/welcome/mac), which is built into MacOS, but if you're on Windows you can use [NVDA](https://www.nvaccess.org/download/) which is free to download.

### Landmarks
Screen reader software such as VoiceOver, JAWS and NVDA provides a way for users to navigate to different sections on the page based on **landmarks**. So, you could skip directly to the footer, or directly to the main part of the site. This relies on these landmarks being signposted through semantic tags such as `<header>`, `<main>` and `<footer>`. We haven't used any of these tags in the example, so screen readers wouldn't be able to identify any landmarks.

When I run VoiceOver and press ctrl+option+shift+I to tell me about the page, it says:

> Page contains 14 links 2 headings 

[Deque University](https://dequeuniversity.com/assets/html/jquery-summit/html5/slides/landmarks.html) advises using ARIA roles (e.g. `role="navigation"`) in conjunction with semantic HTML elements to provide a thorough overview of the landmarks on the page.
When I properly mark up the header, footer and main sections of the page, with an `<article>` around the content of the news article itself, VoiceOver allows me to navigate between them with ctrl + option + right/left arrow.  It tells me:

> Page contains 14 links 2 headings 3 landmarks 1 article

> You are currently on a main

Which, though slightly odd, is helpful enough.

### Menus
Lists of links like the ones in the header and footer should always be exactly that - a list. We should use an unordered list `<ul>` here, ideally with the ARIA attribute `role="navigation"` to make it super clear what its purpose is. 

Lists can be styled easily (including removing bullet points), and `<li>` (list item) elements can contain links and buttons. 

The nice thing about lists is that some screen readers will read out how many items there are, so the user knows how long to keep tabbing through

> list, 5 items
> 
> Sport, 4 of 5
### Checkboxes 
VoiceOver reads out the "checkboxes" as plain text, leaving you with no idea you can even click them. 

> Chocolate chip 

It's super annoying that you can't style the default checkbox in browsers, but there are ways around it that still let you use `<input type="checkbox">`. The same goes for radio buttons. I recommend [Sara Soueidan's guide to inclusively hiding & styling checkboxes and radio buttons](https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/). 

If we put the input back in, we get a much more helpful readout:

> Chocolate chip, unticked, checkbox
### Buttons 
The "buttons" - `<div>` elements with added `onclick` attributes - are recognised as "Clickable" by Voiceover. But if I'm navigating through the page using only the keyboard, I can't select one because the browser doesn't know it's a button. 

Sure, we *could* go adding a `tabindex` attribute to these buttons to make them tabbable, but then you run the risk of messing up the tabbing order of the document. The best solution is to **use a `<button>` element**. That's what it's for, and you can style it pretty much any way you like using CSS. You can even [make a button look like a link, and vice versa](https://codepen.io/sophiekoonin/pen/oNZdebX), which is something I do a lot when building a website to a design spec.

### Headings
We've got three H1 elements on the page: the site name, the article headline, and the cookie banner. A site should only ever have one `<h1>` element - it's the main heading that tells you what the page is about. Any other headings should be nested underneath, or possibly not even headings at all (in the case of "The Woofer Times", this doesn't need to be an actual heading).

There's a subheading within the article which is simply bold text. That should be a lower-level nested heading, in this case an `<h2>`. 

Screenreaders allow users to navigate by headings, so it's important they're in a logical order.

If you want big text, style it with CSS rather than relying on the browser default size of heading elements.

### Bold and italic text
The byline and the image caption are displayed in italics using the `<em>` tag (`<i>` is deprecated in HTML5). However, screen readers may actually read this out differently because they expect the `<em>` tag to signal **emphasis** - that's what `em` means. So the tone of voice might change as it's being read out, with additional stress. The italics in the byline and caption are a stylistic choice, so we should italicise it with CSS rather than `<em>`.

The same goes for any bold text - `<b>` indicates importance and may also result in the screenreader voice changing when read out.

Somewhat confusingly, both `<strong>` and `<b>` are used in slightly different situations despite both rendering as bold text in browsers - `<strong>` "indicates that its contents have strong importance, seriousness, or urgency" ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)), where as `<b>` is used to draw attention without the importance.

### Image caption
It's clear to sighted users that the text under the image is a caption, but not to screen readers - there's nothing associating the two at all.

We can fix that by wrapping the image in a `<figure>` element, then adding a `<figcaption>` underneath the image. 

VoiceOver says:
> "The most angery pupper I have ever seen" Photo: Alex Russell-Saw, figure

before then reading out the image information:
> a lovely fluffy samoyed, image
## You can still use `div`s!
As I demonstrated above, `<div>` elements can be extremely misused. That's not to say you shouldn't use them *at all*: on the contrary. But you should only use them for their intended purpose: entirely meaningless containers. I use them to group elements together which I then style with CSS. Or I'll wrap the entire page in a `<div>` and make it into a flex container for my `<header>`, `<main>` and `<footer>`. `<div>`s are great, as long as you don't use them in place of more meaningful elements.

You can use the Dev Tools inspector on this very website and see the way I've used `<div>`s presentationally: for example, all the stars in the header are divs which are totally hidden from screenreaders, because they're entirely decorative.
## The same news site, with semantic tags

I've recreated the same site using semantic HTML tags, and it looks pretty much exactly the same (save some different margins here and there that are easy enough to fix). 

{{< snippet title="Semantic HTML blog post example: semantic HTML" id="yLMjMgQ" >}}

Here are the main differences:
* the page is broken up into `<header>`, `<main>` and `<footer>`, with an `<article>` round the main page content
* there is only one `<h1>` on the page, because it signifies the main heading that tells you what the page is about
* the "Accept all" and "Close" buttons are actual `<button>` elements
* the checkboxes are `<input type="checkbox">`
* the menu links are in an unordered list, `<ul>`
* the subheadings in the article are now `<h2>` (the first level of nesting under the main heading)
* the byline and caption are styled italic through CSS, rather than `<em>` tags
* I've used a `<figure>` for the image, with a `<figcaption>` for the caption to indicate it's a caption for that image

## Discover more semantic tags
I've put together this semantic HTML showcase on Codepen which shows off the most common tags, and what they're useful for.
