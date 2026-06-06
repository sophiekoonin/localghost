import md5 from "md5";
import path from "path";
import fs from "fs";
const __dirname = import.meta.dirname;

const globalData = {
  baseUrl: process.env.BASE_URL || "https://localghost.dev",
  currentYear() {
    return new Date().getFullYear();
  },
  random() {
    const segment = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return `${segment()}-${segment()}-${segment()}`;
  },
  isDev() {
    return process.env.NODE_ENV !== "production";
  },
  cssFile() {
    const scssDir = path.join(__dirname, "..", "scss");
    const cssFile = fs.readFileSync(path.join(scssDir, "style.scss"));
    const hash = md5(cssFile).slice(0, 8);
    return `/css/style.${hash}.css`;
  },
  jsFiles() {
    const jsDir = path.join(__dirname, "..", "js");
    return Object.fromEntries(
      fs
        .readdirSync(jsDir)
        .filter((f) => f.endsWith(".mjs") && f !== "js.11ty.mjs")
        .map((f) => {
          const contents = fs.readFileSync(path.join(jsDir, f), "utf-8");
          const hash = md5(contents).slice(0, 8);
          const name = path.basename(f, ".mjs");
          return [name, `/js/${name}.${hash}.mjs`];
        }),
    );
  },
};

export default globalData;
