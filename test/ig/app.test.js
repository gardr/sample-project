var bannerApi     = require('../../src/app-inframe.js');

describe('test app.js', function () {
    it('should be assigned to global', function(){
        expect(bannerApi).toEqual(window.banner);
        expect(bannerApi.name).toBeUndefined();
    });


});
