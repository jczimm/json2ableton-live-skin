const fs = require('fs');
const assert = require('assert');
const { migrateSkinMap } = require('..');

const skin8 = require('./myskin8.json');
// `mode` is one of ['upgrade', 'downgrade']; 'upgrade' is default (has same options as `migradeSkinFile`)
const skin9 = migrateSkinMap(skin8, { mode: 'upgrade' });
fs.writeFileSync('./myskin9 copy.json', JSON.stringify(skin9));

// this skin map should be the same as the one created by `parseSkinFile` using a
// myskin9.ask created by `createSkinFile` using a manually modified myskin8.json: myskin9.json
const original_skin9 = require('./myskin9.json');
assert.deepEqual(skin9, original_skin9);
