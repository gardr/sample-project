var api = require('../../src/lib/api.js');
var helpers = require('../testHelpers.js');

describe('Api', function () {

    it('callbacks should be stored', function(done){
        var apiInstance = api.init({name: 'callbacks_tests'}, function(comObj){
            expect(apiInstance._callbacks.length).to.equal(1);
            expect(comObj.index).to.equal(0);
            done();
        });

        expect(apiInstance).to.be.an('object');
        expect(apiInstance._callbacks.length).to.equal(0);

        apiInstance.plugin('some_plug', {}, function(){});
    });

    it('should resolve callback when response is incomming', function(done){
        var raw = {result: 'asdf'};

        var apiInstance = api.init({name: 'callbacks_tests'}, function(comObj){
            raw.index = comObj.index;
            apiInstance.callback(raw);
        });

        apiInstance.plugin('some_plug', {}, function(result, _raw){
            expect(_raw).to.equal(raw);
            expect(result).to.equal(raw.result);
            done();
        });
    });

    it('setBannerFlag and callback inside applyCom', function(done){
        var name = helpers.getRandomName();

        var apiInstance = api.init({name: 'bannerflag_tests'}, function(comObj){
            // lets just send it back
            apiInstance.callback(comObj);
        });

        apiInstance.setBannerFlag(name, 'val', function(){
            done();
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
        expect(banner.log.level).to.equal(3);
    });

    it('should not throw error when init is called with no logOut parameter', function () {
        expect(function () {
            api.init({
                name: 'no_logOut',
                params: {logLevel: 4}
            });
        }).to.not.throw(Error);
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

        expect(logData.length).to.equal(lenBefore + 1);
        var logObj = logData[logData.length - 1];
        expect(logObj.msg).to.equal(msg);
    });
});
