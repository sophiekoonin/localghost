import MarkdownIt from "markdown-it";

export default (content) => {
  const md = new MarkdownIt({
    html: true,
  });

  return md.render(content);
};
