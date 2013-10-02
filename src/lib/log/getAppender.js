var consoleAppender = require('./appender/console.js');
var bannerAppender = require('./appender/banner.js');

module.exports = function (logTo) {
	return (logTo === 'console' ? consoleAppender : bannerAppender);
};