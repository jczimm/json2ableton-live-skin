const fs = require('fs');
const assert = require('assert');
const { migrateSkinFile } = require('..');

const skinFile8 = fs.readFileSync(__dirname + '/myskin8.ask');
// `mode` is one of ['upgrade', 'downgrade']; 'upgrade' is default (has same options as `migradeSkinMap`)
const skinFile9 = migrateSkinFile(skinFile8, { mode: 'upgrade' });

// this skin map should be the same as our myskin9.ask
const original_skinFile9 = fs.readFileSync(__dirname + '/myskin9.ask');
assert.deepEqual(skinFile9, original_skinFile9);