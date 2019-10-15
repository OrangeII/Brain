const getPixels = require("get-pixels");
const fs = require('graceful-fs');
const path = require('path');
const imagesDir = './tiles/';
const jsonDir = './tiles_json/';
let imgD = imagesDir;
let jsonD = jsonDir;

let files = fs.readdirSync(jsonDir);
files.forEach((f) => {
  fs.unlinkSync(`${jsonDir + f}`);
});

fs.readdir(imgD, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach(file => {
    getPixels(`${imgD + file}`, (err, pixels) => {
      if (err) {
        console.log(err);
        return;
      }
      let imgData = [];
      for (let x = 0; x < pixels.shape[0]; x++) {
        for (let y = 0; y < pixels.shape[1]; y++) {
          imgData.push([]);
          for (let z = 0; z < pixels.shape[2] - 1; z++) {
            imgData[imgData.length - 1].push(
              pixels.get(x, y, z)
            );
          }
        }
      }
      let max = 255 * 3;
      imgData = imgData.map((d) => {
        let tot = d[0] + d[1] + d[2];
        return (max - tot) / max
      });
      fs.writeFileSync(`${jsonD + path.parse(file).name}.json`, JSON.stringify({
        input: imgData,
        x: parseInt(path.parse(file).name.split("_")[0]),
        y: parseInt(path.parse(file).name.split("_")[1])
      }));
    });
  });
});




