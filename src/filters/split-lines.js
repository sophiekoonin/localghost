// https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/
module.exports = function (input) {
  const parts = input.split(" ");

  const lines = parts.reduce(function (acc, current, idx) {
    if (!acc.length) {
      return [current];
    }

    const prevLine = acc[acc.length - 1];

    const isTooLong = prevLine.length + ` ${current}`.length > 40;

    // If we're in danger of having an orphan, force the penultimate word onto a new line
    if (isTooLong && idx === parts.length - 1 && !current.includes("-")) {
      const newPrevLine = prevLine.split(" ");
      const lastWord = newPrevLine.pop();
      acc[acc.length - 1] = newPrevLine.join(" ");
      acc.push(lastWord + " " + current);
      return acc;
    }

    if (isTooLong || prevLine.charAt(prevLine.length - 1) === ":") {
      return [...acc, current];
    }

    acc[acc.length - 1] = prevLine + " " + current;

    return acc;
  }, []);
  return lines;
};
