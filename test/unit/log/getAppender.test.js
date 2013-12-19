var consoleAppender = require('../../../src/lib/log/appender/console.js');
var bannerAppender = require('../../../src/lib/log/appender/banner.js');
var getAppender = require('../../../src/lib/log/getAppender.js');

describe('getAppender', function () {
	it('should default to bannerAppender', function () {
		expect(getAppender()).to.equal(bannerAppender);
	});

	it('should return consoleAppender for logTo \'console\'', function () {
		expect(getAppender('console')).to.equal(consoleAppender);
	});
});