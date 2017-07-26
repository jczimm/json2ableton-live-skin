const fs = require('fs');
const { parseSkinFile } = require('..');

// using Live 9-format skin for example; myskin8.ask would also work
const data = fs.readFileSync(__dirname + '/myskin9.ask');
// cssColorType is one of: ['rgb', 'rgba', 'hsl', 'hsla', 'hex']
// default is 'rgba'
const skin = parseSkinFile(data, { cssColors: true, cssColorType: 'hsla' });

console.log(skin);
// console.log(`The SurfaceArea color is: ${skin['SurfaceArea']}`);

