---
title: '7 myths designers and developers believe about web accessibility'
date: '2020-10-11'
tags: 
  - 'design'
  - 'accessibility'
---

In an ideal world, being "good at accessibility" wouldn't make you stand out from the crowd. Companies wouldn't be hiring accessibility experts to help them unpick and untangle the inaccessible products they've been building for years. Speaking about web accessibility at a conference would be as unnecessary as getting up on stage and giving a talk on how to write HTML.

But we don't live in that world, and the web is full of inaccessible websites. Try navigating the [Liberty London](https://libertylondon.com) website with just your keyboard - can you add something to your basket?

I want to bust a few myths that I've come across over the years, in the hope that accessibility will stop being something to "deal with later" and start being something that people think about from the start.

## Myth 1: The majority of your users don't have access needs

Repeat after me: there's no such thing as a "typical" or "normal" user.

When we're designing and building websites or apps, it's all too easy to forget that we are coming from a narrow perspective. My own abilities, experiences and knowledge shape how I interact with a website, and my experience may be totally different from yours. So even if you know instinctively that a particular icon means "download", others might not make that connection.

{{< figure caption="Is this how you see your users?" >}}
{{< img class="inset-image" src="*/spiderman-point.jpg"  alt="Spiderman pointing at himself" >}}
{{</ figure >}}

Microsoft's brilliant [Inclusive Design Toolkit](https://www.microsoft.com/design/inclusive/) warns of the consequences of this selective thinking:

> “If we use our own abilities and biases as a starting point, we end up with products designed for people of a specific gender, age, language ability, tech literacy, and physical ability. Those with specific access to money, time, and a social network.”

As a non-disabled, computer-literate developer with a Macbook and fibre internet, I need to make sure I'm not only building apps for people like me. All my users will have different requirements, different technology and different backgrounds. As the Inclusive Design Toolkit puts it:

> “When it comes to people, there’s no such thing as “normal.” The interactions we design with technology depend heavily on what we can see, hear, say, and touch. Assuming all those senses and abilities are fully enabled all the time creates the potential to ignore much of the range of humanity."

## Myth 2: Accessibility is optional

It's actually the law, in both the UK and the USA (I can't speak for other countries, but I'd be keen to hear from anyone who knows about any legislation in other places).

In the UK, The Equality Act 2010 makes it illegal to discriminate against people with disabilities - and that includes by accident! It doesn’t explicitly refer to websites, but the Equality and Human Rights Commission’s (EHRC) Code of Practice does list websites as one of the services to the public that should be considered covered by the Equality Act.

According to the EHRC, an organisation "is responsible for ensuring that reasonable adjustments have been made where needed, for example by changing the size of the font, to ensure that disabled users are able to get the information, without being placed at a substantial disadvantage (even if the [organization] employs an external organisation to build and maintain its website)."

The EHRC may:

- Conduct formal investigations
- Serve non-discrimination notices
- Act over persistent discrimination
- Issue [Codes of Practice](https://www.equalityhumanrights.com/sites/default/files/employercode.pdf)
- Help someone prosecute a company - this requires someone to actually sue the company, which there's no case law for at the moment - but that could change any time.

In the US, there's the Americans with Disabilities Act (ADA). Famously, [Domino's Pizza was sued](https://www.bbc.co.uk/news/technology-46894463) by a blind person who couldn't use the website with a screenreader. According to US law firm [Seyfarth](https://www.adatitleiii.com/2020/04/the-curve-has-flattened-for-federal-website-accessibility-lawsuits/), in 2019 there were 2,256 web accessibility lawsuits filed.

## Myth 3: Access needs come from permanent disabilities

The truth is, anyone at any time can have access needs, and they can be permanent, temporary or situational. Temporary impairments might be due to a medical condition, and situational impairments may result from the environment around us - a situation we're in.

Some examples of permanent conditions:

- partial or full blindness
- having a limb amputated
- learning difficulties, such as dyslexia

A temporary impairment could be:

- visual aura from a migraine
- repetitive strain injury making it difficult to use a mouse
- cognitive processing difficulties (also known as brain fog) following an illness

Situational impairments might include:

- a bright light causing glare on the screen
- loud noise, making it difficult to concentrate
- slow internet

Even if you consider yourself not to have any form of disability, you could find yourself with a temporary or situational impairment at any point.

Often when developers _do_ think about accessibilty, they think of screen readers and people with visual impairments. That's a start, but there’s a spectrum of what constitutes disability. The important thing to note is that it doesn’t necessarily translate to some kind of personal health condition.

According to the World Health Organisation:

> “Disability is not just a health problem. It is a complex phenomenon, reflecting the interaction between features of a person’s body and features of the society in which [they live]."

So much of the world around us can influence whether or not we have, or consider ourselves to have, a disability. Summed up perfectly in this Tweet by [Amanda Leduc](https://twitter.com/amandaleduc/status/1300083052710899712):

{{<tweet user="amandaleduc" id="1300083052710899712" >}}

## Myth 4: Accessibility is a barrier to good design

I've heard this one a lot. And as a web developer I feel like I’m often turning around to designers and saying “Sorry, I can’t do that, because it’s not accessible”. (The best designers will then turn around and say, "okay, let's find something that works better.")

It’s easy to imagine that in order for design to be truly accessible you have to build sites that look like the [first-ever web page](http://info.cern.ch/hypertext/WWW/TheProject.html), but that’s not the case.

{{< img class="inset-image" src="*/accessible-web-page.png"  alt="A screenshot of the first ever web page on cern.ch: white background, black text, blue hyperlinks, no styling whatsoever." caption="Is this... accessible design?" >}}

The reality is that accessible design _is_ good design - and vice versa.

When it comes down to it, can we really call a design good if it doesn’t work for everyone? You can build the sleekest, prettiest user interface, but if someone who uses the keyboard to get around the internet can’t see what they’re doing, are we really going to call that good design?

As Jessie Hausler, the Director of Product Accessibility at Salesforce, wrote in his article _[7 Things Every Designer Needs to Know about Accessibility](https://medium.com/salesforce-ux/7-things-every-designer-needs-to-know-about-accessibility-64f105f0881b)_:

> “Accessibility will not force you to make a product that is ugly, boring, or cluttered. It will introduce a set of constraints to incorporate as you consider your design.”

If we can work within the constraints of the technology we're building for, or the constraints of what's in style, we can work within the constraints of accessible design.

## Myth 5: Accessibility is hard to implement

This one has a grain of truth in: accessibility can be difficult to implement _retrospectively_. If you've built an entire web app without considering accessibility, it can take a lot of time (and cost money) to go back and fix it up so that it's accessible.

But if you consider accessibility from the _start_, factoring it into your designs and the way you write your code, it doesn't have to be difficult. Accessibility by default is a lot easier than accessibility after the fact.

As web developers, by sticking to some best practices in HTML we're already halfway there:

- using semantic HTML elements such as `<article>` and `<nav>` to mark up the different parts of the document (I'll write more about this soon!)
- using `<button>` for buttons with `onclick` attributes, and `<a>` for links to different pages (and not adding `onclick` attributes to anything except buttons!)
- nesting headings correctly, from `h1` through to `h6` , with only one `h1` on the page
- keeping HTML tags for markup, and using CSS for style (rather than, say, using a `<h1>` tag because you want big text)

Many of the things that will help some groups of users with access needs will also benefit others: for example, good semantic HTML is great for screenreader users, but also helpful for keyboard or [adaptive switch](https://gettecla.com/blogs/news/introduction-to-assistive-switches) users, as with the right tags the browser knows what should be focusable and what shouldn't. Labels on forms make them easier to read and understand for people of all cognitive abilities, and they are good for screenreader users too.

Add an accessibility checklist to your JIRA tickets or pull request templates: make it part of your definition of done. Look out for best practices in your code reviews.

## Myth 6: React apps are inherently inaccessible

I seem to follow two camps of people on Twitter: people in the React community, and people who hate the React community. I am by no means a hardcore React stan (and I think the community can be as toxic as any popular programming language/framework community can be) but I use it every day at work and I think it's just as good as some of the alternatives out there.

One of the arguments against React that I hear most frequently is that React produces inaccessible websites which are `<div>`s all the way down. **It doesn't.** If React apps are a mess of un-semantic `<div>`s, it's because the developer put them there. The issue is not with the framework, but the lack of semantic HTML knowledge of the developers who use it: you can write any HTML you like in JSX.

Ultimately, screen readers tend to ignore `<div>` components, as they're generic containers. If we use semantic HTML elements for the actual content of the page, there shouldn't be a problem at all from a markup perspective.

React components can't return more than one element, so with older versions of React you had to wrap multiple elements in a container `<div>`. This would have added a few extra containers to the page. But the introduction of [React Fragments](https://reactjs.org/docs/fragments.html) solved that, and usually doesn't result in any additional elements being added to the DOM.

Another thing to watch out for is screen readers not alerting users when content on the page changes. This isn't a React problem specifically but a [single-page application (SPA) problem](https://codeburst.io/building-accessible-single-page-apps-2ea3e4fbbc01), and it can be solved with ARIA live regions. You'd still have this problem if you built your app in vanilla JavaScript.

Ideally, your SPA should also work with JavaScript turned off - with React we have tools like [Next.js](nextjs.org/) which produce isomorphic (server- and client-side) applications.

## Myth 7: Automated testing will catch all accessibility problems

People love to show off their Lighthouse scores, don't they?

{{< figure caption="Is it though?" >}}
{{< img class="inset-image" src="*/lighthouse-badges.png"  alt="A screenshot of a github repo that offers Lighthouse badges for your repository or website so you can brag about your site's awesome Lighthouse performance" >}}
{{</ figure >}}

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is an open-source automated testing tool that you can run as a Node module, from the CLI, from Chrome or as part of your CI checks. It checks for performance, accessibility, progressive web app performance, best practices and SEO. It's a great tool, but unfortunately it's often treated as a silver bullet. A high Lighthouse score is a good thing, but it doesn't mean that you've "done" accessibility - there are always things that Lighthouse won't be able to detect.

The best way to test accessibility is to approach it from all sides. Automated tooling such as Lighthouse or [axe](https://www.deque.com/axe/)) can and should be part of your development process, as it'll provide a quick feedback loop for common accessibility problems in your markup and CSS. But what these tools don't account for are things like the quirks of different screenreader software (and boy, do they have quirks), or the other kinds of assistive technology people will use to access your website. Lighthouse can't tell you whether your site is still legible when it's zoomed in 600%, or whether you can interact with the various parts of the app with a keyboard as you would with a mouse. The Accessibility in Government blog has a great article about [what they found when they tested automated tooling on the world's least accessible webpage](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/).

Before you merge your PR, check how your new feature behaves with screenreaders: Macs and iPhones come with [VoiceOver](https://www.apple.com/uk/accessibility/iphone/vision/), Android has [TalkBack](https://support.google.com/accessibility/android/answer/6283677?hl=en), Linux has [Orca](https://help.gnome.org/users/orca/stable/introduction.html.en), and you can download the open-source [NVDA](https://www.nvaccess.org/download/) screenreader for Windows. Does it read out everything it's supposed to? Is it reading out anything it's _not_ supposed to? Are the headings in the right order?

Ultimately, there’s no substitute for getting people with actual access needs to use the website or app. You can do some user testing, commission a formal audit, and/or make sure you have ways for users to give you feedback. Include disabled users in your UX research upfront, as well, so that you're building something accessible right from the start.

## It's your turn

If you encounter any of these myths, **you can (and should) challenge them**. A lot of the time, these myths stick around because accessibility just isn't being talked about. Be the one to bring it up, and get others on board too. Bake accessibility into your design systems and your ways of working.

## Resources & further reading

- [Microsoft Inclusive Design Toolkit](https://www.microsoft.com/design/inclusive/)
- [7 Things Every Designer Needs to Know about Accessibility - Jessie Hausler](https://medium.com/salesforce-ux/7-things-every-designer-needs-to-know-about-accessibility-64f105f0881b)
- [Deque - Accessible Design](https://www.deque.com/accessible-design/)
- [Deque - Accessible Development](https://www.deque.com/accessible-development/)
- [Marcy Sutton](https://marcysutton.com/) - blog posts and talks from an accessibility expert
- [What we found when we tested tools on the world's least accessible webpage](https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/) - Accessibility in Government Blog