// globals
const root = document.documentElement;

let interval;
let timeNow = getUserTime();
const compare = Temporal.PlainTime.compare;
let timeUntilNext = 0;

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

function setColoursForTime() {
  let timeOfDay = "day";
  switch (true) {
    case compare(timeNow, times.sunrise.start) < 0 || compare(timeNow, times.night.start) >= 0: {
      timeOfDay = "night";
      // is it before sunrise?
      if (compare(timeNow, times.sunrise.start) < 0) {
        timeUntilNext = timeNow.until(times.sunrise.start);
      } else {
        timeUntilNext = Temporal.Duration.from("PT24H");
      }
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

  let entireDuration;
  if (timeOfDay === "night" || timeOfDay === "day") {
    // We only start the transition ~2h before.
    entireDuration = Temporal.Duration.from("PT2H00M");
  } else {
    entireDuration = times[timeOfDay].start.until(times[nextTimeOfDay].start);
  }

  const diff = entireDuration.subtract(timeUntilNext).total({ unit: "milliseconds" });
  let percentageProgress = 0;
  if (diff > 0) {
    const entireDurationMs = entireDuration.total({ unit: "milliseconds" });
    percentageProgress = (diff / entireDurationMs) * 100;
  }

  console.log(percentageProgress);

  root.style.setProperty(
    "--color1",
    `color-mix(in oklch, ${times[nextTimeOfDay].color1} ${percentageProgress}%, ${times[timeOfDay].color1})`,
  );
  root.style.setProperty(
    "--color2",
    `color-mix(in oklch, ${times[nextTimeOfDay].color2} ${percentageProgress}%,  ${times[timeOfDay].color2})`,
  );

  // Don't set this to colour mix if we're doing night -> sunset because this comes out green ew
  if (nextTimeOfDay === "sunrise" && percentageProgress > 0) {
    root.style.setProperty(
      "--color3",
      `color-mix(in oklch, ${times[nextTimeOfDay].color3} ${percentageProgress}%,  ${times[nextTimeOfDay].color3})`,
    );
  } else {
    root.style.setProperty(
      "--color3",
      `color-mix(in oklch, ${times[nextTimeOfDay].color3} ${percentageProgress}%,  ${times[timeOfDay].color3})`,
    );
  }
}
