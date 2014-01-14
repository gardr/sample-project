/*jshint expr: true*/
var bannerApi     = require('../../src/app-inframe.js');

describe('test app.js', function () {
    it('should be assigned to global', function(){
        expect(bannerApi).to.equal(window.banner);
        expect(bannerApi.name).to.be.undefined;
    });


});
