// edits an object's keys (does not edit the object itself; returns a new )

const patch = {
	remove: Symbol('patch-remove'),
	add: Symbol('patch-add'),

	update(obj, update, defaultAdd) {
		const newObj = Object.assign({}, obj);
		let newKey;
		Object.getOwnPropertyNames(update).forEach((matchKey) => {
			newKey = update[matchKey];
			newObj[newKey] = newObj[matchKey];
			delete newObj[matchKey]; // let's find out if delete deletes all references too!
		});
		let keys;
		Object.getOwnPropertySymbols(update).forEach((symbol) => {
			if (symbol === this.remove) {
				keys = update[symbol] || [];
				keys.forEach((key) => {
					delete newObj[key];
				});
			} else if (symbol === this.add) {
				keys = update[symbol] || [];
				keys.forEach((key) => {
					newObj[key] = defaultAdd || undefined;
				});
			} else {
				newObj[symbol] = update[symbol];
			}
		});
		return newObj;
	},

	reverse(update) {
		const newPatch = {};
		Object.getOwnPropertyNames(update).forEach((key) => {
			newPatch[update[key]] = key;
		});
		let symbol;
		Object.getOwnPropertySymbols(update).forEach((symbol) => {
			if (symbol === this.remove) {
				newPatch[this.add] = update[symbol];
			} else if (symbol === this.add) {
				newPatch[this.remove] = update[symbol];
			} else {
				newPatch[symbol] = update[symbol];
			}
		});
		return newPatch;
	},
};

module.exports = patch;
