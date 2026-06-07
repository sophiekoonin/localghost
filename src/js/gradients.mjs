// globals
const root = document.documentElement;
const supportsTemporal = typeof window.Temporal?.PlainTime !== "undefined";
const compare = supportsTemporal ? Temporal.PlainTime.compare : jsDateCompare;
export const newTimeInstance = supportsTemporal
  ? Temporal.PlainTime.from
  : (time) => {
      const date = new Date();
      const timeParts = time.split(":");
      date.setMilliseconds(0);
      date.setHours(timeParts[0]);
      date.setMinutes(timeParts[1]);
      return date;
    };

let interval;
let timeUntilNextStage = 0;
let currentStageName = "day";

const stages = {
  sunrise: {
    start: newTimeInstance("06:30:00"),
    next: "day",
    color1: "oklch(0.618 0.3157 265.76)",
    color2: "oklch(0.8867 0.1222 328.24)",
    color3: "oklch(0.9529 0.1222 106.94)",
  },
  day: {
    start: newTimeInstance("08:00:00"),
    next: "sunset",
    color1: "oklch(58% 0.15433 300)",
    color2: "oklch(85% 0.22133 302)",
    color3: "oklch(98 0.22133 302)",
  },
  sunset: {
    start: newTimeInstance("19:30:00"),
    next: "night",
    color1: "oklch(0.6933 0.1899 297.53)",
    color2: "oklch(73.53% 0.21 352.59)",
    color3: "oklch(59.41% 0.289 331.1)",
  },
  night: {
    start: newTimeInstance("21:00:00"),
    next: "sunrise",
    color1: "oklch(25.27% 0.0919 276.73)",
    color2: "oklch(47.35% 0.284 283.78)",
    color3: "oklch(47.35% 0.284 283.78)",
  },
};

function getUserTime() {
  if (!supportsTemporal) {
    const date = new Date();
    return;
  }
  const instant = new Date().toTemporalInstant();
  const zoned = instant.toZonedDateTimeISO(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return zoned.toPlainTime().round("minute");
}

export function durationBetween(time1, time2) {
  if (!supportsTemporal) {
    return (time2.getTime() - time1.getTime()) / 1000;
  }

  return time1.until(time2);
}

export function jsDateCompare(date1, date2) {
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();
  if (date1Ms === date2Ms) return 0;
  return date1Ms < date2Ms ? -1 : 1;
}

export function setColoursForTime(time) {
  const timeNow = time ? newTimeInstance(time) : getUserTime();
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
      timeUntilNextStage = durationBetween(timeNow, stages.day.start);
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

  let entireTransitionDuration;
  if (currentStageName === "night" || currentStageName === "day") {
    // We only start the transition ~2h before for these longer blocks.
    entireTransitionDuration = supportsTemporal ? Temporal.Duration.from("PT2H00M") : 7200;
  } else {
    entireTransitionDuration = durationBetween(stages[currentStageName].start, stages[nextStageName].start);
  }

  const diff = supportsTemporal
    ? entireTransitionDuration.subtract(timeUntilNextStage).total({ unit: "seconds" })
    : entireTransitionDuration - timeUntilNextStage;

  let transitionProgressPercent = 0;
  if (diff > 0) {
    const timeBlockDurationSecs = supportsTemporal ? entireTransitionDuration.total({ unit: "seconds" }) : entireTransitionDuration;
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

  // // Don't colour mix the bottom row if we're doing night -> sunset because this comes out green...
  // if (nextStageName === "sunrise" && transitionProgressPercent > 0) {
  //   root.style.setProperty("--bg-gradient-bottom", `${stages[nextStageName].color3}`);
  // } else {
  root.style.setProperty(
    "--bg-gradient-bottom",
    `color-mix(in oklch, ${stages[nextStageName].color3} ${transitionProgressPercent}%, ${stages[currentStageName].color3})`,
  );
  // }

  root.setAttribute("data-time", currentStageName);
}

window.getTimeOfDay = () => currentStageName;
