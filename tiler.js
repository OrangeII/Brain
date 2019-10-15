const h = 14;
const w = 10;

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const tilesDir = './tiles/';

let files = fs.readdirSync(tilesDir);
files.forEach((f) => {
  fs.unlinkSync(`${tilesDir + f}`);
});

loadImage(process.argv[2]).then((image) => {
  let numX = Math.floor(image.width / w);
  let numY = Math.floor(image.height / h);
  const canvas = createCanvas(w, h);
  let ctx = canvas.getContext('2d');
  for (let x = 0; x < numX; x++) {
    for (let y = 0; y < numY; y++) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, sx = x * w, sy = y * h, sw = w, sh = h, dx = 0, dy = 0, dw = w, dh = h);
      fs.writeFileSync(`${tilesDir}${x}_${y}.png`, canvas.toBuffer());
    }
  }
}).catch(err => {
  console.error(err);
});
