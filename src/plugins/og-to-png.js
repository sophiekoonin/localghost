const fsPromises = require("fs/promises");
const fs = require("fs");
const path = require("path");
const Image = require("@11ty/eleventy-img");
const ogImagesDir = "./src/static/og-images";
// with thanks to
// https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/
module.exports = async function () {
  const socialPreviewImagesDir = "_site/og-images/";
  const files = await fsPromises.readdir(socialPreviewImagesDir);
  if (files.length > 0) {
    files.forEach(function (filename) {
      const outputFilename = filename.substring(0, filename.length - 4);
      if (filename.endsWith(".svg") & !fs.existsSync(path.join(ogImagesDir, outputFilename))) {
        const imageUrl = socialPreviewImagesDir + filename;
        try {
          Image(imageUrl, {
            formats: ["png"],
            outputDir: ogImagesDir,
            filenameFormat: function (id, src, width, format, options) {
              return `${outputFilename}.${format}`;
            },
          });
        } catch (e) {
          console.error("Error with image: ", imageUrl);
          console.error(e);
        }
      }
    });
  }
};
