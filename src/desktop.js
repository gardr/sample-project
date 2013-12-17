var getCookies = require('./lib/usercookies.js').getCookies;
var insertCss = require('./lib/style/insertCss.js');
var Manager = require('./lib/manager.js');
module.exports = global.gardr = function (options) {
	var manager = new Manager(options);
	manager.extendInframeData(getCookies());
	insertCss('.gardr-failed {display: none;}');
	return manager;
};