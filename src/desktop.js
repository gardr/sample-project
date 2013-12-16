var getCookies = require('./lib/usercookies.js').getCookies;
var Manager = require('./lib/manager.js');
module.exports = global.gardr = function (options) {
	var manager = new Manager(options);
	manager.extendInframeData(getCookies());
	return manager;
};