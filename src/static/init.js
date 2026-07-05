const search = new URLSearchParams(location.search);
const theme = search.get("theme") || localStorage.getItem("user-theme") || "city";
document.documentElement.setAttribute("data-theme", theme);
const supportsTemporal = typeof Temporal !== "undefined";
function jsDateCompare(date1, date2) {
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();
  if (date1Ms === date2Ms) return 0;

  return date1Ms < date2Ms ? -1 : 1;
}
const compareTimes = supportsTemporal ? Temporal.PlainTime.compare : jsDateCompare;
const getNewTimeInstance = supportsTemporal
  ? Temporal.PlainTime.from
  : (time) => {
      const date = new Date();
      const timeParts = time.split(":");
      date.setMilliseconds(0);
      date.setHours(timeParts[0]);
      date.setMinutes(timeParts[1]);
      return date;
    };
if (theme === "city") {
  let stage;
  const timeNow = supportsTemporal ? Temporal.Now.plainTimeISO() : new Date();
  if (compareTimes(timeNow, getNewTimeInstance("21:00:00")) >= 0 || compareTimes(timeNow, getNewTimeInstance("06:30:00")) < 0) {
    stage = "night";
  } else if (compareTimes(timeNow, getNewTimeInstance("08:00:00")) < 0) {
    stage = "sunrise";
  } else if (compareTimes(timeNow, getNewTimeInstance("19:30:00")) < 0) {
    stage = "day";
  } else {
    stage = "sunset";
  }
  document.documentElement.setAttribute("data-time", stage);
}
