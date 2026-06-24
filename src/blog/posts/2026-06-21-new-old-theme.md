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

## Introducing Temporal 
For the uninitiated, Temporal is a solution to the objectively terrible Date API in JavaScript. Date was based on Java's Date library, which was also objectively terrible and has long been deprecated. 

It's always really confusing that `Date` instances show either local or UTC time depending on which function you use to display them, and date operations are so fiddly that most of us turn to third party libraries. 

Temporal massively simplifies the API, introducing some new concepts:
- `PlainDateTime`: a date and time with no timezone (TZ) 
- `PlainDate`: a date with no time information and no TZ
- `PlainTime`: a time with no date information and no TZ
- `ZonedDateTime`: a date and time in a specified TZ

`PlainTime` came in useful for this project, as we don't really care what the day is - only what time it is, so we know what colours to show.

### Getting the user's local time
The first thing to do was figure out the time according to the user's browser. 
The [`Temporal.Now` namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Now) has various methods for interacting with the current time, including `plainTimeISO()` which by default gives us a `PlainTime` in local time. (You can also pass in a time zone to get a zoned time.)


```js
const timeNow = Temporal.Now.plainTimeISO();
```

Now we need to know when to show the different colours.

## Defining the stages
The day is split into four stages: sunrise, daytime, sunset and night. Daytime and night are long - 11.5 hours each - whereas sunrise and sunset each last 90 minutes. 

The background of the page has a two-colour gradient:
```css
  --background: fixed linear-gradient(var(--bg-gradient-top), var(--bg-gradient-mid) 80%);

```
The footer has an additional colour that's created with a linear gradient from transparent `oklch(0 0 0 / 0)` to the chosen third colour. 

```css
    background: linear-gradient(oklch(0 0 0 / 0) 40%, var(--bg-gradient-bottom));
```

This means the last colour sticks to the bottom of the page rather than stretching across the viewport height (it's hard to control even when you specify a percentage in the gradient). It also gives more of a glow that really looks like the sun rising/setting or the glow of the city, which I love.

I defined an object for the stages and colours:
```js
const stages = {
  sunrise: {
    start: Temporal.PlainTime.from("06:30:00"),
    next: "day",
    color1: "oklch(0.618 0.3157 265.76)",
    color2: "oklch(0.8867 0.1222 328.24)",
    color3: "oklch(0.9529 0.1222 106.94)",
  },
  day: {
    start: Temporal.PlainTime.from("08:00:00"),
    next: "sunset",
    color1: "oklch(58% 0.15433 300)",
    color2: "oklch(85% 0.22133 302)",
    color3: "oklch(98 0.22133 302)",
  },
  sunset: {
    start: Temporal.PlainTime.from("19:30:00"),
    next: "night",
    color1: "oklch(0.6933 0.1899 297.53)",
    color2: "oklch(75.504% 0.24612 357.26)",
    color3: "oklch(88.591% 0.1422 62.595)",
  },
  night: {
    start: Temporal.PlainTime.from("21:00:00"),
    next: "sunrise",
    color1: "oklch(25.27% 0.0919 276.73)",
    color2: "oklch(47.35% 0.284 283.78)",
    color3: "oklch(62.831% 0.23521 310.291)",
  },
};
```

CSS custom properties are easy to set via JS - you can use `root.style.setProperty`. 

When the page loads, I'm running a function that gets the user time and compares it to each of these start times to see where it fits.

Unlike `Date`, we don't have to do any complicated gymnastics to compare Temporal instances. There's literally a `compare` function on each type of instance. Just like with other JS comparison functions, it returns `1` if the first instance is greater than the second, `0` if the two instances are the same, and `-1` if the first instance is less than the second. 

```js
  const compare = Temporal.PlainTime.compare // extracted for brevity

  switch (true) {
    case compare(timeNow, stages.sunrise.start) < 0 || compare(timeNow, stages.night.start) >= 0: {
      currentStageName = "night";
      break;
    }
    case compare(timeNow, stages.sunrise.start) >= 0 && compare(timeNow, stages.day.start) < 0: {
      currentStageName = "sunrise";
      break;
    }
    case compare(timeNow, stages.day.start) >= 0 && compare(timeNow, stages.sunset.start) < 0: {
      currentStageName = "day";
      break;
    }
    case compare(timeNow, stages.sunset.start) >= 0 && compare(timeNow, stages.night.start) < 0: {
      currentStageName = "sunset";
      break;
    }
    default:
      break;
  }
```

Once we've got the stage name, we can look up the colours and set the custom property values. 

```js

  root.style.setProperty(
    "--bg-gradient-top",
    stages[currentStageName].color1,
  );
  root.style.setProperty(
    "--bg-gradient-mid",
    stages[currentStageName].color2,
  );

  root.style.setProperty(
    "--bg-gradient-bottom",
      stages[currentStageName].color3`,
  );
  ```

I'm also setting a data attribute on the root so we can do some additional stage-based customisations, such as showing the stars when it's night.
```js
root.setAttribute("data-time", currentStageName);
```

And that will give us our different gradient colours at different times of day!

And *then* I remembered that `color-mix` exists. Why restrict ourselves to just 4 times of day and 4 sets of colours, when we could make them transition into each other?

## Blending transitions with color-mix
`color-mix` is an extremely cool CSS function that lets you, well, mix two colours together. You tell it what colour space you're working with, and the colours, and the browser magically outputs the mix between the two. 

```css
background: color-mix(in oklch, color1, color2)
```
Much like with gradients, you can also specify a percentage value for the colours, which indicates the proportions of the colours. So I could gradually feed in a bit of the next stage's colour until the next stage took over completely. 

To get a percentage value for the next stage colour to feed in, I had to figure out how far through the current stage we were. 

First, I calculated the time until the next stage - super simple with the `until` function on `Temporal` instances:

```js
time1.until(time2)
```

This gives us a `Temporal.Duration` which represents a period between two time points. So, for example, if it's 7:45pm now and we're calculating `timeUntilNextStage`: 

```js
const timeUntilNextStage = timeNow.until(stages.night.start)

console.log(timeUntilNextStage.toString()) // PT1H15M

```

`Duration`s are stringified (and specified) using the ISO 8601 duration format, so "PT2H15M" stands for "period, time, 1 hour, 15 minutes". If the duration had any date information in it, it'd appear before the `T`. 

Once we've got the duration representing time until the next stage, we need to know the duration between the start of the current stage and the start of the next stage - let's call it the transition duration. For sunset-night and sunrise-day, the transition duration is always 90 minutes; for night-sunrise and day-sunset, it'd be 11.5 hours. I didn't want the colour mixing to happen all throughout the day, only around sunrise/sunset like in real life, so I just decided to hardcode the transition duration for day and night to be 90 minutes so it matches the other two. 

So for that, I can instantiate a `Duration` using the same ISO 8601 syntax:

```js
const entireTransitionDuration = Temporal.Duration.from("PT1H30M")
```

## Polyfilling Temporal for Safari
Alas, Safari is behind the times (/doesn't want to commit to a not-yet-official API, even though it's *basically* final). We love progressive enhancement, and of course I could have just removed any of the transition logic for people whose browsers don't support Temporal, but that's no fun. They deserve sunsets too!

Writing a shim for Temporal was also no fun, but I did it because I love you. 

There are various Temporal polyfills around and about, but I didn't want to end up importing a whole lot of extra JS when I only needed one or two functions. I'm not using any kind of bundler on this site - I use Eleventy to generate the pages, but scripts are just imported vanilla - so I couldn't import something with NPM and expect it to tree-shake any bits I wasn't using. It was a lot more lightweight to just write my own. 

To check for Temporal support, it's a matter of just checking if `window.Temporal?.PlainTime` is undefined:
```js
const supportsTemporal = typeof window.Temporal?.PlainTime !== "undefined";
```

I'm checking for `PlainTime` specifically as some browsers may have very high level Temporal implementations, but we can't do much without `PlainTime`. 

<!-- To get the user's time in a non-Temporal world, we can -->

To compare dates, we do it the old-fashioned way: comparing epoch timestamps. These represent the number of milliseconds since the Unix epoch, 01 Jan 1970. 

```js
export function jsDateCompare(date1, date2) {
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();
  if (date1Ms === date2Ms) return 0;
  return date1Ms < date2Ms ? -1 : 1;
}
```

Then, we can just assign whichever version of the function we need:
```js
const compare = supportsTemporal ? Temporal.PlainTime.compare : jsDateCompare;
```
