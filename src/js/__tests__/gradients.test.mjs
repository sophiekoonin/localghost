import { test, beforeEach, afterEach, vi, expect, describe } from "vitest";

const expectationsFn = (setPropertySpy, setAttributeSpy, timeOfDay, expectedTopFn, expectedMidFn, expectedBottomFn) => (percentMix) => {
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
  let setColoursForTime, newTimeInstance, durationBetween;
  beforeEach(async () => {
    ({ newTimeInstance, durationBetween, setColoursForTime } = await import("../gradients.mjs"));
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

    test("sets sunrise between 06:30 and 07:59 with varying percentages of colour mix", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "sunrise",
        (percentMix) => `color-mix(in oklch, oklch(58% 0.15433 300) ${percentMix}%, oklch(0.618 0.3157 265.76))`,
        (percentMix) => `color-mix(in oklch, oklch(85% 0.22133 302) ${percentMix}%, oklch(0.8867 0.1222 328.24))`,
        (percentMix) => `color-mix(in oklch, oklch(98 0.22133 302) ${percentMix}%, oklch(0.9529 0.1222 106.94))`,
      );

      setColoursForTime("06:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("06:45");
      assertSetPropertyCallsWithPercentageMix(17);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("07:00");
      assertSetPropertyCallsWithPercentageMix(33);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("07:30");
      assertSetPropertyCallsWithPercentageMix(67);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("07:59");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    test("sets daytime between 08:00 and 19:29 with varying percentages of colour mix 2h before sunset", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "day",
        (percentMix) => `color-mix(in oklch, oklch(0.6933 0.1899 297.53) ${percentMix}%, oklch(58% 0.15433 300))`,
        (percentMix) => `color-mix(in oklch, oklch(73.53% 0.21 352.59) ${percentMix}%, oklch(85% 0.22133 302))`,
        (percentMix) => `color-mix(in oklch, oklch(78.82% 0.148 32.2) ${percentMix}%, oklch(98 0.22133 302))`,
      );

      setColoursForTime("08:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("10:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("12:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("17:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("17:31");
      assertSetPropertyCallsWithPercentageMix(1);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("19:00");
      assertSetPropertyCallsWithPercentageMix(75);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("19:29");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    test("sets sunset between 19:30 and 20:59 with varying percentages of colour mix", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "sunset",
        (percentMix) => `color-mix(in oklch, oklch(25.27% 0.0919 276.73) ${percentMix}%, oklch(0.6933 0.1899 297.53))`,
        (percentMix) => `color-mix(in oklch, oklch(47.35% 0.284 283.78) ${percentMix}%, oklch(73.53% 0.21 352.59))`,
        (percentMix) => `color-mix(in oklch, oklch(47.35% 0.284 283.78) ${percentMix}%, oklch(78.82% 0.148 32.2))`,
      );

      setColoursForTime("19:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("19:45");
      assertSetPropertyCallsWithPercentageMix(17);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("20:00");
      assertSetPropertyCallsWithPercentageMix(33);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("20:30");
      assertSetPropertyCallsWithPercentageMix(67);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("20:59");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    test("sets nighttime between 21:00 and 06:29 with varying percentages of colour mix 2h before sunrise", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "night",
        (percentMix) => `color-mix(in oklch, oklch(0.618 0.3157 265.76) ${percentMix}%, oklch(25.27% 0.0919 276.73))`,
        (percentMix) => `color-mix(in oklch, oklch(0.8867 0.1222 328.24) ${percentMix}%, oklch(47.35% 0.284 283.78))`,
        (percentMix) =>
          percentMix > 0
            ? "oklch(0.9529 0.1222 106.94)"
            : `color-mix(in oklch, oklch(0.9529 0.1222 106.94) 0%, oklch(47.35% 0.284 283.78))`,
      );

      setColoursForTime("21:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("00:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("02:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("04:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("04:31");
      assertSetPropertyCallsWithPercentageMix(1);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("06:00");
      assertSetPropertyCallsWithPercentageMix(75);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("06:29");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });
  });
});

describe("without temporal support", () => {
  let setColoursForTime, newTimeInstance, durationBetween, jsDateCompare;
  beforeEach(async () => {
    window.Temporal = undefined;
    vi.resetModules();
    ({ setColoursForTime, newTimeInstance, durationBetween, jsDateCompare } = await import("../gradients.mjs"));
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

    test("sets sunrise between 06:30 and 07:59 with varying percentages of colour mix", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "sunrise",
        (percentMix) => `color-mix(in oklch, oklch(58% 0.15433 300) ${percentMix}%, oklch(0.618 0.3157 265.76))`,
        (percentMix) => `color-mix(in oklch, oklch(85% 0.22133 302) ${percentMix}%, oklch(0.8867 0.1222 328.24))`,
        (percentMix) => `color-mix(in oklch, oklch(98 0.22133 302) ${percentMix}%, oklch(0.9529 0.1222 106.94))`,
      );

      setColoursForTime("06:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("06:45");
      assertSetPropertyCallsWithPercentageMix(17);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("07:00");
      assertSetPropertyCallsWithPercentageMix(33);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("07:30");
      assertSetPropertyCallsWithPercentageMix(67);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("07:59");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    test("sets daytime between 08:00 and 19:29 with varying percentages of colour mix 2h before sunset", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "day",
        (percentMix) => `color-mix(in oklch, oklch(0.6933 0.1899 297.53) ${percentMix}%, oklch(58% 0.15433 300))`,
        (percentMix) => `color-mix(in oklch, oklch(73.53% 0.21 352.59) ${percentMix}%, oklch(85% 0.22133 302))`,
        (percentMix) => `color-mix(in oklch, oklch(78.82% 0.148 32.2) ${percentMix}%, oklch(98 0.22133 302))`,
      );

      setColoursForTime("08:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("10:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("12:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("17:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("17:31");
      assertSetPropertyCallsWithPercentageMix(1);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("19:00");
      assertSetPropertyCallsWithPercentageMix(75);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("19:29");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    test("sets sunset between 19:30 and 20:59 with varying percentages of colour mix", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "sunset",
        (percentMix) => `color-mix(in oklch, oklch(25.27% 0.0919 276.73) ${percentMix}%, oklch(0.6933 0.1899 297.53))`,
        (percentMix) => `color-mix(in oklch, oklch(47.35% 0.284 283.78) ${percentMix}%, oklch(73.53% 0.21 352.59))`,
        (percentMix) => `color-mix(in oklch, oklch(47.35% 0.284 283.78) ${percentMix}%, oklch(78.82% 0.148 32.2))`,
      );

      setColoursForTime("19:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("19:45");
      assertSetPropertyCallsWithPercentageMix(17);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("20:00");
      assertSetPropertyCallsWithPercentageMix(33);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("20:30");
      assertSetPropertyCallsWithPercentageMix(67);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("20:59");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });

    test("sets nighttime between 21:00 and 06:29 with varying percentages of colour mix 2h before sunrise", () => {
      const assertSetPropertyCallsWithPercentageMix = expectationsFn(
        setPropertySpy,
        setAttributeSpy,
        "night",
        (percentMix) => `color-mix(in oklch, oklch(0.618 0.3157 265.76) ${percentMix}%, oklch(25.27% 0.0919 276.73))`,
        (percentMix) => `color-mix(in oklch, oklch(0.8867 0.1222 328.24) ${percentMix}%, oklch(47.35% 0.284 283.78))`,
        (percentMix) =>
          percentMix > 0
            ? "oklch(0.9529 0.1222 106.94)"
            : `color-mix(in oklch, oklch(0.9529 0.1222 106.94) 0%, oklch(47.35% 0.284 283.78))`,
      );

      setColoursForTime("21:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("00:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("02:00");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("04:30");
      assertSetPropertyCallsWithPercentageMix(0);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("04:31");
      assertSetPropertyCallsWithPercentageMix(1);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("06:00");
      assertSetPropertyCallsWithPercentageMix(75);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();

      setColoursForTime("06:29");
      assertSetPropertyCallsWithPercentageMix(99);
      setPropertySpy.mockClear();
      setAttributeSpy.mockClear();
    });
  });
});
