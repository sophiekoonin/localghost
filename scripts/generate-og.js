const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const path = require('path');

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
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  const image = new Image();
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
    const titleLines = getLines(ctx, title, canvas.width * 0.8);
    const subtitleLines =
      subtitle != null ? getLines(ctx, subtitle, canvas.width * 0.8) : [];

    const offset = subtitleLines.length > 0 ? 70 : 25;

    [...titleLines, ...subtitleLines].forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 - offset + i * 70);
    });

    ctx.textBaseline = 'bottom';
    ctx.font = "bold 32px 'Krungthep'";
    ctx.textAlign = 'left';
    ctx.fillText('localghost.dev', 10, canvas.height - 10);
    console.log(filename);
    const out = fs.createWriteStream(filename);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was created.'));
  };
  image.src = imgSrc;
}

function lookForPosts(overwrite) {
  const postFolder = path.join(process.cwd(), './content/posts');
  const dirs = fs.readdirSync(postFolder);
  const posts = dirs
    .map((dir) => {
      const file = path.join(postFolder, dir, 'index.md');
      try {
        const content = fs.readFileSync(file, 'utf8');
        const splitContent = content.split('\n');

        const title = splitContent.find((line) => line.startsWith('title:'));
        if (title == null) {
          return null;
        }
        if (!overwrite) {
          const existingImage = fs.existsSync(
            path.join(
              process.cwd(),
              './content/posts',
              dir,
              'images',
              'og-image.png'
            )
          );
          if (existingImage) {
            return null;
          }
        }
        const subtitle = splitContent.find((line) =>
          line.startsWith('subtitle:')
        );
        const titleContent = title
          .split('title:')[1]
          .trim()
          .replace(quotationRegex, '');
        const subtitleContent =
          subtitle != null
            ? subtitle.split('subtitle:')[1].trim().replace(quotationRegex, '')
            : null;
        return {
          title: titleContent,
          subtitle: subtitleContent,
          filename: path.join(postFolder, dir, 'images/og-image.png'),
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
    console.log(post);
    generate(post.title, post.subtitle, post.filename);
  });
}

run();
