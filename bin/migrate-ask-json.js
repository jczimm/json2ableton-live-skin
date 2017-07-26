#!/usr/bin/env node
const meow = require('meow');
const { getAbsolutePath: absPath } = require('./util');
const { extname } = require('path');
const { writeFileSync, readFileSync } = require('fs');
const { migrateSkinMap, migrateSkinFile } = require('..');

const cli = meow({
  help: `
  Usage
    $ migrate-ask-json <source-file (.ask or .json)> <skin/json-destination>

  Options
    --mode <upgrade|downgrade>  Specify whether upgrade the source file from Live 8-format to Live 9-format, or downgrade.
                                If unspecified, \`migrate-ask-json\` will try to determine the mode based on the source file.
                                Default is 'upgrade' 

  Examples
    $ migrate-ask-json ./live8-skin.json ./live9-skin.json
    $ migrate-ask-json ./Live9Skin.ask ./Live8Skin.ask
  `,
  description: 'Migrate a .ask Ableton Live skin file or a .json skin map from/to Live 8/9-format.',
});

if (cli.input.length === 0 && Object.getOwnPropertyNames(cli.flags).length === 0) {
  cli.showHelp();
  process.exit(0);
}

if (cli.input.length !== 2) {
  console.error('Expected 2 arguments; received ' + cli.input.length + '.');
  process.exit(1);
}

//

const sourceFilePath = absPath(cli.input[0]);
const destPath = absPath(cli.input[1]);

const options = {};
if (cli.flags.mode) options.mode = cli.flags.mode;

const fileExt = extname(sourceFilePath);
if (fileExt === '.json') {

  const skinMap = require(sourceFilePath);
  const newSkinMap = migrateSkinMap(skinMap, options);
  const jsonFile = JSON.stringify(newSkinMap);

  writeFileSync(destPath, jsonFile);

} else if (fileExt === '.ask') {

  const skinFile = readFileSync(sourceFilePath);
  const newSkinFile = migrateSkinFile(skinFile, options);
  writeFileSync(destPath, newSkinFile);

} else {
  console.error('Invalid file extension; expected .json or .ask.');
  process.exit(1);
}
