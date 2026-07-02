// globals
const compare = window.compareTimes;
const root = document.documentElement;

let interval;
let timeUntilNextStage = 0;
let currentStageName = "day";

export const stages = {
  sunrise: {
    start: window.getNewTimeInstance("06:30:00"),
    next: "day",
    color1: "oklch(0.618 0.3157 265.76)",
    color2: "oklch(0.8867 0.1222 328.24)",
    color3: "oklch(0.9529 0.1222 106.94)",
  },
  day: {
    start: window.getNewTimeInstance("08:00:00"),
    next: "sunset",
    color1: "oklch(58% 0.15433 300)",
    color2: "oklch(85% 0.22133 302)",
    color3: "oklch(98 0.22133 302)",
  },
  sunset: {
    start: window.getNewTimeInstance("19:30:00"),
    next: "night",
    color1: "oklch(0.6933 0.1899 297.53)",
    color2: "oklch(75.504% 0.24612 357.26)",
    color3: "oklch(88.591% 0.1422 62.595)",
  },
  night: {
    start: window.getNewTimeInstance("21:00:00"),
    next: "sunrise",
    color1: "oklch(25.27% 0.0919 276.73)",
    color2: "oklch(47.35% 0.284 283.78)",
    color3: "oklch(0.7 0.33 332.4)",
  },
};

function getUserTime() {
  if (!window.supportsTemporal) {
    return new Date();
  }
  return Temporal.Now.plainTimeISO();
}

export function durationBetween(time1, time2) {
  if (!window.supportsTemporal) {
    return (time2.getTime() - time1.getTime()) / 1000;
  }

  return time1.until(time2);
}

// export function jsDateCompare(date1, date2) {
//   const date1Ms = date1.getTime();
//   const date2Ms = date2.getTime();
//   if (date1Ms === date2Ms) return 0;
//   return date1Ms < date2Ms ? -1 : 1;
// }

export function setColoursForTime(time) {
  const timeNow = time ? window.getNewTimeInstance(time) : getUserTime();
  switch (true) {
    case compare(timeNow, stages.sunrise.start) < 0 || compare(timeNow, stages.night.start) >= 0: {
      currentStageName = "night";
      timeUntilNextStage = durationBetween(timeNow, stages.sunrise.start);
      // it comes out negative when it's before midnight,
      // and we're comparing to a morning timestamp because it's date-agnostic
      // so we force it to a positive number so the diff is always negative
      timeUntilNextStage = typeof timeUntilNextStage === "number" ? Math.abs(timeUntilNextStage) : timeUntilNextStage.abs();
      break;
    }
    case compare(timeNow, stages.sunrise.start) >= 0 && compare(timeNow, stages.day.start) < 0: {
      currentStageName = "sunrise";
      timeUntilNextStage = durationBetween(timeNow, stages.night.start);
      break;
    }
    case compare(timeNow, stages.day.start) >= 0 && compare(timeNow, stages.sunset.start) < 0: {
      currentStageName = "day";
      timeUntilNextStage = durationBetween(timeNow, stages.sunset.start);
      break;
    }
    case compare(timeNow, stages.sunset.start) >= 0 && compare(timeNow, stages.night.start) < 0: {
      currentStageName = "sunset";
      timeUntilNextStage = durationBetween(timeNow, stages.night.start);
      break;
    }
    default:
      break;
  }

  const nextStageName = stages[currentStageName].next;

  const entireTransitionDuration = window.supportsTemporal ? Temporal.Duration.from("PT1H30M") : 5400;

  const diff = window.supportsTemporal
    ? entireTransitionDuration.subtract(timeUntilNextStage).total({ unit: "seconds" })
    : entireTransitionDuration - timeUntilNextStage;

  let transitionProgressPercent = 0;
  if (diff > 0) {
    const timeBlockDurationSecs = window.supportsTemporal ? entireTransitionDuration.total({ unit: "seconds" }) : entireTransitionDuration;
    transitionProgressPercent = Math.round((diff / timeBlockDurationSecs) * 100).toFixed();
  }

  root.style.setProperty(
    "--bg-gradient-top",
    `color-mix(in oklch, ${stages[nextStageName].color1} ${transitionProgressPercent}%, ${stages[currentStageName].color1})`,
  );
  root.style.setProperty(
    "--bg-gradient-mid",
    `color-mix(in oklch, ${stages[nextStageName].color2} ${transitionProgressPercent}%, ${stages[currentStageName].color2})`,
  );

  root.style.setProperty(
    "--bg-gradient-bottom",
    `color-mix(in oklch, ${stages[nextStageName].color3} ${transitionProgressPercent}%, ${stages[currentStageName].color3})`,
  );

  root.setAttribute("data-time", currentStageName);
}

window.getTimeOfDay = () => currentStageName;

export function setStage(stage) {
  setColoursForTime(stages[stage].start);
}
