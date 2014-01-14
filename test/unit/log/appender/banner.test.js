/*jshint expr: true*/
var logToBanner = require('../../../../src/lib/log/appender/banner.js');
describe('logToBanner', function () {
	var logObj = {
		msg: 'test log',
		time: new Date().getTime(),
		level: 4,
		name: 'testName'
	};
	var clock;

	beforeEach(function () {
		clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		logToBanner.reset();
		clock.restore();
	});
	
	it('should render an overlay the first time it\'s called', function () {
		logToBanner(logObj);
		var output = document.getElementById('logoutput');
		expect(output).to.exist;
	});

	it('should output a div for each log message', function () {
		logToBanner(logObj);
		var output = document.getElementById('logoutput');
		clock.tick(51);
		expect(output.children.length).to.equal(1);
		expect(output.children[0].textContent).to.have.string(logObj.msg);
	});

	it('should include script url and line for script errors', function () {
		var errObj = {
			msg: 'Uncaught SyntaxError: Test',
			time: new Date().getTime(),
			level: 1,
			url: 'http://gardrtest.com/scripterror.js',
			line: 123,
			stack: []
		};
		logToBanner(errObj);
		var output = document.getElementById('logoutput');
		clock.tick(51);
		expect(output.children.length).to.equal(1);
		expect(output.children[0].textContent).to.have.string(errObj.url + ':' + errObj.line);
	});
});