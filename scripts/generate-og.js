const { createCanvas, Image } = require('canvas');
const fs = require('fs');
const path = require('path');

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

const title = process.argv[2];
const subtitle = process.argv[3];
if (title == null || title === '') {
  console.log('need title!');
  process.exit(1);
}
function generate() {
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
    ctx.font = `bold 60px 'Inter'`;
    const titleLines = getLines(ctx, title, canvas.width * 0.8);
    const subtitleLines =
      subtitle != null ? getLines(ctx, subtitle, canvas.width * 0.8) : [];

    [...titleLines, ...subtitleLines].forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 25 + i * 90);
    });

    ctx.textBaseline = 'bottom';
    ctx.font = "bold 32px 'Inter'";
    ctx.textAlign = 'left';
    ctx.fillText('localghost.dev', 10, canvas.height - 10);

    const out = fs.createWriteStream(process.cwd() + '/og-image.png');
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('The PNG file was created.'));
  };
  image.src = imgSrc;
}

generate();
