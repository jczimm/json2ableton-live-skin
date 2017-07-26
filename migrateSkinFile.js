const parseSkinFile = require('./parseSkinFile');
const migrateSkinMap = require('./migrateSkinMap');
const createSkinFile = require('./createSkinFile');

// migrateSkinFile: parseSkinFile, migrateSkinMap, createSkinFile
function migrateSkinFile(skinFile, { mode } = {}) {
	if (typeof mode === 'string' && mode !== 'upgrade' && mode !== 'downgrade') {
		throw 'Invalid `mode`. Expected \'upgrade\' or \'downgrade\'.';
	}

	const skin = parseSkinFile(skinFile);

	if (typeof mode !== 'string') {
		mode = (skin.format === 'live9' ? 'downgrade' : 'upgrade');
	}

	const newSkin = migrateSkinMap(skin, { mode });
	const newSkinFile = createSkinFile(newSkin, { live9: mode === 'upgrade' });
	return newSkinFile;
}

module.exports = migrateSkinFile;
