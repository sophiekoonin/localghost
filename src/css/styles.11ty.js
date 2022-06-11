const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const sass = require('sass');
const md5 = require('md5');

module.exports = class {
  async data() {
    const scssDir = path.join(__dirname, '..', 'scss');
    const rawFilePath = path.join(scssDir, 'style.scss');
    const cssFile = fs.readFileSync(rawFilePath);
    const hash = md5(cssFile).slice(0, 8);

    return {
      permalink: `css/style.${hash}.css`,
      file: rawFilePath,
    };
  }

  async render({ file, rawFilePath }) {
    const transpiled = sass.renderSync({ file }).css.toString();
    return await postcss([require('cssnano')])
      .process(transpiled, { from: file })
      .then((result) => result.css);
  }
};
