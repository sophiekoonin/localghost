import canvas from 'canvas';
import fs from 'fs';
import path from 'path';
import slugify from '@sindresorhus/slugify';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const quotationRegex = /^\'|^\"|\"$|\'$/g;
function getLines(ctx, text, maxWidth) {
  var words = text.split(' ');
  var lines = [];
  var currentLine = words[0];

  for (var i = 1; i < words.length; i++) {
    var word = words[i];
    var width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

function generate(title, subtitle, filename) {
  const cnv = canvas.createCanvas(1200, 630);
  const ctx = cnv.getContext('2d');
  const image = new canvas.Image();
  const imgSrc = fs.readFileSync(path.join(__dirname, './base-og-image.png'));
  image.onload = () => {
    ctx.drawImage(image, 0, 0);
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, 1200, 630);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.lineWidth = '2';
    ctx.strokeStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = `bold 48px 'Krungthep'`;
    const titleLines = getLines(ctx, title, cnv.width * 0.8);
    const subtitleLines =
      subtitle != null ? getLines(ctx, subtitle, cnv.width * 0.8) : [];

    const offset = subtitleLines.length > 0 ? 70 : 25;

    [...titleLines, ...subtitleLines].forEach((line, i) => {
      ctx.fillText(line, cnv.width / 2, cnv.height / 2 - offset + i * 70);
    });

    ctx.textBaseline = 'bottom';
    ctx.font = "bold 32px 'Krungthep'";
    ctx.textAlign = 'left';
    ctx.fillText('localghost.dev', 10, cnv.height - 10);
    const out = fs.createWriteStream(filename);
    const stream = cnv.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Processed ' + filename));
  };
  image.src = imgSrc;
}

const ogImageDir = path.join(process.cwd(), './src/static/og-images');
function lookForPosts(overwrite) {
  const postFolder = path.join(process.cwd(), './src/blog');
  const posts = fs
    .readdirSync(postFolder)
    .map((file) => {
      try {
        const content = fs.readFileSync(path.join(postFolder, file), 'utf8');
        const splitContent = content.split('\n');

        const title = splitContent.find((line) => line.startsWith('title:'));
        if (title == null) {
          return null;
        }
        const titleContent = title
          .split('title:')[1]
          .trim()
          .replace(quotationRegex, '');
        const slugifiedTitle = slugify(titleContent);
        if (!overwrite) {
          const existingImage = fs.existsSync(
            path.join(ogImageDir, `${slugifiedTitle}.png`)
          );
          if (existingImage) {
            return null;
          }
        }
        const subtitle = splitContent.find((line) =>
          line.startsWith('subtitle:')
        );

        const subtitleContent =
          subtitle != null
            ? subtitle.split('subtitle:')[1].trim().replace(quotationRegex, '')
            : null;
        return {
          title: titleContent,
          subtitle: subtitleContent,
          filename: path.join(ogImageDir, `${slugifiedTitle}.png`),
        };
      } catch (err) {
        console.error(err);
        return null;
      }
    })
    .filter(Boolean);
  return posts;
}

function run() {
  const posts = lookForPosts(false);
  posts.forEach((post) => {
    generate(post.title, post.subtitle, post.filename);
  });
}

run();
