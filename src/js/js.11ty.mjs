import fs from "fs";
import path from "path";
import md5 from "md5";
import UglifyJS from "uglify-js";

const __dirname = import.meta.dirname;

function getJsFiles() {
  return fs
    .readdirSync(__dirname)
    .filter((f) => f.endsWith(".mjs") && f !== "js.11ty.mjs")
    .map((f) => {
      const filePath = path.join(__dirname, f);
      const contents = fs.readFileSync(filePath, "utf-8");
      const hash = md5(contents).slice(0, 8);
      const name = path.basename(f, ".mjs");
      return { filePath, contents, hash, name };
    });
}

export default class {
  async data() {
    return {
      pagination: {
        data: "jsFiles",
        size: 1,
        alias: "jsFile",
        addAllPagesToCollections: true,
      },
      jsFiles: getJsFiles(),
      permalink: ({ jsFile }) => `js/${jsFile.name}.${jsFile.hash}.mjs`,
    };
  }

  async render({ jsFile }) {
    return process.env.NODE_ENV === "production" ? UglifyJS.minify(jsFile.contents).code : jsFile.contents;
  }
}
