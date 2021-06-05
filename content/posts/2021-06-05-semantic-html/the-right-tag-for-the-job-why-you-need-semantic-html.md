+++
date = 2021-06-04T23:00:00Z
draft = true
summary = ""
tags = ["html", "accessibility"]
title = "The right tag for the job: why you should use semantic HTML"

+++
I've come across a lot of websites in my career (and in daily browsing) that are straight-up inaccessible. If you've ever worked on a project that is riddled with accessibility issues, you'll know that fixing these problems is a mammoth task, requiring _time_, _people, prioritisation..._ it costs money, basically. As I mentioned in my blog post [7 myths designers and developers believe about web accessibility](https://localghost.dev/2020/10/7-myths-designers-and-developers-believe-about-web-accessibility/), retrofitting accessibility is hard.

The key is to start out with the right tools for the job - or rather, the right _tags_ for the job. In every website, underneath the layers of CSS, the bloated frameworks, the 45945 API calls, there's good old HTML, and that's the key to accessible websites. Specifically, _semantic HTML_.

## Introducing semantic HTML

Semantics is the study of meaning, and semantic HTML is exactly that - HTML tags that convey meaning. They tell the browser - and assistive technology such as screenreaders - about the structure of the page, and how it should behave when you interact with those elements. A button should let you click on it. An ordered list should have numbers. 

Sighted people rely on visual information to tell them about the structure of a page. Based on our prior knowledge of UI conventions, we can identify where a header is, which parts of the page are buttons or form elements, and what the title of the page is, for example. But if you don't get that visual information, how can you tell what's on the page?

Assistive technology such as screenreaders will take the HTML markup of the page and present it to the user either by reading it out audibly, or sending the output to something like a [braille display](https://en.wikipedia.org/wiki/Refreshable_braille_display). They'll use the different types of HTML tags in the document to present structured information to the user, allowing them to navigate by headings, or cycle through the links in the page. 

## The problem with `div`s

Take this mocked-up news site (as you can see, graphic design is my passion). 