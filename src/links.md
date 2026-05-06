---
title: "Links & blogroll"
layout: 'page.njk'
---

## Lovely things

* [The Yesterweb](https://yesterweb.org) - A monument to everything I love(d) about the internet, and a movement to reclaim that lost creativity and independence. I've tried to encompass some of that spirit in this website. They publish a zine which is a delight to read.
* [The Useless Web](https://theuselessweb.com) - remember when the internet was pointless?

## Useful things
* [omg.lol](https://home.omg.lol/referred-by/sophie) - a cute set of tools including a homepage (yourname.omg.lol), email (yourname@omg.lol) forwarding, pastebin (paste.lol), url shortener (url.lol) and Mastodon instance (social.lol).
* [Neocities](https://neocities.org/) - a free web host supporting creative personal websites
* [CSS Utopia](https://utopia.fyi/) - generate type and spacing scales without breakpoints
* [Modern CSS](https://moderncss.dev/) - modern CSS solutions for old problems
* [Every Layout](https://every-layout.dev) - loads of excellent layout primitives, and not a breakpoint in sight.
* [Tiny Helpers](https://tiny-helpers.dev/) - little tools for web developers
* [Compute Cuter](https://computecuter.com) - how to make your computer as cute as can be!

## Blogroll
<ul>
{% for item in blogroll %}
<li><a href="{{ item.url }}">{{item.name}}</a></li>
{% endfor %}
</ul>
