+++
date = 2021-06-04T23:00:00Z
draft = true
summary = ""
tags = ["html", "accessibility"]
title = "The right tag for the job: why you should use semantic HTML"

+++
I've come across a lot of websites in my career (and in daily browsing) that are straight-up inaccessible. If you've ever worked on a project that is riddled with accessibility issues, you'll know that fixing these problems is a mammoth task, requiring _time_, _people, prioritisation..._ it costs money, basically. As I mentioned in my blog post [7 myths designers and developers believe about web accessibility](https://localghost.dev/2020/10/7-myths-designers-and-developers-believe-about-web-accessibility/), retrofitting accessibility is hard.

The key is to start out with the right tools for the job - or rather, the right _tags_ for the job. In every website, underneath the layers of CSS, the bloated frameworks, the 45945 API calls, there's good old HTML, and that's the key to accessible websites.

Semantics is the study of meaning, and semantic HTML is exactly that - HTML tags that convey meaning. They tell the browser - and assistive technology such as screenreaders - about the structure of the page, and how it should behave when you interact with those elements. A button should let you click on it. An ordered list should have numbers. 