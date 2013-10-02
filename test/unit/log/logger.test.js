var logger = require('../../../src/lib/log/logger.js');
var helper = require('../../testHelpers.js');
var ErrorEvent = window.ErrorEvent || require('../../lib/ErrorEvent.js');

describe('logger', function () {
	it('should default logLevel to 0 if not undefined', function () {
        var log = logger.create('no_loglevel_test', undefined, function () {});
        expect(log.level).toEqual(0);
    });

    it('should set logLevel when specified', function () {
        var log = logger.create('logLevel_test', '3', function () {});
        expect(log.level).toEqual(3);
    });

    it('should not send log message when logLevel is 0', function () {
        var logData = [];
        var out = function (obj) {
            logData.push(obj);
        };
        var log = logger.create('no_log_call', '0', out);
        log.debug('test');
        expect(logData.length).toEqual(0);
    });

    it('should send log message when logLevel is high enough', function () {
        var logData = [];
        var log = logger.create('log_debug_test', '4', function (obj) {
            logData.push(obj);
        });
        var startTime = new Date().getTime();
        log.debug('test');
        expect(logData.length).toEqual(1);
        expect(logData[0].msg).toEqual('test');
        expect(logData[0].level).toEqual(4);
        expect(logData[0].name).toEqual('log_debug_test');
        expect(logData[0].time).not.toBeLessThan(startTime);
    });

    it('should catch errors', function () {
        var logData = [];
        logger.create('error_test', '1', function (obj) {
            logData.push(obj);
        });
        var errorData = {
            message: 'Test error',
            filename: 'http://pastiestest.com/errorTest.js',
            lineno: 123
        };
        var restoreOnError = helper.undefine(window, 'onerror');
        var evt = new ErrorEvent('error', errorData);
        window.dispatchEvent(evt);
        restoreOnError();
        
        expect(logData.length).toEqual(1);
        var logObj = logData[0];
        expect(logObj.msg).toEqual(errorData.message);
        expect(logObj.level).toEqual(1);
        expect(logObj.name).toEqual('error_test');
        expect(logObj.time).not.toBeUndefined();
        expect(logObj.url).toEqual(errorData.filename);
        expect(logObj.line).toEqual(errorData.lineno);
    });
});