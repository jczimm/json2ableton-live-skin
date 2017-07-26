const fs = require('fs');
const { createSkinFile } = require('..');

// This will write a Live 9-format .ask file using a custom template.

// To edit a skin, instead of reading and parsing a skin file, modifying the skin object, then
// creating a new skin file, we can supply a 'skinFileTemplate' to `createSkinFile` to override
// defaultSkinFileTemplate-9.ask, telling `createSkinFile` to start with our own template, which isn't completely black.
// See examples/editSkin.js for another way to edit a skin file as a more complete demonstration of the library.

// Starting with myskin.ask as a template, let's create a skin with some edits. 

// using Live 9-format skin for example; myskin8.ask would also work
const template = fs.readFileSync(__dirname + '/myskin9.ask');

// edits to the template
const skin = {
	SurfaceArea: 'rgb(1,2,3)',
	ViewCheckControlDisabledOff: 'rgba(32,32,21,0.5)',
};

// pass `template` as 'skinFileTemplate'
const newSkinFile = createSkinFile(skin, { skinFileTemplate: template });
fs.writeFileSync(__dirname + '/myskin9-editedbycustomtemplate.ask', newSkinFile);
console.log('Successfully created myskin9-editedbycustomtemplate.ask');
