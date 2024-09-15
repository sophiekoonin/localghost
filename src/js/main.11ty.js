const fs = require("fs");
const path = require("path");
const md5 = require("md5");
const UglifyJS = require("uglify-js");

module.exports = class {
  async data() {
    const rawFilePath = path.join(__dirname, "main.js");
    const fileContents = fs.readFileSync(rawFilePath, "utf-8");
    const hash = md5(fileContents).slice(0, 8);

    return {
      permalink: `js/main.${hash}.js`,
      file: rawFilePath,
      contents: fileContents,
    };
  }

  async render({ contents }) {
    return UglifyJS.minify(contents).code;
  }
};
