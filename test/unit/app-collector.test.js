/* jshint maxlen: 99999 */
var Cookies     = require('cookies-js');
var cookieVal   = '_' + (+new Date());
Cookies.set('USERID', cookieVal);

var collect         = require('../../src/lib/app-collector.js');
var parseParentUrl  = collect.parseParentUrl;

var smokeTest = 'kvuserid=' + cookieVal;
var smokeTest2 = 'key='+encodeURIComponent('+B09809_10001');
var scriptUrl  = 'http://helios.finn.no/addyn|3.0|989.1|3077328|0|1013|ADTECH;alias=frontpage/survey;key=+B09809_10001+B09809_10447+B09809_11086+B09809_11104+B09809_10870+B09809_11117+C11162_10197+C11162_10196+C11162_10194+C11162_10189;kvuserid=1069558077;kvuserareaid=20002;randnum=8;;page=frontpage;misc=523577442023055;'+smokeTest;
var realInput = 'http://someHost.com:9090/api/banner?url='+ decodeURIComponent(scriptUrl)+'&width=123&height=321';

describe('App.js collector', function () {

    it('should be defined', function () {
        expect(parseParentUrl).to.exist;
    });

    it('should return expected result', function () {
        var result = parseParentUrl(realInput);

        expect(result).to.exist;

        var url = result.params.url;
        expect(url).to.have.string(smokeTest);
        expect(url).to.have.string(smokeTest2);

        expect(result.input.width).to.equal('123');
        expect(result.input.height).to.equal('321');
    });

});
