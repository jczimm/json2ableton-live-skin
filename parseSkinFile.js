const fs = require('fs');
const { convertToCssColor } = require('./util/colors');
const findSkinType = require('./util/skinType').findSkinType;

let isLive9, skinType, data;
function parseSkinFile(data, { cssColors = false, cssColorType } = {}) {
  skinType = findSkinType(data);
  isLive9 = skinType.marker === 't' || skinType.marker === 'w';

  const colorNames = getColorNames();
  const colorValArrays = readColors(data, colorNames.length);

  let colors;
  if (cssColors) colors = colorValArrays.map((arr) => convertToCssColor(arr, cssColorType));
  else colors = colorValArrays;

  const skin = {};
  skin.format = isLive9 ? 'live9' : 'live8';

  colorNames.forEach((name, i) => {
    skin[name] = colors[i];
  });

  return skin;
}

function getColorNames() {
  // colorNamesOffset = isLive9 ? 47 : 144;
  // const hex = data.toString('hex', colorNamesOffset);
  // const letters = hex.replace(/00/g, '');
  // console.log(hex2ascii(letters).split('\0000fRemoteableColor'));
  return require(`./templates/colorNames-${isLive9 ? '9' : '8'}.json`);
}

// modified https://stackoverflow.com/a/3745677/3435077
// function hex2ascii(_hex) {
//   const hex = _hex.toString();
//   let str = '';
//   for (let i = 0; i < hex.length; i += 2)
//     str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
//   return str;
// }

function readColors(_data, numColors) {
  data = _data;

  const colorValArrays = [];
  for (let i = 0; i < numColors; i++) {
    colorValArrays.push(readColorValues(i));
  }
  return colorValArrays;
}

function readColorValues(colorIndex) {
  let pos = colorIndex * 16 + skinType.colorsOffset;
  const vals = [];
  for (let valIndex = 0; valIndex < 4; valIndex++) {
    vals.push(data.readFloatLE(pos + 4 * valIndex));
  }
  return vals;
}

module.exports = parseSkinFile;