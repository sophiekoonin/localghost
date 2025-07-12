import fs from "fs";
import path from "path";
import postcss from "postcss";
import * as sass from "sass";
import md5 from "md5";

const __dirname = import.meta.dirname;

export default class {
  async data() {
    const scssDir = path.join(__dirname, "..", "scss");
    const rawFilePath = path.join(scssDir, "style.scss");
    const cssFile = fs.readFileSync(rawFilePath);
    const hash = md5(cssFile).slice(0, 8);

    return {
      permalink: `css/style.${hash}.css`,
      file: rawFilePath,
    };
  }

  async render({ file }) {
    const transpiled = sass.compile(file).css.toString();
    return await import("cssnano").then(async (cssnano) =>
      postcss([cssnano.default])
        .process(transpiled, { from: file })
        .then((result) => result.css)
    );
  }
}
