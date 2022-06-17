const md5 = require('md5');
const path = require('path');
const fs = require('fs');

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://localghost.dev',
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
    return process.env.NODE_ENV !== 'production';
  },
  cssFile() {
    const scssDir = path.join(__dirname, '..', 'scss');
    const cssFile = fs.readFileSync(path.join(scssDir, 'style.scss'));
    const hash = md5(cssFile).slice(0, 8);
    return `/css/style.${hash}.css`;
  },
};
