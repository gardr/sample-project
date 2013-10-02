var logToBanner = require('../../../../src/lib/log/appender/banner.js');
describe('logToBanner', function () {
	var logObj = {
		msg: 'test log',
		time: new Date().getTime(),
		level: 4,
		name: 'testName'
	};

	afterEach(function () {
		logToBanner.reset();
	});
	
	it('should render an overlay the first time it\'s called', function () {
		logToBanner(logObj);
		var output = document.getElementById('logoutput');
		expect(output).not.toBeNull();
	});

	it('should output a div for each log message', function () {
		jasmine.Clock.useMock();
		logToBanner(logObj);
		var output = document.getElementById('logoutput');
		jasmine.Clock.tick(51);
		expect(output.children.length).toEqual(1);
		expect(output.children[0].textContent).toContain(logObj.msg);
	});

	it('should include script url and line for script errors', function () {
		jasmine.Clock.useMock();
		var errObj = {
			msg: 'Uncaught SyntaxError: Test',
			time: new Date().getTime(),
			level: 1,
			url: 'http://pastiestest.com/scripterror.js',
			line: 123,
			stack: []
		};
		logToBanner(errObj);
		var output = document.getElementById('logoutput');
		jasmine.Clock.tick(51);
		expect(output.children.length).toEqual(1);
		expect(output.children[0].textContent).toContain(errObj.url + ':' + errObj.line);
	});
});