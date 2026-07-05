---
title: "Links"
layout: 'page.njk'
---

Jump to:
[Projects](#projects)
[My favourite things on the web](#my-favourite-things-on-the-web)
[Useful things](#useful-things)
[Personal sites & blogs](#personal-sites--blogs)

## Projects

Some things I've built.

* [Emojinator](https://emojinator.localghost.dev) - drag & drop to create ridiculous emoji. The only limit is your imagination (and the assets I've been able to upload)
* [Virtual Piano](https://virtualpiano.vercel.app) - MIDI-enabled Web Audio API-powered virtual synthesizer that plays chords and scales
* [Tasting menu generator](https://tasting-menu.neocities.org) - Generate a 5-course tasting menu (ridiculous or not, you decide).

## My favourite things on the web

{% for l in delightful %}
* [{{l.title}}]({{l.link}}) - {{ l.description}}
{% endfor %}

## Useful things
{% for l in useful %}
* [{{l.title}}]({{l.link}}) - {{ l.description}}
{% endfor %}


## Personal sites & blogs

{% for l in blogroll %}
* [{{l.title}}]({{l.link}})
{% endfor %}
