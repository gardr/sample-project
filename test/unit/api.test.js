var api = require('../../src/lib/api.js');
var helpers = require('../testHelpers.js');

describe('Api', function () {

    it('callbacks should be stored', function(){
        var done;

        var apiInstance = api.init({name: 'callbacks_tests'}, function(comObj){
            expect(apiInstance._callbacks.length).toEqual(1);
            expect(comObj.index).toEqual(0);
            done  = true;
        });

        expect(apiInstance).toEqual(jasmine.any(Object));
        expect(apiInstance._callbacks.length).toEqual(0);

        apiInstance.plugin('some_plug', {}, function(){});

        waitsFor(function(){
            return done;
        });

    });

    it('should resolve callback when response is incomming', function(){

        var done = false;

        var raw = {result: 'asdf'};


        var apiInstance = api.init({name: 'callbacks_tests'}, function(comObj){
            raw.index = comObj.index;
            apiInstance.callback(raw);
        });


        apiInstance.plugin('some_plug', {}, function(result, _raw){
            expect(_raw).toEqual(raw);
            expect(result).toEqual(raw.result);
            done = true;
        });

        waitsFor(function(){
            return done;
        });


    });

    it('setBannerFlag and callback inside applyCom', function(){
        var done = false;
        var name = helpers.getRandomName();

        var apiInstance = api.init({name: 'bannerflag_tests'}, function(comObj){
            // lets just send it back
            apiInstance.callback(comObj);
        });

        apiInstance.setBannerFlag(name, 'val', function(){
            done = true;
        });

        waitsFor(function(){
            return done;
        });
    });

    it('should set logLevel from params', function () {
        var input = {
            name: 'logLevel_test',
            params: {
                loglevel: 3
            }
        };
        var banner = api.init(input);
        expect(banner.log.level).toEqual(3);
    });

    it('should not throw error when init is called with no logOut parameter', function () {
        expect(function () {
            api.init({
                name: 'no_logOut',
                params: {logLevel: 4}
            });
        }).not.toThrow();
    });

    it('should output log data to supplied logOut function', function () {
        var logData = [];
        var input = {
            name: 'logOut',
            params: {loglevel: 4}
        };
        var banner = api.init(input, null, null, function (logObj) {
            logData.push(logObj);
        });

        var lenBefore = logData.length;
        var msg = 'test';
        banner.log.debug(msg);

        expect(logData.length).toEqual(lenBefore + 1);
        var logObj = logData[logData.length - 1];
        expect(logObj.msg).toEqual(msg);
    });
});
