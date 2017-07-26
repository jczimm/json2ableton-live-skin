const parseColor = require('parse-color');
const colorString = require('color-string');

const validColorTypes = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'];

function convertToCssColor(vals, type) {
  if (!validColorTypes.includes(type)) type = 'rgba';
  if (vals.length !== 4) throw "Invalid value array";
  
  vals[3] = Math.min(vals[3] / 255, 1);

  const rgbaColorString = colorString.to.rgb(vals); // actually rgba
  const formattedVals = parseColor(rgbaColorString)[type];
  
  // the only value returned in parseColor that isn't an array
  if (type === 'hex') return formattedVals;

  if (type === 'rgba') type = 'rgb'; // by 'rgba', the user means color-string's 'rgb'
  if (type === 'hsla') type = 'hsl'; // by 'hsla', the user means color-string's 'hsl'

  return colorString.to[type](formattedVals);
}

function convertToValArray(color) {
  if (typeof color !== 'string') return color;
  try { var { model: type } = colorString.get(color); }
  catch(e) { throw 'Invalid color type or format'; }
  if (!validColorTypes.includes(type)) throw 'Invalid color type';

  const { rgba } = parseColor(color);
  const vals = rgba.slice(0, 4);
  vals[3] = Math.min(vals[3] * 255, 255);
  return vals;
}

module.exports = { convertToValArray, convertToCssColor };