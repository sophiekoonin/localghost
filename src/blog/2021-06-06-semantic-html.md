---
date: 2021-06-06
excerptText: "Whether you write plain old HTML, HTML templating or JSX, are you using the right HTML tags? A guide to semantic HTML: what it is, why it's so important, and how to use it"
tags: 
- "html"
- "accessibility"
title: "The right tag for the job: why you should use semantic HTML"
aliases: 
- '/2021/06/the-right-tag-for-the-job-why-you-should-use-semantic-html/'
---

I've come across a lot of websites in my career (and in daily browsing) that are straight-up inaccessible. If you've ever worked on a project that is riddled with accessibility issues, you'll know that fixing these problems is a mammoth task - it needs _time_, it needs _people_, it needs *prioritisation*... it costs money, basically. As I mentioned in my blog post [7 myths designers and developers believe about web accessibility](https://localghost.dev/2020/10/7-myths-designers-and-developers-believe-about-web-accessibility/), retrofitting accessibility is *hard*.

The key is to *start out* with the right tools for the job - or rather, the right _tags_ for the job. In every website, underneath the layers of CSS, the bloated frameworks, the 45945 API calls, there's good old HTML, and that's the key to accessible websites. Specifically, <b>semantic HTML</b>.

## Semantic HTML conveys meaning

Semantics is the study of meaning, and semantic HTML is exactly that - HTML tags that convey meaning. They tell the browser - and assistive technology such as screenreaders - about the structure of the page, and how it should behave when you interact with those elements. A button should let you click on it. An ordered list should have numbers. 

Sighted people rely on visual information to tell them about the structure of a page. Based on our prior knowledge of UI conventions, we can identify where a header is, which parts of the page are buttons or form elements, and what the title of the page is, for example. But if you don't get that visual information, how can you tell what's on the page?

Assistive technology such as screenreaders will take the HTML markup of the page and present it to the user either by reading it out audibly, or sending the output to something like a [braille display](https://en.wikipedia.org/wiki/Refreshable_braille_display). They'll use the different types of HTML tags in the document to present structured information to the user, allowing them to navigate by headings, or cycle through the links in the page.  So it matters what HTML tags we use, to make sure the screenreaders get the complete picture.

## Example: a non-semantic news site

Take this mocked-up news site (as you can see, graphic design is my passion). I've built it using mostly `<div>` elements, with a couple of `<h1>`s as I wanted some nice big headings. My menu at the top is a series of `<div>`s containing links, and the footer at the bottom is the same. 

{% codepen "jOBxyVB", "Semantic HTML blog post example: no semantics", "sophiekoonin" %}

If you're a sighted user like me, it looks perfectly fine. I can see a menu, a header, some titles and a footer. The byline and image caption is nicely italicised, and there are some nice buttons and fancy SVG checkboxes on the cookie banner.

But let's take a look at this page from the perspective of assistive tech, which relies on the underlying HTML markup to establish the structure of the document. I'm using the screenreader software [VoiceOver](https://support.apple.com/en-gb/guide/voiceover/welcome/mac), which is built into MacOS, but if you're on Windows you can use [NVDA](https://www.nvaccess.org/download/) which is free to download.

### Landmarks
Screenreader software such as VoiceOver, JAWS and NVDA provides a way for users to navigate to different sections on the page based on <b>landmarks</b>. So, you could skip directly to the footer, or directly to the main part of the site. This relies on these landmarks being signposted through semantic tags such as `<header>`,`<main>` and `<footer>`. We haven't used any of these tags in the example, so screen readers wouldn't be able to identify any landmarks.

When I run VoiceOver and press Ctrl+Option+Shift+I to tell me about the page, it says:

> Page contains 14 links 2 headings 

When I properly mark up the header, footer and main sections of the page, with an `<article>` around the content of the news article itself, VoiceOver allows me to navigate between them with Ctrl+Option+right/left arrow.  It tells me:

> Page contains 14 links 2 headings 3 landmarks 1 article

### Menus
If a screenreader user is trying to find the menu in this news page, they're going to have to go through all the links on the page to try and find one that seems like it could be a menu link. The `<div>` wrapping the menu is completely ignored by the screenreader, so all they hear is each individual link.  There's nothing to tell them which part is the menu. People shouldn't have to tab through the page incessantly to find out how to navigate to a different part of the website.

Prior to HTML5, the best way to mark up menus with lists of links was an unordered list - `<ul>`. Now we have the `<nav>` tag, short for navigation.

```html
<nav>
  <ul class="menu">
    <li><a href="#">News</a></li>
    <li><a href="#">Politics</a></li>
    <li><a href="#">World</a></li>
    <li><a href="#">Sport</a></li>
    <li><a href="#">Tech</a></li>
  </ul>
</nav>
```

Technically, you don't have to have a list inside the `<nav>` - you can just put links in. I personally like to keep the list inside - the nice thing about lists is that some screen readers will read out how many items there are, so the user knows how long to keep tabbing through. It's also good for backwards compatibility in case any older screen readers don't understand `<nav>`.

Lists can be styled easily (including removing bullet points), and `<li>` (list item) elements can contain links and buttons. 

You can add `aria-label` attributes to your `<nav>` elements to give even more information about the purpose of the menu.

```html
<nav aria-label="main navigation">
```

Here's how VoiceOver interprets all of this:
> main navigation, navigation
> 
> list, 5 items
> 
> link, Sport, 4 of 5

Whether you use `<nav>` or not isn't a hard-and-fast rule. I noted that [gov.uk](https://gov.uk) (an example of amazing accessible design) doesn't actually use them at all, sticking with unordered lists. As long as you use one and/or the other, you'll be fine. 

As an aside, I recommend using the Dev Tools inspector to look through the source for gov.uk to see how they use ARIA attributes, as they use them very well. 

### Checkboxes 
These checkboxes aren't real checkboxes - they're `<div>` elements with CSS `:before` pseudoselectors containing an SVG checkbox icon. VoiceOver reads them out as plain text, leaving you with no idea you can even click them. 

> Chocolate chip 

It's super annoying that you can't style the default checkbox in browsers, but there are ways around it that still let you use `<input type="checkbox">`. The same goes for radio buttons. 

If we put the input back in and *visually* hide it (leaving the input element in the DOM), we get a much more helpful readout:

```html
 <label for="choc-chip">
  <input id="choc-chip" class="visually-hidden" type="checkbox" />
  <div class="pretty-checkbox" aria-hidden="true"></div> Chocolate chip
</label>
```

(NB. you could even just have the actual SVG inline here)

> Chocolate chip, unticked, checkbox

We hide the "pretty" checkbox from screen readers, because they will pick up the `<input>`.

The input itself has a CSS class of `"visually-hidden"`, which looks like this:

```css
.visually-hidden {
  display: block;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(1px);
  white-space: nowrap;
  position: absolute;
}
```

We can't simply use `visibility: hidden` or `display: none` as these attributes actually apply to screenreaders as well. Anything hidden that way will also be hidden to screenreaders. This `visually-hidden` class makes sure that elements with this styling are invisible to sighted users, but still visible to assistive tech.

For more information on this approach, check out [Sara Soueidan's guide to inclusively hiding & styling checkboxes and radio buttons](https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/). 

For even more semantic goodness, we can now wrap our checkboxes in a `<fieldset>`, which groups together related form-fields. We can then attach the "Which of these cookies can we use?" text to the fieldset by making it a `<legend>`:

```html
<fieldset>
  <legend>Which of these cookies can we use?</legend>
    <label for="choc-chip">
      <input id="choc-chip" type="checkbox" />
      <div class="pretty-checkbox" aria-hidden="true"></div> Chocolate chip
    </label>
    <label for="oatmeal-raisin">
      <input id="oatmeal-raisin" type="checkbox"/>
      <div class="pretty-checkbox"></div> Oatmeal &amp; raisin
    </label>
</fieldset>
```

VoiceOver:
> Which of these cookies can we use?, group

### Buttons 
The "buttons" - actually `<div>` elements with added `onclick` attributes - are recognised as "Clickable" by Voiceover. Not all screenreader software is able to identify clickable elements in this way. 

> Accept all, clickable

However, if I'm navigating through the page using only the keyboard, I can't select one because the browser doesn't know it's a button. 

Sure, we *could* go adding a `tabindex` attribute to these buttons to make them tabbable, but then you run the risk of messing up the natural tabbing order of the document. The best solution is to **use a `<button>` element**. That's what it's for, and you can style it pretty much any way you like using CSS. You can even [make a button look like a link, and vice versa](https://codepen.io/sophiekoonin/pen/oNZdebX), which is something I do a lot when building a website to a design spec.

```css
  .button {
    cursor: pointer;
    display: flex;
    border: 0;
    box-shadow: none;
    border-radius: 6px;
    font-weight: bold;
    font-size: 1rem;
    margin: auto 0;
    justify-content: center;
    align-items: center;
    padding: 0.8rem 1rem;
    color: white;
    background-color: #420a55;
  }
  .button:hover {
    background: #8d6c99;
  }
```

> Accept all, button
>  
> You are currently on a button... to click this button, press Ctrl+Option+Space.
### Headings
We've got three H1 elements on the page: the site name, the article headline, and the cookie banner. A site should only ever have one `<h1>` element - it's the main heading that tells you what the page is about. Any other headings should be nested underneath, or possibly not even headings at all (in the case of "The Woofer Times", this doesn't need to be an actual heading).

There's a subheading within the article which is simply bold text. That should be a lower-level nested heading, in this case an `<h2>`. 

Screenreaders allow users to navigate by headings, so it's important they're in a logical order.

If you want big text, style it with CSS rather than relying on the browser default size of heading elements.

### Bold and italic text
The byline and the image caption are displayed in italics using the `<em>` tag. However, screen readers may actually read this out differently because they expect the `<em>` tag to signal <b>emphasis</b> - that's what `em` means. So the tone of voice might change as it's being read out, with additional stress. The italics in the byline and caption are a stylistic choice, so we should italicise it with CSS rather than `<em>`.

The `<i>` tag still exists alongside the `<em>` tag, but represents text that stands out from the rest of the body, such as scientific names, thoughts, technical terms and idiomatic terms from other languages:

```html
The red fox, <i>Vulpes vulpes</i>, is commonly found... 
It was a case of <i lang="fr">déjà vu</i>.
<i>Sure</i>, she thought, <i>that must be it</i>.

I <em>really</em> don't like this book.
Do it <em>now</em>!
No, <em>I'm</em> Spartacus.
```

The same goes for any bold text - `<b>` indicates significance or keywords and may also result in the screenreader voice changing when read out, so use CSS if the effect is purely presentational.

Somewhat confusingly, both `<strong>` and `<b>` are used in slightly different situations despite both rendering as bold text in browsers - `<strong>` "indicates that its contents have strong importance, seriousness, or urgency" ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)), where as `<b>` is used to draw attention without the urgency (e.g. for relevant terms in a blog post like this one).

```html
I won't tell you again, <strong>do not disconnect the fire alarm</strong>.

This is known as <b>semantic HTML</b>.
```

NB. Frustratingly, Markdown doesn't seem to distinguish between these elements, so everything is `<strong>` or `<em>`.  If you want to use `<b>` or `<i>` you'll have to add them in as HTML within your Markdown.

### Image caption
It's clear to sighted users that the text under the image is a caption, but not to screen readers - there's nothing associating the two at all.

We can fix that by wrapping the image in a `<figure>` element, then adding a `<figcaption>` underneath the image. 

```html
 <figure class="image">
  <img alt="a lovely fluffy samoyed" src="https://codepen-assets.s3.eu-west-2.amazonaws.com/alex-russell-saw-Dj8cxyi9ink-unsplash-1.jpg" />
    <figcaption class="caption">"The most angery pupper I have ever seen" Photo: <a href="https://unsplash.com/@alexrussellsaw">Alex Russell-Saw</a>
  </figcaption>
</figure>
```

VoiceOver says:
> "The most angery pupper I have ever seen" Photo: Alex Russell-Saw, figure

before then reading out the image information:
> a lovely fluffy samoyed, image
## You can still use `div`s!
As I demonstrated above, `<div>` elements can be extremely misused. That's not to say you shouldn't use them *at all*: on the contrary. But you should only use them for their intended purpose: entirely meaningless containers. I use them to group elements together which I then style with CSS. Or I'll wrap the entire page in a `<div>` and make it into a flex container for my `<header>`, `<main>` and `<footer>`. `<div>`s are great, as long as you don't use them in place of more meaningful elements.

You can use the Dev Tools inspector on this very website and see the way I've used `<div>`s presentationally: for example, all the stars in the header are divs which are totally hidden from screenreaders, because they're entirely decorative.
## The same news site, with semantic tags

I've recreated the same site using semantic HTML tags, and it looks pretty much exactly the same (save some different margins here and there that are easy enough to fix). 

{% codepen "yLMjMgQ", "Semantic HTML blog post example: semantic HTML", "sophiekoonin" %}

**There is still a lot of room for improvement**. ARIA attributes come into play here, to add extra information about the roles of each part of the page. I'm just illustrating the semantic elements in this example.

Here are the main differences:
* the page is broken up into `<header>`, `<main>` and `<footer>`, with an `<article>` round the main page content
* there is only one `<h1>` on the page, because it signifies the main heading that tells you what the page is about
* the "Accept all" and "Close" buttons are actual `<button>` elements
* the checkboxes are `<input type="checkbox">`, with `<label>`s on each one
  * they're also inside a `<fieldset>` with a `<legend>` explaining what the checkboxes are for
* the menu links are in an unordered list, `<ul>`, wrapped in a `<nav>`
* the subheadings in the article are now `<h2>` (the first level of nesting under the main heading)
* the byline and caption are styled italic through CSS, rather than `<em>` tags
* I've used a `<figure>` for the image, with a `<figcaption>` for the caption to indicate it's a caption for that image

## Semantics from the start = accessibility from the start
Using semantic HTML as building blocks for a website will give you a lovely accessible foundation upon which to add your fancy CSS and whizzy JavaScript. You can use semantic elements in JS frameworks, too - I write React every day at work, and always use semantic elements. Your users (and/or your customers) will thank you for it. 

## Find out more about semantic HTML
* [MDN: HTML Elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) - with explanations of each element's purpose
* [Semantic HTML cheat sheet](https://learn-the-web.algonquindesign.ca/topics/html-semantics-cheat-sheet)
