document.documentElement.classList.remove("no-js");
const search = new URLSearchParams(window.location.search);
const theme = search.get("theme") || localStorage.getItem("user-theme") || "city";
document.documentElement.setAttribute("data-theme", theme);
window.supportsTemporal = typeof window.Temporal?.PlainTime !== "undefined";
function jsDateCompare(date1, date2) {
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();
  if (date1Ms === date2Ms) return 0;

  return date1Ms < date2Ms ? -1 : 1;
}
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
if (theme === "city") {
  let stage;
  const timeNow = window.supportsTemporal ? Temporal.Now.plainTimeISO() : new Date();
  if (
    window.compareTimes(timeNow, window.getNewTimeInstance("21:00:00")) >= 0 ||
    window.compareTimes(timeNow, window.getNewTimeInstance("06:30:00")) < 0
  ) {
    stage = "night";
  } else if (window.compareTimes(timeNow, window.getNewTimeInstance("08:00:00")) < 0) {
    stage = "sunrise";
  } else if (window.compareTimes(timeNow, window.getNewTimeInstance("19:30:00")) < 0) {
    stage = "day";
  } else {
    stage = "sunset";
  }
  document.documentElement.setAttribute("data-time", stage);
}
