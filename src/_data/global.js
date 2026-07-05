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
  jsFile() {
    const jsDir = path.join(__dirname, "..", "js");
    const jsFile = fs.readFileSync(path.join(jsDir, "main.mjs"), "utf-8");
    const hash = md5(jsFile).slice(0, 8);
    return `/js/main.${hash}.mjs`;
  },
};

export default globalData;
