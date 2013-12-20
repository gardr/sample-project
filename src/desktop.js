var insertCss = require('./lib/style/insertCss.js');
var Manager = require('./lib/manager.js');
module.exports = global.gardr = function (options) {
	var manager = new Manager(options);
	insertCss('.gardr-failed {display: none;}');
	return manager;
};