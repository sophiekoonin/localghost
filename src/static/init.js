window.compareTimes = supportsTemporal ? Temporal.PlainTime.compare : jsDateCompare;
window.getNewTimeInstance = supportsTemporal
  ? Temporal.PlainTime.from
  : (time) => {
      const date = new Date();
      const timeParts = time.split(":");
      date.setMilliseconds(0);
      date.setHours(timeParts[0]);
      date.setMinutes(timeParts[1]);
      return date;
    };
`