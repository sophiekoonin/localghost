---
title: "A new old theme featuring Temporal and color-mix"
date: 2026-06-21
draft: true
tags: ["site"]
---

I've given my website a bit of a refresh with a slightly updated layout if you're on desktop. The <a href="https://localghost.dev?theme=vaporwave" target="_new">Vaporwave theme</a> also has a newly jazzed-up nav bar with some adorable little icons. But the biggest change is to the city theme, which was previously a starry-sky dark mode theme.

If you're reading this between the hours of 9pm and 6:30am, you're probably wondering what all the fuss is about - it looks pretty much the same. That's because the theme changes depending on the time of day! 

<div class="image-grid">
<img alt="A screenshot of the sunrise version of this layout, with pixel art skyscrapers at the bottom. The background is a blue to pink to light orange gradient" src="/img/blog/new-city-theme/sunrise-screenshot.png"><img alt="A screenshot of the daytime version of this layout, with pixel art skyscrapers at the bottom. The background is a purple to pink gradient" src="/img/blog/new-city-theme/day-screenshot.png"><img alt="A screenshot of the sunset version of this layout, with pixel art skyscrapers at the bottom. The background is a purple to pink to orange gradient" src="/img/blog/new-city-theme/sunset-screenshot.png"><img alt="A screenshot of the nighttime version of this layout, with pixel art skyscrapers at the bottom. There are pixel art stars in the header and the theme is now dark mode. The background is a dark blue to light blue to purple gradient" src="/img/blog/new-city-theme/night-screenshot.png">
</div>

I was going to just turn the layout into a pastel lo-fi-aesthetic thing, but then I realised that a) I needed *some* kind of dark mode and b) I'd miss the stars! So I thought... why not both? And why stop at just night and day? ([Alistair Shepherd](https://alistairshepherd.me) did something similar with his beautiful Firewatch-themed website.)

Then I remembered that the Temporal API was available experimentally in Chrome and Firefox, and I'd wanted an excuse to try it opportunity.

And *then* I remembered that `color-mix` exists. Why restrict ourselves to just 4 times of day and 4 sets of colours?

So, the brief:
- the colours should change according to the reader's local time
- the colours should transition smoothly into each other throughout the day 

## Defining the stages
The day is split into four stages: sunrise, daytime, sunset and night. Daytime and night are long - 11.5 hours each - whereas sunrise and sunset each last 90 minutes. 

The background of the page has a two-colour gradient:
```
  --background: fixed linear-gradient(var(--bg-gradient-top), var(--bg-gradient-mid) 80%);

```
The footer has an additional colour that's created with a linear gradient from transparent `hsla(0,0,0,0)` to the chosen third colour. This means the last colour sticks to the bottom of the page rather than stretching across the viewport height (it's hard to control even when you specify a percentage in the gradient). It also gives more of a glow that really looks like the sun rising/setting or the glow of the city, which I love.

## Using Temporal 
For the uninitiated, Temporal is a solution to the objectively terrible Date API in JavaScript. Date was based on Java's Date library, which was also objectively terrible and has long been deprecated. 

It's always really fiddly to figure out if your `Date` objects are showing local or zoned time, and date operations are so fiddly that most of us turn to third party libraries. 

Temporal massively simplifies the API, introducing some new concepts:
- `PlainDateTime`: a date and time with no timezone (TZ) 
- `PlainDate`: a date with no time information and no TZ
- `PlainTime`: a time with no date information and no TZ
- `ZonedDateTime`: a date and time in a specified TZ

`PlainTime` came in useful for this project, as we don't really care what the day is - only what time it is, so we know what colours to show.
