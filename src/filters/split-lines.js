// https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/
module.exports = function (input) {
  const parts = input.split(" ")
  const lines = parts.reduce(function (prev, current) {
    if (!prev.length) {
      return [current]
    }

    let lastOne = prev[prev.length - 1]

    if (lastOne.length + current.length > 40) {
      return [...prev, current]
    }

    prev[prev.length - 1] = lastOne + " " + current

    return prev
  }, [])

  return lines
}
