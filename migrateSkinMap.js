const p = require('./util/patch');

const changesFrom8to9 = {
  'ChoosenPrelisten': 'ChoosenPreListen',
  [p.remove]: ['SearchIndication', 'SearchIndicationStandby'],
};
const changesFrom9to8 = p.reverse(changesFrom8to9);

// mode is one of: ['upgrade', 'downgrade']
function migrateSkinMap(skin, { mode } = {}) {
  if (typeof skin.format === 'string') {
    if (skin.format === 'live9') mode = 'downgrade';
    else if (skin.format === 'live8') mode = 'upgrade';
    else throw `"format" type "${skin.format}"" is invalid or unsupported.`;
  } else if (typeof mode === 'undefined') {
    throw 'Could not determine migration mode from skin map ("format" key unprovided).';
  }

  let update;
  if (mode === 'upgrade') {
    update = changesFrom8to9;
  } else if (mode === 'downgrade') {
    update = changesFrom9to8;
  } else {
    throw 'Invalid `mode`. Expected \'upgrade\' or \'downgrade\'.';
  }

  const newSkin = p.update(skin, update, function value(key) {
    if (mode === 'downgrade') {
      if (key === 'SearchIndication') return [247, 191, 86, 255];
      if (key === 'SearchIndicationStandby') return [237, 202, 137, 255];
    }
    return [0, 0, 0, 255];
  });
  newSkin.format = (mode === 'upgrade' ? 'live9' : 'live8');

  return newSkin;
}

module.exports = migrateSkinMap;