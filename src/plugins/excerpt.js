module.exports = function create(options = {}) {
  const excerptSeparator = options.excerptSeparator || '</p>';

  if (typeof excerptSeparator !== 'string') {
    throw new Error('excerptSeparator must be a string but was: ' + separator);
  }

  return function extractExcerpt(template) {
    debugger;
    if (!template) {
      throw new Error('template is required');
    }
    if (template.excerptText) {
      return template.excerptText;
    }

    if (typeof template?.content !== 'string') {
      throw new Error(
        'template content must be a string but was: ' + templateContent
      );
    }

    const index = template.content.indexOf(excerptSeparator);
    // slice from 3, to remove initial `<p>`
    return index !== -1
      ? template.content.slice(3, index + excerptSeparator.length)
      : '';
  };
};
