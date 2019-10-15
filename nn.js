const josnDir = './data/';
const tilesJsonDir = './tiles_json/';
const charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;?@[\\]^_`{|}~ ';
const fs = require('fs');
const brain = require('brain.js');

const toData = function (jsonFilePath) {
  let singleData = JSON.parse(fs.readFileSync(jsonFilePath));
  return {
    input: singleData.pixels,
    output: charset.split("").map((c) => {
      return c.includes(String.fromCharCode(singleData.charCode)) ? 1 : 0;
    })
  };
};


let files = fs.readdirSync(josnDir);
let trainingData = files.map((file) => {
  return toData(`${josnDir}${file}`);
});



let nn = new brain.NeuralNetwork({ hiddenLayers: [140] });
nn.train(trainingData, {
  log: true,
  errorThresh: 0.00001
});


fs.writeFileSync('trained-net.json', `${JSON.stringify(nn.toJSON())}`);



files = fs.readdirSync(tilesJsonDir);
let data = files.map((file) => {
  return JSON.parse(fs.readFileSync(`${tilesJsonDir}${file}`));
});

const predict = function (tile) {
  let res = nn.run(tile);
  let prediction = res.indexOf(Math.max(...res));
  return charset.charAt(prediction);
};

let s = "";
for (let y = 0; y < 18; y++) {
  for (let x = 0; x < 19; x++) {
    for (let i = 0; i < data.length; i++) {

      if (data[i].x == x && data[i].y == y) {
        s += predict(data[i].input);
      }
    }
  }
  s += "\n";
}

fs.writeFileSync('out.txt', s);




