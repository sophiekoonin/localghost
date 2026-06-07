// globals
const root = document.documentElement;
const compare = Temporal.PlainTime.compare;

let interval;
let timeNow = getUserTime();
let timeUntilNext = 0;
let timeOfDay = "day";

const times = {
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
    color2: "oklch(73.53% 0.21 352.59)",
    color3: "oklch(78.82% 0.148 32.2)",
  },
  night: {
    start: Temporal.PlainTime.from("21:00:00"),
    next: "sunrise",
    color1: "oklch(25.27% 0.0919 276.73)",
    color2: "oklch(47.35% 0.284 283.78)",
    color3: "oklch(47.35% 0.284 283.78)",
  },
};

function getUserTime() {
  const instant = new Date().toTemporalInstant();
  const zoned = instant.toZonedDateTimeISO(Intl.DateTimeFormat().resolvedOptions().timeZone);
  return zoned.toPlainTime().round("minute");
}

export function setColoursForTime() {
  switch (true) {
    case compare(timeNow, times.sunrise.start) < 0 || compare(timeNow, times.night.start) >= 0: {
      timeOfDay = "night";
      timeUntilNext = timeNow.until(times.sunrise.start);
      break;
    }
    case compare(timeNow, times.sunrise.start) >= 0 && compare(timeNow, times.day.start) < 0: {
      timeOfDay = "sunrise";
      timeUntilNext = timeNow.until(times.day.start);
      break;
    }
    case compare(timeNow, times.day.start) >= 0 && compare(timeNow, times.sunset.start) < 0: {
      timeOfDay = "day";
      timeUntilNext = timeNow.until(times.sunset.start);
      break;
    }
    case compare(timeNow, times.sunset.start) >= 0 && compare(timeNow, times.night.start) < 0: {
      timeOfDay = "sunset";
      timeUntilNext = timeNow.until(times.night.start);
      break;
    }
    default:
      break;
  }

  const nextTimeOfDay = times[timeOfDay].next;

  let timeBlockDuration;
  if (timeOfDay === "night" || timeOfDay === "day") {
    // We only start the transition ~2h before for these longer blocks.
    timeBlockDuration = Temporal.Duration.from("PT2H00M");
  } else {
    timeBlockDuration = times[timeOfDay].start.until(times[nextTimeOfDay].start);
  }

  const diff = timeBlockDuration.subtract(timeUntilNext).total({ unit: "milliseconds" });
  let percentageProgress = 0;
  if (diff > 0) {
    const timeBlockDurationMs = timeBlockDuration.total({ unit: "milliseconds" });
    percentageProgress = (diff / timeBlockDurationMs) * 100;
  }

  root.style.setProperty(
    "--bg-gradient-top",
    `color-mix(in oklch, ${times[nextTimeOfDay].color1} ${percentageProgress}%, ${times[timeOfDay].color1})`,
  );
  root.style.setProperty(
    "--bg-gradient-mid",
    `color-mix(in oklch, ${times[nextTimeOfDay].color2} ${percentageProgress}%,  ${times[timeOfDay].color2})`,
  );

  // Don't colour mix the bottom row if we're doing night -> sunset because this comes out green...
  if (nextTimeOfDay === "sunrise" && percentageProgress > 0) {
    root.style.setProperty("--bg-gradient-bottom", `${times[nextTimeOfDay].color3}`);
  } else {
    root.style.setProperty(
      "--bg-gradient-bottom",
      `color-mix(in oklch, ${times[nextTimeOfDay].color3} ${percentageProgress}%,  ${times[timeOfDay].color3})`,
    );
  }

  root.setAttribute("data-time", timeOfDay);
}

window.setTime = (time) => {
  timeNow = Temporal.PlainTime.from(time);
  setColoursForTime();
};
window.getTimeOfDay = () => timeOfDay;
