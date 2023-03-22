const fs = require('fs')
const Image = require("@11ty/eleventy-img");


// with thanks to
// https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/
module.exports = function() {
  const socialPreviewImagesDir = "_site/og-images/";
  fs.readdir(socialPreviewImagesDir, function (err, files) {
      if (files.length > 0) {
          files.forEach(function (filename) {
              if (filename.endsWith(".svg")) {

                  let imageUrl = socialPreviewImagesDir + filename;
                  Image(imageUrl, {
                      formats: ["png"],
                      outputDir: "./" + socialPreviewImagesDir,
                      filenameFormat: function (id, src, width, format, options) {

                          let outputFilename = filename.substring(0, (filename.length-4));
                      
                          return `${outputFilename}.${format}`;

                      }
                  });
                fs.rm(filename, () => {})
              }
          })
      }
  })
}