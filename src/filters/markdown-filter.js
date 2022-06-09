const MarkdownIt = require("markdown-it")

module.exports = (content) => {
  const md = new MarkdownIt({
    html: true,
  })

  return md.render(content)
}
