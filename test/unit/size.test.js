var getSize = require('../../src/lib/size.js');
var helpers = require('../testHelpers.js');

describe('Element size', function () {

    it('should be defined', function () {
        expect(getSize).to.be.a('function');
    });

    it('should return correct sizes from domElement', function () {

        var elem = helpers.insertContainer();
        elem.style.width = '200px';
        elem.style.height = '100px';

        expect(getSize(elem)).to.eql({
            width: 200,
            height: 100
        });
    });
});
