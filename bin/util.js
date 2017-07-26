const { join } = require('path');
const cwd = process.cwd();

module.exports = {
	getAbsolutePath(relPath) {
		return join(cwd, relPath);
	},
};