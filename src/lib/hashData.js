var paramUtil = require('./paramUtil.js');
var RE_SPLIT = /&/gm;

module.exports = {
	PREFIX : 'PASTIES',
	SEPARATOR : '_|_',
	HASH_CHAR : '#',

	encode: function (name, internalParams, params) {
		return [
			this.HASH_CHAR + this.PREFIX,
			name,
			paramUtil.param(internalParams),
			paramUtil.param(params)
		].join(this.SEPARATOR);
	},

	decode: function (hash) {
		var parts = hash.split(this.SEPARATOR);
		if (parts[0] !== this.HASH_CHAR + this.PREFIX) {
			throw new Error('Missing url-fragment prefix ' + this.HASH_CHAR + this.PREFIX);
		}
		return {
			name: parts[1],
			internal: paramUtil.deparam(parts[2], RE_SPLIT),
			params: paramUtil.deparam(parts[3], RE_SPLIT)
		};
	}
};