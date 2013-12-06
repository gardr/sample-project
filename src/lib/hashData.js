var queryParams = require('query-params');
var RE_SPLIT = /&/gm;

module.exports = {
	PREFIX : 'GARDR',
	SEPARATOR : '_|_',
	HASH_CHAR : '#',

	encode: function (id, internalParams, params) {
		return [
			this.HASH_CHAR + this.PREFIX,
			id,
			queryParams.encode(internalParams),
			queryParams.encode(params)
		].join(this.SEPARATOR);
	},

	decode: function (hash) {
		var parts = hash.split(this.SEPARATOR);
		if (parts[0] !== this.HASH_CHAR + this.PREFIX) {
			throw new Error('Missing url-fragment prefix ' + this.HASH_CHAR + this.PREFIX);
		}
		return {
			id: parts[1],
			internal: queryParams.decode(parts[2], RE_SPLIT),
			params: queryParams.decode(parts[3], RE_SPLIT)
		};
	}
};