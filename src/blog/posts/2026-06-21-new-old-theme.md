---
title: "Creating background colour transitions with Temporal and color-mix"
date: 2026-06-21
draft: true
tags: ["site"]
excerptText: "A visual refresh with a background that changes colour according to the time of day, using the new Temporal API."
---

I've given my website a bit of a refresh! There's a slightly updated layout if you're on desktop, plus I ditched the `etc` page and I've revamped my [links page](/links) to be powered by [raindrop.io](https://raindrop.io). The [minimalist theme](?theme=minimalist) is still minimalist, but a bit more fancy. The [vaporwave theme](?theme=vaporwave) has a newly jazzed-up nav bar with some adorable little icons. But the biggest change is to the [city theme](?theme=city), which was previously a starry-sky dark mode theme.

If you're reading this between the hours of 9pm - 5am, you might be wondering what all the fuss is about - it looks pretty much the same as it did before. That's because the theme changes depending on the time of day! 

<div class="image-grid">
<img alt="A screenshot of the sunrise version of this layout, with pixel art skyscrapers at the bottom. The background is a blue to pink to light orange gradient" src="/img/blog/new-city-theme/sunrise-screenshot.png"><img alt="A screenshot of the daytime version of this layout, with pixel art skyscrapers at the bottom. The background is a purple to pink gradient" src="/img/blog/new-city-theme/day-screenshot.png"><img alt="A screenshot of the sunset version of this layout, with pixel art skyscrapers at the bottom. The background is a purple to pink to orange gradient" src="/img/blog/new-city-theme/sunset-screenshot.png"><img alt="A screenshot of the nighttime version of this layout, with pixel art skyscrapers at the bottom. There are pixel art stars in the header and the theme is now dark mode. The background is a dark blue to light blue to purple gradient" src="/img/blog/new-city-theme/night-screenshot.png">
</div>

You can select the time of day using the picker in the top right, after the theme switcher. Note that your selection won't be persisted between pages (unlike theme choice) as I wanted to make sure it didn't get stuck if you come back at a later date. 

I was going to just turn the layout into a pastel lo-fi-aesthetic thing, but then I realised that a) I needed *some* kind of dark mode and b) I'd miss the stars! So I thought... why not both? And why stop at just night and day? (Hat tip to [Alistair Shepherd](https://alistairshepherd.uk/) who did something similar with his beautiful Firewatch-inspired website.)

Then I remembered that the Temporal API was available experimentally in Chrome and Firefox, and I'd been looking for an excuse to try it out.

## Introducing Temporal 
For the uninitiated, Temporal is a solution to the objectively terrible Date API in JavaScript. Date was based on Java's Date library, which was also objectively terrible and has long been deprecated. 

It's always really confusing that `Date` instances show either local or UTC time depending on which function you use to display them, and date operations are so fiddly that most of us turn to third party libraries like `date-fns` or `luxon`. 

Temporal massively simplifies the API, introducing some new concepts:
- `PlainDateTime`: a date and time with no timezone (TZ) 
- `PlainDate`: a date with no time information and no TZ
- `PlainTime`: a time with no date information and no TZ
- `ZonedDateTime`: a date and time in a specified TZ

`PlainTime` came in useful for this project, as we don't really care what the day is - only what time it is, so we know what colours to show.

### Getting the user's local time
The first thing to do was figure out the time according to the user's browser. 
The `Temporal.Now` [namespace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Now) has various methods for interacting with the current time, including `plainTimeISO()` which by default gives us a `PlainTime` in local time. (You can also pass in a time zone to get a zoned time.)


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

CSS custom properties are easy to set via JS - you can use `root.style.setProperty`:
```js
 root.style.setProperty(
    "--bg-gradient-top",
    "oklch(25.27% 0.0919 276.73)",
  );
```

When the page loads, I'm running a function that gets the user time and compares it to each of these start times to see where it fits. I had to make my JS render-blocking, for my sins, as I needed to make sure it ran before the rest of the page rendered - otherwise you end up with flashes of unstyled content between page loads. Thankfully it still only takes a few ms to execute, and the page looks good if you have JS disabled (it shows the 'minimalist' theme).

Unlike `Date`, we don't have to do any gymnastics to compare Temporal instances: there's literally a `compare` function on each type of instance. Just like with other JS comparison functions, it returns `1` if the first instance is greater than the second, `0` if the two instances are the same, and `-1` if the first instance is less than the second. 

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
      stages[currentStageName].color3,
  );
  ```

I'm also setting a data attribute on the root so we can do some additional stage-based customisations, such as showing the stars when it's night.

```js
root.setAttribute("data-time", currentStageName);
```

And that will give us our different gradient colours at different times of day!

And *then* I remembered that `color-mix` exists. Why restrict ourselves to just 4 times of day and 4 sets of colours, when we could make them... transition into each other?????

## Blending transitions with color-mix
`color-mix` is an extremely cool CSS function that lets you, well, mix two colours together. You tell it what colour space you're working with, and the colours, and the browser magically outputs the mix between the two. 

```css
background: color-mix(in oklch, color1, color2)
```

Much like with gradients, you can also specify a percentage value for the colours, which indicates the proportions of the colours:
```css
background: color-mix(in oklch, color1 20%, color2)
```
So I could gradually feed in a bit of the next stage's colour until the next stage took over completely. 

To get a percentage value for the next stage colour to feed in, I had to figure out how far through the current stage we are. 

First, I'm calculating the time until the next stage - super simple with the `until` function on `Temporal` instances:

```js
time1.until(time2)
```

This gives us a `Temporal.Duration` which represents a period between two time points. So, for example, if it's 7:45pm now and we're calculating `timeUntilNextStage`: 

```js
const timeUntilNextStage = timeNow.until(stages.night.start)

console.log(timeUntilNextStage.toString()) // PT1H15M

```

`Duration`s are stringified (and specified) using the [ISO 8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations), so "PT1H15M" means "period, time separator, 1 hour, 15 minutes".Time information appears after the `T`; if the duration had any date information in it, it'd appear before the `T`. 

We set `timeUntilNextStage` in the switch statement where we're deciding what stage we're in, for example: 

```js
  case compare(timeNow, stages.sunrise.start) >= 0 && compare(timeNow, stages.day.start) < 0: {
      currentStageName = "sunrise";
      timeUntilNextStage = timeNow.until(stages.night.start);
      break;
    }
```

Once we've got the duration representing time until the next stage, we need to know the duration between the start of the current stage and the start of the next stage - let's call it the "transition duration". For sunset-to-night and sunrise-to-day, the transition duration is always 90 minutes; for night-sunrise and day-sunset, it'd be 11.5 hours. I didn't want the colour mixing to happen all throughout the day, only around sunrise/sunset like in real life, so I just decided to hardcode the transition duration for day and night to be 90 minutes so it matches the other two. 

So for that, I can instantiate a `Duration` using the same ISO 8601 syntax:

```js
const entireTransitionDuration = Temporal.Duration.from("PT1H30M")
```
Now I need to calculate the difference between the total duration and the time until next stage - basically, how far into the transition period we are, and therefore how much of a percentage we should mix in of the next colour.

Handily, Temporal gives us a `subtract` function as well:

```js
const diff = entireTransitionDuration.subtract(timeUntilNextStage)
```

Then to figure out the transition progress as a percentage, we can divide `diff` by `entireTransitionDuration`. We'll do that with the time values in seconds so we can divide them, using the instance's `total` function:

```js
const entireTransitionDurationInSeconds = entireTransitionDuration.total({ unit: "seconds" })
const diffInSeconds = diff.total({ unit: "seconds" })
const transitionProgressPercent = Math.round((diffInSeconds / entireTransitionDurationInSeconds)*100).toFixed() // gives us a string representation with 0 d.p.
```

### The midnight problem

It's a little more complicated for the "night" stage, because that crosses midnight into the next day. Remember that our `PlainTime` only has time information, not date information - so if it's 10pm and you're asking it how long until sunrise at 6:30am, it'll give you a negative number!

```js

const now = Temporal.PlainTime.from("22:00")
const sunrise = Temporal.PlainTime.from("06:30")
const d = now.until(sunrise) // Temporal.Duration -PT15H30M
```

This causes problems at the point where I calculate the diff, as it'll come out as a large number and completely throw off the calculations. I got around this by getting the absolute value of the duration with `.abs()`, so `timeUntilNextStage` will always be positive, even if it's before midnight: e.g. what was`-PT15H30M` will now be `PT15H30M`. Calculating the diff by subtracting that from a `transitionDuration` of 90 mins will always yield a negative number.

```js
 case compare(timeNow, stages.sunrise.start) < 0 || compare(timeNow, stages.night.start) >= 0: {
      currentStageName = "night";
      timeUntilNextStage = timeNow.until(stages.sunrise.start).abs();
      break;
    }
```

Then, we only calculate the percentage and set the variables via JS if `diff` is greater than 0:
```js
  let transitionProgressPercent = 0;
  if (diffInSeconds > 0) {
    transitionProgressPercent = Math.round((diffInSeconds / entireTransitionDurationInSeconds) * 100);
    root.style.setProperty(
      "--bg-gradient-top",
      `color-mix(in oklch, ${stages[nextStageName].color1} ${transitionProgressPercent}%, ${stages[currentStageName].color1})`,
    );
    [...]
  }
```

That way, if it's before midnight we'll only show the plain ol' nighttime colours that are in the CSS.  

This works for the daytime stage too: if it's more than 90 mins before sunset, it'll come out with a negative diff - so that will just display the daytime colours and no transition. 

### Let's mix!

Now we can use that percentage value (which will always be a whole number) in the `color-mix` function to dictate how much of the next colour we should interpolate.

```css
color-mix(in oklch, ${color1} ${transitionProgressPercent}%, ${color2})
```

I updated my `stages` object to include the next stage name as well:

```js
 night: {
    start: Temporal.PlainTime.from("21:00:00"),
    next: "sunrise",
    color1: "oklch(25.27% 0.0919 276.73)",
    color2: "oklch(47.35% 0.284 283.78)",
    color3: "oklch(62.831% 0.23521 310.291)",
  }, // etc
```
So we can get both colours dynamically when we set the variables with `color-mix`:

```js
 root.style.setProperty(
    "--bg-gradient-top",
    `color-mix(in oklch, ${stages[nextStageName].color1} ${transitionProgressPercent}%, ${stages[currentStageName].color1})`,
  );
```

And that's how we transition the colours!

## Transitioning the transitions
As a bonus touch, I wanted the colour change to transition smoothly when you switch between stages manually using the picker on the top right. By declaring my `bg-gradient-xx` variables using `@property`, I can tell the browsers that yes, they are definitely colours - and therefore they can be animated.

Without this explicit custom property declaration, I could set the value of `--bg-gradient-top` to a number, or a position, or anything I wanted. By saying it's definitely a colour, the browser knows how to transition it into other values of the same type.

I initially did this with `@property` declarations in the CSS:

```css
@property --bg-gradient-top {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(...);
}
@property --bg-gradient-mid {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(...);
}
@property --bg-gradient-bottom {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(...);
}

```
Unfortunately, setting these in the CSS meant that you got a flash of whichever initial values I'd set before the JS kicked in and set the appropriate colours for time of day. If this page were server-driven, or always started from the same colour for everyone, it would've been fine. But the starting colour depends on your time zone and is only calculated when the initial JS runs. 

I got around this by setting the properties via JS instead, when we set the time to "now":

```js
// we only provide a time if we're setting a specific stage
// so "now" means no time provided 
if (!specificTime) {
  window.CSS.registerProperty({
    name: "--bg-gradient-top",
    syntax: "<color>",
    inherits: true,
    initialValue: stages[currentStageName].color1,
  });

  window.CSS.registerProperty({
    name: "--bg-gradient-mid",
    syntax: "<color>",
    inherits: true,
    initialValue: stages[currentStageName].color2,
  });

  window.CSS.registerProperty({
    name: "--bg-gradient-bottom",
    syntax: "<color>",
    inherits: true,
    initialValue: stages[currentStageName].color3,
  });
}
```



On the `body` and `footer` I set `transition-property` and `transition-duration` to tell it which properties I want to animate:

```css
  body {
    --background: fixed linear-gradient(var(--bg-gradient-top), var(--bg-gradient-mid) 80%);

    transition-property: --bg-gradient-top, --bg-gradient-mid;
    transition-duration: 0.5s;
  }

  footer {
    background: linear-gradient(oklch(0 0 0 / 0) 40%, var(--bg-gradient-bottom));
    transition: --bg-gradient-bottom 0.5s;
  }
```

And like motherflipping magic, the colours transition seamlessly into each other when the values change! I love CSS.

## Polyfilling Temporal for Safari
Alas, Safari is behind the times. We love progressive enhancement, and of course I could have just removed any of the transition logic for people whose browsers don't support Temporal, but that's no fun. They deserve sunsets too!

Writing a shim for Temporal was also no fun, but I did it because I love you. 

There are various Temporal polyfills around and about, but I didn't want to end up importing a whole lot of extra JS when I only needed one or two functions. I'm not using any kind of bundler on this site - I use Eleventy to generate the pages, but scripts are just imported vanilla - so I couldn't import something with NPM and expect it to tree-shake any bits I wasn't using. It was a lot more lightweight to just write my own. 

To check for Temporal support, it's a matter of just checking if `window.Temporal?.PlainTime` is undefined:
```js
const supportsTemporal = typeof window.Temporal?.PlainTime !== "undefined";
```

I'm checking for `PlainTime` specifically as some browsers may have very high level Temporal implementations, but we can't do much without `PlainTime`. 

To get the user's time in a non-Temporal world, we can just call the good old-fashioned `new Date()`:

```js
function getUserTime() {
  if (!supportsTemporal) {
    return new Date();
  }
  return Temporal.Now.plainTimeISO();
}
```

To compare dates, we do it by comparing epoch timestamps. These represent the number of milliseconds since the Unix epoch, 01 Jan 1970. 

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

To polyfill `until`, I've got a `durationBetween` function which will call `until` if Temporal's supported, otherwise it'll subtract two epoch timestamps, and divide the result by 1000 to get the duration as seconds:

```js
export function durationBetween(time1, time2) {
  if (!supportsTemporal) {
    return (time2.getTime() - time1.getTime()) / 1000;
  }

  return time1.until(time2);
}
```
Then I call it like this:

```js
 case compare(timeNow, stages.sunset.start) >= 0 && compare(timeNow, stages.night.start) < 0: {
      currentStageName = "sunset";
      timeUntilNextStage = durationBetween(timeNow, stages.night.start);
      break;
    }
```

I wrote a whole suite of unit tests (for a PERSONAL project! I know!) to make sure behaviour was exactly the same, and it seems to be working nicely. I'm hoping I can remove the polyfills in time, but given that the web is beautifully backwards-compatible, it's not the end of the world if it stays around longer than it needs to.


## It's not perfect

Because this is a static site, it's all client-side JS. There might be a little bit of a flash when you navigate between pages in Firefox (it seems to be fine with Chrome). Ideally I'd compute this on the server and serve the content with the correct colour values, but my web host only supports static sites. 

## See the full code 

The [repo](https://github.com/sophiekoonin/localghost) for this website is public, feel free to have a look at the code in `src/js/gradients.mjs`. My CSS is definitely extremely messy, but then so is my brain...! 
