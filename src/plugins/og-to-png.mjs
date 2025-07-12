import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import Image from "@11ty/eleventy-img";
const ogImagesDir = "./src/static/og-images";
// with thanks to
// https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/
export default async function () {
  const socialPreviewImagesDir = "_site/og-images/";
  const files = await fsPromises.readdir(socialPreviewImagesDir);

  if (files.length > 0) {
    files.forEach(async function (filename) {
      if (!filename.endsWith(".svg")) {
        return;
      }
      const outputFilename = `${filename.substring(0, filename.length - 4)}.png`;

      if (!fs.existsSync(path.join(ogImagesDir, outputFilename))) {
        const imageUrl = socialPreviewImagesDir + filename;
        try {
          Image(imageUrl, {
            formats: ["png"],
            outputDir: ogImagesDir,
            filenameFormat: (id, src, width, format, options) => outputFilename,
          });
        } catch (e) {
          console.error("Error with image: ", imageUrl);
          console.error(e);
        }
      }
    });
  }
}
