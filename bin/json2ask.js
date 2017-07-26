#!/usr/bin/env node
const meow = require('meow');
const absPath = require('./util').getAbsolutePath;
const fs = require('fs');
const { createSkinFile } = require('..');

const cli = meow({
  help: `
  Usage
    $ json2ask <source-file> [skin-destination]

  If you don't provide a skin-destination, the .ask skin file contents will be written to stdout.

  Options
    --template <template-file>  A template .ask file to be edited to create the final .ask
    --live8                     Use this flag if you wish to create a Live 8-format skin (see skinMap-8.json)
                                You can also specify that a skin map is Live 8-format by including:
                                  "format": "live8"

                                Note: You cannot yet create a Live 9-format skin using a Live 8-format template.

  Examples
    $ json2ask ./lightSkin.json ./output/Light.ask
    $ json2ask ./material.json ./Material.ask --template ./template.ask
    $ json2ask ./my8patch.json ./Default8.ask --live8 --template ./MyDefault8.ask
    $ json2ask ./bright-skin.json # pipes .ask file to stdout
  `,
  description: 'Creates a .ask skin file to use in Ableton Live from a .json file ("skin map").',
});

if (cli.input.length === 0 && Object.getOwnPropertyNames(cli.flags).length === 0) {
  cli.showHelp();
  process.exit(0);
}

if (cli.input.length !== 1 && cli.input.length !== 2) {
  console.error('Expected 1 or 2 arguments; received ' + cli.input.length + '.');
  process.exit(1);
}

//

const sourceFilePath = absPath(cli.input[0]);
let skinDestPath = null;
if (cli.input[1]) skinDestPath = absPath(cli.input[1]);

const log = skinDestPath ? console.log.bind(console) : () => {};


const sourceFile = require(sourceFilePath);

const options = {};
if (cli.flags.template) {
  const templatePath = absPath(cli.flags.template);
  options.skinFileTemplate = fs.readFileSync(templatePath);
}

// the --live8 flag should override the "format" key
if (cli.flags.live8) {
  options.live9 = false;
  log('Using --live8 flag.');
} else if (typeof sourceFile.format !== 'undefined') {
  if (sourceFile.format === 'live9') {
    options.live9 = true;
  } else if (sourceFile.format === 'live8') {
    options.live9 = false;
  } else {
    console.error(`Error parsing skin map: "format" type "${sourceFile.format}"" is invalid or unsupported.`);
    process.exit(1);
  }
  if (typeof options.live9 === 'boolean') {
    log(`Using "format": "${sourceFile.format}" from skin map.`);
  }
}


let newSkinFile;
try {
  log(`Creating a ${options.live9 ? 'Live 9' : 'Live 8'}-type skin.`);
  newSkinFile = createSkinFile(sourceFile, options);
} catch (err) {
  console.error('Fatal Error creating skin file:', err);
  process.exit(1);
}

if (skinDestPath) {
  fs.writeFileSync(skinDestPath, newSkinFile);
  log(`Wrote skin file (.ask) to ${skinDestPath}`);
} else {
  process.stdout.write(newSkinFile);
}
