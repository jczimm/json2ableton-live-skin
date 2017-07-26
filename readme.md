# json2ableton-live-skin

Tools for editing/creating Ableton Live 8/9 skin files using .json files.

## API

### Read a skin

```js
const { parseSkinFile } = require('json2ableton-live-skin');
const skinFileBuffer = fs.readFileSync(__dirname + '/skinFile.ask');
const skin = parseSkinFile(skinFileBuffer);
console.log(skin);
// => {"format":"live9","ControlForeground":[0,0,0,255],"TextDisabled":[90,90,9..."ViewCheckControlDisabledOff":[66,66,66,255]}
```
See [examples/getCSSColors.js](examples/getCSSColors.js) for an example using the 'cssColors: true' option.

##### Notes

If you choose 'hex', 'rgb', or 'hsl' for the `cssColorType` option for `parseSkinFile`, the outputted colors will have no alpha.
('rgba' and 'hsla' are available for rgb with alpha and hsl with alpha, respectively)

### Create a skin

```js
const { createSkinFile } = require('json2ableton-live-skin');
const skinMap = require('./skinMap.json'); // see examples/myskin9.json or examples/myskin8.json
const skinFileBuffer = createSkinFile(skinMap);
console.log(skinFileBuffer);
// => <Buffer ab 1e 56 78 04 cf 00 00 00 00 0b 53 6b 69 6e 4d 61 6e 61 67 65 72 03 00 00 00 00 0b 53 6b 69 6e 4d 61 6e 61 67 65 72 74 00 00 00 11 00 00 00 43 00 6f ... >
```

### Edit a skin

See [examples/editSkin.js](examples/editSkin.js) for an example which uses `parseSkinFile` to read a .ask file, edits it, then uses `createSkinFile` to write the modified skin.

See  [examples/editSkinCustomTemplate.js](examples/editSkinCustomTemplate.js) for an example which uses `createSkinFile`'s `skinFileTemplate` option.

### Migrate a skin

See [examples/upgradeSkinFile.js](examples/upgradeSkinFile.js) for an example which upgrades a Live 8 skin file to the Live 9 format.

See [examples/upgradeSkinMap.js](examples/upgradeSkinMap.js) for an example which upgrades a Live 8 skin map to the Live 9 skin map format.

## CLI

### ask2json
```
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
```

### json2ask
```
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
```

### migrate-ask-json
```
Usage
  $ migrate-ask-json <source-file (.ask or .json)> <skin/json-destination>

Options
  --mode <upgrade|downgrade>  Specify whether upgrade the source file from Live 8-format to Live 9-format, or downgrade.
                              If unspecified, \`migrate-ask-json\` will try to determine the mode based on the source file.
                              Default is 'upgrade' 

Examples
  $ migrate-ask-json ./live8-skin.json ./live9-skin.json
  $ migrate-ask-json ./Live9Skin.ask ./Live8Skin.ask
```

## Meta

### Contributing

Please see [contributing.md](contributing.md) and [code-of-conduct.md](code-of-conduct.md).

### License

Please see [license.md](license.md).

### TODO

- Tests
- Docs
- Binary that identifies the format of a skin map (.json) or a skin file (.ask)