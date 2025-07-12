export default function (id, title, author) {
  return `
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="result" data-user="${author}" data-slug-hash="${id}" data-preview="true" data-pen-title="${title}">
  <span>See the Pen 
    <a href="https://codepen.io/${author}/pen/${id}">
      ${title}</a> by <a href="https://codepen.io/${author}">@${author}</a>
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
`;
}
