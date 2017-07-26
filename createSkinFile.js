const fs = require('fs');
const path = require('path');
const { convertToValArray } = require('./util/colors');
const { skinType, findSkinType } = require('./util/skinType');

let isLive9, data, colorsOffset;
function createSkinFile(skin, { live9 = true, skinFileTemplate } = {}) {
  isLive9 = live9;

  // create an array of color value arrays
  const colorNames = getColorNames(isLive9);
  const colors = [];
  colorNames.forEach((name, i) => {
    colors[i] = skin[name];
  });
  const valArrays = colors.map(convertToValArray);

  // if no `skinFileTemplate` has been loaded, read the default template skin,
  // modify the buffer, then return the new skin
  
  if (skinFileTemplate != null) {
    data = skinFileTemplate;

    const skinType = findSkinType(data);
    if (skinType.isLive9 !== isLive9) throw 'sorry, cannot use a Live 9 skin template for a Live 8 skin (or vice versa). please migrate one of them.'
    if (skinType.marker === 'w') throw 'sorry, we don\'t support using a w-type skin file as a template';
    // it's not practical or desired yet to create a skinTemplate, defaultSkinFileTemplate, and colorNames for a seemingly useless skin format
  } else if (this.skinFileTemplate != null) {
    // if `skinFileTemplate` has already been loaded, let's use it
    data = this.skinFileTemplate;
  } else {
    data = this.skinFileTemplate = fs.readFileSync(path.join(__dirname, 'templates', `defaultSkinFileTemplate-${isLive9 ? '9' : '8'}.ask`));
  }
  writeColors(valArrays); // manipulates `data`
  return data;
}

function getColorNames() {
  return require(`./templates/colorNames-${isLive9 ? '9' : '8'}.json`);
}

function writeColors(valArrays) {
  colorsOffset = skinType(isLive9 ? 't' : 'v').colorsOffset;

  for (let i = 0; i < valArrays.length; i++) {
    if (valArrays[i] != null) writeColorValues(i, valArrays[i]);
  }
}

function writeColorValues(colorIndex, valArray) {
  let pos = colorIndex * 16 + colorsOffset;
  // if (colorIndex === 0) console.log(valArray, pos); // TEMP
  for (let valIndex = 0; valIndex < 4; valIndex++) {
    data.writeFloatLE(valArray[valIndex], pos + 4 * valIndex);
  }
}

module.exports = createSkinFile;