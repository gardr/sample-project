/* jshint nonew: false */
var Iframe       = require('../../src/lib/iframe.js');

describe('iframe', function () {

    it('should be defined', function(){
        expect(Iframe).toEqual(jasmine.any(Function));
    });

    it('should require iframeUrl', function(){

        expect(function(){
            new Iframe('some-test-123');
        }).toThrow();

        expect(function(){
            new Iframe('some-test-123', {});
        }).toThrow();

        var name = 'iframe1';
        var iframeUrl = 'about:blank';
        var frame = new Iframe(name, {iframeUrl: iframeUrl});

        expect(frame.name).toEqual(name);

        frame.makeIframe('some=parameters&and=another');

        expect(frame.element.src.indexOf(iframeUrl) === 0).toBe(true);


        //....
    });

    it('should have width and height from constructor options', function(){
        var iframe = new Iframe('resize-test', {width:100, height:200, iframeUrl:'about:blank'});
        iframe.makeIframe();
        //expect(iframe.element.width).toEqual('100px');
        expect(iframe.element.style.width).toEqual('100px');
        expect(iframe.element.style.height).toEqual('200px');
    });

    it('should encode data object to query string', function () {
        var iframe = new Iframe('data-test', {iframeUrl: 'about:blank'});
        iframe.setData({
            aNumber: 100,
            encodeUrl: 'http://test.com/path?a=b&c=æøå'
        });
        iframe.makeIframe();
        var lastSepIndex = iframe.element.src.lastIndexOf(Iframe.prototype.SEPARATOR);
        var dataStr = iframe.element.src.substring(lastSepIndex + Iframe.prototype.SEPARATOR.length);
        expect(dataStr).toEqual('aNumber=100&encodeUrl=http%3A%2F%2Ftest.com%2Fpath%3Fa%3Db%26c%3D%C3%A6%C3%B8%C3%A5');
    });

    it('should resize', function(){
        var iframe = new Iframe('resize-test', {width:100, height:100, iframeUrl:'about:blank'});
        iframe.makeIframe();
        iframe.resize(250, 200);
        expect(iframe.element.style.width).toEqual('250px');
        expect(iframe.element.style.height).toEqual('200px');
    });
});
