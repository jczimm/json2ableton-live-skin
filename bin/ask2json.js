#!/usr/bin/env node
const meow = require('meow');
const absPath = require('./util').getAbsolutePath;
const fs = require('fs');
const { parseSkinFile } = require('..');

const cli = meow({
  help: `
  Usage
    $ ask2json <source-file> [json-destination]

  If you don't provide a json-destination, the .json skin map contents will be written to stdout.

  Options
    --css-colors, -C      Convert the colors in the source file to CSS colors (use --css-color-type to choose format)
    --css-color-type, -T  If using --css-colors, determines the color format.
                            One of: ['rgb', 'rgba', 'hsl', 'hsla', 'hex'] (default is 'rgba')
                            Note: 'rgb', 'hsl', and 'hex' color formats do not include the alpha channel.
    --bare                Do not write the skin format in the skin map (e.g. "format": "live8") 

  Examples
    $ ask2json ./Material.ask ./material-skin.json
    $ ask2json ./BlueSkin.ask ./blue-skinmap.json --css-colors --css-color-type hex
    $ ask2json ./Browns.ask # pipes .json file to stdout
  `,
    description: 'Create a .json file ("skin map") from an Ableton Live .ask skin file.',
  },
  {
    alias: {
      C: 'css-colors',
      T: 'css-color-type',
    },
  }
);

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
let jsonDestPath = null;
if (cli.input[1]) jsonDestPath = absPath(cli.input[1]);

const log = jsonDestPath ? console.log.bind(console) : () => {};


const sourceFile = fs.readFileSync(sourceFilePath);

const options = {
  cssColors: !!cli.flags.cssColors,
  cssColorType: cli.flags.cssColorType,
};

const skinObject = parseSkinFile(sourceFile, options);

log(`Parsed skin of type '${skinObject.format}'.`);
if (cli.flags.bare) delete skinObject.format;

const jsonFile = JSON.stringify(skinObject);

if (jsonDestPath) {
  fs.writeFileSync(jsonDestPath, jsonFile);
  log(`Wrote skin map (.json) to ${jsonDestPath}`);
} else {
  process.stdout.write(jsonFile);
}
