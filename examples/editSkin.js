const fs = require('fs');
const { parseSkinFile, createSkinFile } = require('..');

// This will start with a template file, edit one color, and write a new .ask file with the edit. 
// See examples/customTemplate.js for another way to edit a skin file that is more efficient.
// (this example is included as a demonstration of the library)

// read and parse a skin

// using Live 9-format skin for example; myskin8.ask would also work
const skinFile = fs.readFileSync(__dirname + '/myskin9.ask');
const skin = parseSkinFile(skinFile); // cssColors defaults to false, so we'll get RGBA arrays as the colors

console.log(`The original SurfaceArea color in myskin.ask is: ${skin['SurfaceArea']}`);

// edit the skin

// change the SurfaceArea color to black; let's use a css color string since `createSkinFile`
// will automatically convert it to the right format for the .ask file
skin['SurfaceArea'] = 'rgba(0, 0, 0, 0.5)';
console.log(`The new SurfaceArea color is: ${skin['SurfaceArea']}`);

// create a new skin file with the edited SurfaceArea color

const newSkinFile = createSkinFile(skin);
fs.writeFileSync(__dirname + '/myskin9-edited.ask', newSkinFile);
console.log('Successfully created myskin9-edited.ask');
