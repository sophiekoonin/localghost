import { test, beforeEach, afterEach, vi, expect, describe } from "vitest";
const expectationsFn = (timeOfDay, expectedTopFn, expectedMidFn, expectedBottomFn) => (setPropertySpy, setAttributeSpy, percentMix) => {
  expect(setPropertySpy.mock.calls).toEqual([
    ["--bg-gradient-top", expectedTopFn(percentMix)],
    ["--bg-gradient-mid", expectedMidFn(percentMix)],
    ["--bg-gradient-bottom", expectedBottomFn(percentMix)],
  ]);
  expect(setAttributeSpy).toHaveBeenCalledWith("data-time", timeOfDay);
};

describe("with Temporal support", () => {
  // Importing the modules dynamically here so we can test the non-Temporal path separately.
  // Once Temporal is baseline, we can move the imports to top level and get rid of the shims
  let setColoursForTime, stages, newTimeInstance, durationBetween;
  beforeEach(async () => {
    ({ newTimeInstance, stages, durationBetween, setColoursForTime } = await import("../gradients.mjs"));
  });

  test("newTimeInstance gives me a Temporal PlainTime", () => {
    const timeInstance = newTimeInstance("13:45");
    expect(timeInstance instanceof Temporal.PlainTime).toBe(true);
  });

  test("durationBetween uses the builtin Temporal `until` and returns a duration", () => {
    const date1 = Temporal.PlainTime.from("02:30");
    const date2 = Temporal.PlainTime.from("16:45");
    expect(durationBetween(date1, date2)).toEqual(Temporal.Duration.from("PT14H15M"));
  });

  describe("setColoursForTime", () => {
    let setPropertySpy;
    let setAttributeSpy;
    beforeEach(() => {
      vi.useFakeTimers();
      setAttributeSpy = vi.spyOn(document.documentElement, "setAttribute");
      setPropertySpy = vi.spyOn(document.documentElement.style, "setProperty");
    });
    afterEach(() => {
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    describe("sunrise between 06:30 and 07:59", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "sunrise",
        (percentMix) => `color-mix(in oklch, ${stages.day.color1} ${percentMix}%, ${stages.sunrise.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.day.color2} ${percentMix}%, ${stages.sunrise.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.day.color3} ${percentMix}%, ${stages.sunrise.color3})`,
      );

      test.each([
        ["06:30", 0],
        ["06:45", 17],
        ["07:00", 33],
        ["07:30", 67],
        ["07:59", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });

    describe("daytime between 08:00 and 19:29, mix 1.5h before sunset", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "day",
        (percentMix) => `color-mix(in oklch, ${stages.sunset.color1} ${percentMix}%, ${stages.day.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunset.color2} ${percentMix}%, ${stages.day.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunset.color3} ${percentMix}%, ${stages.day.color3})`,
      );

      test.each([
        ["08:00", 0],
        ["10:00", 0],
        ["12:00", 0],
        ["18:00", 0],
        ["18:01", 1],
        ["19:00", 67],
        ["19:29", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });

    describe("sunset between 19:30 and 20:59", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "sunset",
        (percentMix) => `color-mix(in oklch, ${stages.night.color1} ${percentMix}%, ${stages.sunset.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.night.color2} ${percentMix}%, ${stages.sunset.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.night.color3} ${percentMix}%, ${stages.sunset.color3})`,
      );

      test.each([
        ["19:30", 0],
        ["19:45", 17],
        ["20:00", 33],
        ["20:30", 67],
        ["20:59", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });

    describe("nighttime between 21:00 and 06:29, mix 1.5h before sunrise", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "night",
        (percentMix) => `color-mix(in oklch, ${stages.sunrise.color1} ${percentMix}%, ${stages.night.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunrise.color2} ${percentMix}%, ${stages.night.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunrise.color3} ${percentMix}%, ${stages.night.color3})`,
      );

      test.each([
        ["21:00", 0],
        ["00:00", 0],
        ["02:00", 0],
        ["05:00", 0],
        ["05:01", 1],
        ["06:00", 67],
        ["06:29", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });
  });
});

describe("without temporal support", () => {
  let setColoursForTime, stages, newTimeInstance, durationBetween, jsDateCompare;
  beforeEach(async () => {
    window.Temporal = undefined;
    vi.resetModules();
    ({ setColoursForTime, stages, newTimeInstance, durationBetween, jsDateCompare } = await import("../gradients.mjs"));
  });
  afterEach(() => {
    vi.resetModules();
  });
  test("newTimeInstance successfully creates a new Date when temporal isn't supported", () => {
    const timeInstance = newTimeInstance("13:45");
    expect(timeInstance instanceof Date).toBe(true);
    expect(timeInstance.getHours()).toEqual(13);
    expect(timeInstance.getMinutes()).toEqual(45);
  });

  test("jsDateCompare can compare two dates accurately", () => {
    const date1 = new Date(2026, 1, 1, 2, 30);
    const date2 = new Date(2026, 1, 1, 16, 45);
    const date3 = new Date(2026, 1, 1, 16, 45);

    expect(jsDateCompare(date1, date2)).toEqual(-1);
    expect(jsDateCompare(date2, date1)).toEqual(1);
    expect(jsDateCompare(date2, date3)).toEqual(0);
  });

  test("durationBetween calculates the duration in seconds between two datetimes", () => {
    const date1 = new Date(2026, 1, 1, 2, 30);
    const date2 = new Date(2026, 1, 1, 16, 45);
    expect(durationBetween(date1, date2)).toEqual(51300);
  });

  describe("setColoursForTime", () => {
    let setPropertySpy;
    let setAttributeSpy;
    beforeEach(() => {
      vi.useFakeTimers();
      setAttributeSpy = vi.spyOn(document.documentElement, "setAttribute");
      setPropertySpy = vi.spyOn(document.documentElement.style, "setProperty");
    });
    afterEach(() => {
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    describe("sunrise between 06:30 and 07:59", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "sunrise",
        (percentMix) => `color-mix(in oklch, ${stages.day.color1} ${percentMix}%, ${stages.sunrise.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.day.color2} ${percentMix}%, ${stages.sunrise.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.day.color3} ${percentMix}%, ${stages.sunrise.color3})`,
      );

      test.each([
        ["06:30", 0],
        ["06:45", 17],
        ["07:00", 33],
        ["07:30", 67],
        ["07:59", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });

    describe("daytime between 08:00 and 19:29, mix 1.5h before sunset", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "day",
        (percentMix) => `color-mix(in oklch, ${stages.sunset.color1} ${percentMix}%, ${stages.day.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunset.color2} ${percentMix}%, ${stages.day.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunset.color3} ${percentMix}%, ${stages.day.color3})`,
      );

      test.each([
        ["08:00", 0],
        ["10:00", 0],
        ["12:00", 0],
        ["18:00", 0],
        ["18:01", 1],
        ["19:00", 67],
        ["19:29", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });

    describe("sunset between 19:30 and 20:59", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "sunset",
        (percentMix) => `color-mix(in oklch, ${stages.night.color1} ${percentMix}%, ${stages.sunset.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.night.color2} ${percentMix}%, ${stages.sunset.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.night.color3} ${percentMix}%, ${stages.sunset.color3})`,
      );

      test.each([
        ["19:30", 0],
        ["19:45", 17],
        ["20:00", 33],
        ["20:30", 67],
        ["20:59", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });

    describe("nighttime between 21:00 and 06:29, mix 1.5h before sunrise", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        "night",
        (percentMix) => `color-mix(in oklch, ${stages.sunrise.color1} ${percentMix}%, ${stages.night.color1})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunrise.color2} ${percentMix}%, ${stages.night.color2})`,
        (percentMix) => `color-mix(in oklch, ${stages.sunrise.color3} ${percentMix}%, ${stages.night.color3})`,
      );

      test.each([
        ["21:00", 0],
        ["00:00", 0],
        ["02:00", 0],
        ["05:00", 0],
        ["05:01", 1],
        ["06:00", 67],
        ["06:29", 99],
      ])("at %s - %i% mix", (time, percentMix) => {
        setColoursForTime(time);
        assertSetPropertyCallsWithPercentageMix(setPropertySpy, setAttributeSpy, percentMix);
      });
    });
  });
});
